// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import {isValidSignatureRecord, SignatureCache, SignatureRecord, SignatureResponse} from '@/utils/cache/SignatureCache'

describe('SignatureCache', () => {
    test('returns the API response payload and keeps the records intact', async () => {
        SignatureCache.instance.clear()

        const mock = new MockAdapter(axios as any)
        mock.onGet(SAMPLE_QUERY).reply(200, SAMPLE_RESPONSE_DATA)

        const cached = await SignatureCache.instance.lookup(SAMPLE_HEX_SIGNATURE)

        expect(cached).toStrictEqual(SAMPLE_RESPONSE_DATA)

        mock.restore()
    })

    test('returns the API response payload but evict forged records', async () => {
        SignatureCache.instance.clear()

        const mock = new MockAdapter(axios as any)
        mock.onGet(SAMPLE_QUERY).reply(200, FORGED_RESPONSE_DATA)

        const cached = await SignatureCache.instance.lookup(SAMPLE_HEX_SIGNATURE)

        expect(cached).toStrictEqual(SAMPLE_RESPONSE_DATA) // Forged records has been evicted

        mock.restore()
    })

    test('isValidSignatureRecord', () => {
        for (const r of SAMPLE_RESPONSE_DATA.results) {
            expect(isValidSignatureRecord(r, SAMPLE_HEX_SIGNATURE)).toBe(true)
        }
        expect(isValidSignatureRecord(FORGED_RECORD_1, SAMPLE_HEX_SIGNATURE)).toBe(false)
        expect(isValidSignatureRecord(FORGED_RECORD_2, SAMPLE_HEX_SIGNATURE)).toBe(false)
    })
})

//
// curl 'https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=a9059cbb'
//
// as of 2026/11/27
//

const SAMPLE_HEX_SIGNATURE = "0xa9059cbb"
const SAMPLE_QUERY = "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=" + SAMPLE_HEX_SIGNATURE
const SAMPLE_RESPONSE_DATA: SignatureResponse = {
    "count": 6,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1111734,
            "created_at": "2023-12-27T03:30:48.233282Z",
            "text_signature": "workMyDirefulOwner(uint256,uint256)",
            "hex_signature": "0xa9059cbb",
            "bytes_signature": "©\u0005»"
        },
        {
            "id": 844280,
            "created_at": "2022-08-26T12:20:41.369990Z",
            "text_signature": "join_tg_invmru_haha_fd06787(address,bool)",
            "hex_signature": "0xa9059cbb",
            "bytes_signature": "©\u0005»"
        },
        {
            "id": 313067,
            "created_at": "2021-10-20T05:29:13.555535Z",
            "text_signature": "func_2093253501(bytes)",
            "hex_signature": "0xa9059cbb",
            "bytes_signature": "©\u0005»"
        },
        {
            "id": 161159,
            "created_at": "2019-03-22T19:13:17.314877Z",
            "text_signature": "transfer(bytes4[9],bytes5[6],int48[11])",
            "hex_signature": "0xa9059cbb",
            "bytes_signature": "©\u0005»"
        },
        {
            "id": 31780,
            "created_at": "2018-05-11T08:39:29.708250Z",
            "text_signature": "many_msg_babbage(bytes1)",
            "hex_signature": "0xa9059cbb",
            "bytes_signature": "©\u0005»"
        },
        {
            "id": 145,
            "created_at": "2016-07-09T03:58:28.234977Z",
            "text_signature": "transfer(address,uint256)",
            "hex_signature": "0xa9059cbb",
            "bytes_signature": "©\u0005»"
        }
    ]
}

const FORGED_RECORD_1: SignatureRecord = {
    "id": 999998,
    "created_at": "2016-07-09T03:58:28.234977Z",
    "text_signature": "forgedSignature(uint256)", // Does not match hex_signature
    "hex_signature": "0xa9059cbb",
    "bytes_signature": "©\u0005»"
}

const FORGED_RECORD_2: SignatureRecord = {
    "id": 999999,
    "created_at": "2026-11-27T13:12:34.009466Z",
    "text_signature": "lotsOf(address)",
    "hex_signature": "0x9374ae94", // Does not match 0xa9059cbb
    "bytes_signature": "t®"
}

const FORGED_RESPONSE_DATA: SignatureResponse = {
    "count": SAMPLE_RESPONSE_DATA.count + 1,
    "next": null,
    "previous": null,
    "results": [
        ...SAMPLE_RESPONSE_DATA.results,
        // We add tow forged records
        FORGED_RECORD_1,
        FORGED_RECORD_2
    ]
}
