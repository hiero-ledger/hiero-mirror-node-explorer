// SPDX-License-Identifier: Apache-2.0

import {beforeEach, describe, expect, test} from 'vitest'
import {AppStorage} from '@/AppStorage'

describe('AppStorage cookies policy', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    test('returns null when cookies policy was never set', () => {
        expect(AppStorage.getAcceptCookiesPolicy()).toBeNull()
    })

    test('stores and reads cookies policy from local storage', () => {
        AppStorage.setAcceptCookiesPolicy(true)

        expect(localStorage.getItem('v1/cookies_policy')).toBe('accept')
        expect(AppStorage.getAcceptCookiesPolicy()).toBe(true)

        AppStorage.setAcceptCookiesPolicy(false)

        expect(localStorage.getItem('v1/cookies_policy')).toBe('reject')
        expect(AppStorage.getAcceptCookiesPolicy()).toBe(false)
    })

    test('does not mutate document.cookie when cookies policy changes', () => {
        const initialBrowserState = document.cookie

        AppStorage.setAcceptCookiesPolicy(true)

        expect(document.cookie).toBe(initialBrowserState)
    })
})
