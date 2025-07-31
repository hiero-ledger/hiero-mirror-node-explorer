// SPDX-License-Identifier: Apache-2.0

import {Ref, ref, watch} from "vue";

export class InputChangeController {

    public readonly outputText = ref<string>("")
    private timeoutID = -1

    //
    // Public
    //

    public constructor(private readonly inputText: Ref<string>, private readonly millis: number = 500) {
        watch(this.inputText, this.inputTextDidChange, {immediate: true})
    }

    //
    // Private
    //

    private readonly inputTextDidChange = () => {
        if (this.timeoutID != -1) {
            window.clearTimeout(this.timeoutID)
            this.timeoutID = -1
        }
        if (this.inputText.value == "") {
            this.outputText.value = this.inputText.value
        } else {
            this.timeoutID = window.setTimeout(() => {
                this.outputText.value = this.inputText.value.trim()
                this.timeoutID = -1
            }, this.millis)
        }
    }
}
