// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {TransactionID} from "@/utils/TransactionID";

describe("TransactionID.ts", () => {

    const dashForm = "0.0.88-1640084590-665216882"
    const atForm = "0.0.88@1640084590.665216882"

    //
    // TransactionID.parse()
    //

    test("0.0.88-1640084590-665216882", () => {
        const str = "0.0.88-1640084590-665216882"
        const obj = TransactionID.parse(str)
        expect(obj?.entityID.shard).toBe(0)
        expect(obj?.entityID.realm).toBe(0)
        expect(obj?.entityID.num).toBe(88)
        expect(obj?.seconds).toBe(1640084590)
        expect(obj?.nanoSeconds).toBe(665216882)
        expect(obj?.queryParam).toBeNull()
        expect(obj?.toString(false)).toBe(str)
    })

    test("0.0.88@1640084590.665216882", () => {
        const str = "0.0.88@1640084590.665216882"
        const obj = TransactionID.parse(str)
        expect(obj?.entityID.shard).toBe(0)
        expect(obj?.entityID.realm).toBe(0)
        expect(obj?.entityID.num).toBe(88)
        expect(obj?.seconds).toBe(1640084590)
        expect(obj?.nanoSeconds).toBe(665216882)
        expect(obj?.queryParam).toBeNull()
        expect(obj?.toString(true)).toBe(str)
    })

    test("0.0.88@1640084590 (without autocomplete)", () => {
        const str = "0.0.88@1640084590"
        const obj = TransactionID.parse(str) // autocomplete
        expect(obj).toBeNull()
    })

    test("0.0.88@1640084590 (with autocomplete)", () => {
        const str = "0.0.88@1640084590"
        const obj = TransactionID.parse(str, true)
        expect(obj?.entityID.shard).toBe(0)
        expect(obj?.entityID.realm).toBe(0)
        expect(obj?.entityID.num).toBe(88)
        expect(obj?.seconds).toBe(1640084590)
        expect(obj?.nanoSeconds).toBe(0)
        expect(obj?.queryParam).toBeNull()
        expect(obj?.toString(true)).toBe(str + ".000000000")
    })

    test("0.0.88@1640084590.665216882?scheduled", () => {
        const str = "0.0.88@1640084590.665216882?scheduled"
        const obj = TransactionID.parse(str)
        expect(obj?.entityID.shard).toBe(0)
        expect(obj?.entityID.realm).toBe(0)
        expect(obj?.entityID.num).toBe(88)
        expect(obj?.seconds).toBe(1640084590)
        expect(obj?.nanoSeconds).toBe(665216882)
        expect(obj?.queryParam).toBe("scheduled")
        expect(obj?.toString(true, true)).toBe(str)
    })

    test("00881640084590665216882", () => {
        const obj = TransactionID.parse("00881640084590665216882")
        expect(obj?.entityID.shard).toBe(0)
        expect(obj?.entityID.realm).toBe(0)
        expect(obj?.entityID.num).toBe(88)
        expect(obj?.seconds).toBe(1640084590)
        expect(obj?.nanoSeconds).toBe(665216882)
        expect(obj?.queryParam).toBeNull()
        expect(obj?.toString(true)).toBe("0.0.88@1640084590.665216882")
    })

    test("invalid ids", () => {
        expect(TransactionID.parse("abc")).toBeNull()
        expect(TransactionID.parse("0.0.88-abc")).toBeNull()
        expect(TransactionID.parse("0.0.88-12-abc")).toBeNull()
        expect(TransactionID.parse("0.0.88-12-12-13")).toBeNull()
        expect(TransactionID.parse("0.0.88@abc")).toBeNull()
        expect(TransactionID.parse("0.0.88@12.abc")).toBeNull()
        expect(TransactionID.parse("0.0.88@12.12.14")).toBeNull()
        expect(TransactionID.parse("0.0.88@1640084590.665216882?dummy")).toBeNull()
        expect(TransactionID.parse("001640084590665216882")).toBeNull()
        expect(TransactionID.parse("11881640084590665216882")).toBeNull()
    })

    //
    // TransactionID.normalize()
    //

    test("normalize", () => {
        expect(TransactionID.normalize(atForm)).toBe(dashForm)
        expect(TransactionID.normalize(atForm, false)).toBe(dashForm)
        expect(TransactionID.normalize(atForm, true)).toBe(atForm)

        expect(TransactionID.normalize(dashForm)).toBe(dashForm)
        expect(TransactionID.normalize(dashForm, false)).toBe(dashForm)
        expect(TransactionID.normalize(dashForm, true)).toBe(atForm)
    })

    //
    // TransactionID.normalizeForDisplay()
    //

    test("normalizeForDisplay", () => {
        expect(TransactionID.normalizeForDisplay(dashForm)).toBe(atForm)
        TransactionID.setUseAtForm(false)
        expect(TransactionID.normalizeForDisplay(dashForm)).toBe(dashForm)
        TransactionID.setUseAtForm(true)
        expect(TransactionID.normalizeForDisplay(dashForm)).toBe(atForm)

        expect(TransactionID.normalizeForDisplay(atForm)).toBe(atForm)
        TransactionID.setUseAtForm(false)
        expect(TransactionID.normalizeForDisplay(atForm)).toBe(dashForm)
        TransactionID.setUseAtForm(true)
        expect(TransactionID.normalizeForDisplay(atForm)).toBe(atForm)
    })

    //
    // TransactionID.makePayerID()
    //

    test("makePayerID", () => {
        const str1 = "0.0.88-1640084590-665216882"
        const str2 = "0.0.88@1640084590.665216882"
        const payerId = "0.0.88"
        expect(TransactionID.makePayerID(str1)).toBe(payerId)
        expect(TransactionID.makePayerID(str2)).toBe(payerId)
    })
})
