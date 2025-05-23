// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref, shallowRef, watch, WatchStopHandle} from "vue";
import {ethers} from "ethers";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer";
import {SignatureCache, SignatureRecord, SignatureResponse} from "@/utils/cache/SignatureCache";
import {
    decodeRedirectForTokenInput,
    isRedirectForTokenTx,
    labelForResponseCode,
    resolveFunctionFragmentForHTSProxyContract
} from "@/schemas/MirrorNodeUtils.ts";

export class FunctionCallAnalyzer {

    private readonly contractAnalyzer: ContractAnalyzer
    private readonly signatureResponse = shallowRef<SignatureResponse | null>(null)
    private readonly functionFragment = shallowRef<ethers.FunctionFragment | ethers.ConstructorFragment | null>(null)
    private readonly is4byteFunctionFragment = ref<boolean>(false)
    private readonly functionDecodingFailure = shallowRef<unknown>(null)
    private readonly inputResult = shallowRef<ethers.Result | null>(null)
    private readonly inputDecodingFailure = shallowRef<unknown>(null)
    private readonly outputResult = shallowRef<ethers.Result | null>(null)
    private readonly outputDecodingFailure = shallowRef<unknown>(null)
    private readonly errorDescription = shallowRef<ethers.ErrorDescription | null>(null)
    private readonly errorDecodingFailure = shallowRef<unknown>(null)
    private readonly watchHandle: Ref<WatchStopHandle[]> = ref([])

    //
    // Public
    //

    public constructor(
        public readonly input: Ref<string | null>,
        public readonly output: Ref<string | null>,
        public readonly error: Ref<string | null>,
        public readonly contractId: Ref<string | null>,
        public readonly contractCreate: Ref<boolean> = ref(false)) {
        this.contractAnalyzer = new ContractAnalyzer(contractId)
    }

    public mount(): void {
        this.watchHandle.value = [
            watch([this.functionHash, this.contractAnalyzer.report], this.updateSignatureResponse, {immediate: true}),
            watch([this.functionHash, this.contractAnalyzer.interface, this.signatureResponse, this.input], this.updateFunctionFragment, {immediate: true}),
            watch([this.input, this.functionFragment], this.updateInputResult, {immediate: true}),
            watch([this.output, this.functionFragment], this.updateOutputResult, {immediate: true}),
            watch([this.error, this.contractAnalyzer.interface], this.updateErrorDescription, {immediate: true})
        ]
        this.contractAnalyzer.mount()
    }

    public unmount(): void {
        this.contractAnalyzer.unmount()
        for (const wh of this.watchHandle.value) {
            wh()
        }
        this.watchHandle.value = []
        this.signatureResponse.value = null
        this.functionFragment.value = null
        this.functionDecodingFailure.value = null
        this.inputResult.value = null
        this.inputDecodingFailure.value = null
        this.outputResult.value = null
        this.outputDecodingFailure.value = null
        this.errorDescription.value = null
        this.errorDecodingFailure.value = null
        this.is4byteFunctionFragment.value = false
    }

    public readonly normalizedInput: ComputedRef<string | null> = computed(() => {
        return this.input.value == "0x" ? null : this.input.value
    })

    public readonly normalizedOutput: ComputedRef<string | null> = computed(() => {
        return this.output.value == "0x" ? null : this.output.value
    })

    public readonly normalizedError: ComputedRef<string | null> = computed(() => {
        return this.error.value == "0x" ? null : this.error.value
    })

    public readonly functionHash: ComputedRef<string|null> = computed(() => {
        let result: string|null
        if (this.contractCreate.value) {
            result = null
        } else {
            const input = this.normalizedInput.value
            result = input !== null ? input.slice(0, 10) : null
        }
        return result
    })

    public readonly signature: ComputedRef<string | null> = computed(() => {
        return this.functionFragment.value?.format("full") ?? null
    })

    public readonly is4byteSignature: ComputedRef<boolean> = computed(() => {
        return this.is4byteFunctionFragment.value
    })

    public readonly errorSignature: ComputedRef<string | null> = computed(() => {
        return this.errorDescription.value?.signature ?? null
    })

    public readonly errorHash: ComputedRef<string | null> = computed(() => {
        return this.errorDescription.value?.selector ?? null
    })

    public readonly inputs: ComputedRef<NameTypeValue[]> = computed(() => {
        const result: NameTypeValue[] = []
        if (this.functionFragment.value !== null && this.inputResult.value !== null) {
            const results = this.inputResult.value
            const fragmentInputs = this.functionFragment.value.inputs
            for (let i = 0, count = results.length; i < count; i += 1) {
                const value = results[i]
                const name = i < fragmentInputs.length ? fragmentInputs[i].name : "?"
                const type = i < fragmentInputs.length ? fragmentInputs[i].type : "?"
                result.push(new NameTypeValue(name, type, value, null, null))
            }
        }
        return result
    })

