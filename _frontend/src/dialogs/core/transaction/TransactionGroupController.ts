// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, ref} from "vue";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {waitForTransactionRefresh} from "@/schemas/MirrorNodeUtils.ts";
import {isSuccessfulResult} from "@/utils/TransactionTools.ts";
import {WalletClientRejectError} from "@/utils/wallet/client/WalletClient.ts";

export abstract class TransactionGroupController extends TaskController {

    private readonly transactionOutcomesRef: Ref<TransactionOutcome[]> = ref([])


    public readonly transactionOutcomes = computed(() => this.transactionOutcomesRef.value)

    public readonly errorOutcomes = computed(() => {
        const result: TransactionOutcome[] = []
        for (const o of this.transactionOutcomesRef.value) {
            if (o.error !== null) {
                result.push(o)
            }
        }
        return result
    })

    public readonly successOutcomes = computed(() => {
        const result: TransactionOutcome[] = []
        for (const o of this.transactionOutcomesRef.value) {
            if (typeof o.result === "object" && o.result !== null) {
                const td = o.result as Transaction
                if (isSuccessfulResult(td.result)) {
                    result.push(o)
                }
            }
        }
        return result
    })

    public readonly failureOutcomes = computed(() => {
        const result: TransactionOutcome[] = []
        for (const o of this.transactionOutcomesRef.value) {
            if (typeof o.result === "object" && o.result !== null) {
                const td = o.result as Transaction
                if (!isSuccessfulResult(td.result)) {
                    result.push(o)
                }
            }
        }
        return result
    })

    public readonly unknownOutcomes = computed(() => {
        const result: TransactionOutcome[] = []
        for (const o of this.transactionOutcomesRef.value) {
            if (typeof o.result !== "object") {
                result.push(o)
            }
        }
        return result
    })

    public readonly outcome0 = computed(() => {
        return this.transactionOutcomesRef.value.length >= 1 ? this.transactionOutcomesRef.value[0] : null
    })


    //
    // To be subclassed
    //

    public abstract getTransactionCount(): number

    protected async executeTransaction(index: number): Promise<Transaction | string | null> {
        throw "To be subclassed (i=" + index + ")"
    }


    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        return this.getTransactionCount() >= 1
    }

    public async execute(): Promise<void> {

        this.transactionOutcomesRef.value = []

        let rejected = false
        for (let i = 0; i < this.getTransactionCount(); i += 1) {
            let newOutcome: TransactionOutcome
            try {
                const r = await this.executeTransaction(i)
                if (r === null) {
                    // Transaction as completed but for some reason we did not get an transaction id
                    newOutcome = new TransactionOutcome(null, null)
                } else if (typeof r === "string") {
                    // r is a transaction id
                    try {
                        const t = await waitForTransactionRefresh(r)
                        newOutcome = new TransactionOutcome(t, null)
                    } catch (error) {
                        newOutcome = new TransactionOutcome(null, error)
                    }
                } else {
                    // r is a Transaction object
                    newOutcome = new TransactionOutcome(r, null)
                }
            } catch (error) {
                if (error instanceof WalletClientRejectError) {
                    rejected = true
                    break
                } else {
                    newOutcome = new TransactionOutcome(null, error)
                }
            }
            this.transactionOutcomesRef.value.push(newOutcome)
        }

        if (rejected && this.transactionOutcomesRef.value.length == 0) {
            // User has rejected the first transaction
            // => task did not start at all
            // => we close dialog silently
            this.showDialog.value = false
        }

    }

}

export class TransactionOutcome {

    public constructor(
        public readonly result: Transaction | string | null,
        public readonly error: unknown) {
    }

    public getTransactionId(): string | null {
        let result: string | null
        if (typeof this.result === "object" && this.result !== null) {
            result = (this.result as Transaction).transaction_id
        } else { // string | null
            result = this.result
        }
        return result
    }

    public getResult(): string | null {
        let result: string | null
        if (typeof this.result === "object" && this.result !== null) {
            result = (this.result as Transaction).result
        } else { // string | null
            result = this.result
        }
        return result
    }
}
