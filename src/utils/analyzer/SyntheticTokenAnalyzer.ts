// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, Ref} from "vue";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";
import {ERCTokenByAddressCache} from "@/utils/cache/ERCTokenByAddressCache.ts";
import {EntityLookup} from "@/utils/cache/base/EntityCache.ts";
import {TOCLocParser} from "@/utils/parser/TOCLocParser.ts";
import {TokenInfo, TokenType} from "@/schemas/MirrorNodeSchemas.ts";

export class SyntheticTokenAnalyzer {

    private readonly tocLocParser: TOCLocParser
    private readonly ercTokenLookup: EntityLookup<string, Blockscout.TokenInfo | null>

    //
    // Public
    //

    public constructor(private readonly tocLoc: Ref<string | null>) {
        this.tocLocParser = new TOCLocParser(tocLoc)
        this.ercTokenLookup = ERCTokenByAddressCache.instance.makeLookup(this.tokenAddress)
    }

    public mount(): void {
        this.tocLocParser.mount()
        this.ercTokenLookup.mount()
    }

    public unmount(): void {
        this.tocLocParser.unmount()
        this.ercTokenLookup.unmount()
    }

    public readonly tokenId: ComputedRef<string | null> = computed(
        () => this.tocLocParser.entityId.value)

    public readonly tokenAddress: ComputedRef<string | null> = computed(
        () => this.tocLocParser.ethereumAddress.value)

    public readonly tokenInfo: ComputedRef<TokenInfo|null> = computed(
        () => this.tocLocParser.tokenInfo.value)

    public readonly ercTokenInfo: ComputedRef<Blockscout.TokenInfo|null> = computed(
        () => this.ercTokenLookup.entity.value)

    public readonly errorNotification: ComputedRef<string | null> = computed(
        () => this.tocLocParser.errorNotification.value)

    public readonly isHts = computed(() => this.tocLocParser.isToken.value)

    public readonly isErc20 = computed(() => this.type.value === "ERC-20")
    public readonly isErc721 = computed(() => this.type.value === "ERC-721")
    public readonly isErc1155 = computed(() => this.type.value === "ERC-1155")

    public readonly type = computed(() => {
        let result: string | null
        if (this.tocLocParser.tokenInfo.value !== null) {
            result = this.tocLocParser.tokenInfo.value.type === TokenType.FUNGIBLE_COMMON ? "ERC-20" : "ERC-721"
        } else if (this.tocLocParser.contractInfo.value !== null) {
            result = this.ercTokenLookup.entity.value?.type ?? null
        } else {
            result = null
        }
        return result
    })

    public readonly name = computed(() =>
        this.tokenInfo.value?.name ?? this.ercTokenInfo.value?.name ?? null
    )
    public readonly symbol = computed(() =>
        this.tokenInfo.value?.symbol ?? this.ercTokenInfo.value?.symbol ?? null
    )
    public readonly decimals = computed(() =>
        this.tokenInfo.value?.decimals ?? this.ercTokenInfo.value?.decimals ?? null
    )
    public readonly totalSupply = computed(() =>
        this.tokenInfo.value?.total_supply ?? this.ercTokenInfo.value?.total_supply ?? null
    )
    public readonly holders = computed(() =>
        this.ercTokenInfo.value?.holders ?? null)

}
