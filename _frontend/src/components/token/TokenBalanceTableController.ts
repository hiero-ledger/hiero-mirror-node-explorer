// SPDX-License-Identifier: Apache-2.0

import {TokenBalancesResponse, TokenDistribution} from "@/schemas/MirrorNodeSchemas";
import {ComputedRef, Ref} from "vue";
import axios, {AxiosResponse} from "axios";
import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";

export class TokenBalanceTableController extends TableController<TokenDistribution, string> {

    public readonly tokenId: Ref<string | null>

    //
    // Public
    //

    public constructor(router: Router, tokenId: ComputedRef<string | null>, defaultPageSize: number) {
        super(
            router,
            defaultPageSize,
            TableController.SLOW_REFRESH_PERIOD,
            TableController.SLOW_REFRESH_COUNT,
            100,
            AppStorage.TOKEN_BALANCE_TABLE_PAGE_SIZE_KEY
        );
        this.tokenId = tokenId
        this.watchAndReload([this.tokenId, this.pageSize])
    }

    //
    // TableController
    //

    public async load(accountId: string | null, operator: KeyOperator, order: SortOrder, limit: number): Promise<TokenDistribution[] | null> {
        let result
        if (this.tokenId.value) {
            const params = {} as {
                limit: number
                order: string
                'account.id': string | undefined
            }
            params.limit = limit
            params.order = TableController.invertSortOrder(order)
            const keyOperator = TableController.invertKeyOperator(operator)
            if (accountId !== null) {
                params['account.id'] = keyOperator + ":" + accountId
            }
            const cb = (r: AxiosResponse<TokenBalancesResponse>): Promise<TokenDistribution[] | null> => {
                return Promise.resolve(r.data.balances ?? [])
            }
            result = axios.get<TokenBalancesResponse>("api/v1/tokens/" + this.tokenId.value + "/balances", {params: params}).then(cb)
        } else {
            result = Promise.resolve(null)
        }
        return result
    }

    public keyFor(row: TokenDistribution): string {
        return row.account ?? ""
    }

    public stringFromKey(key: string): string {
        return key;
    }

    public keyFromString(s: string): string | null {
        return s;
    }
}
