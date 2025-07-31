// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {TransactionByIdResponse, TransactionDetail} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class TransactionGroupCache extends EntityCache<string, TransactionDetail[] | null> {

    public static readonly instance = new TransactionGroupCache()

    //
    // Cache
    //

    protected async load(transactionId: string): Promise<TransactionDetail[] | null> {
        let result: TransactionDetail[] | null
        try {
            const response = await axios.get<TransactionByIdResponse>("api/v1/transactions/" + transactionId)
            result = response.data?.transactions ?? null
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = null
            } else {
                throw error
            }
        }
        if (result) {
            result.sort((t1, t2) => t1.nonce - t2.nonce)
        }
        return Promise.resolve(result)
    }
}

