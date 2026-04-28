// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
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
        return response.metadata ?? null;
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

            const sourcifyResponse = await axios.get<Array<Record<string, unknown>>>(requestURL)
            if (sourcifyResponse.data) {
                for (const r of sourcifyResponse.data) {
                    if ('chainIds' in r && typeof r.address === 'string') {
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
                    const isFullMatch = response.data.runtimeMatch === "exact_match"
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

export interface SourcifyStatusRecord {
    matchId: string,                // 28201817
    creationMatch: string|null,
    runtimeMatch: string,           // exact_match, match
    verifiedAt: string,             // 2026-03-17T14:52:17Z
    match: string,                  // exact_match
    chainId: string,                // 296
    address: string,                // 0x00000000000000000000000000000000005A67f7
}

export interface SourcifyResponse extends SourcifyStatusRecord {
    abi?: unknown,
    metadata?: SolcMetadata,
    creationByteCode?: unknown,
    onchainBytecode?: unknown,
    deployment?: unknown,
    blockNumber?: unknown,
    compilation?: unknown,
    sources?: Record<string, { content: string }>
}

export interface SourcifyBatchResponse {
    results: SourcifyStatusRecord[]
}

export interface SourcifyResponseItem {
    name: string,
    path: string,
    content: string
}
