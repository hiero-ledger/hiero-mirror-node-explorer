// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from 'vue';
import {ContractLog} from '@/schemas/MirrorNodeSchemas.ts'
import {ContractResultsLogsByContractIdCache} from '../cache/ContractResultsLogsByContractIdCache';
import {EntityLookup} from "@/utils/cache/base/EntityCache";

export class ContractResultsLogsAnalyzer {
    public readonly contractId: Ref<string | null>
    public readonly contractResultsLookup: EntityLookup<string, ContractLog[] | null>

    //
    // Public
    //
    public constructor(contractId: Ref<string | null>) {
        this.contractId = contractId
        this.contractResultsLookup = ContractResultsLogsByContractIdCache.instance.makeLookup(this.contractId)
    }

    public mount(): void {
        this.contractResultsLookup.mount()
    }

    public unmount(): void {
        this.contractResultsLookup.unmount()
    }

    public readonly logs = computed(() =>
        this.contractResultsLookup.entity.value ?? []
    )
}
