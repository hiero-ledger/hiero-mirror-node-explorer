// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {ContractResultDetails} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class ContractResultByTransactionIdCache extends EntityCache<string, ContractResultDetails | null> {

    public static readonly instance = new ContractResultByTransactionIdCache()

    //
    // Cache
    //

    protected async load(transactionId: string): Promise<ContractResultDetails | null> {
        let result: Promise<ContractResultDetails | null>
        try {
            const response = await axios.get<ContractResultDetails>("api/v1/contracts/results/" + transactionId)
            result = Promise.resolve(response.data)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = Promise.resolve(null)
            } else {
                throw error
            }
        }
        return result
    }

}

