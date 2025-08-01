// SPDX-License-Identifier: Apache-2.0

import {HgraphChartController} from "@/charts/hgraph/HgraphChartController.ts";
import {ChartRange, computeStartDateForRange} from "@/charts/core/ChartRange.ts";
import {makeLatestQuery} from "@/charts/hgraph/EcosystemMetric.ts";
import {ThemeController} from "@/components/ThemeController.ts";
import {RouteManager} from "@/utils/RouteManager.ts";

export abstract class GenericMetricController extends HgraphChartController {

    private readonly metricName: string

    //
    // Protected
    //

    protected constructor(chartTitle: string,
                          metricName: string,
                          themeController: ThemeController,
                          routeManager: RouteManager,
                          supportedRanges: ChartRange[] = []) {
        super(chartTitle, themeController, routeManager, supportedRanges)
        this.metricName = metricName
    }

    //
    // HgraphChartController
    //

    protected makeQuery(range: ChartRange): string {
        const periodStartDate = computeStartDateForRange(range).toISOString()
        return "{" +
            "  all_metrics: ecosystem_metric(" +
            "    where: {" +
            "      name: {_eq: \"" + this.metricName + "\"}, " +
            "      period: {_eq: \"hour\"}," +
            "      end_date: {_gte: \"" + periodStartDate + "\"}," +
            "    }" +
            "    order_by: {end_date: asc}" +
            "  ) {" +
            "    start_date" +
            "    end_date" +
            "    total" +
            "  }" +
            "}"
    }

    protected makeLatestQuery(): string {
        return makeLatestQuery(this.metricName)
    }


}
