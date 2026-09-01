// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import fc from 'fast-check'
import {EntityID} from "@/utils/EntityID";

describe("EntityID.ts (property-based)", () => {

    const component = fc.integer({min: 0, max: EntityID.MAX_INT - 1})
    const checksum = fc.array(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyz"), {minLength: 5, maxLength: 5})
        .map(letters => letters.join(""))

    test("parse() <=> toString()", () => {
        fc.assert(
            fc.property(component, component, component, (shard, realm, num) => {
                const str = shard + "." + realm + "." + num
                const obj = EntityID.parse(str)
                expect(obj).not.toBeNull()
                expect(obj?.shard).toBe(shard)
                expect(obj?.realm).toBe(realm)
                expect(obj?.num).toBe(num)
                expect(obj?.checksum).toBeNull()
                expect(obj?.toString()).toBe(str)
                expect(EntityID.normalize(str)).toBe(str)
            })
        )
    })

    test("parseWithChecksum() preserves checksum", () => {
        fc.assert(
            fc.property(component, component, component, checksum, (shard, realm, num, cs) => {
                const str = shard + "." + realm + "." + num
                const obj = EntityID.parseWithChecksum(str + "-" + cs)
                expect(obj?.toString()).toBe(str)
                expect(obj?.checksum).toBe(cs)
                expect(EntityID.parse(str + "-" + cs)).toBeNull()
            })
        )
    })

    test("toAddress() <=> fromAddress()", () => {
        fc.assert(
            fc.property(component, (num) => {
                const address = new EntityID(0, 0, num, null).toAddress()
                expect(address.length).toBe(40)
                expect(EntityID.fromAddress(address)?.num).toBe(num)
            })
        )
    })

    test("parse() rejects components >= MAX_INT", () => {
        const tooLarge = fc.integer({min: 0, max: 0x7fffffff}).map(n => EntityID.MAX_INT + n)
        fc.assert(
            fc.property(tooLarge, (n) => {
                expect(EntityID.parse("0.0." + n)).toBeNull()
                expect(EntityID.parse("0." + n + ".0")).toBeNull()
                expect(EntityID.parse(n + ".0.0")).toBeNull()
            })
        )
    })
})
