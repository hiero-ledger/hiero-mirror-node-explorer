// SPDX-License-Identifier: Apache-2.0

import {ContractResult, ContractResultDetails, ContractResultsResponse} from "@/schemas/MirrorNodeSchemas";
import {ContractResultByHashCache} from "@/utils/cache/ContractResultByHashCache";
import {EntityCache} from "@/utils/cache/base/EntityCache"
import {drainContractResults} from "@/schemas/MirrorNodeUtils.ts";
import axios from "axios";
import {SAMPLE_CONTRACT_RESULT_DETAILS} from "../../../tests/unit/Mocks.ts"

const mockLists = import.meta.env.VITE_APP_MOCK_CONTRACT_RESULT_LISTS === "true"

export class ContractResultByTsCache extends EntityCache<string, ContractResultDetails | null> {

    public static readonly instance = new ContractResultByTsCache()


    //
    // Public
    //

    public updateWithContractResult(contractResult: ContractResultDetails): void {
        if (contractResult.timestamp) {
            this.forget(contractResult.timestamp)
            this.mutate(contractResult.timestamp, Promise.resolve(contractResult))
        }
    }

    //
    // Cache
    //

    protected async load(timestamp: string): Promise<ContractResultDetails | null> {
        let result: ContractResultDetails | null
        const contractResult = await this.loadContractResult(timestamp)
        const contractId = contractResult?.contract_id ?? null
        if (contractId !== null && contractId !== "0.0.359") {
            result = await this.loadContractResultDetail(contractId, timestamp)
            if (result !== null) {
                ContractResultByHashCache.instance.updateWithContractResult(result);
            }
        } else {
            const ethereumHash = contractResult?.hash ?? null
            if (ethereumHash !== null) {
                result = await ContractResultByHashCache.instance.lookup(ethereumHash)
            } else {
                result = null
            }
        }
        return Promise.resolve(result)
    }

    //
    // Private
    //

    private async loadContractResult(timestamp: string): Promise<ContractResult | null> {
        let result: ContractResult | null
        try {
            const parameters = {
                timestamp: timestamp,
                internal: true,
                limit: 1
            }
            const response = await axios.get<ContractResultsResponse>("api/v1/contracts/results", {params: parameters})
            const results = await drainContractResults(response.data, parameters.limit)
            result = results && results.length >= 1 ? results[0] : null
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = null
            } else {
                throw error
            }
        }
        return Promise.resolve(result)
    }

    private async loadContractResultDetail(contractId: string, timestamp: string): Promise<ContractResultDetails | null> {
        let result: ContractResultDetails | null
        try {
            const response = await axios.get<ContractResultDetails>("api/v1/contracts/" + contractId + "/results/" + timestamp)
            result = mockLists ? {
                ...response.data,
                access_list: SAMPLE_CONTRACT_RESULT_DETAILS.access_list,
                authorization_list: SAMPLE_CONTRACT_RESULT_DETAILS.authorization_list
            } : response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = null
            } else {
                throw error
            }
        }
        return Promise.resolve(result)
    }
}

