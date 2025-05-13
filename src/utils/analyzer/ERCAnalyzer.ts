// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {ERC20Info, ERC20InfoCache} from "@/utils/cache/ERC20InfoCache.ts";
import {ERC1155Cache, ERC1155Index} from "@/utils/cache/ERC1155Cache.ts";
import {ERC721Info, ERC721InfoCache} from "@/utils/cache/ERC721InfoCache.ts";
import {EntityLookup} from "@/utils/cache/base/EntityCache.ts";
import {SingletonLookup} from "@/utils/cache/base/SingletonCache.ts";

export class ERCAnalyzer {

    public readonly contractId: Ref<string | null>
    public readonly erc20: Ref<ERC20Info | null>
    public readonly erc721: Ref<ERC721Info | null>
    public readonly erc1155Index: Ref<ERC1155Index | null>

    private erc20Lookup: EntityLookup<string, ERC20Info | null>
    private erc721Lookup: EntityLookup<string, ERC721Info | null>
    private erc1155Lookup: SingletonLookup<ERC1155Index>

    //
    // Public
    //

    public constructor(contractId: Ref<string | null>) {
        this.contractId = contractId
        this.erc20Lookup = ERC20InfoCache.instance.makeLookup(contractId)
        this.erc721Lookup = ERC721InfoCache.instance.makeLookup(contractId)
        this.erc1155Lookup = ERC1155Cache.instance.makeLookup()
        this.erc20 = this.erc20Lookup.entity
        this.erc721 = this.erc721Lookup.entity
        this.erc1155Index = this.erc1155Lookup.entity
    }

    public mount(): void {
        this.erc20Lookup.mount()
        this.erc721Lookup.mount()
        this.erc1155Lookup.mount()
    }

    public unmount(): void {
        this.erc20Lookup.unmount()
        this.erc721Lookup.unmount()
        this.erc1155Lookup.unmount()
    }

    public readonly isErc20 = computed(() => this.erc20.value !== null)
    public readonly isErc721 = computed(() => this.erc721.value !== null)
    public readonly isErc1155 = computed(() =>
        this.erc1155Index.value !== null
        && this.contractId.value !== null
        && this.erc1155Index.value.lookup(this.contractId.value) !== null
    )
}
