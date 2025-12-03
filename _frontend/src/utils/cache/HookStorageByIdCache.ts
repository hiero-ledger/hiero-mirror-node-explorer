// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import {EntityCache} from './base/EntityCache';
import {HooksStorageResponse, HookStorage} from "@/schemas/MirrorNodeSchemas.ts";

export class HookStorageByIdCache extends EntityCache<string, HookStorage[] | null> {

    public static readonly instance = new HookStorageByIdCache()

    public static makeKey(accountId: string, hookId: number): string {
        return `${accountId}---${hookId}`
    }

    //
    // Cache
    //
    protected async load(key: string): Promise<HookStorage[] | null> {
        const accountAndHookId = key.split("---")
        const accountId = accountAndHookId[0]
        const hookId = Number(accountAndHookId[1])

        let result: HookStorage[] | null
        const params = {
            limit: 100,
            order: "desc",
        }

        try {
            const response = await axios.get<HooksStorageResponse>(`api/v1/accounts/${accountId}/hooks/${hookId}/storage`, {params});
            result = response.data.storage ?? null
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

