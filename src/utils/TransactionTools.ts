// SPDX-License-Identifier: Apache-2.0

import {StakingRewardTransfer, Transaction, TransactionType, Transfer} from "@/schemas/MirrorNodeSchemas";
import {TransactionID} from "@/utils/TransactionID";

// eslint-disable-next-line max-lines-per-function, complexity
export function makeEntityType(row: Transaction): string | null {
    let result: string | null

    switch (row.name) {
        case TransactionType.CONSENSUSCREATETOPIC:
        case TransactionType.CONSENSUSDELETETOPIC:
        case TransactionType.CONSENSUSUPDATETOPIC:
        case TransactionType.CONSENSUSSUBMITMESSAGE:
            result = "Topic"
            break
        case TransactionType.CRYPTOCREATEACCOUNT:
        case TransactionType.CRYPTODELETE:
        case TransactionType.CRYPTOUPDATEACCOUNT:
        case TransactionType.TOKENASSOCIATE:
        case TransactionType.TOKENDISSOCIATE:
        case TransactionType.TOKENGRANTKYC:
        case TransactionType.TOKENREVOKEKYC:
        case TransactionType.TOKENFREEZE:
        case TransactionType.TOKENUNFREEZE:
        case TransactionType.TOKENREJECT:
        case TransactionType.CRYPTOADDLIVEHASH:
        case TransactionType.CRYPTODELETELIVEHASH:
            result = "Account"
            break
        case TransactionType.TOKENBURN:
        case TransactionType.TOKENMINT:
        case TransactionType.TOKENCREATION:
        case TransactionType.TOKENDELETION:
        case TransactionType.TOKENFEESCHEDULEUPDATE:
        case TransactionType.TOKENPAUSE:
        case TransactionType.TOKENUNPAUSE:
        case TransactionType.TOKENUPDATE:
        case TransactionType.TOKENUPDATENFTS:
        case TransactionType.TOKENWIPE:
        case TransactionType.TOKENAIRDROP:
        case TransactionType.TOKENCANCELAIRDROP:
        case TransactionType.TOKENCLAIMAIRDROP:
            result = "Token"
            break
        case TransactionType.CONTRACTCREATEINSTANCE:
        case TransactionType.CONTRACTDELETEINSTANCE:
        case TransactionType.CONTRACTUPDATEINSTANCE:
        case TransactionType.CONTRACTCALL:
            result = "Contract"
            break
        case TransactionType.FILECREATE:
        case TransactionType.FILEUPDATE:
        case TransactionType.FILEDELETE:
        case TransactionType.FILEAPPEND:
            result = "File"
            break
        case TransactionType.SCHEDULECREATE:
        case TransactionType.SCHEDULEDELETE:
        case TransactionType.SCHEDULESIGN:
            result = "Schedule"
            break
        default:
            result = null
    }
    return result
}

