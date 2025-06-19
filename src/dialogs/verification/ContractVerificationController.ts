// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref} from "vue";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {SourcifyUtils, SourcifyVerifyCheckedContract} from "@/utils/sourcify/SourcifyUtils.ts";
import {gtagVerifyContract} from "@/gtag.ts";
import {ContractSourceAnalyzer, ContractSourceAnalyzerItem} from "@/utils/analyzer/ContractSourceAnalyzer.ts";

export class ContractVerificationController extends TaskController {


    public readonly contractId: Ref<string | null>
    public readonly items: ComputedRef<ContractSourceAnalyzerItem[]>
    private readonly contractSourceAnalyzer: ContractSourceAnalyzer


    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, contractId: Ref<string | null>) {
        super(showDialog)
        this.contractId = contractId
        this.contractSourceAnalyzer = new ContractSourceAnalyzer(this.contractId)
        this.items = this.contractSourceAnalyzer.items

    }


    public readonly matchingContractName = computed(
        () => this.contractSourceAnalyzer.matchingContract.value?.name ?? null)

    public readonly newMatchingContract = ref<SourcifyVerifyCheckedContract | null>(null)
    public readonly verificationError = ref<unknown>(null)

    //
    // Status
    //

    public readonly status = computed(() => {
        let result: string
        if (this.contractSourceAnalyzer.analyzing.value) {
            result = "Analyzing…"
        } else if (this.contractSourceAnalyzer.failure.value) {
            result = "Analysis failed"
        } else if (this.contractSourceAnalyzer.matchingContract.value !== null) {
            const matchingContract = this.contractSourceAnalyzer.matchingContract.value
            const note = matchingContract.status == "perfect" ? "full match" : "partial match"
            result = "Ready to verify \"" + this.contractSourceAnalyzer.matchingContractName.value + "\" (" + note + ")"
        } else if (this.contractSourceAnalyzer.contractCount.value == 0 && this.contractSourceAnalyzer.unusedCount.value >= 1) {
            result = "Add metadata json file"
        } else {
            result = "Drop files…"
        }
        return result
    })

    //
    // Public (success)
    //

    public readonly mainSuccessMessage = computed(() => {
        let result: string | null
        if (this.newMatchingContract.value !== null) {
            const status = this.newMatchingContract.value.status
            if (status == "perfect" || status == "partial") {
                result = "Verification succeeded"
            } else {
                result = "Verification failed"
            }
        } else {
            result = null
        }
        return result
    })

    public readonly extraSuccessMessage = computed(() => {
        let result: string | null
        if (this.newMatchingContract.value !== null) {
            const status = this.newMatchingContract.value.status
            if (status == "perfect" || status == "partial") {
                result = status == "perfect" ? "Full Match" : "Partial Match"
            } else {
                result = this.newMatchingContract.value.statusMessage ?? null
            }
        } else {
            result = null
        }
        return result
    })

    //
    // Public (error)
    //

    public readonly extraErrorMessage = computed(() => {
        return this.verificationError.value?.toString() ?? null
    })

    //
    // User actions
    //

    public async handleClearAllFiles(): Promise<void> {
        await this.contractSourceAnalyzer.reset()
    }

    public async chooseFiles(fileList: FileList): Promise<void> {
        await this.contractSourceAnalyzer.chooseFiles(fileList)
    }

    public async dropFiles(transferList: DataTransferItemList): Promise<void> {
        await this.contractSourceAnalyzer.dropFiles(transferList)
    }

    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        return !this.contractSourceAnalyzer.analyzing.value
            && this.contractSourceAnalyzer.matchingContractName.value !== null
    }

    public async execute(): Promise<void> {
        const contractId = this.contractId.value!
        const matchingContract = this.contractSourceAnalyzer.matchingContract.value!

        try {
            const verificationIds = [matchingContract.verificationId]
            const response = await SourcifyUtils.sessionVerifyChecked(contractId, verificationIds, true)
            this.newMatchingContract.value = SourcifyUtils.fetchMatchingContract(response)
            this.verificationError.value = null
        } catch (reason) {
            this.newMatchingContract.value = null
            this.verificationError.value = reason
            throw reason
        } finally {
            gtagVerifyContract(this.mainSuccessMessage.value ?? "Verification failed")
        }
    }

    public dialogStopShowing(): void {
        this.contractSourceAnalyzer.reset().catch()
    }
}
