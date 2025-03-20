// SPDX-License-Identifier: Apache-2.0

import {ChartController, LoadedData} from "@/charts/core/ChartController.ts";
import {ChartGranularity, ChartRange, computeGranularityForRange} from "@/charts/core/ChartRange.ts";
import {aggregateMetrics, EcosystemMetric, getEndDate, getStartDate} from "@/charts/hgraph/EcosystemMetric.ts";
import axios, {AxiosRequestConfig} from "axios";
import {ChartConfiguration} from "chart.js";

export abstract class HgraphChartController extends ChartController<EcosystemMetric> {

    //
    // Protected (to be subclassed)
    //

    protected abstract makeQuery(range: ChartRange): string

    protected abstract makeLatestQuery(): string


    //
    // Protected (tools for subclasses)
    //

    protected makeBarChartConfig(metrics: EcosystemMetric[], range: ChartRange,
                                 logarithmic: boolean, yLabel: string | null,
                                 context: CanvasRenderingContext2D): ChartConfiguration {
        const granularity = computeGranularityForRange(range)
        const graphLabels = makeGraphLabels(metrics, granularity)
        const graphDataSet = this.makeBarGraphDataSet(metrics, context) as any
        const textPrimaryColor = this.themeController.getTextPrimaryColor()
        const textSecondaryColor = this.themeController.getTextSecondaryColor()
        const yScaleType = logarithmic ? "logarithmic" : "linear"

        return {
            type: 'bar',
            data: {
                labels: graphLabels,
                datasets: [graphDataSet],
            },
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textPrimaryColor
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        type: yScaleType,
                        ticks: {
                            color: textPrimaryColor
                        },
                        grid: {
                            display: false
                        },
                        beginAtZero: true,
                        title: {
                            display: yLabel !== null,
                            text: yLabel ?? "",
                            color: textSecondaryColor
                        },
                    }
                },
                maintainAspectRatio: false
            }
        }
    }

    protected makeLineChartConfig(metrics: EcosystemMetric[], range: ChartRange,
                                  logarithmic: boolean, yLabel: string | null,
                                  context: CanvasRenderingContext2D): ChartConfiguration {
        const granularity = computeGranularityForRange(range)
        const graphLabels = makeGraphLabels(metrics, granularity)
        const graphDataSet = this.makeLineGraphDataSet(metrics, context) as any
        const textPrimaryColor = this.themeController.getTextPrimaryColor()
        const textSecondaryColor = this.themeController.getTextSecondaryColor()
        const yScaleType = logarithmic ? "logarithmic" : "linear"

        return {
            type: 'line',
            data: {
                labels: graphLabels,
                datasets: [graphDataSet],
            },
            options: {
                elements: {
                  line: {
                      tension: 0.4,
                      cubicInterpolationMode: "default",
                      // cubicInterpolationMode: "monotone",
                  }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textPrimaryColor
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        type: yScaleType,
                        ticks: {
                            color: textPrimaryColor
                        },
                        grid: {
                            display: false
                        },
                        beginAtZero: true,
                        title: {
                            display: yLabel !== null,
                            text: yLabel ?? "",
                            color: textSecondaryColor
                        },
                    }
                },
                maintainAspectRatio: false
            }
        }
    }

    protected makeBarGraphDataSet(metrics: EcosystemMetric[],
                                  context: CanvasRenderingContext2D): object {
        const totals = metrics.map((m: EcosystemMetric) => m.total)
        const graphBarColor = this.themeController.getGraphBarColor()
        return {
            label: this.chartTitle,
            data: totals,
            borderWidth: 1,
            borderColor: graphBarColor,
            backgroundColor: graphBarColor
        }
    }

    protected makeLineGraphDataSet(metrics: EcosystemMetric[],
                                   context: CanvasRenderingContext2D): object {
        const totals = metrics.map((m: EcosystemMetric) => m.total)
        const graphLineColor = this.themeController.getGraphLineColor()
        const gradient = context.createLinearGradient(0, 0, 0, 300)
        const startColor = this.themeController.getGraphGradientStartColor()
        const endColor = this.themeController.getGraphGradientEndColor()
        gradient.addColorStop(0, startColor)
        gradient.addColorStop(1, endColor)
        return {
            label: this.chartTitle,
            data: totals,
            borderWidth: 1,
            borderColor: graphLineColor,
            pointBackgroundColor: graphLineColor,
            backgroundColor: gradient,
            fill: true,
        }
    }

    //
    // ChartController
    //

    public isSupported(): boolean {
        return this.routeManager.hgraphURL.value !== null
    }

    public getMetricDate(metric: EcosystemMetric): Date | null {
        return getEndDate(metric) ?? getStartDate(metric)
    }

    protected async transformMetrics(metrics: EcosystemMetric[], range: ChartRange): Promise<EcosystemMetric[]> {
        const result = aggregateMetrics(metrics, computeGranularityForRange(range))
        return Promise.resolve(result)
    }

    protected async loadData(range: ChartRange): Promise<LoadedData<EcosystemMetric>> {
        let result: LoadedData<EcosystemMetric>

        const url = this.routeManager.hgraphURL.value
        if (url !== null) {

            // Target metrics
            const query = this.makeQuery(range)
            const metrics = await this.runQuery(url, query)

            // Latest metric available
            const latestQuery = this.makeLatestQuery()
            const latestMetrics = await this.runQuery(url, latestQuery)
            const latestMetric = latestMetrics && latestMetrics.length >= 1 ? latestMetrics[0] : null

            result = new LoadedData(metrics, latestMetric)
        } else {
            result = new LoadedData([], null)
        }

        return Promise.resolve(result)
    }

    //
    // Private
    //

    private makeConfig(): AxiosRequestConfig {
        let result: AxiosRequestConfig
        const hgraphKey = this.routeManager.hgraphKey.value
        if (hgraphKey !== null) {
            result = {
                headers: {
                    "X-API-KEY": hgraphKey
                }
            }
        } else {
            result = {}
        }
        return result
    }


    private async runQuery(url: string, query: string): Promise<EcosystemMetric[]> {
        let result: EcosystemMetric[]

        const config = this.makeConfig()
        const response = await axios.post<GraphQLResponse>(url, {query}, config)
        if (response.status === 200 && typeof response.data === "object" && response.data !== null) {
            if (response.data.data) {
                result = response.data.data.all_metrics ?? []
            } else {
                const errors = response.data.errors ?? []
                const error = errors.length >= 1 ? errors[0] : null
                throw error ?? "GraphQL query failed"
            }
        } else {
            throw "HTTP Error " + response.status
        }

        return Promise.resolve(result)
    }
}

interface GraphQLResponse {
    data?: {
        all_metrics?: EcosystemMetric[]
    }
    errors?: unknown[]
}

export function makeGraphLabels(metrics: EcosystemMetric[], granularity: ChartGranularity): string[] {
    const result: string[] = []
    for (const m of metrics) {
        const t = Date.parse(m.start_date)
        if (isNaN(t)) {
            result.push(m.start_date)
        } else {
            switch (granularity) {
                case ChartGranularity.hour:
                    result.push(hourFormat.format(t))
                    break
                case ChartGranularity.day:
                    result.push(dayFormat.format(t))
                    break
                case ChartGranularity.month:
                    result.push(monthFormat.format(t))
                    break
                case ChartGranularity.year:
                    result.push(yearFormat.format(t))
                    break
            }
        }
    }
    return result
}

const hourFormat = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    weekday: "short"
})

const dayFormat = new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
})

const monthFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
})

const yearFormat = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
})
