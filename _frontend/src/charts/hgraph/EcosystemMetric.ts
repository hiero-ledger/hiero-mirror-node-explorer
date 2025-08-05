// SPDX-License-Identifier: Apache-2.0


import {ChartGranularity, ChartRange, computeStartDateForRange} from "@/charts/core/ChartRange.ts";

export interface EcosystemMetric {
    start_date: string,
    end_date: string | null,
    total: number
}

export function makeLatestQuery(metricName: string): string {
    return "{" +
        "  all_metrics: ecosystem_metric(" +
        "    where: {" +
        "      name: {_eq: \"" + metricName + "\"}, " +
        "      period: {_eq: \"hour\"}," +
        "    }" +
        "    order_by: {start_date: desc}" +
        "    limit: 1" +
        "  ) {" +
        "    start_date" +
        "    end_date" +
        "    total" +
        "  }" +
        "}"
}

export function filterMetrics(rawMetrics: EcosystemMetric[], range: ChartRange): EcosystemMetric[] {
    const result: EcosystemMetric[] = []

    const startTime = computeStartDateForRange(range).getTime()
    for (const m of rawMetrics.reverse()) {
        const metricDate = getEndDate(m)
        if (metricDate !== null && metricDate.getTime() >= startTime) {
            result.push(m)
        } else {
            break
        }
    }

    return result.reverse()
}

export function aggregateMetrics(rawMetrics: EcosystemMetric[], granularity: ChartGranularity): EcosystemMetric[] {
    let result: EcosystemMetric[]
    switch (granularity) {
        case ChartGranularity.hour:
            result = rawMetrics
            break
        case ChartGranularity.day:
            result = aggregateMetricsByDay(rawMetrics)
            break
        case ChartGranularity.month:
            result = aggregateMetricsByMonth(rawMetrics)
            break
        case ChartGranularity.year:
            result = aggregateMetricsByYear(rawMetrics)
            break
    }
    return result
}

export function averageMetrics(rawMetrics: EcosystemMetric[], granularity: ChartGranularity): EcosystemMetric[] {
    let result: EcosystemMetric[]
    switch (granularity) {
        case ChartGranularity.hour:
            result = rawMetrics
            break
        case ChartGranularity.day:
            result = averageMetricsByDay(rawMetrics)
            break
        case ChartGranularity.month:
            result = averageMetricsByMonth(rawMetrics)
            break
        case ChartGranularity.year:
            result = averageMetricsByYear(rawMetrics)
            break
    }
    return result
}

export function selectMetrics(rawMetrics: EcosystemMetric[], granularity: ChartGranularity): EcosystemMetric[] {
    let result: EcosystemMetric[]
    switch (granularity) {
        case ChartGranularity.hour:
            result = rawMetrics
            break
        case ChartGranularity.day:
            result = selectMetricsByDay(rawMetrics)
            break
        case ChartGranularity.month:
            result = selectMetricsByMonth(rawMetrics)
            break
        case ChartGranularity.year:
            result = selectMetricsByYear(rawMetrics)
            break
    }
    return result
}

export function getStartDate(metric: EcosystemMetric): Date | null {
    const startTime = Date.parse(metric.start_date)
    return isNaN(startTime) ? null : new Date(startTime)
}

export function getEndDate(metric: EcosystemMetric): Date | null {
    let result: Date | null
    if (metric.end_date !== null) {
        const endTime = Date.parse(metric.end_date)
        result = isNaN(endTime) ? null : new Date(endTime)
    } else {
        result = null
    }
    return result
}

//
// export function getTimeRange(metric: EcosystemMetric): number|null {
//     let result: number|null
//     if (metric.end_date !== null) {
//         const startTime = Date.parse(metric.start_date)
//         const endTime = Date.parse(metric.end_date)
//         if (isNaN(startTime) || isNaN(endTime)) {
//             result = null
//         } else {
//             result = endTime - startTime
//         }
//     } else {
//         result = null
//     }
//     return result
// }