    public readonly outputs: ComputedRef<NameTypeValue[]> = computed(() => {
        const result: NameTypeValue[] = []
        if (this.functionFragment.value instanceof ethers.FunctionFragment && this.outputResult.value !== null) {
            const results = this.outputResult.value
            const fragmentOutputs = this.functionFragment.value.outputs
            for (let i = 0, count = results.length; i < count; i += 1) {
                const value = results[i]
                const name = i < fragmentOutputs.length ? fragmentOutputs[i].name : "?"
                const type = i < fragmentOutputs.length ? fragmentOutputs[i].type : "?"
                const comment = i < fragmentOutputs.length ? this.makeComment(value, fragmentOutputs[i]) : null
                result.push(new NameTypeValue(name, type, value, null, comment))
            }
        }
        return result
    })

    public readonly errorInputs: ComputedRef<NameTypeValue[]> = computed(() => {
        const result: NameTypeValue[] = []
        if (this.errorDescription.value !== null) {
            const results = this.errorDescription.value.args
            const fragmentInputs = this.errorDescription.value?.fragment.inputs ?? []
            for (let i = 0, count = results.length; i < count; i += 1) {
                const value = results[i]
                const name = i < fragmentInputs.length ? fragmentInputs[i].name : "?"
                const type = i < fragmentInputs.length ? fragmentInputs[i].type : "?"
                result.push(new NameTypeValue(name, type, value, null, null))
            }
        }
        return result
    })

    public readonly functionDecodingStatus = computed(() => {
        let result: string | null
        if (this.functionDecodingFailure.value !== null) {
            result = this.makeDecodingErrorMessage(this.functionDecodingFailure.value)
        } else {
            result = null
        }
        return result
    })

    public readonly inputDecodingStatus = computed(() => {
        let result: string | null
        if (this.inputDecodingFailure.value !== null) {
            result = this.makeDecodingErrorMessage(this.inputDecodingFailure.value)
        } else {
            result = null
        }
        return result
    })

    public readonly outputDecodingStatus = computed(() => {
        let result: string | null

        if (this.outputDecodingFailure.value !== null) {
            result = this.makeDecodingErrorMessage(this.outputDecodingFailure.value)
        } else {
            result = null
        }
        return result
    })

    public readonly errorDecodingStatus = computed(() => {
        let result: string | null
        if (this.errorDecodingFailure.value !== null) {
            result = this.makeDecodingErrorMessage(this.errorDecodingFailure.value)
        } else {
            result = null
        }
        return result
    })

    public readonly inputArgsOnly = computed(() => {
        let result: string | null
        if (this.normalizedInput.value !== null) {
            if (this.contractCreate.value) {
                // constructor input has no 4-bytes selector
                result = this.normalizedInput.value
            } else {
                // function input starts with 4-bytes selector => we remove it
                result = "0x" + this.normalizedInput.value.slice(10) // "0x" + 2x4 bytes
            }
        } else {
            result = null
        }
        return result
    })

    //
    // Private
    //

    private makeDecodingErrorMessage(failure: unknown): string {
        const f = failure as ethers.EthersError
        return "Decoding Error (" + f.shortMessage + ")"
    }

    private readonly updateSignatureResponse = async () => {
        if (this.functionHash.value !== null
            && this.contractAnalyzer.report.value !== null
            && this.contractAnalyzer.report.value.abi === null) {
            try {
                this.signatureResponse.value = await SignatureCache.instance.lookup(this.functionHash.value)
            } catch {
                this.signatureResponse.value = null
            }
        } else {
            this.signatureResponse.value = null
        }
    }

    private readonly updateFunctionFragment = async () => {
        const i = this.contractAnalyzer.interface.value
        const r = this.signatureResponse.value
        const functionHash = this.functionHash.value
        const contractId = this.contractAnalyzer.contractId.value
        const inputArgs = this.inputArgsOnly.value

        if (i !== null) {
            try {
                if (this.contractCreate.value) {

                    this.functionFragment.value = getConstructor(i)
                    this.functionDecodingFailure.value = null
                    this.is4byteFunctionFragment.value = false

                } else if (functionHash !== null && inputArgs !== null && contractId !== null) {

                    const ff = i.getFunction(functionHash)
                    this.functionDecodingFailure.value = null
                    this.is4byteFunctionFragment.value = false

                    // please refer to the ticket below for more information on this logic for redirectForToken(address,bytes) method on HTS System Contract
                    // https://github.com/hashgraph/hedera-mirror-node-explorer/issues/921
                    if (ff !== null && isRedirectForTokenTx(contractId, functionHash)) {
                        this.functionFragment.value = resolveFunctionFragmentForHTSProxyContract(ff, inputArgs)
                    } else {
                        this.functionFragment.value = ff
                    }
                } else {
                    this.functionFragment.value = null
                    this.functionDecodingFailure.value = null
                    this.is4byteFunctionFragment.value = false
                }
            } catch (failure) {
                this.functionFragment.value = null
                this.functionDecodingFailure.value = failure
                this.is4byteFunctionFragment.value = false
            }
        } else if (r !== null && r.results.length >= 1) {
            let r0: SignatureRecord | null
            if (r.results.length == 1) {
                r0 = r.results[0]
            } else {
                // Mmmm ... we have multiple signatures for this selector … :(
                // We take the first one which enables to decode input… if we have input … :/
                if (this.inputArgsOnly.value !== null) {
                    r0 = FunctionCallAnalyzer.resolveSignatureCollisions(r.results, this.inputArgsOnly.value)
                } else {
                    r0 = null // We'll see later when this.input.value is available
                }
            }
            if (r0 !== null) {
                this.functionFragment.value = ethers.FunctionFragment.from(r0.text_signature)
                this.functionDecodingFailure.value = null
                this.is4byteFunctionFragment.value = true
            } else {
                this.functionFragment.value = null
                this.functionDecodingFailure.value = null
                this.is4byteFunctionFragment.value = false
            }
        } else {
            this.functionFragment.value = null
            this.functionDecodingFailure.value = null
            this.is4byteFunctionFragment.value = false
        }
    }

