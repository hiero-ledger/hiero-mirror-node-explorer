// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {Transaction, TransactionByIdResponse} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class TransactionByHashCache extends EntityCache<string, Transaction | null> {

    public static readonly instance = new TransactionByHashCache()

    //
    // Public
    //

    public updateWithTransactions(transactions: Transaction[]): void {
        for (const t of transactions) {
            this.updateWithTransaction(t)
        }
    }

    public updateWithTransaction(transaction: Transaction): void {
        if (transaction.transaction_hash) {
            this.forget(transaction.transaction_hash)
            this.mutate(transaction.transaction_hash, Promise.resolve(transaction))
        }
    }

    //
    // Cache
    //

    protected async load(transactionHash: string): Promise<Transaction | null> {
        let result: Promise<Transaction | null>
        try {
            const response = await axios.get<TransactionByIdResponse>("api/v1/transactions/" + transactionHash)
            const transactions = response.data?.transactions ?? []
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

