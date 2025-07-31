// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {ComplexKeyLine} from "@/utils/ComplexKeyLine";
import hashgraph from "@hashgraph/proto";
import {hexToByte} from "@/utils/B64Utils";

const KEY_0_0_4 = "0x2a880208021283020a562a54080112500a2632240a221220ef2d877b88b7464d9253560b8851316f5c2f6ddf935eb4eec0761a3262b0a48c0a2632240a221220a95d54cf49c1d08cd16d8908f37dfad95637134ffaf528a1d96da7f28d45f1390aa8012aa501080212a0010a2632240a221220c44c911fa45166e356b498463184459dd9ee760bacc083de348691d6357e06340a2632240a221220ef2d877b88b7464d9253560b8851316f5c2f6ddf935eb4eec0761a3262b0a48c0a2632240a221220a95d54cf49c1d08cd16d8908f37dfad95637134ffaf528a1d96da7f28d45f1390a2632240a221220daa5da866bf4e990c14eff4336f5ab4b416c85a31289c8cb8ae1b4a54ce8c111"
const KEY_0_0_900 = "322c0a2a2a28080112240a2212209e2f322fe21c3471290c7d6a9de3bb114c3277945a5559a3e4db3a57b91487b4"
const KEY_0_0_49058639 = "2aa2040802129d040a221220d40d60cfe24c1e6e63eddbbbb857c6540759e02514b1a151d8147f07d4e3eaee0ad2032acf03080112ca030a221220775334a1a5d250c3bfc75b8b81fa2d5fc8fed7d5dab4b2a5ec272aa952aa377c0a2212205b18a5aa454e99759a2e5d9c4f3239dbc3584f69ab26383470446874bb7f79d10a2212203aa16f6f6cf5b95057ba1854cf5822a446d082b37212a3f1c164babadb713f870a93023290020a221220b3a3e302a74198085e0752495528a6bc475b6bc1f4ba9ae246d9235e5a45e43c0a221220b31d0cfc76ea431928330adfc3094780985876c87864bfe094f956dee4e05d9a0a221220c5b759fee0f23620330deea250bd1a66602f8d847bc181482e268d63e16ae16a0aa101329e010a9b013298010a722a700801126c0a221220b5d243760381ec28f8df73ca2707761720482612071fead9a8a14ff1e0c2f36a0a2212202f170df8b57ee630c42e408a6fc749e4ee62174fce66b9e03c9d9b4e68d35d400a221220bce139f0d9e6d69076f8915fcc32209ade6debaca3f05ee5a713e652b65e73290a221220a4c8bfd29c164be686c18d9ddbb09c3a47a375a57f32f6df6aec9ccef80f817c0a221220c5040cb52c20d2ab9496893fca0b690cb13855e6e55231e63360c3976e64a25c0a22122078b769551a81d0fd10c3b5390abb3de92ed4878977a119c2be2039247d8182da0a2212205b18a5aa454e99759a2e5d9c4f3239dbc3584f69ab26383470446874bb7f79d1"

const CONTRACT_KEY = "0a0418caba02" // Contract ID: 0.0.40266

describe("ComplexKeyLine.ts", () => {

    test("0.0.4 key", () => {

        const keyBytes = hexToByte(KEY_0_0_4)
        expect(keyBytes).not.toBeNull()

        const key = hashgraph.proto.Key.decode(keyBytes!)
        expect(key).not.toBeNull()

        const lines = ComplexKeyLine.flattenComplexKey(key)
        expect(lines.length).toBe(9)
    })

    test("0.0.900 key", () => {

        const keyBytes = hexToByte(KEY_0_0_900)
        expect(keyBytes).not.toBeNull()

        const key = hashgraph.proto.Key.decode(keyBytes!)
        expect(key).not.toBeNull()

        const lines = ComplexKeyLine.flattenComplexKey(key)
        expect(lines.length).toBe(1)
    })

    test("0.0.49058639 key", () => {

        const keyBytes = hexToByte(KEY_0_0_49058639)
        expect(keyBytes).not.toBeNull()

        const key = hashgraph.proto.Key.decode(keyBytes!)
        expect(key).not.toBeNull()

        const lines = ComplexKeyLine.flattenComplexKey(key)
        expect(lines.length).toBe(19)
    })

    test("Key with contract id", () => {

        const keyBytes = hexToByte(CONTRACT_KEY)
        expect(keyBytes).not.toBeNull()

        const key = hashgraph.proto.Key.decode(keyBytes!)
        expect(key).not.toBeNull()

        const lines = ComplexKeyLine.flattenComplexKey(key)
        expect(lines.length).toBe(1)
        expect(lines[0].contractId()).toBe("0.0.40266")
    })

})

