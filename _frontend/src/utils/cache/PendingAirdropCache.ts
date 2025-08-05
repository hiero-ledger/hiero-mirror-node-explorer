// SPDX-License-Identifier: Apache-2.0

import {TokenAirdrop, TokenAirdropsResponse} from "@/schemas/MirrorNodeSchemas";
import {EntityCache, EntityLookup} from "@/utils/cache/base/EntityCache";
import axios, {AxiosResponse} from "axios";
import {computed, Ref} from "vue";

export class PendingAirdropCache extends EntityCache<string, TokenAirdrop[] | null> {

    public static readonly instance = new PendingAirdropCache()

    //
    // Public
    //

    public static makeAirdropKey(accountId: string, tokenId: string): string {
        return accountId + "---" + tokenId
    }

    public static parseAirdropKey(key: string): string[] {
        const components = key.split("---")
        return components.length == 2 ? components : []
    }

    public makeAirdropLookup(accountId: Ref<string | null>, tokenId: Ref<string | null>): EntityLookup<string, TokenAirdrop[] | null> {
        const key = computed(() => {
            let result: string | null
            if (accountId.value !== null && tokenId.value !== null) {
                result = PendingAirdropCache.makeAirdropKey(accountId.value, tokenId.value)
            } else {
                result = null
            }
            return result
        })
        return this.makeLookup(key)
    }

    public forgetTokenAirdrop(accountId: string, tokenId: string): void {
        this.forget(PendingAirdropCache.makeAirdropKey(accountId, tokenId))
    }

    public forgetTokenAirdrops(airdrops: TokenAirdrop[]): void {
        for (const airdrop of airdrops) {
            if (airdrop.receiver_id !== null && airdrop.token_id) {
                this.forgetTokenAirdrop(airdrop.receiver_id, airdrop.token_id)
            }
        }
    }

    //
    // Cache
    //

    protected async load(airdropKey: string): Promise<TokenAirdrop[] | null> {
        let result: TokenAirdrop[] | null

        const components = PendingAirdropCache.parseAirdropKey(airdropKey)
        if (components.length == 2) {
            const accountId = components[0]
            const tokenId = components[1]
            const url: string | null = "api/v1/accounts/" + accountId + "/airdrops/pending?token.id=" + tokenId
            const response: AxiosResponse<TokenAirdropsResponse> = await axios.get<TokenAirdropsResponse>(url)
            result = response.data.airdrops.length == 1 ? response.data.airdrops : []
        } else {
            // Emergency code
            result = null
        }

        return Promise.resolve(result)
    }

}
