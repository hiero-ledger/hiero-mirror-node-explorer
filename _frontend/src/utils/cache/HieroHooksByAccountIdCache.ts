// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import {EntityCache} from './base/EntityCache';
import {Hook, HooksResponse} from '@/schemas/MirrorNodeSchemas.ts';

export class HieroHooksByAccountIdCache extends EntityCache<string, Hook[] | null> {

    public static readonly instance = new HieroHooksByAccountIdCache()

    //
    // Cache
    //
    // eslint-disable-next-line max-lines-per-function
    protected async load(accountId: string): Promise<Hook[] | null> {
        console.log("HieroHooksByAccountIdCache.load", accountId,)
        let result: Hook[] | null
        const params = {
            limit: 100,
            order: "asc",
        }

        try {
            const response = await axios.get<HooksResponse>(`api/v1/accounts/${accountId}/hooks`, {params});
            // TODO Provide drainAccountHooks() and use it here to get all available hooks at once
            // result = await drainAccountHooks(response.data, params.limit)
            result = response.data.hooks

            // result = [
            //     {
            //         "admin_key": {
            //             "_type": KeyType.ED25519,
            //             "key": "0xe88d731ad218447874d7470b797cac989d23107b4da129441665625cd5269ab0"
            //         },
            //         "contract_id": "0.0.6984897",
            //         "created_timestamp": "1726874345.123456789",
            //         "deleted": false,
            //         "extension_point": ExtensionPoint.ACCOUNT_ALLOWANCE_HOOK,
            //         "hook_id": 1,
            //         "owner_id": "0.0.1306",
            //         "timestamp_range": null,
            //         "type": HookType.LAMBDA,
            //     },
            //     {
            //         "admin_key": {
            //             "_type": KeyType.ED25519,
            //             "key": "0xe88d731ad218447874d7470b797cac989d23107b4da129441665625cd5269ab0"
            //         },
            //         "contract_id": "0.0.6984897",
            //         "created_timestamp": "1726874345.123456789",
            //         "deleted": false,
            //         "extension_point": ExtensionPoint.ACCOUNT_ALLOWANCE_HOOK,
            //         "hook_id": 2,
            //         "owner_id": "0.0.1306",
            //         "timestamp_range": null,
            //         "type": HookType.LAMBDA,
            //     },
            // ]
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

