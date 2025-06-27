// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TransactionDetail, TransactionType} from "@/schemas/MirrorNodeSchemas";

export class TransactionGroupAnalyzer {

    public readonly transactions: Ref<TransactionDetail[] | null>

    //
    // Public
    //

    public constructor(transactions: Ref<TransactionDetail[] | null>) {
        this.transactions = transactions
    }

    private readonly outerTransaction = computed(() => {
        let result: TransactionDetail | null = null
        for (const t of this.transactions.value ?? []) {
            if (t.name === TransactionType.ATOMICBATCH) {
                result = t
                break
            }
        }
        return result
    })

    public readonly innerTransactions = computed(() => {
        const result = new Array<TransactionDetail>()
        if (this.outerTransaction.value !== null) {
            for (const t of this.transactions.value ?? []) {
                if (t.batch_key) {
                    result.push(t)
                }
            }
        }
        return result
    })

    public readonly parentTransaction = computed(() => {
        let result: TransactionDetail | null = null
        if (this.childTransactions.value.length > 0) {
            for (const t of this.transactions.value ?? []) {
                if (t.nonce === 0) {
                    result = t
                    break
                }
            }
        }
        result = this.childTransactions.value.length > 0 ? result : null // can't be a parent without children
        return result
    })

    public readonly childTransactions = computed(() => {
        const result = new Array<TransactionDetail>()
        for (const t of this.transactions.value ?? []) {
            if (t.parent_consensus_timestamp && !t.batch_key) {
                result.push(t)
            }
        }
        return result
    })

    public readonly scheduledTransaction = computed(() => {
        let result: TransactionDetail | null = null
        if (this.transactions.value !== null && this.transactions.value.length == 2) {
            for (const t of this.transactions.value) {
                if (t.scheduled) {
                    result = t
                    break
                }
            }
        } else {
            result = null
        }
        return result
    })

    public readonly schedulingTransaction = computed(() => {
        let result: TransactionDetail | null = null
        if (this.transactions.value !== null && this.transactions.value.length == 2) {
            for (const t of this.transactions.value) {
                if (t.name === TransactionType.SCHEDULECREATE) {
                    result = t
                    break
                }
            }
        } else {
            result = null
        }
        return result
    })


}

