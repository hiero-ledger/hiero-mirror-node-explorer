// SPDX-License-Identifier: Apache-2.0


import {ethers} from "ethers";
import {ContractCallRequest, ContractCallResponse} from "@/schemas/MirrorNodeSchemas.ts";
import axios from "axios";

export class ERCUtils {


    //
    // Public (ERC20, ERC721)
    //

    public static async loadName(contractAddress: string): Promise<string | null> {
        // https://eips.ethereum.org/EIPS/eip-20
        // https://eips.ethereum.org/EIPS/eip-721
        const abi = "function name() public view returns (string)"
        const results = await this.call(contractAddress, abi, [])
        const result = results !== null ? results[0] as string : null
        return Promise.resolve(result)
    }

    public static async loadSymbol(contractAddress: string): Promise<string | null> {
        // https://eips.ethereum.org/EIPS/eip-20
        // https://eips.ethereum.org/EIPS/eip-721
        const abi = "function symbol() public view returns (string)"
        const results = await this.call(contractAddress, abi, [])
        const result = results !== null ? results[0] as string : null
        return Promise.resolve(result)
    }
    //
    // public static async loadBalance(contractAddress: string, accountAddress: string): Promise<bigint | null> {
    //     // https://eips.ethereum.org/EIPS/eip-20
    //     // https://eips.ethereum.org/EIPS/eip-721
    //     const abi = "function balanceOf(address owner) view returns (uint256)"
    //     const results = await this.call(contractAddress, abi, [accountAddress])
    //     const result = results !== null ? results[0] as bigint : null
    //     return Promise.resolve(result)
    // }

    //
    // Public (ERC165)
    //

    public static async supportsInterface(contractAddress: string, interfaceID: string): Promise<boolean> {
        // https://eips.ethereum.org/EIPS/eip-165
        const abi = "function supportsInterface(bytes4 interfaceID) external view returns (bool)"
        const results = await this.call(contractAddress, abi, [interfaceID])
        const result = results !== null ? results[0] as boolean : false
        return Promise.resolve(result)
    }

    public static async isERC165(contractAddress: string): Promise<boolean> {
        let result: boolean
        // https://eips.ethereum.org/EIPS/eip-165
        try {
            const supports0x01ffc9a7 = await this.supportsInterface(contractAddress, "0x01ffc9a7")
            const supports0xffffffff = await this.supportsInterface(contractAddress, "0xffffffff")
            result = supports0x01ffc9a7 && !supports0xffffffff
        } catch {
            result = false
        }
        return Promise.resolve(result)
    }

    public static async isERC721(contractAddress: string): Promise<boolean> {
        let result: boolean
        // https://eips.ethereum.org/EIPS/eip-165
        if (await this.isERC165(contractAddress)) {
            result = await this.supportsInterface(contractAddress, "0x80ac58cd")
        } else {
            result = false
        }
        return Promise.resolve(result)
    }


    //
    // Public (ERC20)
    //

    public static async loadDecimals(contractAddress: string): Promise<number | null> {
        // https://eips.ethereum.org/EIPS/eip-20
        const abi = "function decimals() public view returns (uint8)"
        const results = await this.call(contractAddress, abi, [])
        const result = results !== null ? Number(results[0]) : null
        return Promise.resolve(result)
    }

    public static async loadTotalSupply(contractAddress: string): Promise<string | null> {
        // https://eips.ethereum.org/EIPS/eip-20
        const abi = "function totalSupply() public view returns (uint256)"
        const results = await this.call(contractAddress, abi, [])
        const result = results !== null ? results[0] as string : null
        return Promise.resolve(result)
    }


    //
    // Private
    //

    private static privateAxios = axios.create()

    private static async call(targetAddress: string, abi: string, values: unknown[]): Promise<unknown[] | null> {
        let result: unknown[] | null
        const itf = new ethers.Interface([abi])
        const functionData = itf.encodeFunctionData(abi, values)
        const url = axios.defaults.baseURL + "api/v1/contracts/call"
        const body: ContractCallRequest = {
            data: functionData,
            to: targetAddress,
        }
        try {
            const response = await ERCUtils.privateAxios.post<ContractCallResponse>(url, body)
            result = itf.decodeFunctionResult(abi, response.data.result)
        } catch (error) {
            if (axios.isAxiosError(error) && error.status === 400) {
                console.log("Call to " + abi + " failed with error: " + JSON.stringify(error.response?.data))
            }
            result = null
        }
        return result
    }
}
