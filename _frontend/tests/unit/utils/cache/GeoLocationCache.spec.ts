// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0


import {describe, expect, test} from 'vitest'
import {GeoLocationCache} from "@/utils/cache/GeoLocationCache.ts";
import {NetworkCache} from "@/utils/cache/NetworkCache.ts";
import {NetworkNode} from "@/schemas/MirrorNodeSchemas.ts";

describe("GeoLocationCache", () => {

    test("GeoLocationCache", async () => {

        const nodes = await NetworkCache.instance.lookup()
        const book = await GeoLocationCache.instance.lookup()

        const missingNodes: NetworkNode[] = []
        for (const n of nodes) {
            const place = n.public_key ? book.findPlace(n.public_key) : null
            if (place === null) {
                missingNodes.push(n)
            }
        }

        if (missingNodes.length > 0) {
            console.log("Following network nodes are missing in node-locations.json:")
            for (const n of missingNodes) {
                console.log("nodeId: " + n.node_id + ", description: " + n.description + ", public_key: " + n.public_key)
            }
        }

        expect(missingNodes.length).toBe(0)
    })

})

