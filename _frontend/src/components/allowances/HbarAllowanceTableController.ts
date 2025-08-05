// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {CryptoAllowance, CryptoAllowancesResponse} from "@/schemas/MirrorNodeSchemas";
import {Ref} from "vue";
import axios, {AxiosResponse} from "axios";
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";

export class HbarAllowanceTableController extends TableController<CryptoAllowance, string> {

    //
    // Public
    //

    public readonly accountId: Ref<string | null>

    public constructor(router: Router,
                       accountId: Ref<string | null>,
                       defaultPageSize: number,
                       pageParamName = "p", keyParamName = "k") {
        super(router, defaultPageSize, 5000, 0, 100,
            AppStorage.ALLOWANCE_TABLE_PAGE_SIZE_KEY,
            pageParamName, keyParamName);
        this.accountId = accountId
        this.watchAndReload([this.accountId, this.pageSize])
    }

    //
    // TableController
    //

    public async load(spenderId: string | null, operator: KeyOperator,
                      order: SortOrder, limit: number): Promise<CryptoAllowance[] | null> {
        let result: Promise<CryptoAllowance[] | null>

        if (this.accountId.value === null) {
            result = Promise.resolve(null)
        } else {
            const params = {} as {
                limit: number
                order: string
                "spender.id": string | undefined
            }
            params.limit = limit
            params.order = TableController.invertSortOrder(order)
            if (spenderId !== null) {
                params["spender.id"] = TableController.invertKeyOperator(operator) + ":" + spenderId
            }
            const cb = (r: AxiosResponse<CryptoAllowancesResponse>): Promise<CryptoAllowance[] | null> => {
                return Promise.resolve(r.data.allowances ?? [])
            }
            result = axios.get<CryptoAllowancesResponse>(
                "api/v1/accounts/" + this.accountId.value + "/allowances/crypto", {params: params})
                .then(cb)
        }

        return result
    }

    public keyFor(row: CryptoAllowance): string {
        return row.spender ?? ""
    }

    public keyFromString(s: string): string | null {
        return s
    }

    public stringFromKey(key: string): string {
        return key
    }

}
