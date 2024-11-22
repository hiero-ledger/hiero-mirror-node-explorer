/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import axios from "axios";
import {EntityCache} from "@/utils/cache/base/EntityCache";

export class AssetCache extends EntityCache<string, unknown> {

    public static readonly instance = new AssetCache()

    private static readonly AXIOS_TIMEOUT = 10000 // 10 sec. to leave reasonable time when querying IPFS asset
    // private privateAxios = axios.create({timeout: AssetCache.AXIOS_TIMEOUT});

    //
    // Cache
    //

    protected async load(url: string): Promise<unknown> {
        const response = await axios.get<unknown>(url, {timeout: AssetCache.AXIOS_TIMEOUT})
        return Promise.resolve(response.data)
    }

}
