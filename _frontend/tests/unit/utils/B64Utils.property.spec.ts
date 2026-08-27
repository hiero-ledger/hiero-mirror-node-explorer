// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import fc from 'fast-check'
import {aliasToBase32, base32ToAlias, base64Decode, base64Encode, byteToHex, hexToByte} from "@/utils/B64Utils";

describe("B64Utils.ts (property-based)", () => {

    const bytes = fc.uint8Array({maxLength: 256})

    test("hexToByte() <=> byteToHex()", () => {
        fc.assert(
            fc.property(bytes, (b) => {
                const hex = byteToHex(b)
                expect(hex.length).toBe(b.length * 2)
                expect(hex).toMatch(/^[0-9a-f]*$/)
                expect(hexToByte(hex)).toEqual(b)
                expect(hexToByte("0x" + hex)).toEqual(b)
            })
        )
    })

    test("base64Decode() <=> base64Encode()", () => {
        fc.assert(
            fc.property(bytes, (b) => {
                expect(base64Decode(base64Encode(b))).toEqual(b)
            })
        )
    })

    test("base32ToAlias() <=> aliasToBase32()", () => {
        fc.assert(
            fc.property(bytes, (b) => {
                const base32 = aliasToBase32(b)
                expect(base32).toMatch(/^[A-Z2-7]*$/)
                expect(base32ToAlias(base32)).toEqual(b)
            })
        )
    })
})
