// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {
    AccountAllowanceApproveTransaction,
    AccountAllowanceDeleteTransaction,
    AccountId,
    AccountUpdateTransaction,
    ContractExecuteTransaction,
    NftId,
    PendingAirdropId,
    TokenAssociateTransaction,
    TokenClaimAirdropTransaction,
    TokenDissociateTransaction,
    TokenId,
    TokenRejectTransaction,
    TransactionId,
    TransactionResponse,
    TransactionResponseJSON
} from "@hashgraph/sdk";
import {ContractResultDetails, TokenAirdrop, Transaction} from "@/schemas/MirrorNodeSchemas";
import {WalletClient, WalletClientError, WalletClientRejectError} from "@/utils/wallet/client/WalletClient";
import {base64Encode, hexToByte} from "@/utils/B64Utils";
import {waitFor} from "@/utils/TimerUtils";
import {TransactionByIdCache} from "@/utils/cache/TransactionByIdCache";
import {ContractResultByTransactionIdCache} from "@/utils/cache/ContractResultByTransactionIdCache";
import {eth_getErrorCode, eth_getMessage, eth_isUserReject} from "@/utils/wallet/eip1193";


export class WalletClient_Hiero extends WalletClient {

    //
    // Public
    //

    public async rejectTokens(transaction: TokenRejectTransaction): Promise<string> {
        transaction.setOwnerId(AccountId.fromString(this.accountId))
        const result = await this.executeTransaction(transaction)
        await this.waitForTransactionSurfacing(result)
        return Promise.resolve(result)
    }

    public async changeStaking(stakedNodeId: number | null, stakedAccountId: string | null, declineReward: boolean | null): Promise<string> {
        const trans = new AccountUpdateTransaction()
        trans.setAccountId(this.accountId)
        if (stakedNodeId !== null) {
            trans.setStakedNodeId(stakedNodeId)
        } else if (stakedAccountId !== null) {
            trans.setStakedAccountId(stakedAccountId)
        } else {
            trans.setStakedNodeId(-1)
            trans.setStakedAccountId("0.0.0")
        }
        if (declineReward !== null) {
            trans.setDeclineStakingReward(declineReward)
        }

        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)