// eslint-disable-next-line max-lines-per-function, complexity
export function makeTypeLabel(type: TransactionType | undefined): string {
    let result: string
    switch (type) {

        case TransactionType.ATOMICBATCH:
            result = "Atomic Batch";
            break;
        case TransactionType.CONSENSUSCREATETOPIC:
            result = "Create Topic";
            break;
        case TransactionType.CONSENSUSUPDATETOPIC:
            result = "Update Topic";
            break;
        case TransactionType.CONSENSUSDELETETOPIC:
            result = "Delete Topic";
            break;
        case TransactionType.CONSENSUSSUBMITMESSAGE:
            result = "Submit Message"
            break;

        case TransactionType.CONTRACTCALL:
            result = "Contract Call"
            break;
        case TransactionType.CONTRACTDELETEINSTANCE:
            result = "Contract Delete"
            break;
        case TransactionType.CONTRACTCREATEINSTANCE:
            result = "Contract Create"
            break;
        case TransactionType.CONTRACTUPDATEINSTANCE:
            result = "Contract Update"
            break;

        case TransactionType.CRYPTOADDLIVEHASH:
            result = "Add Live Hash"
            break;
        case TransactionType.CRYPTOCREATEACCOUNT:
            result = "Create Account"
            break;
        case TransactionType.CRYPTODELETE:
            result = "Delete Account"
            break;
        case TransactionType.CRYPTOUPDATEACCOUNT:
            result = "Update Account"
            break;
        case TransactionType.CRYPTODELETELIVEHASH:
            result = "Delete Live Hash"
            break
        case TransactionType.CRYPTOTRANSFER:
            result = "Crypto Transfer"
            break
        case TransactionType.CRYPTOAPPROVEALLOWANCE:
            result = "Approve Allowance"
            break
        case TransactionType.CRYPTODELETEALLOWANCE:
            result = "Delete Allowance"
            break

        case TransactionType.ETHEREUMTRANSACTION:
            result = "Ethereum Transaction";
            break;

        case TransactionType.FILECREATE:
            result = "File Create";
            break;
        case TransactionType.FILEDELETE:
            result = "File Delete";
            break;
        case TransactionType.FILEAPPEND:
            result = "File Append";
            break;
        case TransactionType.FILEUPDATE:
            result = "File Update";
            break;

        case TransactionType.FREEZE:
            result = "Freeze";
            break;

        case TransactionType.NODECREATE:
            result = "Node Create";
            break;
        case TransactionType.NODEDELETE:
            result = "Node Delete";
            break;
        case TransactionType.NODESTAKEUPDATE:
            result = "Node Stake Update";
            break;
        case TransactionType.NODEUPDATE:
            result = "Node Update";
            break;

        case TransactionType.SCHEDULECREATE:
            result = "Schedule Create";
            break;
        case TransactionType.SCHEDULEDELETE:
            result = "Schedule Delete";
            break;
        case TransactionType.SCHEDULESIGN:
            result = "Schedule Sign";
            break;

        case TransactionType.SYSTEMDELETE:
            result = "System Delete";
            break;
        case TransactionType.SYSTEMUNDELETE:
            result = "System Undelete";
            break;

        case TransactionType.TOKENBURN:
            result = "Token Burn";
            break;
        case TransactionType.TOKENCREATION:
            result = "Token Create";
            break;
        case TransactionType.TOKENDELETION:
            result = "Token Delete";
            break;
        case TransactionType.TOKENUPDATE:
            result = "Token Update";
            break;
        case TransactionType.TOKENUPDATENFTS:
            result = "Update NFTs";
            break;
        case TransactionType.TOKENASSOCIATE:
            result = "Token Associate";
            break;
        case TransactionType.TOKENDISSOCIATE:
            result = "Token Dissociate";
            break;
        case TransactionType.TOKENFEESCHEDULEUPDATE:
            result = "Token Fee Schedule Update";
            break;
        case TransactionType.TOKENFREEZE:
            result = "Token Freeze";
            break;
        case TransactionType.TOKENGRANTKYC:
            result = "Token KYC Grant";
            break;
        case TransactionType.TOKENMINT:
            result = "Token Mint";
            break;
        case TransactionType.TOKENPAUSE:
            result = "Token Pause";
            break;
        case TransactionType.TOKENREJECT:
            result = "Token Reject";
            break;
        case TransactionType.TOKENAIRDROP:
            result = "Token Airdrop";
            break;
        case TransactionType.TOKENCANCELAIRDROP:
            result = "Cancel Airdrop";
            break;
        case TransactionType.TOKENCLAIMAIRDROP:
            result = "Claim Airdrop";
            break;
        case TransactionType.TOKENREVOKEKYC:
            result = "Token KYC Revoke";
            break;
        case TransactionType.TOKENUNFREEZE:
            result = "Token Unfreeze";
            break;
        case TransactionType.TOKENUNPAUSE:
            result = "Token Unpause";
            break;
        case TransactionType.TOKENWIPE:
            result = "Token Wipe";
            break;

        case TransactionType.UNCHECKEDSUBMIT:
            result = "Unchecked Submit";
            break;

        case TransactionType.UTILPRNG:
            result = "Pseudorandom Number Generate";
            break;

        default:
            result = type ?? "?"
            break
    }

    return result.toUpperCase()
}

export function makeOperatorAccountLabel(transaction: Transaction): string {
    let result: string
    const transactionId = transaction.transaction_id;
    if (transactionId != null) {
        result = TransactionID.makePayerID(transactionId) ?? "?"
    } else {
        result = "?"
    }
    return result
}

export function isSuccessfulResult(transactionResult: string): boolean {
    return transactionResult === "SUCCESS"
        || transactionResult === "FEE_SCHEDULE_FILE_PART_UPLOADED"
        || transactionResult === "SUCCESS_BUT_MISSING_EXPECTED_OPERATION"
}

export function formatMemo(memo64: string): string {
    let result: string
    try {
        result = atob(memo64)
    } catch {
        result = memo64
    }
    return result
}

export function computeNetAmount(transfers: Transfer[] | undefined, transactionFee: number | undefined): number {
    let result = 0
    if (transfers !== undefined) {
        for (const t of transfers) {
            if (t.amount > 0) {
                result += t.amount
            }
        }
    }
    result -= transactionFee ?? 0
    return result
}

// eslint-disable-next-line complexity
export function makeNetOfRewards(transfers: Transfer[] | undefined, rewards: StakingRewardTransfer[] | undefined): Transfer[] {
    let result = Array<Transfer>()
    let totalRewardAmount = 0

    if (transfers && rewards && transfers.length > 0 && rewards.length > 0) {
        for (const r of rewards) {
            totalRewardAmount += r.amount
        }
        let netAmount: number
        for (const t of transfers) {
            if (t.account === "0.0.800") {
                netAmount = t.amount + totalRewardAmount
            } else {
                netAmount = t.amount
                for (const r of rewards) {
                    if (t.account == r.account) {
                        netAmount = t.amount - r.amount
                        break
                    }
                }
            }
            if (netAmount != 0) {
                result.push({
                    amount: netAmount,
                    account: t.account,
                    is_approval: t.is_approval
                })
            }
        }
    } else {
        result = transfers ?? []
    }

    return result
}

export function getTargetedTokens(transaction: Transaction, nbItems: number | null = null): string[] {
    let result: string[]
    const type = transaction.name
    if (makeTypeLabel(type).toUpperCase().includes("TOKEN")) {
        result = transaction.entity_id ? [transaction.entity_id] : []
    } else if (type === TransactionType.CRYPTOTRANSFER) {
        result = []
        transaction.nft_transfers.forEach((nft) => {
            if (nft.token_id && !result.includes(nft.token_id)) {
                result.push(nft.token_id)
            }
        })
        transaction.token_transfers.forEach((token) => {
            if (token.token_id && !result.includes(token.token_id)) {
                result.push(token.token_id)
            }
        })
    } else {
        result = []
    }
    if (nbItems != null) {
        result = result.slice(0, nbItems)
    }
    return result
}

