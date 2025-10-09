// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import {EntityCache} from './base/EntityCache';
import {Key, KeyType} from '@/schemas/MirrorNodeSchemas.ts';

export interface HieroHook {
    admin_key: Key
    contract_id: string  // Network entity ID in the format of shard.realm.num
    created_timestamp: string
    deleted: boolean
    extension_point: "ACCOUNT_ALLOWANCE_HOOK"
    hook_id: number
    owner_id: string   // Network entity ID in the format of shard.realm.num
    type: "LAMBDA"
}

export class HieroHooksByAccountIdCache extends EntityCache<string, HieroHook[] | null> {

    public static readonly instance = new HieroHooksByAccountIdCache()

    //
    // Cache
    //
    protected async load(accountId: string): Promise<HieroHook[] | null> {
        console.log("HieroHooksByAccountIdCache.load", accountId,)
        let result: HieroHook[] | null
        // const params = {
        //     limit: 100,
        //     order: "asc",
        // }

        try {
            // const response = await axios.get(`api/v1/accounts/${accountId}/hooks`, {params});
            // result = await drainAccountHooks(response.data, params.limit)
            result = [
                {
                    "admin_key": {
                        "_type": KeyType.ED25519,
                        "key": "0xe88d731ad218447874d7470b797cac989d23107b4da129441665625cd5269ab0"
                    },
                    "contract_id": "0.0.6984897",
                    "created_timestamp": "1726874345.123456789",
                    "deleted": false,
                    "extension_point": "ACCOUNT_ALLOWANCE_HOOK",
                    "hook_id": 1,
                    "owner_id": "0.0.1306",
                    "type": "LAMBDA"
                },
                {
                    "admin_key": {
                        "_type": KeyType.ED25519,
                        "key": "0xe88d731ad218447874d7470b797cac989d23107b4da129441665625cd5269ab0"
                    },
                    "contract_id": "0.0.6984897",
                    "created_timestamp": "1726874345.123456789",
                    "deleted": false,
                    "extension_point": "ACCOUNT_ALLOWANCE_HOOK",
                    "hook_id": 2,
                    "owner_id": "0.0.1306",
                    "type": "LAMBDA"
                },
            ]
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

