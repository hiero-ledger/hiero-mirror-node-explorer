// SPDX-License-Identifier: Apache-2.0

import {WalletClient, WalletClientRejectError} from "@/utils/wallet/client/WalletClient";
import {ContractResultDetails, Transaction} from "@/schemas/MirrorNodeSchemas";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache";
import {EntityID} from "@/utils/EntityID";
import {ethers} from "ethers";
import {eth_isUserReject} from "@/utils/wallet/eip1193";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import {makeTokenSymbol} from "@/schemas/MirrorNodeUtils";
import {waitFor} from "@/utils/TimerUtils";
import {ContractResultByHashCache} from "@/utils/cache/ContractResultByHashCache.ts";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache.ts";


export class WalletClient_Ethereum extends WalletClient {


    //
    // Public
    //

    public async watchToken(tokenId: string, serialNumber?: string): Promise<void> {
        const tokenAddress = EntityID.parse(tokenId)?.toAddress() ?? null
        if (tokenAddress !== null) {
            const tokenInfo = await TokenInfoCache.instance.lookup(tokenId)
            const symbol = makeTokenSymbol(tokenInfo, 11)
            let params = {}

            if (serialNumber) {
                params = {
                    "type": "ERC721",
                    "options": {
                        "address": `0x${tokenAddress}`,
                        "symbol": symbol,
                        "tokenId": serialNumber,
                        "image": HEDERA_LOGO
                    }
                }
            } else {
                params = {
                    "type": "ERC20",
                    "options": {
                        "address": `0x${tokenAddress}`,
                        "symbol": symbol,
                        "decimals": tokenInfo?.decimals,
                        "image": HEDERA_LOGO
                    }
                }
            }

            return new Promise<void>((resolve, reject) => {
                if (this.provider.send) {
                    const cb = (error: (Error | null)/* , response: unknown*/) => {
                        if (error === null) {
                            resolve()
                        } else {
                            reject(error)
                        }
                    }
                    this.provider.send({
                        method: "wallet_watchAsset",
                        params: params
                    }, cb)

                } else {
                    reject("Provider does not support send() method")
                }
            })
        } else {
            throw "bug"
        }
    }


    //
    // WalletSession
    //

    public async associateToken(tokenId: string): Promise<string> {
        const abi = ["function associate()"]
        const iface = new ethers.Interface(abi)
        const callData = iface.encodeFunctionData("associate", [])
        const result = await this.executeCall(tokenId, callData)
        return Promise.resolve(result)
    }

    public async dissociateToken(tokenId: string): Promise<string> {
        const abi = ["function dissociate()"]
        const iface = new ethers.Interface(abi)
        const callData = iface.encodeFunctionData("dissociate", [])
        const result = await this.executeCall(tokenId, callData)
        return Promise.resolve(result)
    }


    public async callContract(contractId: string, functionData: string): Promise<ContractResultDetails | string> {
        return this.executeCall(contractId, functionData)
    }

    //
    // Private
    //

    private async executeCall(targetId: string, callData: string): Promise<string> {
        let result: string

        const accountAddress = await AccountByIdCache.instance.findAccountAddress(this.accountId)
        const tokenAddress = EntityID.parse(targetId)?.toAddress() ?? null
        if (accountAddress !== null && tokenAddress !== null) {
            // 1) Estimate gas
            try {
                const gas = await this.estimateGas(accountAddress, "0x" + tokenAddress, callData)
                console.log("gas = " + gas)
            } catch (reason) {
                console.log("failed to estimate gas = " + JSON.stringify(reason))
            }
            // 2) Sends transaction
            let ethHash: string
            try {
                ethHash = await this.sendTransaction(accountAddress, "0x" + tokenAddress, callData)
            } catch (reason) {
                if (eth_isUserReject(reason)) {
                    throw new WalletClientRejectError()
                } else {
                    throw reason
                }
            }
            // 3) Waits for transaction to appear in mirror node
            try {
                const transaction = await this.waitForTransactionSurfacing(ethHash)
                result = typeof transaction === "object" ? transaction.transaction_id : ethHash
            } catch {
                result = ethHash
            }

        } else {
            throw "bug"
        }

        return result
    }

    private async sendTransaction(fromAddress: string, toAddress: string, callData: string): Promise<string> {
        const ethParams = {
            from: fromAddress,
            to: toAddress,
            data: callData,
            gas: "0x1E8480", // 2_000_000
            gasPrice: "0x1D1A94A2000" // 2_000_000_000_000
        }
        const request = {
            method: "eth_sendTransaction",
            params: [ethParams]
        }
        return await this.provider.request(request) as string
    }

    private async estimateGas(fromAddress: string, toAddress: string, callData: string): Promise<string> {
        const ethParams = {
            from: fromAddress,
            to: toAddress,
            data: callData,
        }
        const request = {
            method: "eth_estimateGas",
            params: [ethParams]
        }
        return await this.provider.request(request) as string
    }


    private async waitForTransactionSurfacing(transactionHash: string): Promise<Transaction | string> {
        let result: Transaction | string

        try {

            await waitFor(500) // Optimistic wait
            let contractResult = await ContractResultByHashCache.instance.lookup(transactionHash, true)

            let counter = 20
            while (contractResult === null && counter > 0) {
                await waitFor(3000)
                contractResult = await ContractResultByHashCache.instance.lookup(transactionHash, true)
                counter -= 1
            }
            if (contractResult !== null) {
                result = await TransactionByTsCache.instance.lookup(contractResult.timestamp, true) ?? transactionHash
            } else {
                result = transactionHash
            }
        } catch {
            result = transactionHash
        }

        return Promise.resolve(result)
    }

}

export function networkToChainId(network: string, hex: boolean = true): string | null {
    let result: number | null
    // https://docs.hedera.com/hedera/core-concepts/smart-contracts/deploying-smart-contracts/json-rpc-relay
    switch (network) {
        case "mainnet":
            result = 295
            break
        case "testnet":
            result = 296
            break
        case "previewnet":
            result = 297
            break
        default:
            result = null
            break
    }
    return result !== null ? result.toString(hex ? 16 : 10) : null
}


export const HEDERA_LOGO =
    'data:image/svg+xml;utf8,<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">' +
    '<path d="M20 0a20 20 0 1 0 20 20A20 20 0 0 0 20 0" fill="black"></path>' +
    '<path d="M28.13 28.65h-2.54v-5.4H14.41v5.4h-2.54V11.14h2.54v5.27h11.18v-5.27h2.54zm-13.6-7.42h11.18v-2.79H14.53z" fill="white"></path>' +
    '</svg>'


