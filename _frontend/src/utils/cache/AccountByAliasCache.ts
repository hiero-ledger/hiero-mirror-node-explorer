// SPDX-License-Identifier: Apache-2.0

import {AccountBalanceTransactions} from "@/schemas/MirrorNodeSchemas";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache";

export class AccountByAliasCache extends EntityCache<string, AccountBalanceTransactions | null> {

    public static readonly instance = new AccountByAliasCache()

    //
    // Public
    //

    public updateWithAccountInfo(accountInfo: AccountBalanceTransactions): void {
        if (accountInfo.alias) {
            this.forget(accountInfo.alias)
            this.mutate(accountInfo.alias, Promise.resolve(accountInfo))
        }
    }

    //
    // Cache
    //

    protected async load(alias: string): Promise<AccountBalanceTransactions | null> {
        let result: Promise<AccountBalanceTransactions | null>
        try {
            const response = await axios.get<AccountBalanceTransactions>("api/v1/accounts/" + alias)
            result = Promise.resolve(response.data)
            AccountByIdCache.instance.updateWithAccountInfo(response.data)
            AccountByAddressCache.instance.updateWithAccountInfo(response.data)
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
