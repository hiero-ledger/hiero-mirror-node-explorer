// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {TransactionByIdResponse, TransactionDetail} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class TransactionByIdCache extends EntityCache<string, TransactionDetail | null> {

    public static readonly instance = new TransactionByIdCache()

    //
    // Cache
    //

    protected async load(transactionId: string): Promise<TransactionDetail | null> {
        let result: TransactionDetail | null
        const params = {
            nonce: 0
        }
        try {
            const response = await axios.get<TransactionByIdResponse>("api/v1/transactions/" + transactionId, {params: params})
            const transactions = response.data.transactions ?? []
            switch (transactions.length) {
                case 0:
                    result = null
                    break
                case 1:
                    result = transactions[0]
                    break
                default:
                    result = TransactionByIdCache.fetchScheduledTransaction(transactions)
                    break
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

    //
    // Private
    //

    private static fetchScheduledTransaction(transactions: TransactionDetail[]): TransactionDetail | null {
        let result: TransactionDetail | null = null
        for (const t of transactions) {
            if (t.scheduled) {
                result = t
                break
            }
        }
        return result
    }
}

