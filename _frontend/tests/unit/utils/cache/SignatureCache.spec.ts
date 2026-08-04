// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {SignatureCache} from '@/utils/cache/SignatureCache'

const buildResponse = () => ({
    count: 2,
    next: null,
    previous: null,
    results: [
        {id: 31780, created_at: '', text_signature: 'many_msg_babbage(bytes1)', hex_signature: '0x', bytes_signature: ''},
        {id: 145, created_at: '', text_signature: 'transfer(address,uint256)', hex_signature: '0xa9059cbb', bytes_signature: ''},
    ],
})

describe('SignatureCache', () => {
    test('returns the API response payload and keeps the records intact', async () => {
        SignatureCache.instance.clear()

        const mock = new MockAdapter(axios as any)
        const response = buildResponse()
        const matcher = 'https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=a9059cbb'
        mock.onGet(matcher).reply(200, response)

        const cached = await SignatureCache.instance.lookup('a9059cbb')

        expect(cached).toStrictEqual(response)
        expect(cached?.results.map((record) => record.id)).toStrictEqual([31780, 145])

        mock.restore()
    })
})
