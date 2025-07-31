// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache.ts";
import {ERC20Cache} from "@/utils/cache/ERC20Cache.ts";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache.ts";
import {ERCUtils} from "@/utils/ERCUtils.ts";

export class ERC20InfoCache extends EntityCache<string, ERC20Info | null> {

    public static readonly instance = new ERC20InfoCache()

    //
    // Cache
    //

    protected async load(contractId: string): Promise<ERC20Info | null> {
        let result: ERC20Info | null
        const erc20 = await ERC20Cache.instance.lookupContract(contractId)
        if (erc20 !== null) {
            result = await this.loadInfo(contractId)
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

    //
    // Private
    //

    private async loadInfo(contractId: string): Promise<ERC20Info | null> {
        let result: ERC20Info | null
        const evmAddress = await AccountByIdCache.instance.findAccountAddress(contractId)
        if (evmAddress !== null) {
            const promises: Promise<unknown>[] = [
                ERCUtils.loadName(evmAddress),
                ERCUtils.loadSymbol(evmAddress),
                ERCUtils.loadDecimals(evmAddress),
                ERCUtils.loadTotalSupply(evmAddress),
            ]
            const resolutions = await Promise.all(promises)
            const name = resolutions[0] as string | null
            const symbol = resolutions[1] as string | null
            const decimals = resolutions[2] as number | null
            const totalSupply = resolutions[3] as string | null
            result = {
                contractId,
                evmAddress,
                name,
                symbol,
                decimals,
                totalSupply,
            }
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

    //
    // private async loadName(contractAddress: string): Promise<string|null> {
    //     // https://eips.ethereum.org/EIPS/eip-20
    //     const abi = "function name() public view returns (string)"
    //     const results = await this.call(contractAddress, abi, [])
    //     const result = results !== null ? results[0] as string : null
    //     return Promise.resolve(result)
    // }
    //
    // private async loadSymbol(contractAddress: string): Promise<string|null> {
    //     // https://eips.ethereum.org/EIPS/eip-20
    //     const abi = "function symbol() public view returns (string)"
    //     const results = await this.call(contractAddress, abi, [])
    //     const result = results !== null ? results[0] as string : null
    //     return Promise.resolve(result)
    // }
    //
    // private async loadDecimals(contractAddress: string): Promise<number|null> {
    //     // https://eips.ethereum.org/EIPS/eip-20
    //     const abi = "function decimals() public view returns (uint8)"
    //     const results = await this.call(contractAddress, abi, [])
    //     const result = results !== null ? Number(results[0]) : null
    //     return Promise.resolve(result)
    // }
    //
    // private async loadTotalSupply(contractAddress: string): Promise<string|null> {
    //     // https://eips.ethereum.org/EIPS/eip-20
    //     const abi = "function totalSupply() public view returns (uint256)"
    //     const results = await this.call(contractAddress, abi, [])
    //     const result = results !== null ? results[0] as string : null
    //     return Promise.resolve(result)
    // }
    //
    // private async call(targetAddress: string, abi: string, values: unknown[]): Promise<unknown[]|null> {
    //     let result: unknown[] | null
    //     const itf = new ethers.Interface([abi])
    //     const functionData = itf.encodeFunctionData(abi, values)
    //     const url = "api/v1/contracts/call"
    //     const body: ContractCallRequest = {
    //         data: functionData,
    //         to: targetAddress,
    //     }
    //     try {
    //         const response = await axios.post<ContractCallResponse>(url, body)
    //         result = itf.decodeFunctionResult(abi, response.data.result)
    //     } catch(error) {
    //         result = null
    //     }
    //     return result
    // }
}

export interface ERC20Info {
    contractId: string
    evmAddress: string
    name: string | null
    symbol: string | null
    decimals: number | null
    totalSupply: string | null
}
