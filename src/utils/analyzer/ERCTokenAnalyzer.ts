// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {ContractResponse, TokenInfo} from "@/schemas/MirrorNodeSchemas.ts";
import {EntityLookup} from "@/utils/cache/base/EntityCache.ts";
import {EntityID} from "@/utils/EntityID.ts";

export class ERCTokenAnalyzer {

    private readonly tokenLookup: EntityLookup<string, TokenInfo | null>
    private readonly contractLookup: EntityLookup<string, ContractResponse | null>

    //
    // Public
    //

    public constructor(public readonly evmAddress: Ref<string | null>) {
        this.tokenLookup = TokenInfoCache.instance.makeLookup(this.fallbackEntityId)
        this.contractLookup = ContractByAddressCache.instance.makeLookup(evmAddress)
    }

    public mount(): void {
        this.tokenLookup.mount()
        this.contractLookup.mount()
    }

    public unmount(): void {
        this.tokenLookup.unmount()
        this.contractLookup.unmount()
    }

    public tokenId = computed(
        () => this.tokenInfo.value?.token_id ?? null)

    public contractId = computed(
        () => this.contractInfo.value?.contract_id ?? null)

    public tokenInfo = computed(
        () => this.tokenLookup.entity.value)

    public contractInfo = computed(
        () => this.contractLookup.entity.value)

    //
    // Private
    //

    private readonly fallbackEntityId = computed(() => {
        let result: string|null
        if (this.evmAddress.value !== null) {
            const entityId = EntityID.fromAddress(this.evmAddress.value)
            result = entityId?.toString() ?? null
        } else {
            result = null
        }
        return result
    })
}