//
// Private (aggregate)
//

function aggregateMetricsByDay(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startDay = getDayFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getDayFromDate(rawMetrics[i].start_date) === startDay) {
            i += 1
        }
        result.push(aggregateMetricSegment(rawMetrics, startIndex, i))
    }
    return result
}

function aggregateMetricsByMonth(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startMonth = getMonthFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getMonthFromDate(rawMetrics[i].start_date) === startMonth) {
            i += 1
        }
        result.push(aggregateMetricSegment(rawMetrics, startIndex, i))
    }
    return result
}

function aggregateMetricsByYear(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startYear = getYearFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getYearFromDate(rawMetrics[i].start_date) === startYear) {
            i += 1
        }
        result.push(aggregateMetricSegment(rawMetrics, startIndex, i))
    }
    return result
}

function aggregateMetricSegment(rawMetrics: EcosystemMetric[], startIndex: number, endIndex: number): EcosystemMetric {
    let aggregatedTotal = 0
    for (let i = startIndex; i < endIndex; i += 1) {
        aggregatedTotal += rawMetrics[i].total
    }
    return {
        start_date: rawMetrics[startIndex].start_date,
        end_date: rawMetrics[endIndex - 1].end_date,
        total: aggregatedTotal
    }
}

//
// Private (average)
//

function averageMetricsByDay(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startDay = getDayFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getDayFromDate(rawMetrics[i].start_date) === startDay) {
            i += 1
        }
        result.push(averageMetricSegment(rawMetrics, startIndex, i))
    }
    return result
}

function averageMetricsByMonth(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startMonth = getMonthFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getMonthFromDate(rawMetrics[i].start_date) === startMonth) {
            i += 1
        }
        result.push(averageMetricSegment(rawMetrics, startIndex, i))
    }
    return result
}

function averageMetricsByYear(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startYear = getYearFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getYearFromDate(rawMetrics[i].start_date) === startYear) {
            i += 1
        }
        result.push(averageMetricSegment(rawMetrics, startIndex, i))
    }
    return result
}


function averageMetricSegment(rawMetrics: EcosystemMetric[], startIndex: number, endIndex: number): EcosystemMetric {
    const result = aggregateMetricSegment(rawMetrics, startIndex, endIndex)
    result.total /= (endIndex - startIndex)
    return result
}


//
// Private (selectMetrics)
//

function selectMetricsByDay(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startDay = getDayFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getDayFromDate(rawMetrics[i].start_date) === startDay) {
            i += 1
        }
        result.push(rawMetrics[i - 1])
    }
    return result
}

function selectMetricsByMonth(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startMonth = getMonthFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getMonthFromDate(rawMetrics[i].start_date) === startMonth) {
            i += 1
        }
        result.push(rawMetrics[i - 1])
    }
    return result
}

function selectMetricsByYear(rawMetrics: EcosystemMetric[]): EcosystemMetric[] {
    const result: EcosystemMetric[] = []
    let i = 0
    while (i < rawMetrics.length) {
        const startIndex = i
        const startYear = getYearFromDate(rawMetrics[startIndex].start_date)
        i += 1
        while (i < rawMetrics.length && getYearFromDate(rawMetrics[i].start_date) === startYear) {
            i += 1
        }
        result.push(rawMetrics[i - 1])
    }
    return result
}


//
// Private
//

export function getDayFromDate(date: string): number | null {
    const t = Date.parse(date)
    const d = isNaN(t) ? null : new Date(t)
    return d !== null ? d.getDate() : null
}

export function getMonthFromDate(date: string): number | null {
    const t = Date.parse(date)
    const d = isNaN(t) ? null : new Date(t)
    return d !== null ? d.getMonth() : null
}

export function getYearFromDate(date: string): number | null {
    const t = Date.parse(date)
    const d = isNaN(t) ? null : new Date(t)
    return d !== null ? d.getFullYear() : null
}
