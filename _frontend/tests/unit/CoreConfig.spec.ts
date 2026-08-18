// SPDX-License-Identifier: Apache-2.0

import {afterEach, describe, expect, test} from 'vitest'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import {CoreConfig} from '@/config/CoreConfig'

describe('CoreConfig cookies dialog content', () => {
    const mock = new MockAdapter(axios as any)

    afterEach(() => {
        mock.reset()
    })

    test('loads cookiesDialogContent from core config', async () => {
        mock.onGet('/core-config-cookies.json').reply(200, {
            cookiesDialogContent: '<p>Cookies text</p>'
        })

        const config = await CoreConfig.load('/core-config-cookies.json')

        expect(config.cookiesDialogContent).toBe('<p>Cookies text</p>')
    })

    test('returns null when cookiesDialogContent is absent', async () => {
        mock.onGet('/core-config-without-cookies.json').reply(200, {
            productName: 'Explorer'
        })

        const config = await CoreConfig.load('/core-config-without-cookies.json')

        expect(config.cookiesDialogContent).toBeNull()
    })

    test('handles explicit null cookiesDialogContent', async () => {
        mock.onGet('/core-config-null-cookies.json').reply(200, {
            cookiesDialogContent: null
        })

        const config = await CoreConfig.load('/core-config-null-cookies.json')

        expect(config.cookiesDialogContent).toBeNull()
    })
})
