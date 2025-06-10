// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, Ref} from "vue";
import {ethers} from "ethers";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";
import {FourByteAnalyzer} from "@/utils/analyzer/call/FourByteAnalyzer.ts";

export class FunctionCallDecoder {

    private readonly contractAnalyzer: ContractAnalyzer
    private readonly fourByteAnalyzer: FourByteAnalyzer

    //
    // Public
    //

    public constructor(
        contractId: Ref<string | null>,
        private readonly input: Ref<string | null>,
        private readonly output: Ref<string | null>,
        private readonly error: Ref<string | null>,
        private readonly contractCreate: Ref<boolean>) {
        this.contractAnalyzer = new ContractAnalyzer(contractId)
        this.fourByteAnalyzer = new FourByteAnalyzer(this.functionHash, this.functionParams, this.fourByteAnalyzerEnabled)
    }

    public mount(): void {
        this.contractAnalyzer.mount()
        this.fourByteAnalyzer.mount()
    }

    public unmount(): void {
        this.contractAnalyzer.unmount()
        this.fourByteAnalyzer.unmount()
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

    public readonly signature = computed(() => {
        let result: string|null
        if (this.fragment.value !== null) {
            result = this.fragment.value?.format("full") ?? null
        } else {
            result = null
        }
        return result
    })

    public readonly is4byteSignature = computed(() => {
        return this.fourByteAnalyzer.fragment.value !== null
    })

    public readonly errorSignature = computed(() => {
        return this.errorDescription.value?.signature ?? null
    })

    public readonly errorHash = computed(() => {
        return this.errorDescription.value?.selector ?? null
    })

    public readonly decodedFunctionStatus = computed(() => {
        let result: string | null

        const functionHash = this.functionHash.value
        const callParams = this.functionParams.value
        const i = this.contractAnalyzer.interface.value

        if (i !== null) {
            if (this.contractCreate.value) {
                result = null
            } else if (functionHash !== null && callParams !== null) {
                try {
                    i.getFunction(functionHash)
                    result = null
                } catch(error) {
                    result = this.makeDecodingErrorMessage(error)
                }
            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    })

    public readonly decodedInput = computed<NameTypeValue[]>(() => {
        const result: NameTypeValue[] = []

        const ff = this.fragment.value
        const functionParams = this.functionParams.value
        if (ff !== null && functionParams !== null) {
            try {
                const fragmentInputs = ff.inputs
                const r = ethers.AbiCoder.defaultAbiCoder().decode(fragmentInputs, functionParams)
                for (let i = 0, count = r.length; i < count; i += 1) {
                    const value = r[i]
                    const name = i < fragmentInputs.length ? fragmentInputs[i].name : "?"
                    const type = i < fragmentInputs.length ? fragmentInputs[i].type : "?"
                    result.push(new NameTypeValue(name, type, value, null, null))
                }
            } catch {
                // Keeps result empty
            }
        } else {
            // Keeps result empty
        }

        return result
    })

    public readonly decodedInputStatus = computed(() => {
        let result: string|null

        const ff = this.fragment.value
        const functionParams = this.functionParams.value
        if (ff !== null && functionParams !== null) {
            try {
                ethers.AbiCoder.defaultAbiCoder().decode(ff.inputs, functionParams)
                result = null
             } catch(error) {
                result = this.makeDecodingErrorMessage(error)
            }
        } else {
            result = null
        }

        return result
    })

    public readonly decodedOutput = computed<NameTypeValue[]>(() => {
        const result: NameTypeValue[] = []

        const ff = this.fragment.value
        const output = this.output.value
        if (ff instanceof ethers.FunctionFragment && output !== null) {
            try {
                const fragmentOutputs = ff.outputs
                const r = ethers.AbiCoder.defaultAbiCoder().decode(fragmentOutputs, output)
                for (let i = 0, count = r.length; i < count; i += 1) {
                    const value = r[i]
                    const name = i < fragmentOutputs.length ? fragmentOutputs[i].name : "?"
                    const type = i < fragmentOutputs.length ? fragmentOutputs[i].type : "?"
                    result.push(new NameTypeValue(name, type, value, null, null))
                }
            } catch {
                // Keeps result empty
            }
        } else {
            // Keeps result empty
        }

        return result
    })

    public readonly decodedOutputStatus = computed(() => {
        let result: string|null

        const ff = this.fragment.value
        const output = this.output.value
        if (ff instanceof ethers.FunctionFragment && output !== null) {
            try {
                ethers.AbiCoder.defaultAbiCoder().decode(ff.outputs, output)
                result = null
            } catch(error) {
                result = this.makeDecodingErrorMessage(error)
            }
        } else {
            result = null
        }

        return result
    })


    public readonly decodedError = computed<NameTypeValue[]>(() => {
        const result: NameTypeValue[] = []

        const errorDescription = this.errorDescription.value
        const error = this.error.value
        if (errorDescription !== null && error !== null) {
            try {
                const errorArgs = errorDescription.args
                const fragmentInputs = errorDescription.fragment.inputs ?? []
                for (let i = 0, count = errorArgs.length; i < count; i += 1) {
                    const value = errorArgs[i]
                    const name = i < fragmentInputs.length ? fragmentInputs[i].name : "?"
                    const type = i < fragmentInputs.length ? fragmentInputs[i].type : "?"
                    result.push(new NameTypeValue(name, type, value, null, null))
                }
            } catch {
                // Keeps result empty
            }
        } else {
            // Keeps result empty
        }

        return result
    })

    public readonly decodedErrorStatus = computed(() => {
        let result: string|null

        const i = this.contractAnalyzer.interface.value
        const error = this.error.value
        if (i !== null && error !== null) {
            try {
                i.parseError(error)
                result = null
            } catch(error) {
                result = this.makeDecodingErrorMessage(error)
            }
        } else {
            result = null
        }

        return result
    })


    //
    // Private
    //

    private readonly fragment = computed(() => {
        let result: ethers.ConstructorFragment | ethers.FunctionFragment | null

        const functionHash = this.functionHash.value
        const callParams = this.functionParams.value
        const i = this.contractAnalyzer.interface.value

        if (i !== null) {
            if (this.contractCreate.value) {
                result = getConstructor(i)
            } else if (functionHash !== null && callParams !== null) {
                try {
                    result = i.getFunction(functionHash)
                } catch {
                    result = null
                }
            } else {
                result = null
            }
        } else {
            result = this.fourByteAnalyzer.fragment.value
        }
        return result
    })

    private readonly errorDescription = computed(() => {
        let result: ethers.ErrorDescription|null

        const i = this.contractAnalyzer.interface.value
        const error = this.error.value
        if (i !== null && error !== null) {
            try {
                result = i.parseError(error)
            } catch {
                result = null
            }
        } else {
            result = null
        }

        return result
    })

    private readonly fourByteAnalyzerEnabled = computed(() => {
        // We enable four byte analysis only if contract analyzer completed without finding abi
        return this.contractAnalyzer.report.value !== null && this.contractAnalyzer.report.value.abi === null
    })

    private makeDecodingErrorMessage(failure: unknown): string {
        const f = failure as ethers.EthersError
        return "Decoding Error (" + f.shortMessage + ")"
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
