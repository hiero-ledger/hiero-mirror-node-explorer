// SPDX-License-Identifier: Apache-2.0

import {Nft, Nfts} from "@/schemas/MirrorNodeSchemas";
import {Ref} from "vue";
import axios from "axios";
import {getNonStrictOperator, KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {Router} from "vue-router";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import {AppStorage} from "@/AppStorage.ts";

export class NftsTableController extends TableController<Nft, string> {

    public readonly accountId: Ref<string | null>

    //
    // Public
    //

    public constructor(
        router: Router,
        accountId: Ref<string | null>,
        defaultPageSize: number,
        pageParamName = "p",
        keyParamName = "k"
    ) {
        super(
            router,
            defaultPageSize,
            TableController.SLOW_REFRESH_PERIOD,
            0,
            100,
            AppStorage.ACCOUNT_TOKENS_TABLE_PAGE_SIZE_KEY,
            pageParamName, keyParamName
        )
        this.accountId = accountId
        this.watchAndReload([this.accountId, this.pageSize])
    }

    //
    // TableController
    //

    public async load(key: string | null, operator: KeyOperator, order: SortOrder, limit: number): Promise<Nft[] | null> {
        let result

        if (this.accountId.value == null) {
            result = Promise.resolve(null)
        } else {
            order = TransactionTableController.invertSortOrder(order)
            operator = TransactionTableController.invertKeyOperator(operator)

            const params = {} as {
                limit: number
                "token.id": string | undefined
                serialnumber: string | undefined
                order: string
            }
            params.limit = limit
            params.order = order

            if (key !== null) {
                const items = key.split('-')
                const token = items[0] ?? null
                const serial = items[1] ?? null

                params["token.id"] = token ? `${getNonStrictOperator(operator)}:${token}` : undefined
                params.serialnumber = serial ? `${operator}:${serial}` : undefined
            }

            const url = `api/v1/accounts/${this.accountId.value}/nfts`
            const response = await axios.get<Nfts>(url, {params: params},)
            result = Promise.resolve(response.data.nfts ?? null)
        }
        return result
    }

    public keyFor(row: Nft): string {
        return row.token_id && row.serial_number ? `${row.token_id}-${row.serial_number}` : ""
    }

    public stringFromKey(key: string): string {
        return key
    }

    public keyFromString(s: string): string | null {
        return s
    }
}
