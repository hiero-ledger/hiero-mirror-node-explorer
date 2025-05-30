// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";
import {computed} from "vue";
import {routeManager} from "@/router.ts";

export class ERCTokenByAddressCache extends EntityCache<string, Blockscout.TokenInfo | null> {

    public static readonly instance = new ERCTokenByAddressCache()

    private static blockscoutURL = computed(() => routeManager.currentNetworkEntry.value.blockscoutURL)

    //
    // Cache
    //

    protected async load(address: string): Promise<Blockscout.TokenInfo | null> {
        let result: Promise<Blockscout.TokenInfo | null>
        try {
            const url = ERCTokenByAddressCache.blockscoutURL.value + "tokens/" + address
            const response = await axios.get<Blockscout.TokenInfo>(url)
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
