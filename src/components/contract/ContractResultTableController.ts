// SPDX-License-Identifier: Apache-2.0

import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {ContractResult, ContractResultsResponse} from "@/schemas/MirrorNodeSchemas";
import {Ref} from "vue";
import axios from "axios";
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";

export class ContractResultTableController extends TableController<ContractResult, string> {

    private readonly contractId: Ref<string | null>

    //
    // Public
    //

    public constructor(router: Router,
                       contractId: Ref<string | null>,
                       defaultPageSize: number,
                       pageParamName = "p", keyParamName = "k") {
        super(
            router,
            defaultPageSize,
            TableController.SLOW_REFRESH_PERIOD,
            TableController.SLOW_REFRESH_COUNT,
            100,
            AppStorage.RECENT_CALL_TABLE_PAGE_SIZE_KEY,
            pageParamName,
            keyParamName
        );
        this.contractId = contractId
        this.watchAndReload([this.contractId, this.pageSize])
    }

    //
    // TableController
    //

    public async load(consensusTimestamp: string | null, operator: KeyOperator,
                      order: SortOrder, limit: number): Promise<ContractResult[] | null> {
        let result: ContractResult[] | null

        if (this.contractId.value === null) {
            result = null
        } else {
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
            const url = "api/v1/contracts/" + this.contractId.value + "/results?internal=true"
            const r = await axios.get<ContractResultsResponse>(url, {params: params})
            result = r.data.results ?? []
        }

        return Promise.resolve(result)
    }

    public keyFor(row: ContractResult): string {
        return row.timestamp ?? ""
    }

    public keyFromString(s: string): string | null {
        return s
    }

    public stringFromKey(key: string): string {
        return key
    }

}
