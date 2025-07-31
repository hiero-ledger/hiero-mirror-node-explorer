// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import {NetworkFeesResponse} from "@/schemas/MirrorNodeSchemas";

export class NetworkFeesCache extends EntityCache<string, NetworkFeesResponse> {

    public static readonly instance = new NetworkFeesCache()

    //
    // Cache
    //

    protected async load(timestamp: string): Promise<NetworkFeesResponse> {
        const parameters = timestamp != "0" ? {timestamp: timestamp} : {}
        const result = await axios.get<NetworkFeesResponse>(
            'api/v1/network/fees',
            {params: parameters}
        )
        return Promise.resolve(result.data)
    }

}
