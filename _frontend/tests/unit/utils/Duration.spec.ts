// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {Duration, formatSeconds} from "@/utils/Duration";

describe("Duration.ts", () => {

    test("42 days 21 hours 42 minutes 42 seconds", () => {
        const seconds = 42
        const minutes = 42
        const hours = 21
        const days = 42
        const secondCount = seconds + 60 * minutes + 3600 * hours + 3600 * 24 * days
        const durationText = "42d 21h 42min 42s"

        const d = Duration.decompose(secondCount)
        expect(d.seconds).toBe(seconds)
        expect(d.minutes).toBe(minutes)
        expect(d.hours).toBe(hours)
        expect(d.days).toBe(days)
        expect(formatSeconds(secondCount)).toBe(durationText)
        expect(formatSeconds(secondCount.toString())).toBe(durationText)
    })

    test("42 days 42 seconds", () => {
        const seconds = 42
        const days = 42
        const secondCount = seconds + 3600 * 24 * days
        const durationText = "42d 42s"

        const d = Duration.decompose(secondCount)
        expect(d.seconds).toBe(seconds)
        expect(d.minutes).toBe(0)
        expect(d.hours).toBe(0)
        expect(d.days).toBe(days)
        expect(formatSeconds(secondCount)).toBe(durationText)
        expect(formatSeconds(secondCount.toString())).toBe(durationText)
    })

    test("1 day 1 hour 1 minute 1 second", () => {
        const seconds = 1
        const minutes = 1
        const hours = 1
        const days = 1
        const secondCount = seconds + 60 * minutes + 3600 * hours + 3600 * 24 * days
        const durationText = "1d 1h 1min 1s"

        const d = Duration.decompose(secondCount)
        expect(d.seconds).toBe(seconds)
        expect(d.minutes).toBe(minutes)
        expect(d.hours).toBe(hours)
        expect(d.days).toBe(days)
        expect(formatSeconds(secondCount)).toBe(durationText)
        expect(formatSeconds(secondCount.toString())).toBe(durationText)
    })

    test("invalid or undefined", () => {
        const invalidValue = "ben voila"
        expect(formatSeconds(invalidValue)).toBe(invalidValue)
        expect(formatSeconds(undefined)).toBe("")
    })

})
