// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {BaseTextFieldController} from "@/dialogs/common/BaseTextFieldController.ts";
import isEmail from 'validator/es/lib/isEmail' // Tree shakeable

export class EmailTextFieldController {

    public readonly inputText: Ref<string>
    private readonly baseTextFieldController = new BaseTextFieldController(computed(() => null))

    //
    // Public
    //

    public constructor() {
        this.inputText = this.baseTextFieldController.inputText
    }

    public readonly state = computed<EmailTextFieldState>(() => {
        let result: EmailTextFieldState

        const trimmedValue = this.baseTextFieldController.newText.value.trim()
        if (trimmedValue.length === 0) {
            result = EmailTextFieldState.empty
        } else if (isEmail(trimmedValue)) {
            result = EmailTextFieldState.ok
        } else {
            result = EmailTextFieldState.invalidSyntax
        }
        return result
    })

    public readonly newEmail = computed(() => {
        const trimmedValue = this.baseTextFieldController.newText.value.trim()
        return trimmedValue !== "" ? trimmedValue : null
    })
}

export enum EmailTextFieldState {
    empty,
    invalidSyntax, // Invalid email syntax
    ok
}
