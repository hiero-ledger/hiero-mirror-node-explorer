// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {NftAllowance, NftAllowancesResponse} from "@/schemas/MirrorNodeSchemas";
import {Ref} from "vue";
import axios, {AxiosResponse} from "axios";
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";

export class NftAllSerialsAllowanceTableController extends TableController<NftAllowance, string> {

    //
    // Public
    //

    public readonly accountId: Ref<string | null>

    public constructor(
        router: Router,
        accountId: Ref<string | null>,
        defaultPageSize: number,
        pageParamName = "p",
        keyParamName = "k"
    ) {
        super(router, defaultPageSize, 5000, 0, 100,
            AppStorage.ALLOWANCE_TABLE_PAGE_SIZE_KEY,
            pageParamName, keyParamName);
        this.accountId = accountId
        this.watchAndReload([this.accountId, this.pageSize])
    }

    //
    // TableController
    //

    public async load(
        key: string | null,
        operator: KeyOperator,
        order: SortOrder,
        limit: number
    ): Promise<NftAllowance[] | null> {
        let result: Promise<NftAllowance[] | null>

        if (this.accountId.value === null) {
            result = Promise.resolve(null)
        } else {
            const params = {} as {
                limit: number
                order: string
                "account.id": string | undefined
                "token.id": string | undefined
            }
            params.limit = limit
            params.order = TableController.invertSortOrder(order)
            if (key !== null) {
                const items = key.split('-')
                const account = items[0] ?? null
                const token = items[1] ?? null
                if (params.order === SortOrder.ASC) {
                    params["account.id"] = account ? KeyOperator.gte + ":" + account : undefined
                    params["token.id"] = token ? KeyOperator.gt + ":" + token : undefined
                } else {
                    params["account.id"] = account ? KeyOperator.lte + ":" + account : undefined
                    params["token.id"] = token ? KeyOperator.lt + ":" + token : undefined
                }
            }
            const cb = (r: AxiosResponse<NftAllowancesResponse>): Promise<NftAllowance[] | null> => {
                return Promise.resolve(r.data.allowances ?? [])
            }
            result = axios.get<NftAllowancesResponse>(
                "api/v1/accounts/" + this.accountId.value + "/allowances/nfts", {params: params})
                .then(cb)
        }

        return result
    }

    public keyFor(row: NftAllowance): string {
        return row.spender && row.token_id ? `${row.spender}-${row.token_id}` : ""
    }

    public keyFromString(s: string): string | null {
        return s
    }

    public stringFromKey(key: string): string {
        return key
    }

}
