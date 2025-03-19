// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {EthereumAddress} from "@/utils/EthereumAddress";

describe("EthereumAddress", () => {

    test("Parsing from a long-zero address", () => {

        const longZeroAddress = "0x000000000000000000000000000000000010400e"
        const compactAddress = "0x00…10400e"
        const entityId = "0.0.1064974"

        const address = EthereumAddress.parse(longZeroAddress)

        expect(address?.isLongZeroForm()).toBe(true)
        expect(address?.toString()).toBe(longZeroAddress)
        expect(address?.toCompactString()).toBe(compactAddress)
        expect(address?.toEntityID()?.toString()).toBe(entityId)
    })

    test("Parsing from a native evm address", () => {

        const nativeEvmAddress = "0xe6d5514b8de7ef9e5f5c4cc2e8ca0207129deb65"
        const compactAddress = "0xe6…9deb65"

        const address = EthereumAddress.parse(nativeEvmAddress)

        expect(address?.isLongZeroForm()).toBe(false)
        expect(address?.toString()).toBe(nativeEvmAddress)
        expect(address?.toCompactString()).toBe(compactAddress)
        expect(address?.toEntityID()).toBe(null)
    })

    test("Parsing from an invalid address", () => {

        const invalidEvmAddress = "0xe6d5514b8de7ef9e5f5c4cc2e8ca0207129deb6500"

        const address = EthereumAddress.parse(invalidEvmAddress)

        expect(address).toBe(null)
    })

    test("EIP55", () => {

        const random = "0000000000000000000000000000000000440A9C"
        expect(EthereumAddress.normalizeEIP55("0x" + random)).toBe("0x" + random)
        expect(EthereumAddress.normalizeEIP55("0x" + random.toLowerCase())).toBe("0x" + random)
        expect(EthereumAddress.normalizeEIP55("0x" + random.toUpperCase())).toBe("0x" + random)

        const normal = "fB6916095ca1df60bB79Ce92cE3Ea74c37c5d359"
        expect(EthereumAddress.normalizeEIP55("0x" + normal)).toBe("0x" + normal)
        expect(EthereumAddress.normalizeEIP55("0x" + normal.toLowerCase())).toBe("0x" + normal)
        expect(EthereumAddress.normalizeEIP55("0x" + normal.toUpperCase())).toBe("0x" + normal)

        const allCaps = "52908400098527886E0F7030069857D2E4169EE7"
        expect(EthereumAddress.normalizeEIP55("0x" + allCaps)).toBe("0x" + allCaps)
        expect(EthereumAddress.normalizeEIP55("0x" + allCaps.toLowerCase())).toBe("0x" + allCaps)
        expect(EthereumAddress.normalizeEIP55("0x" + allCaps.toUpperCase())).toBe("0x" + allCaps)

        const allLower = "de709f2102306220921060314715629080e2fb77"
        expect(EthereumAddress.normalizeEIP55("0x" + allLower)).toBe("0x" + allLower)
        expect(EthereumAddress.normalizeEIP55("0x" + allLower.toLowerCase())).toBe("0x" + allLower)
        expect(EthereumAddress.normalizeEIP55("0x" + allLower.toUpperCase())).toBe("0x" + allLower)

    })

    test("Parsing with non-zero shard/realm", () => {

        const longZeroAddress = "0x000000000000000000000000000000000010400e"
        const compactAddress = "0x00…10400e"
        const entityId = "1.2.1064974"
        const baseShard = 1
        const baseRealm = 2

        const address = EthereumAddress.parse(longZeroAddress)

        expect(address?.isLongZeroForm()).toBe(true)
        expect(address?.toString()).toBe(longZeroAddress)
        expect(address?.toCompactString()).toBe(compactAddress)
        expect(address?.toEntityID(baseShard, baseRealm)?.toString()).toBe(entityId)
    })
})