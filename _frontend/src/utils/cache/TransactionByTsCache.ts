// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {Transaction, TransactionResponse} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class TransactionByTsCache extends EntityCache<string, Transaction | null> {

    public static readonly instance = new TransactionByTsCache()

    //
    // Public
    //

    public updateWithTransactions(transactions: Transaction[]): void {
        for (const t of transactions) {
            this.updateWithTransaction(t)
        }
    }

    public updateWithTransaction(transaction: Transaction): void {
        if (transaction.consensus_timestamp) {
            this.forget(transaction.consensus_timestamp)
            this.mutate(transaction.consensus_timestamp, Promise.resolve(transaction))
        }
    }

    //
    // Cache
    //

    protected async load(timestamp: string): Promise<Transaction | null> {
        let result: Promise<Transaction | null>
        const params = {
            timestamp: timestamp
        }
        try {
            const response = await axios.get<TransactionResponse>("api/v1/transactions", {params: params})
            const transactions = response.data.transactions ?? []
            result = Promise.resolve(transactions.length >= 1 ? transactions[0] : null)
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

