// SPDX-License-Identifier: Apache-2.0

import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";
import axios from "axios";
import {routeManager} from "@/utils/RouteManager.ts";

export class SourcifyUtils {


    //
    // Session verification
    //

    private static readonly withCredentials = true

    public static async sessionClear(): Promise<string> {
        let result: string

        const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup
        if (sourcifySetup !== null) {
            const url = sourcifySetup.serverURL + "session/clear"
            const config = {withCredentials: this.withCredentials}
            const response = await axios.post<string>(url, null, config)
            result = response.data
        } else {
            throw Error("No sourcify setup for network " + routeManager.currentNetworkEntry.value.name)
        }

        return Promise.resolve(result)
    }

    public static async sessionInputFiles(files: Map<string, string>): Promise<SourcifyInputFilesResponse> {
        let result: SourcifyInputFilesResponse

        const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup
        if (sourcifySetup !== null) {
            const body: SourcifyInputFilesBody = {
                files: {}
            }
            for (const [f, c] of files) {
                body.files[f] = c
            }
            const url = sourcifySetup.serverURL + "session/input-files"
            const config = {
                withCredentials: this.withCredentials,
                headers: {'content-type': 'application/json'},
                params: {dryrun: true}
            }
            const response = await axios.post<SourcifyInputFilesResponse>(url, body, config)
            result = response.data
        } else {
            throw Error("No sourcify setup for network " + routeManager.currentNetworkEntry.value.name)
        }

        return Promise.resolve(result)
    }

    public static async sessionVerifyChecked(contractId: string,
                                             verificationIds: string[],
                                             store: boolean): Promise<SourcifyVerifyCheckedResponse> {
        let result: SourcifyVerifyCheckedResponse

        const contractResponse = await ContractByIdCache.instance.lookup(contractId)
        const address = contractResponse?.evm_address ?? null
        const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup
        if (address !== null && sourcifySetup !== null) {
            const chainId = sourcifySetup.chainID.toString()
            const body: SourcifyVerifyCheckedBody = {
                contracts: []
            }
            for (const vid of verificationIds) {
                body.contracts.push({
                    address: address,
                    chainId: chainId,
                    verificationId: vid,
                    creatorTxHash: null
                })
            }
            const url = sourcifySetup.serverURL + "session/verify-checked"
            const config = {
                withCredentials: this.withCredentials,
                headers: {'content-type': 'application/json'},
                params: {}
            }
            if (!store) {
                config.params = {dryrun: true}
            }
            const response = await axios.post<SourcifyVerifyCheckedResponse>(url, body, config)
            result = response.data
        } else {
            throw Error("No sourcify setup for network " + routeManager.currentNetworkEntry.value.name)
        }

        return Promise.resolve(result)
    }

    //
    // Tools
    //

    public static fetchMatchingContract(response: SourcifyVerifyCheckedResponse): SourcifyVerifyCheckedContract | null {
        let result: SourcifyVerifyCheckedContract | null = null
        for (const c of response.contracts) {
            if (c.status == "partial" || c.status == "perfect") {
                result = c
                break
            }
        }
        return result
    }

    public static fetchVerificationIds(response: SourcifyInputFilesResponse): string[] {
        const result: string[] = []
        for (const c of response.contracts) {
            result.push(c.verificationId)
        }
        return result
    }
}


export interface SourcifyInputFilesBody {
    files: Record<string, string> // filename x content
}

export interface SourcifyInputFilesResponse {
    contracts: {
        compiledPath: string
        name: string
        compilerVersion: string
        files: {
            found: string[]
            missing: string[]
        }
        verificationId: string
        status: string
    }[]
    files: string[]
    unused: string[]
}

export interface SourcifyVerifyCheckedBody {
    contracts: {
        address: string
        chainId: string
        creatorTxHash: string | null
        verificationId: string
    }[]
}


export interface SourcifyVerifyCheckedResponse {
    contracts: SourcifyVerifyCheckedContract[]
    files: string[]
    unused: string[]
}

export interface SourcifyVerifyCheckedContract {
    verificationId: string
    compiledPath: string
    name: string
    compilerVersion: string
    address: string
    chainId: string
    files: {
        found: string[]
        missing: string[]
    }
    status: string
    statusMessage?: string
    storageTimestamp: string
}
