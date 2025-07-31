// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import {BalancesResponse} from "@/schemas/MirrorNodeSchemas";

export class BalanceCache extends EntityCache<string, BalancesResponse | null> {

    public static readonly instance = new BalanceCache()

    //
    // Cache
    //

    protected async load(accountId: string): Promise<BalancesResponse | null> {
        let result: Promise<BalancesResponse | null>
        try {
            const params = {
                'account.id': accountId,
            }
            const response = await axios.get<BalancesResponse>("api/v1/balances", {params: params})
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
