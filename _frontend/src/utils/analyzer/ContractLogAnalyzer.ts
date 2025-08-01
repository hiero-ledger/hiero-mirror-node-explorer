// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, Ref, shallowRef, watch, WatchStopHandle} from "vue";
import {ContractResultLog} from "@/schemas/MirrorNodeSchemas";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer";
import {ethers} from "ethers";
import {NameTypeValue} from "@/utils/analyzer/call/FunctionCallDecoder.ts";

export class ContractLogAnalyzer {

    public readonly log: Ref<ContractResultLog | null>
    public readonly isContractVerified = computed(() => this.logDescription.value !== null)
    private readonly contractAnalyzer: ContractAnalyzer
    private readonly logDescription = shallowRef<ethers.LogDescription | null>(null)
    private watchHandle: WatchStopHandle | null = null

    //
    // Public
    //

    public constructor(log: Ref<ContractResultLog | null>) {
        this.log = log
        this.contractAnalyzer = new ContractAnalyzer(computed(() => log.value?.contract_id ?? null))
    }

    public mount(): void {
        this.watchHandle = watch([
            this.log,
            this.contractAnalyzer.interface
        ], this.updateLogDescription, {immediate: true})
        this.contractAnalyzer.mount()
    }

    public unmount(): void {
        this.contractAnalyzer.unmount()
        if (this.watchHandle !== null) {
            this.watchHandle()
            this.watchHandle = null
        }
        this.logDescription.value = null
    }

    public readonly signature = computed(
        () => this.logDescription.value?.signature ?? null)

    public readonly fullLogSignature = computed(
        () => {
            if (this.logDescription.value && this.args.value) {
                const eventArgs = this.args.value.slice(1) // omit signature hash for looping
                const fragmentInputs = this.logDescription.value.fragment.inputs
                let returnedSignarue = this.logDescription.value.name + " ("
                for (let i = 0; i < eventArgs.length; i += 1) {
                    const name = i < fragmentInputs.length ? fragmentInputs[i].name : "?"
                    const type = i < fragmentInputs.length ? fragmentInputs[i].type : "?"
                    const indexed = i < fragmentInputs.length ? fragmentInputs[i].indexed : false
                    returnedSignarue = returnedSignarue + `${indexed ? `index_topic_${i + 1} ` : ''}` + type + " " + name + `${i === eventArgs.length - 1 ? "" : ", "}`
                }
                returnedSignarue = returnedSignarue + ")"
                return returnedSignarue
            } else {
                return null;
            }
        }
    )


    public readonly args: ComputedRef<NameTypeValue[]> = computed(() => {
        const result: NameTypeValue[] = []
        if (this.logDescription.value) {
            const args = this.logDescription.value.args
            const signatureHash = this.logDescription.value.topic
            const fragmentInputs = this.logDescription.value.fragment.inputs
            result.push(new NameTypeValue("signature hash", "", signatureHash, true, null))
            for (let i = 0; i < args.length; i += 1) {
                const value = args[i]
                const name = i < fragmentInputs.length ? fragmentInputs[i].name : "?"
                const type = i < fragmentInputs.length ? fragmentInputs[i].type : "?"
                const indexed = i < fragmentInputs.length ? fragmentInputs[i].indexed : false
                result.push(new NameTypeValue(name, type, value, indexed, null))
            }
        }
        return result
    })

    //
    // Private
    //

    private readonly updateLogDescription = () => {
        const i = this.contractAnalyzer.interface.value
        const l = this.log.value
        if (i !== null && l !== null && l.topics && l.data) {
            try {
                this.logDescription.value = i.parseLog({topics: l.topics, data: l.data})
            } catch {
                this.logDescription.value = null
            }
        } else {
            this.logDescription.value = null
        }
    }

}
