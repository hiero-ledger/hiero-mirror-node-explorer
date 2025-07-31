// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController,} from "@/utils/table/TableController"
import {NftTransactionHistory, NftTransactionTransfer,} from "@/schemas/MirrorNodeSchemas"
import {ref, Ref, watch, WatchStopHandle} from "vue"
import axios from "axios"
import {LocationQuery, Router} from "vue-router"
import {fetchStringQueryParam} from "@/utils/RouteManager"
import {AppStorage} from "@/AppStorage.ts";

export class NftTransactionTableController extends TableController<
    NftTransactionTransfer,
    string
> {
    private readonly tokenId: Ref<string | null>
    private readonly serialNumber: Ref<string | null>

    //
    // Public
    //

    public constructor(
        router: Router,
        tokenId: Ref<string | null>,
        serialNumber: Ref<string | null>,
        defaultPageSize: number,
        pageParamName = "p",
        keyParamName = "k",
    ) {
        super(
            router,
            defaultPageSize,
            TableController.SLOW_REFRESH_PERIOD,
            TableController.SLOW_REFRESH_COUNT,
            100,
            AppStorage.NFT_TRANSACTION_TABLE_PAGE_SIZE_KEY,
            pageParamName,
            keyParamName,
        )
        this.tokenId = tokenId
        this.serialNumber = serialNumber
        this.watchAndReload([
            this.transactionType,
            this.tokenId,
            this.serialNumber,
        ])
    }

    public readonly transactionType: Ref<string> = ref("")

    //
    // TableController
    //

    public async load(
        consensusTimestamp: string | null,
        operator: KeyOperator,
        order: SortOrder,
        limit: number,
    ): Promise<NftTransactionTransfer[] | null> {
        if (this.tokenId.value === null || this.serialNumber.value === null) {
            return Promise.resolve(null)
        }

        const params = {} as {
            limit: number
            order: string
            timestamp: string | undefined
        }
        params.limit = limit
        params.order = order

        if (consensusTimestamp !== null) {
            params.timestamp = operator + ":" + consensusTimestamp
        }

        const r = await axios.get<NftTransactionHistory>(
            `api/v1/tokens/${this.tokenId.value}/nfts/${this.serialNumber.value}/transactions`,
            {params: params},
        )
        return r.data.transactions ?? []
    }

    public keyFor(row: NftTransactionTransfer): string {
        return row.consensus_timestamp ?? ""
    }

    public keyFromString(s: string): string | null {
        return s
    }

    public stringFromKey(key: string): string {
        return key
    }

    public mount(): void {
        // Must be done before calling mount()
        this.transactionType.value = this.fetchTransactionTypeParam()
        super.mount()
        this.watchTransactionTypeHandle = watch(this.transactionType, () =>
            this.updateRouteQuery(),
        )
    }

    public unmount(): void {
        if (this.watchTransactionTypeHandle !== null) {
            this.watchTransactionTypeHandle()
        }
        this.watchTransactionTypeHandle = null
        super.unmount()
    }

    protected makeRouteQuery(): LocationQuery {
        const result = super.makeRouteQuery()
        if (this.transactionType.value != "") {
            result[this.typeParamName] =
                this.transactionType.value.toLowerCase()
        } else {
            delete result[this.typeParamName]
        }
        return result
    }

    //
    // Private
    //

    private readonly typeParamName = "type"
    private watchTransactionTypeHandle: WatchStopHandle | null = null

    public fetchTransactionTypeParam(): string {
        return (
            fetchStringQueryParam(
                this.typeParamName,
                this.router.currentRoute.value,
            )?.toUpperCase() ?? ""
        )
    }
}
