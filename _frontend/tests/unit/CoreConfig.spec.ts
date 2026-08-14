// SPDX-License-Identifier: Apache-2.0

import {afterEach, describe, expect, test} from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {CoreConfig} from '@/config/CoreConfig'

describe('CoreConfig telemetry dialog content', () => {
    const mock = new MockAdapter(axios as any)

    afterEach(() => {
        mock.reset()
    })

    test('loads cookiesDialogContent from core config', async () => {
        mock.onGet('/core-config-telemetry.json').reply(200, {
            cookiesDialogContent: '<p>Telemetry text</p>'
        })

        const config = await CoreConfig.load('/core-config-telemetry.json')

        expect(config.cookiesDialogContent).toBe('<p>Telemetry text</p>')
    })

    test('falls back to cookiesDialogContent when cookiesDialogContent is absent', async () => {
        mock.onGet('/core-config-cookies.json').reply(200, {
            cookiesDialogContent: '<p>Legacy telemetry text</p>'
        })

        const config = await CoreConfig.load('/core-config-cookies.json')

        expect(config.cookiesDialogContent).toBe('<p>Legacy telemetry text</p>')
    })

    test('returns null when cookiesDialogContent is absent', async () => {
        mock.onGet('/core-config-without-telemetry.json').reply(200, {
            productName: 'Explorer'
        })

        const config = await CoreConfig.load('/core-config-without-telemetry.json')

        expect(config.cookiesDialogContent).toBeNull()
    })

    test('handles explicit null cookiesDialogContent', async () => {
        mock.onGet('/core-config-null-telemetry.json').reply(200, {
            cookiesDialogContent: null
        })

        const config = await CoreConfig.load('/core-config-null-telemetry.json')

        expect(config.cookiesDialogContent).toBeNull()
    })
})
