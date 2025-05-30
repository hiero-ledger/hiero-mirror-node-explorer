// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {ERC20Info, ERC20InfoCache} from "@/utils/cache/ERC20InfoCache.ts";
import {ERC1155Cache, ERC1155Index} from "@/utils/cache/ERC1155Cache.ts";
import {ERC721Info, ERC721InfoCache} from "@/utils/cache/ERC721InfoCache.ts";
import {EntityLookup} from "@/utils/cache/base/EntityCache.ts";
import {SingletonLookup} from "@/utils/cache/base/SingletonCache.ts";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";
import {ERCTokenByAddressCache} from "@/utils/cache/ERCTokenByAddressCache.ts";

export class ERCAnalyzer {

    public readonly contractId: Ref<string | null>
    public readonly contractAddress: Ref<string | null>
    public readonly ercTokenInfo: Ref<Blockscout.TokenInfo | null>
    public readonly erc20: Ref<ERC20Info | null>
    public readonly erc721: Ref<ERC721Info | null>
    public readonly erc1155Index: Ref<ERC1155Index | null>

    private ercTokenLookup: EntityLookup<string, Blockscout.TokenInfo | null>
    private erc20Lookup: EntityLookup<string, ERC20Info | null>
    private erc721Lookup: EntityLookup<string, ERC721Info | null>
    private erc1155Lookup: SingletonLookup<ERC1155Index>

    //
    // Public
    //

    public constructor(contractId: Ref<string | null>, contractAddress: Ref<string | null>) {
        this.contractId = contractId
        this.contractAddress = contractAddress
        this.ercTokenLookup = ERCTokenByAddressCache.instance.makeLookup(contractAddress)
        this.erc20Lookup = ERC20InfoCache.instance.makeLookup(contractId)
        this.erc721Lookup = ERC721InfoCache.instance.makeLookup(contractId)
        this.erc1155Lookup = ERC1155Cache.instance.makeLookup()
        this.ercTokenInfo = this.ercTokenLookup.entity
        this.erc20 = this.erc20Lookup.entity
        this.erc721 = this.erc721Lookup.entity
        this.erc1155Index = this.erc1155Lookup.entity
    }

    public mount(): void {
        this.erc20Lookup.mount()
        this.erc20Lookup.mount()
        this.erc721Lookup.mount()
        this.erc1155Lookup.mount()
    }

    public unmount(): void {
        this.erc20Lookup.unmount()
        this.erc20Lookup.unmount()
        this.erc721Lookup.unmount()
        this.erc1155Lookup.unmount()
    }

    public readonly isErc20 = computed(() => this.type.value === "ERC-20")
    public readonly isErc721 = computed(() => this.type.value === "ERC-721")
    public readonly isErc1155 = computed(() => this.type.value === "ERC-1155")

    public readonly type = computed(() => {
        const isIn1155Index = this.erc1155Index.value !== null && this.contractId.value !== null && this.erc1155Index.value.lookup(this.contractId.value) !== null

        return this.ercTokenInfo.value?.type
        ?? this.erc20.value !== null ? "ERC-20"
            : this.erc721.value !== null ? "ERC-721"
                : isIn1155Index ? "ERC-1155"
                    : null
    })

    public readonly name = computed(() =>
        this.ercTokenInfo.value?.name ?? this.erc20.value?.name ?? this.erc721.value?.name ?? null
    )
    public readonly symbol = computed(() =>
        this.ercTokenInfo.value?.symbol ?? this.erc20.value?.symbol ?? this.erc721.value?.symbol ?? null
    )
    public readonly decimals = computed(() =>
        this.ercTokenInfo.value?.decimals ?? this.erc20.value?.decimals ?? null
    )
    public readonly holders = computed(() =>
        this.ercTokenInfo.value?.holders ?? null
    )
    public readonly totalSupply = computed(() =>
        this.ercTokenInfo.value?.total_supply ?? this.erc20.value?.totalSupply ?? null
    )
}
