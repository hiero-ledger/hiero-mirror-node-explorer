// SPDX-License-Identifier: Apache-2.0

export class Duration {

    public readonly years: number
    public readonly days: number
    public readonly hours: number
    public readonly minutes: number
    public readonly seconds: number

    public constructor(years: number, days: number, hours: number, minutes: number, seconds: number) {
        this.years = years
        this.days = days
        this.hours = hours
        this.minutes = minutes
        this.seconds = seconds
    }

    public static decompose(seconds: number): Duration {

        const years = Math.floor(seconds / 31536000)
        seconds -= years * 31536000

        const days = Math.floor(seconds / 86400)
        seconds -= days * 86400

        const hours = Math.floor(seconds / 3600)
        seconds -= hours * 3600

        const minutes = Math.floor(seconds / 60)
        seconds -= minutes * 60

        return new Duration(years, days, hours, minutes, seconds)
    }
}

export function formatSeconds(secondCount: number | string | undefined): string {
    let result: string

    if (secondCount) {
        const seconds = typeof secondCount == "number" ? secondCount : Number.parseInt(secondCount)
        if (isNaN(seconds)) {
            result = secondCount.toString()
        } else {
            const duration = Duration.decompose(seconds)
            result = ""
            if (duration.years >= 2) {
                const yearUnit = (!duration.days && !duration.hours && !duration.minutes && !duration.seconds) ? " years" : "y "
                result = duration.years + yearUnit
            } else if (duration.years == 1) {
                result = (!duration.days && !duration.hours && !duration.minutes && !duration.seconds) ? "365 days" : "1y "
            }
            if (duration.days >= 2) {
                const dayUnit = (!duration.years && !duration.hours && !duration.minutes && !duration.seconds) ? " days" : "d "
                result += duration.days + dayUnit
            } else if (duration.days == 1) {
                result = (!duration.years && !duration.hours && !duration.minutes && !duration.seconds) ? "24h" : "1d "
            }
            if (duration.hours) {
                result += duration.hours + "h "
            }
            if (duration.minutes) {
                result += duration.minutes + "min "
            }
            if (duration.seconds) {
                result += duration.seconds + "s "
            }
            result = result.trim()
        }
    } else {
        result = ""
    }
    return result
}
