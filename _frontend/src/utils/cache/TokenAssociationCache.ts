// SPDX-License-Identifier: Apache-2.0

import {TokenRelationship, TokenRelationshipResponse} from "@/schemas/MirrorNodeSchemas";
import {EntityCache, EntityLookup} from "@/utils/cache/base/EntityCache";
import axios, {AxiosResponse} from "axios";
import {computed, Ref} from "vue";

export class TokenAssociationCache extends EntityCache<string, TokenRelationship[] | null> {

    public static readonly instance = new TokenAssociationCache()

    //
    // Public
    //

    public static makeAssociationKey(accountId: string, tokenId: string): string {
        return accountId + "---" + tokenId
    }

    public static parseAssociationKey(key: string): string[] {
        const components = key.split("---")
        return components.length == 2 ? components : []
    }

    public makeTokenAssociationLookup(accountId: Ref<string | null>, tokenId: Ref<string | null>): EntityLookup<string, TokenRelationship[] | null> {
        const key = computed(() => {
            let result: string | null
            if (accountId.value !== null && tokenId.value !== null) {
                result = TokenAssociationCache.makeAssociationKey(accountId.value, tokenId.value)
            } else {
                result = null
            }
            return result
        })
        return this.makeLookup(key)
    }

    public forgetTokenAssociation(accountId: string, tokenId: string): void {
        this.forget(TokenAssociationCache.makeAssociationKey(accountId, tokenId))
    }

    //
    // Cache
    //

    protected async load(associationKey: string): Promise<TokenRelationship[] | null> {
        let result: TokenRelationship[] | null

        const components = TokenAssociationCache.parseAssociationKey(associationKey)
        if (components.length == 2) {
            const accountId = components[0]
            const tokenId = components[1]
            const url: string | null = "api/v1/accounts/" + accountId + "/tokens?token.id=" + tokenId + "&limit=1"
            const response: AxiosResponse<TokenRelationshipResponse> = await axios.get<TokenRelationshipResponse>(url)
            result = response.data.tokens.length == 1 ? response.data.tokens : []
        } else {
            // Emergency code
            result = null
        }

        return Promise.resolve(result)
    }

}
