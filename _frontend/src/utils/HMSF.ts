// SPDX-License-Identifier: Apache-2.0

export class HMSF {

    public readonly hour: string
    public readonly minute: string
    public readonly second: string
    public readonly fractionalSecond: string
    public readonly dayPeriod: string

    public static forceUTC = false // For unit testing purpose

    public static extract(secondSinceEpoch: number, locale: string): HMSF {

        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
            timeZone: HMSF.forceUTC ? "UTC" : undefined
        }

        const timeFormat = new Intl.DateTimeFormat([locale], timeOptions)
        const secondCount = Math.floor(secondSinceEpoch)
        const secondFrac = secondSinceEpoch - secondCount

        const parts = timeFormat.formatToParts(secondCount * 1000)
        const hourPart = HMSF.findPart(parts, "hour", "?")
        const minutePart = HMSF.findPart(parts, "minute", "?")
        const secondPart = HMSF.findPart(parts, "second", "?")
        const dayPeriodPart = HMSF.findPart(parts, "dayPeriod", "?")

        const fractionalSeconds = secondFrac.toString().concat("00000").slice(2, 6)

        return new HMSF(hourPart, minutePart, secondPart, fractionalSeconds, dayPeriodPart)

    }

    //
    // Private
    //

    private constructor(hour: string, minute: string, second: string, fractionalSecond: string, dayPeriod: string) {
        this.hour = hour
        this.minute = minute
        this.second = second
        this.fractionalSecond = fractionalSecond
        this.dayPeriod = dayPeriod
    }

    private static findPart(parts: Array<Intl.DateTimeFormatPart>, targetPart: Intl.DateTimeFormatPartTypes, fallback: string): string {
        let result: string = fallback
        for (const p of parts) {
            if (p.type == targetPart) {
                result = p.value
            }
        }
        return result
    }

}
