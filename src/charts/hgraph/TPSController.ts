// SPDX-License-Identifier: Apache-2.0

import {ThemeController} from "@/components/ThemeController.ts";
import {RouteManager} from "@/utils/RouteManager.ts";
import {GenericMetricController} from "@/charts/hgraph/GenericMetricController.ts";
import {averageMetrics, EcosystemMetric} from "@/charts/hgraph/EcosystemMetric.ts";
import {ChartRange, computeGranularityForRange} from "@/charts/core/ChartRange.ts";
import {ChartConfiguration} from "chart.js/auto";

export class TPSController extends GenericMetricController {

    //
    // Public
    //

    public constructor(themeController: ThemeController, routeManager: RouteManager) {
        super("TPS", "network_tps", themeController, routeManager)
    }

    //
    // ChartController
    //

    protected async transformMetrics(metrics: EcosystemMetric[], range: ChartRange): Promise<EcosystemMetric[]> {
        const granularity = computeGranularityForRange(range)
        const result = averageMetrics(metrics, granularity)
        return Promise.resolve(result)
    }

    protected makeChartConfig(metrics: EcosystemMetric[],
                              range: ChartRange,
                              context: CanvasRenderingContext2D): ChartConfiguration {
        return this.makeBarChartConfig(metrics, range, true, "tx / second", context)
    }
}
