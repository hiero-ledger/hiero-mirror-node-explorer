// SPDX-License-Identifier: Apache-2.0


export enum ChartRange {            // Matching granularity
    day = "day",                    // => hour
    month = "month",                // => day
    year = "year",                  // => month
    all = "all"                     // => year
}

export enum ChartGranularity {
    hour = "hour",
    day = "day",
    month = "month",
    year = "year"
}

export function computeStartDateForRange(period: ChartRange): Date {
    let result: Date
    const now = new Date()
    switch (period) {
        case ChartRange.all: {
            result = new Date(0)
            break
        }
        case ChartRange.year: {
            const y = now.getFullYear()
            const m = now.getMonth()
            result = new Date(y - 1, m)
            break
        }
        case ChartRange.month: {
            result = new Date(now.getTime() - 30 * 24 * 3600 * 1000)
            break
        }
        case ChartRange.day: {
            result = new Date(now.getTime() - 24 * 3600 * 1000)
            break
        }
    }
    return result
}


export function computeGranularityForRange(period: ChartRange): ChartGranularity {
    let result: ChartGranularity
    switch (period) {
        default:
        case ChartRange.all:
            result = ChartGranularity.month
            break
        case ChartRange.year:
            result = ChartGranularity.month
            break
        case ChartRange.month:
            result = ChartGranularity.day
            break
        case ChartRange.day:
            result = ChartGranularity.hour
            break
    }
    return result
}

