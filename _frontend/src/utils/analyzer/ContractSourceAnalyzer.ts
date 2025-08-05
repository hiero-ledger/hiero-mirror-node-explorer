// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref, shallowRef} from 'vue';
import {
    SourcifyInputFilesResponse,
    SourcifyUtils,
    SourcifyVerifyCheckedContract,
    SourcifyVerifyCheckedResponse
} from "@/utils/sourcify/SourcifyUtils";
import {importFromChooser, importFromDrop} from "@/utils/analyzer/FileImporter";

export class ContractSourceAnalyzer {

    private readonly contractId: Ref<string | null>
    private readonly analyzingRef = ref(false)
    private readonly failureRef = ref<unknown>(null)
    private readonly inputFiles = ref<Map<string, string>>(new Map())
    private readonly inputFilesResponse = shallowRef<SourcifyInputFilesResponse | null>(null)
    private readonly verifyResponse = shallowRef<SourcifyVerifyCheckedResponse | null>(null)

    //
    // Public
    //

    public constructor(contractId: Ref<string | null>) {
        this.contractId = contractId
    }

    public readonly analyzing = computed(() => this.analyzingRef.value)

    public readonly failure = computed(() => this.failureRef.value)

    public readonly matchingContractName = computed<string | null>(() => {
        return this.matchingContract.value?.name ?? null
    })

    public readonly matchingContract = computed<SourcifyVerifyCheckedContract | null>(() => {
        let result: SourcifyVerifyCheckedContract | null
        if (this.verifyResponse.value !== null) {
            result = SourcifyUtils.fetchMatchingContract(this.verifyResponse.value)
        } else {
            result = null
        }
        return result
    })

    public readonly contractCount = computed<number>(() => {
        return this.inputFilesResponse.value?.contracts.length ?? 0
    })

    public readonly unusedCount = computed<number>(() => {
        return this.inputFilesResponse.value?.unused.length ?? 0
    })

    public readonly items = computed<ContractSourceAnalyzerItem[]>(() => {
        const result: ContractSourceAnalyzerItem[] = []

        for (const f of this.inputFiles.value.keys()) {
            if (this.verifyResponse.value !== null) {
                const matchingContract = this.matchingContract.value
                const unused = this.verifyResponse.value.unused.indexOf(f) != -1
                const target = !unused && matchingContract !== null && matchingContract.compiledPath == f
                result.push({path: f, unused, target})
            } else if (this.inputFilesResponse.value !== null) {
                const unused = this.inputFilesResponse.value.unused.indexOf(f) != -1
                const target = false
                result.push({path: f, unused, target})
            }
        }
        return result
    })

    public async dropFiles(transferList: DataTransferItemList): Promise<void> {
        if (this.contractId.value !== null) {
            this.analyzingRef.value = true
            try {
                const newFiles = await importFromDrop(transferList)
                this.inputFiles.value = new Map([...this.inputFiles.value, ...newFiles])
                await this.verifyWithoutStore(this.contractId.value)
                this.failureRef.value = null
            } catch (reason) {
                // Leaves this.inputFilesResponse and this.verifyResponse unchanged
                this.failureRef.value = reason
            } finally {
                this.analyzingRef.value = false
            }
        }
    }

    public async chooseFiles(fileList: FileList): Promise<void> {
        if (this.contractId.value !== null) {
            this.analyzingRef.value = true
            try {
                const newFiles = await importFromChooser(fileList)
                this.inputFiles.value = new Map([...this.inputFiles.value, ...newFiles])
                await this.verifyWithoutStore(this.contractId.value)
                this.failureRef.value = null
            } catch (reason) {
                // Leaves this.inputFilesResponse and this.verifyResponse unchanged
                this.failureRef.value = reason
            } finally {
                this.analyzingRef.value = false
            }
        }
    }

    public async reset(): Promise<void> {
        this.inputFiles.value.clear()
        this.inputFilesResponse.value = null
        this.verifyResponse.value = null
        this.analyzingRef.value = false
    }

    //
    // Private
    //

    private async verifyWithoutStore(contractId: string): Promise<void> {
        await SourcifyUtils.sessionClear()
        this.inputFilesResponse.value = await SourcifyUtils.sessionInputFiles(this.inputFiles.value)
        const verificationIds = SourcifyUtils.fetchVerificationIds(this.inputFilesResponse.value)
        if (verificationIds.length >= 1) {
            this.verifyResponse.value = await SourcifyUtils.sessionVerifyChecked(contractId, verificationIds, false)
        } else {
            this.verifyResponse.value = null
        }
    }

}

export interface ContractSourceAnalyzerItem {
    path: string
    unused: boolean
    target: boolean
}
