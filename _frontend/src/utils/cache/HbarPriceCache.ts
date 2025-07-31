// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import {NetworkExchangeRateSetResponse} from "@/schemas/MirrorNodeSchemas";

export class HbarPriceCache extends EntityCache<string, NetworkExchangeRateSetResponse> {

    public static readonly instance = new HbarPriceCache()

    //
    // Cache
    //

    protected async load(timestamp: string): Promise<NetworkExchangeRateSetResponse> {
        const parameters = timestamp != "0" ? {timestamp: timestamp} : {}
        const result = await axios.get<NetworkExchangeRateSetResponse>(
            'api/v1/network/exchangerate', {params: parameters})
        return Promise.resolve(result.data)
    }

}
