// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref} from "vue";
import {EntityLookup} from "@/utils/cache/base/EntityCache.ts";
import {InputChangeController} from "@/components/utils/InputChangeController.ts";
import {EntityID} from "@/utils/EntityID.ts";
import {NftCollectionCache, NftCollectionInfo} from "@/utils/cache/NftCollectionCache.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class NftSerialsTextFieldController {

    private readonly inputChangeController: InputChangeController
    private readonly nftCollectionLookup: EntityLookup<string, NftCollectionInfo[] | null>

    //
    // Public
    //

    public constructor(
        public readonly tokenId: Ref<string | null>,
        public readonly input: Ref<string> = ref("")) {
        this.inputChangeController = new InputChangeController(input)
        this.nftCollectionLookup = NftCollectionCache.instance.makeLookup(walletManager.accountId)
    }

    public mount(): void {
        this.nftCollectionLookup.mount()
    }

    public unmount(): void {
        this.nftCollectionLookup.unmount()
    }

    public readonly state = computed(() => {
        const serials = this.serials.value
        return serials !== null ? NftSerialsTextFieldState.ok : NftSerialsTextFieldState.invalidSyntax
    })

    public readonly serials = computed<number[] | null>(() => {
        let ok = true
        const result: number[] = []
        const trimmedValue = this.inputChangeController.outputText.value.trim()
        for (const i of trimmedValue.split(",")) {
            if (i !== "") {
                const n = EntityID.parsePositiveInt(i.trim())
                if (n == null) {
                    ok = false
                    break
                } else {
                    result.push(n)
                }
            }
        }
        return ok ? result : null
    })

    public readonly rejectedSerials = computed<number[] | null>(() => {
        let result: number[] | null
        const tokenId = this.tokenId.value
        const serials = this.serials.value
        const nftCollectionInfos = this.nftCollectionLookup.entity.value
        if (tokenId !== null && serials !== null && nftCollectionInfos !== null) {
            const info = nftCollectionInfos.find((c: NftCollectionInfo) => c.tokenId === tokenId)
            if (info) {
                result = serials.slice() // Let's duplicate and filter serials that are owned
                for (const sn of info.serials) {
                    const i = result.indexOf(sn)
                    if (i !== -1) {
                        result.splice(i, 1)
                    }
                }
            } else {
                result = serials // All serials are rejected
            }
        } else {
            result = null
        }
        return result
    })

}

export enum NftSerialsTextFieldState {
    invalidSyntax, // Invalid syntax
    ok
}
