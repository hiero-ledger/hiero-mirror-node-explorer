// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";

export interface MerkleScienceAddress {
    tags: {
        owner: MerkleScienceTag,
        user: MerkleScienceTag
    }
}

export interface MerkleScienceTag {
    tag_type_verbose?: string,
    tag_subtype_verbose?: string,
    tag_name_verbose?: string
}

export class MerkleScienceAddressCache extends EntityCache<string, MerkleScienceAddress | null> {

    public static readonly instance = new MerkleScienceAddressCache()

    //
    // EntityCache
    //

    protected async load(key: string): Promise<MerkleScienceAddress | null> {

        console.log(`MerkleScienceInfoCache.load for key: ${key}`)

        const API_KEY = "FNDVLX5L56W8R63TJM8YS77Z3T7H3HQ980AP9PVKZ8"

        let result: MerkleScienceAddress | null
        try {
            const url = "https://api.merklescience.com/api/v4.2/addresses/"
            const data = {
                identifier: key,
                blockchain: '14'
            }
            const headers = {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'X-API-KEY': API_KEY
            }
            const response =
                await axios.post<MerkleScienceAddress>(url, data, {headers: headers})
            result = response.data
            console.log(`MerkleScienceInfoCache.load: ${JSON.stringify(result)}`)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = null
            } else {
                throw error
            }
        }
        return Promise.resolve(result)
    }
}
