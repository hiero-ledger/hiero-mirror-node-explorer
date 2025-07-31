// SPDX-License-Identifier: Apache-2.0

import {TokenRelationship, TokenRelationshipResponse} from "@/schemas/MirrorNodeSchemas";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios, {AxiosResponse} from "axios";

export class TokenRelationshipCache extends EntityCache<string, TokenRelationship[] | null> {

    public static readonly instance = new TokenRelationshipCache()

    //
    // Cache
    //

    protected async load(accountId: string): Promise<TokenRelationship[] | null> {
        let result: TokenRelationship[] = []

        let url: string | null = "api/v1/accounts/" + accountId + "/tokens?limit=100"
        let counter = 10
        while (url !== null && counter > 0) {
            const response: AxiosResponse<TokenRelationshipResponse> = await axios.get<TokenRelationshipResponse>(url)
            if (response.data.tokens) {
                result = result.concat(response.data.tokens)
            }
            url = response.data.links.next ?? null
            counter -= 1
        }
        return Promise.resolve(result)
    }

}
