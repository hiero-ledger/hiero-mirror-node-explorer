// SPDX-License-Identifier: Apache-2.0

import axios, {AxiosResponse} from "axios";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import {SolcMetadata} from "@/utils/solc/SolcMetadata";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";

import {routeManager} from "@/utils/RouteManager.ts";

export class SourcifyCache extends EntityCache<string, SourcifyRecord | null> {

    public static readonly instance = new SourcifyCache()


    //
    // Public
    //

    public static fetchMetadata(response: SourcifyResponse): SolcMetadata | null {

        // https://docs.sourcify.dev/docs/api/server/get-source-files-all/

        let result: SolcMetadata | null
        try {
            result = null
            for (const i of response.files) {
                if (i.name === "metadata.json") {
                    result = JSON.parse(i.content)
                    break
                }
            }
        } catch {
            result = null
        }

        return result
    }

    public static async checkAllContracts(addressesToCheck: string[]): Promise<string[]> {
        const verifiedAddresses: string[] = []
        const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup!

        const baseURL = sourcifySetup.makeCheckAllByAddressURL()
        const MAX_VERIFICATIONS = 100

        for (let i = 0; i < addressesToCheck.length; i += MAX_VERIFICATIONS) {
            const queryParams = new URLSearchParams();
            queryParams.append('chainIds', sourcifySetup.chainID.toString());
            queryParams.append('addresses', addressesToCheck.slice(i, i + MAX_VERIFICATIONS).join());
            const requestURL = `${baseURL}?${queryParams.toString()}`;

            const sourcifyResponse: AxiosResponse<Array<any>> = await axios.get<Array<any>>(requestURL)
            if (sourcifyResponse.data) {
                for (const r of sourcifyResponse.data) {
                    if ('chainIds' in r) {
                        verifiedAddresses.push(r.address.toLowerCase())
                    }
                }
            }
        }
        return Promise.resolve(verifiedAddresses)
    }

    //
    // public static fetchSource(sourceFileName: string, response: SourcifyResponse): string|null {
    //
    //     // https://docs.sourcify.dev/docs/api/server/get-source-files-all/
    //
    //     let result: string|null = null
    //     for (const f of response.files) {
    //         if (f.name === sourceFileName) {
    //             result = f.content
    //             break
    //         }
    //     }
    //
    //     return result
    // }

    //
    // Cache
    //

    protected async load(contractId: string): Promise<SourcifyRecord | null> {
        let result: SourcifyRecord | null
        const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup
        if (sourcifySetup !== null && sourcifySetup.activate) {
            const contractResponse = await ContractByIdCache.instance.lookup(contractId)
            const contractAddress = contractResponse?.evm_address
            if (contractAddress) {
                const requestURL = sourcifySetup.makeRequestURL(contractAddress)
                try {
                    const response = await axios.get<SourcifyResponse>(requestURL)
                    const isFullMatch = response.data.status === "full"
                    const repoURL = sourcifySetup.makeContractSourceURL(contractAddress, isFullMatch)
                    result = new SourcifyRecord(response.data, isFullMatch, repoURL)
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response?.status == 404) {
                        result = null
                    } else {
                        throw error
                    }
                }
            } else {
                result = null
            }
        } else {
            result = null
        }
        return Promise.resolve(result)
    }
}

export class SourcifyRecord {
    public readonly response: SourcifyResponse
    public readonly fullMatch: boolean
    public readonly folderURL: string

    constructor(response: SourcifyResponse, fullMatch: boolean, folderURL: string) {
        this.response = response
        this.fullMatch = fullMatch
        this.folderURL = folderURL
    }
}

export interface SourcifyResponse {
    status: string,
    files: SourcifyResponseItem[]
}

export interface SourcifyResponseItem {
    name: string,
    path: string,
    content: string
}
