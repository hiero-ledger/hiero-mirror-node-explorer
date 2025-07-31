// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {aliasToBase32, base32ToAlias, byteToHex, hexToByte} from "@/utils/B64Utils";

describe("B64Utils.ts", () => {

    const hexString = "12200000fc0634e2ab455eff393f04819efa262fe5e6ab1c7ed1d4f85fbcd8e6e296"
    const base32String = "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ"


    test("hexToByte() <=> byteToHex()", () => {
        const decodedBytes = hexToByte(hexString)
        expect(decodedBytes).not.toBeNull()
        const hexString2 = decodedBytes ? byteToHex(decodedBytes) : ""
        expect(hexString2).toEqual(hexString)
    })

    test("hexToByte() <=> byteToHex()   with 0x prefix", () => {
        const decodedBytes = hexToByte("0x" + hexString)
        expect(decodedBytes).not.toBeNull()
        const hexString2 = decodedBytes ? byteToHex(decodedBytes) : ""
        expect(hexString2).toEqual(hexString)
    })

    test("aliasToBase32()", () => {

        const decodedBytes = hexToByte(hexString)
        expect(decodedBytes).not.toBeNull()

        const encodedString = decodedBytes ? aliasToBase32(decodedBytes) : ""
        expect(encodedString).toEqual(base32String)
    })


    test("base32ToAlias", () => {

        const decodedBytes = base32ToAlias(base32String)
        expect(decodedBytes).not.toBeNull()

        const decodedHex = byteToHex(decodedBytes!)
        expect(decodedHex).toEqual(hexString)
    })

})