    private readonly updateInputResult = () => {
        const ff = this.functionFragment.value
        const inputArgs = this.inputArgsOnly.value
        const contractId = this.contractAnalyzer.contractId.value
        const functionHash = this.functionHash.value

        if (inputArgs !== null) {
            try {
                if (ff instanceof ethers.FunctionFragment) {
                    // Call is a function
                    if (contractId !== null && functionHash !== null) {
                        if (isRedirectForTokenTx(contractId, functionHash)) {
                            this.inputResult.value = decodeRedirectForTokenInput(ff, inputArgs)
                            this.inputDecodingFailure.value = null
                        } else {
                            this.inputResult.value = ethers.AbiCoder.defaultAbiCoder().decode(ff.inputs, inputArgs)
                            this.inputDecodingFailure.value = null
                        }
                    } else {
                        this.inputResult.value = null
                        this.inputDecodingFailure.value = null
                    }
                } else if (ff instanceof ethers.ConstructorFragment) {
                    // Call is a constructor
                    this.inputResult.value = ethers.AbiCoder.defaultAbiCoder().decode(ff.inputs, inputArgs)
                    this.inputDecodingFailure.value = null
                } else {
                    this.inputResult.value = null
                    this.inputDecodingFailure.value = null
                }
            } catch (failure) {
                this.inputResult.value = null
                this.inputDecodingFailure.value = failure
            }
        } else {
            this.inputResult.value = null
            this.inputDecodingFailure.value = null
        }
    }

    private readonly updateOutputResult = () => {
        const ff = this.functionFragment.value
        const output = this.normalizedOutput.value
        if (ff instanceof ethers.FunctionFragment && output !== null) {
            try {
                this.outputResult.value = ethers.AbiCoder.defaultAbiCoder().decode(ff.outputs, output)
                this.outputDecodingFailure.value = null
            } catch (failure) {
                this.outputResult.value = null
                this.outputDecodingFailure.value = failure
            }
        } else {
            this.outputResult.value = null
            this.outputDecodingFailure.value = null
        }
    }

    private readonly updateErrorDescription = async () => {
        const i = this.contractAnalyzer.interface.value
        const error = this.normalizedError.value
        if (i !== null && error !== null && error !== "0x") {
            try {
                this.errorDescription.value = i.parseError(error)
                this.errorDecodingFailure.value = null
            } catch (failure) {
                this.errorDescription.value = null
                this.errorDecodingFailure.value = failure
            }
        } else {
            this.errorDescription.value = null
            this.errorDecodingFailure.value = null
        }
    }

    private static resolveSignatureCollisions(records: SignatureRecord[], inputArgs: string): SignatureRecord | null {
        //
        // Some selectors (like 0x70a08231) have multiple signatures registered on 4bytes.directory.
        // We select the first signature which enables to decode inputArgs.
        //
        let result: SignatureRecord | null = null
        for (const r of records) {
            try {
                const ff = ethers.FunctionFragment.from(r.text_signature)
                const decodedArgs = ethers.AbiCoder.defaultAbiCoder().decode(ff.inputs, inputArgs)
                const encodedArgs = ethers.AbiCoder.defaultAbiCoder().encode(ff.inputs, decodedArgs)
                if (encodedArgs == inputArgs) {
                    result = r
                    break
                }
            } catch {
                // Ignored
            }
        }
        return result
    }

    private makeComment(value: unknown, paramType: ethers.ParamType): string | null {
        if (this.contractAnalyzer.isSystemContract.value
            && paramType.name == "responseCode"
            && typeof value == "bigint") {
            // It's a responseCode from a system contract
            return labelForResponseCode(value)
        } else {
            return null
        }
    }

}

export class NameTypeValue {
    public readonly name: string
    public readonly type: string
    public readonly value: unknown
    public readonly indexed: boolean | null
    public readonly comment: string | null

    public constructor(name: string, type: string, value: unknown, indexed: boolean | null = null, comment: string | null) {
        this.name = name
        this.type = type
        this.value = value
        this.indexed = indexed
        this.comment = comment
    }
}


function getConstructor(i: ethers.Interface): ethers.ConstructorFragment|null {
    const result = i.fragments.find((f: ethers.Fragment): boolean => ethers.ConstructorFragment.isFragment(f))
    return result as ethers.ConstructorFragment|null
}
