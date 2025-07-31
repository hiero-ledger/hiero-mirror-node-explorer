// SPDX-License-Identifier: Apache-2.0

import {Contract, ContractsResponse} from "@/schemas/MirrorNodeSchemas";
import axios, {AxiosResponse} from "axios";
import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";

export class ContractTableController extends TableController<Contract, string> {

    //
    // Public
    //

    public constructor(router: Router, defaultPageSize: number) {
        super(
            router,
            defaultPageSize,
            TableController.SLOW_REFRESH_PERIOD,
            TableController.SLOW_REFRESH_COUNT,
            100,
            AppStorage.CONTRACT_TABLE_PAGE_SIZE_KEY
        );
        this.watchAndReload([this.pageSize])
    }

    //
    // TableController
    //

    public async load(contractId: string | null, operator: KeyOperator, order: SortOrder, limit: number): Promise<Contract[] | null> {

        const params = {} as {
            limit: number
            "contract.id": string | undefined
            order: string
        }
        params.limit = limit
        params.order = order
        if (contractId !== null) {
            params["contract.id"] = operator + ":" + contractId
        }
        const cb = (r: AxiosResponse<ContractsResponse>): Promise<Contract[] | null> => {
            return Promise.resolve(r.data.contracts ?? [])
        }

        return axios.get<ContractsResponse>("api/v1/contracts", {params: params}).then(cb)
    }

    public keyFor(row: Contract): string {
        return row.contract_id ?? ""
    }

    public stringFromKey(key: string): string {
        return key;
    }

    public keyFromString(s: string): string | null {
        return s;
    }
}
