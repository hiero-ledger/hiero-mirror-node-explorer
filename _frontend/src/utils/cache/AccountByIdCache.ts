// SPDX-License-Identifier: Apache-2.0

import {AccountBalanceTransactions} from "@/schemas/MirrorNodeSchemas";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {AccountByAliasCache} from "@/utils/cache/AccountByAliasCache";
import {EntityID} from "@/utils/EntityID";

export class AccountByIdCache extends EntityCache<string, AccountBalanceTransactions | null> {

    public static readonly instance = new AccountByIdCache()

    //
    // Public
    //

    public async findAccountAddress(accountId: string): Promise<string | null> {
        let result: string | null
        const accountInfo = await this.lookup(accountId)
        if (accountInfo !== null) {
            result = accountInfo.evm_address ?? EntityID.parse(accountId)?.toAddress() ?? null
        } else {
            result = null
        }
        return result
    }

    public updateWithAccountInfo(accountInfo: AccountBalanceTransactions): void {
        if (accountInfo.account) {
            this.forget(accountInfo.account)
            this.mutate(accountInfo.account, Promise.resolve(accountInfo))
        }
    }

    //
    // Cache
    //

    protected async load(accountId: string): Promise<AccountBalanceTransactions | null> {
        let result: Promise<AccountBalanceTransactions | null>
        try {
            const response = await axios.get<AccountBalanceTransactions>("api/v1/accounts/" + accountId)
            result = Promise.resolve(response.data)
            AccountByAliasCache.instance.updateWithAccountInfo(response.data)
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
