// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {BlockByNbCache} from "@/utils/cache/BlockByNbCache";
import {Transaction, TransactionResponse} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";
import {TransactionByHashCache} from "@/utils/cache/TransactionByHashCache";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache";

import {drainTransactions} from "@/schemas/MirrorNodeUtils.ts";

export class TransactionGroupByBlockCache extends EntityCache<number, Transaction[] | null> {

    public static readonly instance = new TransactionGroupByBlockCache()

    //
    // Cache
    //

    protected async load(blockNb: number): Promise<Transaction[] | null> {
        let result: Transaction[] | null
        try {
            const block = await BlockByNbCache.instance.lookup(blockNb)
            if (block?.timestamp?.to && block?.count) {
                const params = {
                    limit: Math.min(block.count, 100),
                    timestamp: "lte:" + block.timestamp.to
                }
                const response = await axios.get<TransactionResponse>("api/v1/transactions", {params: params})
                result = await drainTransactions(response.data, params.limit)
                TransactionByHashCache.instance.updateWithTransactions(result)
                TransactionByTsCache.instance.updateWithTransactions(result)
            } else {
                result = null
            }
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