        return Promise.resolve(result)
    }

    public async approveHbarAllowance(spender: string, amount: number): Promise<string> {

        const trans = new AccountAllowanceApproveTransaction()
        trans.approveHbarAllowance(this.accountId, spender, amount)
        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)

        return Promise.resolve(result)
    }

    public async approveTokenAllowance(token: string, spender: string, amount: number): Promise<string> {

        const trans = new AccountAllowanceApproveTransaction()
        trans.approveTokenAllowance(token, this.accountId, spender, amount)
        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)

        return Promise.resolve(result)
    }

    public async approveNFTAllowance(token: string, spender: string, serialNumbers: number[]): Promise<string> {

        const trans = new AccountAllowanceApproveTransaction()
        if (1 <= serialNumbers.length && serialNumbers.length <= 20) {
            const tid = TokenId.fromString(token)
            for (const sn of serialNumbers) {
                trans.approveTokenNftAllowance(new NftId(tid, sn), this.accountId, spender)
            }
        } else if (serialNumbers.length == 0) {
            trans.approveTokenNftAllowanceAllSerials(token, this.accountId, spender)
        } else {
            throw new WalletClientError("Invalid serial number count (" + serialNumbers.length + ")", "")
        }
        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)

        return Promise.resolve(result)
    }

    public async deleteNftAllowance(token: string, serialNumber: number): Promise<string> {

        const trans = new AccountAllowanceDeleteTransaction()
        const tokenId = TokenId.fromString(token)
        trans.deleteAllTokenNftAllowances(new NftId(tokenId, serialNumber), this.accountId)
        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)

        return Promise.resolve(result)
    }

    public async deleteNftAllSerialsAllowance(token: string, spender: string): Promise<string> {

        const trans = new AccountAllowanceApproveTransaction()
        trans.deleteTokenNftAllowanceAllSerials(token, this.accountId, spender)
        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)

        return Promise.resolve(result)
    }

    public async updateAccount(transaction: AccountUpdateTransaction): Promise<string> {
        transaction.setAccountId(this.accountId)
        const result = await this.executeTransaction(transaction)
        await this.waitForTransactionSurfacing(result)

        return Promise.resolve(result)
    }

    public async claimTokenAirdrops(airdrops: TokenAirdrop[]): Promise<string> {

        const trans = new TokenClaimAirdropTransaction()

        console.log(`Building TokenClaimAirdropTransaction:`)

        for (const airdrop of airdrops) {
            if (airdrop.sender_id && airdrop.receiver_id && airdrop.token_id) {
                const airdropId = new PendingAirdropId()
                    .setSenderid(AccountId.fromString(airdrop.sender_id))
                    .setReceiverId(AccountId.fromString(airdrop.receiver_id))
                const tokenId = TokenId.fromString(airdrop.token_id)
                if (airdrop.serial_number) {
                    console.log(`  Adding NFT airdrop:`)
                    console.log(`    senderId: ${airdrop.sender_id}`)
                    console.log(`    receiverId: ${airdrop.receiver_id}`)
                    console.log(`    tokenId: ${airdrop.token_id}`)
                    console.log(`    serial #: ${airdrop.serial_number}`)
                    airdropId.setNftId(new NftId(tokenId, airdrop.serial_number))
                } else {
                    console.log(`  Adding Fungible Token airdrop:`)
                    console.log(`    senderId: ${airdrop.sender_id}`)
                    console.log(`    receiverId: ${airdrop.receiver_id}`)
                    console.log(`    tokenId: ${airdrop.token_id}`)
                    airdropId.setTokenId(tokenId)
                }
                trans.addPendingAirdropId(airdropId)
            }
        }

        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)
        return Promise.resolve(result)
    }

    //
    // WalletClient
    //

    public async associateToken(tokenId: string): Promise<string> {
        // https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service/associate-tokens-to-an-account
        const trans = new TokenAssociateTransaction()
        trans.setAccountId(this.accountId)
        trans.setTokenIds([tokenId])
        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)
        return Promise.resolve(result)
    }

    public async dissociateToken(tokenId: string): Promise<string> {
        // https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service/dissociate-tokens-from-an-account
        const trans = new TokenDissociateTransaction()
        trans.setAccountId(AccountId.fromString(this.accountId))
        trans.setTokenIds([tokenId])
        const result = await this.executeTransaction(trans)
        await this.waitForTransactionSurfacing(result)
        return Promise.resolve(result)
    }

    public async callContract(contractId: string, functionData: string): Promise<ContractResultDetails | string> {
        let result: string | ContractResultDetails

        const fp = hexToByte(functionData)
        if (fp !== null) {
            const trans = new ContractExecuteTransaction()
            trans.setContractId(contractId)
            trans.setFunctionParameters(fp)
            trans.setGas(75_000)
            const transactionId = await this.executeTransaction(trans)
            result = await this.waitForContractResultSurfacing(transactionId)
        } else {
            throw "bug"
        }

        return Promise.resolve(result)
    }

    //
    // Private
    //

    private async executeTransaction(
        transaction: AccountAllowanceApproveTransaction
            | AccountUpdateTransaction
            | AccountAllowanceDeleteTransaction
            | TokenAssociateTransaction
            | TokenDissociateTransaction
            | TokenRejectTransaction
            | ContractExecuteTransaction
            | TokenClaimAirdropTransaction): Promise<string> {

        let result: string
        try {
            transaction.setNodeAccountIds([new AccountId(3), new AccountId(4), new AccountId(5)])
            transaction.setTransactionId(TransactionId.generate(AccountId.fromString(this.accountId)))
            transaction.freeze()
            const transactionBytes = transaction.toBytes()
            const transactionBase64 = base64Encode(transactionBytes)
            const request = {
                method: "hedera_signAndExecuteTransaction",
                params: {
                    signerAccountId: "hedera:" + this.network + ":" + this.accountId,
                    transactionList: transactionBase64,
                }
            }
            const response = await this.provider.request(request) as TransactionResponseJSON
            const tr = TransactionResponse.fromJSON(response)
            result = tr.transactionId.toString()
        } catch (reason) {
            if (isUserReject(reason)) {
                throw new WalletClientRejectError()
            } else {
                throw reason
            }
        }

        return Promise.resolve(result)
    }


    private async waitForTransactionSurfacing(transactionId: string): Promise<Transaction | string> {
        let result: Promise<Transaction | string>

        try {
            let counter = 10
            let transaction: Transaction | null = null
            while (counter > 0 && transaction === null) {
                await waitFor(3000)
                transaction = await TransactionByIdCache.instance.lookup(transactionId, true)
                counter -= 1
            }
            result = Promise.resolve(transaction ?? transactionId)
        } catch {
            result = Promise.resolve(transactionId)
        }

        return result
    }


    protected async waitForContractResultSurfacing(transactionId: string): Promise<ContractResultDetails | string> {
        let result: Promise<ContractResultDetails | string>

        try {
            let counter = 10
            let contractResult: ContractResultDetails | null = null
            while (counter > 0 && contractResult === null) {
                await waitFor(3000)
                contractResult = await ContractResultByTransactionIdCache.instance.lookup(transactionId, true)
                counter -= 1
            }
            result = Promise.resolve(contractResult ?? transactionId)
        } catch {
            result = Promise.resolve(transactionId)
        }

        return result
    }


}

function isUserReject(error: unknown): boolean {
    //
    // "user reject" specification is pretty under specified :(
    // Over time and wallets, we saw the following error object:
    //  - { code: 9000, message: "USER REJECT"} // partially specified in HIP 820
    //  - { code: 4001, message: "User Rejected Request"}  // as defined by EIP-1193
    //  - { code: -32603, message: "Internal error"} // as defined by JSON-RPC spec
    //
    //  References
    //      https://hips.hedera.com/hip/hip-820#hedera_signandexecutetransaction
    //      https://www.jsonrpc.org/specification#error_object
    //      https://eips.ethereum.org/EIPS/eip-1193
    //
    const code = eth_getErrorCode(error)
    const message = eth_getMessage(error)
    return (code === 9000 && message == "USER_REJECT") || code == -32603 || eth_isUserReject(error)
}

