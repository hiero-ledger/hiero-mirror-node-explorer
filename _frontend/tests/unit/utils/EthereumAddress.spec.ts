// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {EthereumAddress} from "@/utils/EthereumAddress";

describe("EthereumAddress", () => {

    test("Parsing from a long-zero address", () => {

        const longZeroAddress = "0x000000000000000000000000000000000010400e"
        const compactAddress = "0x00…10400e"
        const squeezedAddress = "0x10400e"
        const entityId = "0.0.1064974"

        const address = EthereumAddress.parse(longZeroAddress)

        expect(address?.isLongZeroForm()).toBe(true)
        expect(address?.toString()).toBe(longZeroAddress)
        expect(address?.toCompactString()).toBe(compactAddress)
        expect(address?.toSqueezedString()).toBe(squeezedAddress)
        expect(address?.toEntityID()?.toString()).toBe(entityId)
    })

    test("Parsing from a native evm address", () => {

        const nativeEvmAddress = "0xe6d5514b8de7ef9e5f5c4cc2e8ca0207129deb65"
        const compactAddress = "0xe6…9deb65"

        const address = EthereumAddress.parse(nativeEvmAddress)

        expect(address?.isLongZeroForm()).toBe(false)
        expect(address?.toString()).toBe(nativeEvmAddress)
        expect(address?.toCompactString()).toBe(compactAddress)
        expect(address?.toSqueezedString()).toBe(nativeEvmAddress)
        expect(address?.toEntityID()).toBe(null)
    })

    test("Parsing from an invalid address", () => {

        const invalidEvmAddress = "0xe6d5514b8de7ef9e5f5c4cc2e8ca0207129deb6500"

        const address = EthereumAddress.parse(invalidEvmAddress)

        expect(address).toBe(null)
    })

    test("Parsing with non-zero shard/realm", () => {

        const longZeroAddress = "0x000000000000000000000000000000000010400e"
        const compactAddress = "0x00…10400e"
        const squeezedAddress = "0x10400e"
        const entityId = "1.2.1064974"
        const baseShard = 1
        const baseRealm = 2

        const address = EthereumAddress.parse(longZeroAddress)

        expect(address?.isLongZeroForm()).toBe(true)
        expect(address?.toString()).toBe(longZeroAddress)
        expect(address?.toCompactString()).toBe(compactAddress)
        expect(address?.toSqueezedString()).toBe(squeezedAddress)
        expect(address?.toEntityID(baseShard, baseRealm)?.toString()).toBe(entityId)
    })
})
