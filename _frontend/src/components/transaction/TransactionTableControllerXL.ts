// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {Transaction, TransactionResponse} from "@/schemas/MirrorNodeSchemas";
import {ref, Ref, watch, WatchStopHandle} from "vue";
import axios from "axios";
import {LocationQuery, Router} from "vue-router";
import {fetchStringQueryParam} from "@/utils/RouteManager";
import {drainAndFilterTransactions, drainTransactions} from "@/schemas/MirrorNodeUtils.ts";


export class TransactionTableControllerXL extends TableController<Transaction, string> {

    private readonly accountId: Ref<string | null>
    private readonly accountIdMandatory: boolean
    private readonly minTinyBar: Ref<number>

    //
    // Public
    //

    public constructor(router: Router,
                       accountId: Ref<string | null>,
                       defaultPageSize: number,
                       accountIdMandatory: boolean,
                       storageKey: string,
                       pageParamName = "p", keyParamName = "k",
                       minTinyBar = ref(0)) {
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
        this.accountId = accountId
        this.accountIdMandatory = accountIdMandatory
        this.minTinyBar = minTinyBar
        this.storageKey = storageKey
        this.watchAndReload([this.transactionType, this.accountId, this.pageSize, this.minTinyBar])
    }

    public readonly transactionType: Ref<string> = ref("")
    public storageKey: string

    //
    // TableController
    //

    public async load(consensusTimestamp: string | null, operator: KeyOperator,
                      order: SortOrder, limit: number): Promise<Transaction[] | null> {
        let result: Transaction[] | null

        if (this.accountIdMandatory && this.accountId.value === null) {
            result = null
        } else {
            const params = {} as {
                limit: number
                order: string
                "account.id": string | undefined
                transactiontype: string | undefined
                timestamp: string | undefined
            }
            params.limit = (this.minTinyBar.value > 0) ? 100 : limit
            params.order = order
            if (this.accountId.value !== null) {
                params["account.id"] = this.accountId.value
            }
            if (this.transactionType.value != "") {
                params.transactiontype = this.transactionType.value
            }
            if (consensusTimestamp !== null) {
                params.timestamp = operator + ":" + consensusTimestamp
            }
            const r = await axios.get<TransactionResponse>("api/v1/transactions", {params: params})
            if (this.accountId.value && this.minTinyBar.value > 0) {
                result = await drainAndFilterTransactions(r.data, limit, this.minTinyBar.value, this.accountId.value)
            } else {
                result = await drainTransactions(r.data, limit)
            }
        }

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

    public mount(): void {
        this.transactionType.value = this.fetchTransactionTypeParam() // Must be done before calling mount()
        super.mount()
        this.watchTransactionTypeHandle = watch(this.transactionType, () => this.updateRouteQuery())
    }

    public unmount(): void {
        if (this.watchTransactionTypeHandle !== null) {
            this.watchTransactionTypeHandle()
        }
        this.watchTransactionTypeHandle = null;
        super.unmount()
    }

    protected makeRouteQuery(): LocationQuery {
        const result = super.makeRouteQuery()
        if (this.transactionType.value != "") {
            result[this.typeParamName] = this.transactionType.value.toLowerCase()
        } else {
            delete (result[this.typeParamName])
        }
        return result
    }

    protected isRouteQueryOutdated(): boolean {
        return super.isRouteQueryOutdated()
            || this.fetchTransactionTypeParam() != this.transactionType.value
    }

    //
    // Private
    //

    private readonly typeParamName = "type"
    private watchTransactionTypeHandle: WatchStopHandle | null = null

    public fetchTransactionTypeParam(): string {
        return fetchStringQueryParam(this.typeParamName, this.router.currentRoute.value)?.toUpperCase() ?? ""
    }

}
