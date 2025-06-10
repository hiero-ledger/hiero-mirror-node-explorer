// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref} from "vue";
import {FunctionCallDecoder, NameTypeValue} from "@/utils/analyzer/call/FunctionCallDecoder.ts";
import {isRedirectForTokenTx} from "@/schemas/MirrorNodeUtils.ts";
import {EntityID} from "@/utils/EntityID.ts";

export class FunctionCallAnalyzer {

    private readonly callDecoder: FunctionCallDecoder

    //
    // Public
    //

    public constructor(
        private readonly input: Ref<string | null>,
        private readonly output: Ref<string | null>,
        private readonly error: Ref<string | null>,
        private readonly contractId: Ref<string | null>,
        private readonly contractCreate: Ref<boolean> = ref(false)) {
        this.callDecoder = new FunctionCallDecoder(
            this.contractForDecoder,
            this.inputForDecoder,
            this.normalizedOutput,
            this.normalizedError,
            this.contractCreate
        )
    }

    public mount(): void {
        this.callDecoder.mount()
    }

    public unmount(): void {
        this.callDecoder.unmount()
    }

    public readonly functionHash: ComputedRef<string|null> = computed(() => {
        let result: string|null
        if (this.contractCreate.value) {
            // constructor input has no 4-bytes selector
            result = null
        } else {
            const input = this.input.value
            result = input !== null ? input.slice(0, 10) : null
        }
        return result
    })


    public readonly functionParams = computed(() => {
        let result: string | null
        if (this.contractCreate.value) {
            // constructor input has no 4-bytes selector
            result = this.input.value
        } else {
            // function input starts with 4-bytes selector => we remove it
            const input = this.input.value
            result = input !== null ? "0x" + input.slice(10) : null
        }
        return result
    })

    public readonly isRedirect = computed(() => {
        const contractId = this.contractId.value
        const functionHash = this.functionHash.value
        return contractId !== null && functionHash !== null && isRedirectForTokenTx(contractId, functionHash)
    })

    public readonly normalizedInput: ComputedRef<string | null> = computed(() => {
        return this.input.value == "0x" ? null : this.input.value
    })

    public readonly normalizedOutput: ComputedRef<string | null> = computed(() => {
        return this.output.value == "0x" ? null : this.output.value
    })

    public readonly normalizedError: ComputedRef<string | null> = computed(() => {
        return this.error.value == "0x" ? null : this.error.value
    })

    public readonly signature: ComputedRef<string | null> = computed(() => {
        let result: string|null
        if (this.isRedirect.value) {
            result = "function redirectForToken(address token, bytes encodedFunctionSelector) returns (int64 responseCode, bytes response)"
        } else {
            result = this.callDecoder.signature.value
        }
        return result
    })

    public readonly is4byteSignature: ComputedRef<boolean> = computed(() => {
        return this.isRedirect.value ? false : this.callDecoder.is4byteSignature.value
    })

    public readonly errorSignature: ComputedRef<string | null> = computed(() => {
        return this.callDecoder.errorSignature.value
    })

    public readonly errorHash: ComputedRef<string | null> = computed(() => {
        return this.callDecoder.errorHash.value
    })

    public readonly inputs: ComputedRef<NameTypeValue[]> = computed(() => {
        let result: NameTypeValue[]
        if (this.isRedirect.value) {
            const functionParams = this.functionParams.value
            if (functionParams !== null) {
                const tokenAddress = `0x${functionParams.slice(2, 42)}`
                const encodedFunctionSelector = `0x${functionParams.slice(42)}`
                result = [
                    new NameTypeValue("token", "address", tokenAddress, null, null),
                    new NameTypeValue("encodedFunctionSelector", "bytes", encodedFunctionSelector, null, null),
                ]
                if (this.callDecoder.signature.value !== null) {
                    result.push(
                        new NameTypeValue("signature", "string", this.callDecoder.signature.value, null, null),
                    )
                    for (let ntv of this.callDecoder.decodedInput.value) {
                        result.push(ntv)
                    }
                }
            } else {
                result = []
            }
        } else {
            result = this.callDecoder.decodedInput.value
        }
        return result
    })

    public readonly outputs: ComputedRef<NameTypeValue[]> = computed(() => {
        return this.callDecoder.decodedOutput.value
    })

    public readonly errorInputs: ComputedRef<NameTypeValue[]> = computed(() => {
        return this.callDecoder.decodedError.value
    })

    public readonly functionDecodingStatus = computed(() => {
        return this.callDecoder.decodedFunctionStatus.value
    })

    public readonly inputDecodingStatus = computed(() => {
        return this.callDecoder.decodedInputStatus.value
    })

    public readonly outputDecodingStatus = computed(() => {
        return this.callDecoder.decodedOutputStatus.value
    })

    public readonly errorDecodingStatus = computed(() => {
        return this.callDecoder.decodedErrorStatus.value
    })

    public readonly inputArgsOnly = computed(() => {
        return this.functionParams.value
    })

    //
    // Private
    //

    private readonly contractForDecoder = computed(() => {
        let result: string|null
        if (this.isRedirect.value) {
            if (this.functionParams.value !== null) {
                const tokenAddress = `0x${this.functionParams.value.slice(2, 42)}`
                const entityId = EntityID.fromAddress(tokenAddress)
                result = entityId !== null ? entityId.toString() : null
            } else {
                result = null
            }
        } else {
            result = this.contractId.value
        }
        return result
    })

    private readonly inputForDecoder = computed(() => {
        let result: string|null
        if (this.isRedirect.value) {
            if (this.functionParams.value !== null) {
                result = `0x${this.functionParams.value.slice(42)}`
            } else {
                result = null
            }
        } else {
            result = this.normalizedInput.value
        }
        return result
    })

}

