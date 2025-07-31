// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {TokenInfo} from "@/schemas/MirrorNodeSchemas";
import {SerialCache} from "@/utils/cache/base/SerialCache";

export class TokenInfoCache extends SerialCache<string, TokenInfo | null> {

    public static readonly instance = new TokenInfoCache()

    //
    // Cache
    //

    protected async load(tokenId: string): Promise<TokenInfo | null> {
        let result: Promise<TokenInfo | null>
        try {
            const response = await axios.get<TokenInfo>("api/v1/tokens/" + tokenId)
            result = Promise.resolve(response.data)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = Promise.resolve(null)
            } else {
                throw error
            }
        }
        return result
    }
}
