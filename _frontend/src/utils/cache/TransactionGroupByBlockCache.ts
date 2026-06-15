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
        try {
            return await this.fetchBlockTransactions(blockNb)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                return null
            }
            throw error
        }
    }

    private async fetchBlockTransactions(blockNb: number): Promise<Transaction[] | null> {
        const block = await BlockByNbCache.instance.lookup(blockNb)
        if (!block?.timestamp || !block.count) {
            return null
        }
        const {from, to} = block.timestamp
        if (!from || !to) {
            return null
        }
        const params = {
            limit: Math.min(block.count, 100),
            timestamp: ["gte:" + from, "lte:" + to]
        }
        const response = await axios.get<TransactionResponse>(
            "api/v1/transactions",
            {params: params}
        )
        const result = await drainTransactions(response.data, block.count)
        if (result.length !== block.count) {
            console.warn(`fetchBlockTransactions only retrieved ${result.length} transactions (expected ${block.count}) for block ${blockNb}`)
        }

        TransactionByHashCache.instance.updateWithTransactions(result)
        TransactionByTsCache.instance.updateWithTransactions(result)
        return result
    }
}

