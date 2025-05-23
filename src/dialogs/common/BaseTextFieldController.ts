// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, ref, watch} from "vue";

export class BaseTextFieldController {

    public readonly oldText: Ref<string | null>
    public readonly inputText: Ref<string> = ref("")
    private readonly newTextRef: Ref<string> = ref("")
    private timeoutID = -1


    //
    // Public
    //

    public constructor(oldText: Ref<string | null>) {
        this.oldText = oldText
        watch(this.oldText, () => {
            if (this.oldText.value) {
                this.inputText.value = this.oldText.value
            }
        }, {immediate: true})
        watch(this.inputText, this.inputTextDidChange, {immediate: true})
    }

    public readonly newText = computed(() => this.newTextRef.value)

    //
    // Private
    //

    private readonly inputTextDidChange = () => {
        const milliseconds = 500
        if (this.timeoutID != -1) {
            window.clearTimeout(this.timeoutID)
            this.timeoutID = -1
        }
        if (this.inputText.value == "") {
            this.newTextRef.value = this.inputText.value
        } else {
            this.timeoutID = window.setTimeout(() => {
                this.newTextRef.value = this.inputText.value.trim()
                this.timeoutID = -1
            }, milliseconds)
        }
    }
}
