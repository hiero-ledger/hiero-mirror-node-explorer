// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {ethers} from "ethers";
import {ABIAnalyzer} from "@/utils/analyzer/ABIAnalyzer";

export class ABIController {

    public readonly abiAnalyzer: ABIAnalyzer
    private readonly mode: Ref<ABIMode>

    //
    // Public
    //

    public constructor(abiAnalyzer: ABIAnalyzer, mode: Ref<ABIMode>) {
        this.abiAnalyzer = abiAnalyzer
        this.mode = mode
    }

    public readonly logicModeAvailable = computed(
        () => this.abiAnalyzer.logicInterface.value !== null)

    public readonly targetInterface = computed(() => {
        let result: ethers.Interface | null
        switch (this.mode.value) {
            case ABIMode.Normal:
                result = this.abiAnalyzer.contractAnalyzer.interface.value
                break
            case ABIMode.Logic:
                result = this.abiAnalyzer.logicInterface.value
                break
            default:
                result = null
                break
        }
        return result
    })

    public readonly targetContractName = computed(() => {
        let result: string | null
        switch (this.mode.value) {
            case ABIMode.Normal:
                result = this.abiAnalyzer.contractAnalyzer.contractName.value
                break
            case ABIMode.Logic:
                result = this.abiAnalyzer.logicContractName.value
                break
            default:
                result = null
                break
        }
        return result
    })

}

export enum ABIMode {
    Normal = "normal",
    Logic = "logic",
}
