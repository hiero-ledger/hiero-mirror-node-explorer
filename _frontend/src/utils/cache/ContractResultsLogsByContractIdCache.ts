// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import {EntityCache} from './base/EntityCache';
import {ContractLog} from '@/schemas/MirrorNodeSchemas.ts';
import {drainContractResultsLogs} from "@/schemas/MirrorNodeUtils.ts";

export class ContractResultsLogsByContractIdCache extends EntityCache<string, ContractLog[] | null> {

    public static readonly instance = new ContractResultsLogsByContractIdCache()

    //
    // Cache
    //
    protected async load(contractId: string): Promise<ContractLog[] | null> {
        let result: ContractLog[] | null
        const params = {
            limit: 100,
            order: "desc",
        }

        try {
            const response = await axios.get(`api/v1/contracts/${contractId}/results/logs`, {params});
            result = await drainContractResultsLogs(response.data, params.limit)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = null
            } else {
                throw error
            }
        }

        return result
    }
}
