// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {Transaction, TransactionResponse} from "@/schemas/MirrorNodeSchemas";
import {drainTransactions} from "@/schemas/MirrorNodeUtils.ts";
import {ref, Ref} from "vue";
import axios from "axios";
import {Router} from "vue-router";


export class TransactionTableController extends TableController<Transaction, string> {

    private readonly accountId: Ref<string | null>
    private readonly transactionType: string
    private readonly transactionResult: string

    //
    // Public
    //

    public constructor(router: Router, defaultPageSize: number,
                       transactionType = "",
                       transactionResult = "",
                       storageKey: string,
                       pageParamName = "p",
                       keyParamName = "k",
                       accountId: Ref<string | null> = ref(null)) {
        super(
            router,
            defaultPageSize,
            TableController.FAST_REFRESH_PERIOD,
            TableController.FAST_REFRESH_COUNT,
            100,
            storageKey,
            pageParamName,
            keyParamName
        );
        this.transactionType = transactionType
        this.transactionResult = transactionResult
        this.accountId = accountId
        this.storageKey = storageKey
        this.watchAndReload([this.accountId, this.pageSize])
    }

    public storageKey: string | null

    //
    // TableController
    //

    public async load(consensusTimestamp: string | null, operator: KeyOperator,
                      order: SortOrder, limit: number): Promise<Transaction[] | null> {

        const params = {} as {
            limit: number
            order: string
            transactiontype: string | undefined
            result: string | undefined
            timestamp: string | undefined
            "account.id": string | undefined
        }
        params.limit = limit
        params.order = order
        if (this.transactionType != "") {
            params.transactiontype = this.transactionType
        }
        if (this.transactionResult != "") {
            params.result = this.transactionResult
        }
        if (this.accountId.value !== null) {
            params["account.id"] = this.accountId.value
        }
        if (consensusTimestamp !== null) {
            params.timestamp = operator + ":" + consensusTimestamp
        }
        const r = await axios.get<TransactionResponse>("api/v1/transactions", {params: params})
        const result = await drainTransactions(r.data, limit)

        return Promise.resolve(result)
    }

    public keyFor(row: Transaction): string {
        return row.consensus_timestamp ?? ""
    }

    public keyFromString(s: string): string | null {
        return s
    }

    public stringFromKey(key: string): string {
        return key
    }
}


