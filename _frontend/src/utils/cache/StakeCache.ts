// SPDX-License-Identifier: Apache-2.0

import {SingletonCache} from "@/utils/cache/base/SingletonCache";
import {NetworkStake} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";

export class StakeCache extends SingletonCache<NetworkStake> {

    public static readonly instance = new StakeCache()

    //
    // SingletonCache
    //

    protected async load(): Promise<NetworkStake> {
        const r = await axios.get<NetworkStake>("api/v1/network/stake")
        return r.data
    }

}
