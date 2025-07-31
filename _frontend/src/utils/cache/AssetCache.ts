// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {EntityCache} from "@/utils/cache/base/EntityCache";

export class AssetCache extends EntityCache<string, unknown> {

    public static readonly instance = new AssetCache()

    private static readonly AXIOS_TIMEOUT = 10000 // 10 sec. to leave reasonable time when querying IPFS asset

    //
    // Cache
    //

    protected async load(url: string): Promise<unknown> {
        const response = await axios.get<unknown>(url, {timeout: AssetCache.AXIOS_TIMEOUT})
        return Promise.resolve(response.data)
    }

}
