// SPDX-License-Identifier: Apache-2.0

import {beforeEach, describe, expect, test} from 'vitest'
import {AppStorage} from '@/AppStorage'

describe('AppStorage telemetry policy', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    test('returns null when telemetry policy was never set', () => {
        expect(AppStorage.getAcceptTelemetryPolicy()).toBeNull()
    })

    test('stores and reads telemetry policy from local storage', () => {
        AppStorage.setAcceptTelemetryPolicy(true)

        expect(localStorage.getItem('v1/telemetry_policy')).toBe('accept')
        expect(AppStorage.getAcceptTelemetryPolicy()).toBe(true)

        AppStorage.setAcceptTelemetryPolicy(false)

        expect(localStorage.getItem('v1/telemetry_policy')).toBe('reject')
        expect(AppStorage.getAcceptTelemetryPolicy()).toBe(false)
    })

    test('does not mutate document.cookie when telemetry policy changes', () => {
        const initialBrowserState = document.cookie

        AppStorage.setAcceptTelemetryPolicy(true)

        expect(document.cookie).toBe(initialBrowserState)
    })
})
