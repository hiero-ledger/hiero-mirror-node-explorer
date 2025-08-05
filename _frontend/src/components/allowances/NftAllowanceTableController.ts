// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {Nft, Nfts} from "@/schemas/MirrorNodeSchemas";
import {Ref} from "vue";
import axios, {AxiosResponse} from "axios";
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";

export class NftAllowanceTableController extends TableController<Nft, string> {

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
    ): Promise<Nft[] | null> {
        let result: Promise<Nft[] | null>

        if (this.accountId.value === null) {
            result = Promise.resolve(null)
        } else {
            const params = {} as {
                limit: number
                order: string
                "spender.id": string
                "token.id": string | undefined
                serialnumber: string | undefined
            }
            params.limit = limit
            params.order = TableController.invertSortOrder(order)
            params["spender.id"] = KeyOperator.gte + ":0.0.1"
            if (key !== null) {
                const items = key.split('-')
                const token = items[0] ?? null
                const serial = items[1] ?? null
                if (params.order === SortOrder.ASC) {
                    params["token.id"] = token ? KeyOperator.gte + ":" + token : undefined
                    params.serialnumber = serial ? KeyOperator.gt + ":" + serial : undefined
                } else {
                    params["token.id"] = token ? KeyOperator.lte + ":" + token : undefined
                    params.serialnumber = serial ? KeyOperator.lt + ":" + serial : undefined
                }
            }
            const cb = (r: AxiosResponse<Nfts>): Promise<Nft[] | null> => {
                return Promise.resolve(r.data.nfts ?? [])
            }
            result = axios.get<Nfts>(
                "api/v1/accounts/" + this.accountId.value + "/nfts", {params: params})
                .then(cb)
        }

        return result
    }

    public keyFor(row: Nft): string {
        return row.token_id && row.serial_number ? `${row.token_id}-${row.serial_number}` : ""
    }

    public keyFromString(s: string): string | null {
        return s
    }

    public stringFromKey(key: string): string {
        return key
    }
}
