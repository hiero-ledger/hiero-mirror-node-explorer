// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {TableController} from "@/utils/table/TableController.ts";
import {Router} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";
import {routeManager} from "@/utils/RouteManager.ts";
import {SourcifyBatchResponse, SourcifyStatusRecord} from "@/utils/cache/SourcifyCache.ts";
import {TableControllerV2} from "@/utils/table/TableControllerV2.ts";

export class VerifiedContractTableController extends TableControllerV2<SourcifyStatusRecord, string> {

    //
    // Public
    //

    public constructor(router: Router, defaultPageSize: number) {
        super(
            router,
            TableController.SLOW_REFRESH_PERIOD,
            TableController.SLOW_REFRESH_COUNT,
            "p",
            defaultPageSize,
            AppStorage.CONTRACT_TABLE_PAGE_SIZE_KEY
        );
        this.watchAndReload([this.pageSize])
    }

    //
    // TableControllerV2
    //

    public async headLoad(matchId: string, limit: number): Promise<SourcifyStatusRecord[] | null> {
        let result: SourcifyStatusRecord[]|null

        const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup
        if (sourcifySetup !== null && sourcifySetup.activate) {
            const requestURL = sourcifySetup.makeBatchRequestURL()
                + "?limit=" + (limit + 1)
                + "&afterMatchId=" + matchId
                + "&sort=asc"
            const { data } = await axios.get<SourcifyBatchResponse>(requestURL)
            const matches = data.results
            if (matches.length <= limit) {
                result = matches.reverse()
            } else {
                // More than pageSize matches have been inserted since last headLoad()
                // => we reload latest pageSize matches
                const requestURL2 = sourcifySetup.makeBatchRequestURL() + "?limit=" + limit
                const { data } = await axios.get<SourcifyBatchResponse>(requestURL2)
                result = data.results
            }
        } else {
            result = null
        }

        return result
    }

    public async tailLoad(matchId: string | null, limit: number): Promise<SourcifyStatusRecord[] | null> {
        let result: SourcifyStatusRecord[]|null

        const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup
        if (sourcifySetup !== null && sourcifySetup.activate) {
            let requestURL = sourcifySetup.makeBatchRequestURL() + "?limit=" + this.pageSize.value
            if (matchId !== null) {
                requestURL += "&afterMatchId=" + matchId
            }
            const { data } = await axios.get<SourcifyBatchResponse>(requestURL)
            result = data.results
        } else {
            result = null
        }

        return result
    }

    public keyFor(row: SourcifyStatusRecord): string {
        return row.matchId
    }

    public stringFromKey(matchId: string): string {
        return matchId;
    }

    public keyFromString(s: string): string | null {
        return s;
    }
}
