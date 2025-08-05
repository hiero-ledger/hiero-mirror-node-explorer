// SPDX-License-Identifier: Apache-2.0

import {AccountBalanceTransactions} from "@/schemas/MirrorNodeSchemas";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";
import {makeEthAddressForAccount} from "@/schemas/MirrorNodeUtils.ts";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache";
import {AccountByAliasCache} from "@/utils/cache/AccountByAliasCache";

export class AccountByAddressCache extends EntityCache<string, AccountBalanceTransactions | null> {

    public static readonly instance = new AccountByAddressCache()

    //
    // Public
    //

    public updateWithAccountInfo(accountInfo: AccountBalanceTransactions): void {
        const address = makeEthAddressForAccount(accountInfo)
        if (address) {
            this.forget(address)
            this.mutate(address, Promise.resolve(accountInfo))
        }
    }

    //
    // Cache
    //

    protected async load(accountAddress: string): Promise<AccountBalanceTransactions | null> {
        let result: Promise<AccountBalanceTransactions | null>
        try {
            const response = await axios.get<AccountBalanceTransactions>("api/v1/accounts/" + accountAddress)
            result = Promise.resolve(response.data)
            AccountByIdCache.instance.updateWithAccountInfo(response.data)
            AccountByAliasCache.instance.updateWithAccountInfo(response.data)
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
