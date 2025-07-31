// SPDX-License-Identifier: Apache-2.0

import {computed, ref} from "vue";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {WalletClientRejectError} from "@/utils/wallet/client/WalletClient.ts";
import {isSuccessfulResult} from "@/utils/TransactionTools.ts";
import {TransactionID} from "@/utils/TransactionID.ts";
import {waitForTransactionRefresh} from "@/schemas/MirrorNodeUtils.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";

export abstract class TransactionController extends TaskController {


    //
    // Public
    //

    public readonly transactionId = ref<string | null>(null)
    public readonly transactionResult = ref<string | null>(null)

    public readonly isFailedResult = computed(() => {
        const r = this.transactionResult.value
        return r !== null && !isSuccessfulResult(r)
    })

    //
    // To be subclassed
    //

    protected async executeTransaction(): Promise<Transaction | string | null> {
        throw "Must be subclassed"
    }

    //
    // TaskController
    //

    public async execute(): Promise<void> {
        try {
            const r = await this.executeTransaction()
            if (r === null) {
                this.transactionId.value = null
                this.transactionResult.value = null
            } else if (typeof r === "string") {
                this.transactionId.value = TransactionID.normalize(r)
                try {
                    const t = await waitForTransactionRefresh(this.transactionId.value)
                    this.transactionResult.value = typeof t == "object" ? t.result : null
                } catch {
                    this.transactionResult.value = null
                }
            } else { // r is a Transaction
                this.transactionId.value = r.transaction_id
                this.transactionResult.value = r.result
            }
        } catch (error) {
            this.transactionId.value = null
            this.transactionResult.value = null
            if (error instanceof WalletClientRejectError) {
                this.showDialog.value = false
            } else {
                throw error
            }
        }
    }

}
