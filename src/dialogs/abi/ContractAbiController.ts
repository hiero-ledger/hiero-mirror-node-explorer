// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {ContractCallBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";

export class ContractAbiController extends TaskController {

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, private readonly contractCallBuilder: ContractCallBuilder) {
        super(showDialog)
    }


    public readonly errorMessage = computed(() => {
        let result: string
        const lastError = this.contractCallBuilder.lastError.value
        if (lastError instanceof Error) {
            result = lastError.message
        } else if (lastError !== null) {
            result = JSON.stringify(lastError)
        } else {
            result = "No error details"
        }
        return result
    })

    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        const functionDataOK = this.contractCallBuilder.functionData.value !== null
        const payableValueOK = this.contractCallBuilder.payableValueBuilder === null
                                || this.contractCallBuilder.payableValue.value !== null
        return functionDataOK && payableValueOK
    }

    public async execute(): Promise<void> {

        this.contractCallBuilder.saveInputParams()
        await this.contractCallBuilder.execute()
        if (this.contractCallBuilder.lastError.value !== null) {
            throw this.contractCallBuilder.lastError.value
        }

    }

}
