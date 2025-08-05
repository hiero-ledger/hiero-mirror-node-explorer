// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref, watch, WatchStopHandle} from "vue";
import {ContractAction, ResultDataType} from "@/schemas/MirrorNodeSchemas";
import {FunctionCallAnalyzer} from "@/utils/analyzer/FunctionCallAnalyzer";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {systemContractRegistry} from "@/schemas/SystemContractRegistry";

export class ContractActionAnalyzer {

    public readonly action: Ref<ContractAction | null>
    public readonly functionCallAnalyzer: FunctionCallAnalyzer
    public readonly toId: Ref<string | null> = ref(null)
    public readonly fromId: Ref<string | null> = ref(null)
    private readonly watchHandle: Ref<WatchStopHandle[]> = ref([])

    //
    // Public
    //

    public constructor(action: Ref<ContractAction | null>) {
        this.action = action
        this.functionCallAnalyzer = new FunctionCallAnalyzer(this.input, this.output, this.error, this.revertReason, this.toId)
    }

    public mount(): void {
        this.watchHandle.value = [
            watch(this.action, this.actionDidChange, {immediate: true}),
        ]
        this.functionCallAnalyzer.mount()
    }

    public unmount(): void {
        this.functionCallAnalyzer.unmount()
        for (const wh of this.watchHandle.value) {
            wh()
        }
        this.functionCallAnalyzer.unmount()
        this.toId.value = null
        this.fromId.value = null
    }

    //
    // Private
    //

    private readonly actionDidChange = async () => {

        // fromId
        try {
            if (this.action.value?.caller) { // We have the entity id :)
                this.fromId.value = this.action.value.caller
            } else if (this.action.value?.from) { // We have evm address only :|
                const r = await AccountByAddressCache.instance.lookup(this.action.value.from)
                this.fromId.value = r?.account ?? null
            } else { // We have nothing :(
                this.fromId.value = null
            }
        } catch {
            this.fromId.value = null
        }

        // toId
        try {
            if (this.action.value?.recipient) { // We have the entity id :)
                this.toId.value = this.action.value?.recipient
            } else if (this.action.value?.to) { // We have evm address only :|
                // => if it's a system contract, then id is computed
                // => else we must fetch contract by address and get its contract id
                const systemContractEntry = systemContractRegistry.lookupByAddress(this.action.value.to)
                if (systemContractEntry !== null) {
                    this.toId.value = systemContractEntry.contractId
                } else {
                    const r = await AccountByAddressCache.instance.lookup(this.action.value.to)
                    this.toId.value = r?.account ?? null
                }
            } else { // We have nothing :(
                this.toId.value = null
            }
        } catch {
            this.toId.value = null
        }

    }

    private readonly input = computed(() => this.action.value?.input ?? null)

    private readonly output = computed(() => {
        let result: string | null
        if (this.action?.value?.result_data_type == ResultDataType.OUTPUT) {
            result = this.action.value.result_data ?? null
        } else {
            result = null
        }
        return result
    })

    public readonly error = computed(() => {
        let result: string | null
        if (this.action?.value?.result_data_type == ResultDataType.ERROR) {
            result = this.action?.value?.result_data ?? null
        } else {
            result = null
        }
        return result
    })

    private readonly revertReason = computed(() => {
        let result: string | null
        if (this.action?.value?.result_data_type == ResultDataType.REVERT_REASON) {
            result = this.action?.value?.result_data ?? null
        } else {
            result = null
        }
        return result
    })
}
