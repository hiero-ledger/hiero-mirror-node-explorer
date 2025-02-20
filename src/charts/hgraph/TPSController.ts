/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {ThemeController} from "@/components/ThemeController.ts";
import {RouteManager} from "@/utils/RouteManager.ts";
import {GenericMetricController} from "@/charts/hgraph/GenericMetricController.ts";
import {averageMetrics, EcosystemMetric} from "@/charts/hgraph/EcosystemMetric.ts";
import {ChartRange, computeGranularityForRange} from "@/charts/core/ChartController.ts";
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

    protected transformMetrics(metrics: EcosystemMetric[], range: ChartRange): EcosystemMetric[] {
        const granularity = computeGranularityForRange(range)
        return averageMetrics(metrics, granularity)
    }

    protected makeChartConfig(metrics: EcosystemMetric[], range: ChartRange): ChartConfiguration {
        return this.makeBarChartConfig(metrics, range, true, "tx / second")
    }
}
