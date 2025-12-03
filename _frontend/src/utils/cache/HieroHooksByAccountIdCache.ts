// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import {EntityCache} from './base/EntityCache';
import {Hook, HooksResponse} from '@/schemas/MirrorNodeSchemas.ts';

export class HieroHooksByAccountIdCache extends EntityCache<string, Hook[] | null> {

    public static readonly instance = new HieroHooksByAccountIdCache()

    //
    // Cache
    //
    protected async load(accountId: string): Promise<Hook[] | null> {
        console.log("HieroHooksByAccountIdCache.load", accountId,)
        let result: Hook[] | null
        const params = {
            limit: 100,
            order: "asc",
        }

        try {
            const response = await axios.get<HooksResponse>(`api/v1/accounts/${accountId}/hooks`, {params});
            result = response.data.hooks ?? null
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

