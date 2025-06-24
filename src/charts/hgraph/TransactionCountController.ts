// SPDX-License-Identifier: Apache-2.0

import {ThemeController} from "@/components/ThemeController.ts";
import {RouteManager} from "@/utils/RouteManager.ts";
import {GenericMetricController} from "@/charts/hgraph/GenericMetricController.ts";
import {EcosystemMetric} from "@/charts/hgraph/EcosystemMetric.ts";
import {ChartRange} from "@/charts/core/ChartRange.ts";
import {ChartConfiguration} from "chart.js/auto";

export class TransactionCountController extends GenericMetricController {

    //
    // Public
    //

    public constructor(themeController: ThemeController, routeManager: RouteManager) {
        super("Transactions Per Period", "transactions", themeController, routeManager)
    }

    //
    // ChartController
    //

    protected makeChartConfig(metrics: EcosystemMetric[], range: ChartRange,
                              context: CanvasRenderingContext2D): ChartConfiguration {
        return this.makeBarChartConfig(metrics, range, false, "# of transactions", context)
    }
}
