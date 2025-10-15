// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import {EntityCache} from './base/EntityCache';

export interface HieroHookStorage {
    key: string
    value: string
    timestamp: string
}

export class HieroHookStorageByIdCache extends EntityCache<string, HieroHookStorage[] | null> {

    public static readonly instance = new HieroHookStorageByIdCache()

    public static makeKey(accountId: string, hookId: number): string {
        return `${accountId}---${hookId}`
    }

    //
    // Cache
    //
    // eslint-disable-next-line max-lines-per-function
    protected async load(key: string): Promise<HieroHookStorage[] | null> {
        console.log("HieroHookStorageByIdCache.load", key)
        const accountAndHookId = key.split("---")
        const accountId = accountAndHookId[0]
        const hookId = Number(accountAndHookId[1])
        console.log("HieroHookStorageByIdCache.load", accountId, hookId)
        let result: HieroHookStorage[] | null
        // const params = {
        //     limit: 100,
        //     order: "desc",
        // }

        try {
            // const response = await axios.get(`api/v1/accounts/${accountId}/hooks/${hookId}`, {params});
            // result = await drainAccountHooks(response.data, params.limit)
            result = [
                [{
                    "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "value": "0x00000000000000000000000000000000000000000000000000000000000003e8",
                    "timestamp": "1726874345.123456789"
                }, {
                    "key": "0x0000000000000000000000000000000000000000000000000000000000000020",
                    "value": "0x00000000000000000000000000000000000000000000000000000000FFFFFFFF",
                    "timestamp": "1726876346.123456789"
                }, {
                    "key": "0x0000000000000000000000000000000000000000000000000000000000000020",
                    "value": "0x00000000000000000000000000000000000000000000000000000000CCCCCCCC",
                    "timestamp": "1726878348.123456789"
                }],
                [{
                    "key": "0x0000000000000000000000000000000000000000000000000000000000000000",
                    "value": "0x00000000000000000000000000000000000000000000000000000000000003e8",
                    "timestamp": "1727974345.123456789"
                }, {
                    "key": "0x0000000000000000000000000000000000000000000000000000000000000020",
                    "value": "0x0000000000000000000000000000000000000000000000000000000099999999",
                    "timestamp": "1727976346.123456789"
                }, {
                    "key": "0x0000000000000000000000000000000000000000000000000000000000000020",
                    "value": "0x0000000000000000000000000000000000000000000000000000000055555555",
                    "timestamp": "1727978348.123456789"
                }],
            ][hookId - 1]
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = null
            } else {
                throw error
            }
        }
        return result
    }
}

