// SPDX-License-Identifier: Apache-2.0

import {ref, Ref, watch} from "vue";

export abstract class TaskController {

    public readonly executeError: Ref<unknown> = ref(null)

    //
    // To be subclassed
    //

    public abstract canBeExecuted(): boolean

    public async execute(): Promise<void> {
        throw "Must be subclassed"
    }

    protected dialogStartShowing(): void {
        // Dialog did start showing
    }

    protected dialogStopShowing(): void {
        // Dialog did stop showing
    }

    //
    // Protected
    //

    protected constructor(public readonly showDialog: Ref<boolean>) {
        watch(this.showDialog, (show) => {
            if (show) {
                this.dialogStartShowing()
            } else {
                this.dialogStopShowing()
            }
        })
    }

}
