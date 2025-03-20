// SPDX-License-Identifier: Apache-2.0

import {GenericMetricController} from "@/charts/hgraph/GenericMetricController.ts";
import {EcosystemMetric} from "@/charts/hgraph/EcosystemMetric.ts";
import {ChartRange} from "@/charts/core/ChartRange.ts";
import {ThemeController} from "@/components/ThemeController.ts";
import {RouteManager} from "@/utils/RouteManager.ts";
import {ChartConfiguration} from "chart.js/auto";

export class NetworkFeeController extends GenericMetricController {

    //
    // Public
    //

    public constructor(themeController: ThemeController, routeManager: RouteManager) {
        super("Network Fees", "network_fee", themeController, routeManager)
    }

    //
    // ChartController
    //

    protected async transformMetrics(metrics: EcosystemMetric[], range: ChartRange): Promise<EcosystemMetric[]> {
        const result = await super.transformMetrics(metrics, range);
        for (const m of result) {
            m.total = Math.round(m.total / 100_000_000) // Convert to HBAR
        }
        return Promise.resolve(result)
    }

    protected makeChartConfig(metrics: EcosystemMetric[],
                              range: ChartRange,
                              context: CanvasRenderingContext2D): ChartConfiguration {
        const coreConfig = this.routeManager.coreConfig.value
        const cryptoSymbole = coreConfig.cryptoSymbol ?? coreConfig.cryptoName
        return this.makeLineChartConfig(metrics, range, false, cryptoSymbole, context)
    }
}
