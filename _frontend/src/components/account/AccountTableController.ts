// SPDX-License-Identifier: Apache-2.0

import {AccountInfo, AccountsResponse} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";
import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {drainAccounts} from "@/schemas/MirrorNodeUtils.ts";
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";

export class AccountTableController extends TableController<AccountInfo, string> {

    private readonly pubKey: string | null

    //
    // Public
    //

    public constructor(router: Router, defaultPageSize: number, pubKey: string | null = null) {
        super(
            router,
            defaultPageSize,
            TableController.SLOW_REFRESH_PERIOD,
            AccountTableController.SLOW_REFRESH_COUNT,
            100,
            AppStorage.ACCOUNT_TABLE_PAGE_SIZE_KEY,
        )
        this.pubKey = pubKey
        this.watchAndReload([this.pageSize])
    }

    //
    // TableController
    //

    public async load(accountId: string | null, operator: KeyOperator, order: SortOrder, limit: number): Promise<AccountInfo[] | null> {

        const params = {} as {
            limit: number
            "account.id": string | undefined,
            "account.publickey": string | undefined,
            order: string
        }
        params.limit = limit
        params.order = order
        if (accountId !== null) {
            params["account.id"] = operator + ":" + accountId
        }
        if (this.pubKey !== null) {
            params["account.publickey"] = this.pubKey
        }
        const r = await axios.get<AccountsResponse>("api/v1/accounts", {params: params})
        const result = await drainAccounts(r.data, params.limit)

        return Promise.resolve(result)
    }

    public keyFor(row: AccountInfo): string {
        return row.account ?? ""
    }

    public stringFromKey(account: string): string {
        return account
    }

    public keyFromString(s: string): string | null {
        return s
    }
}
