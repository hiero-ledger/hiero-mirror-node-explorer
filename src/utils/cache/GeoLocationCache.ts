// SPDX-License-Identifier: Apache-2.0

import {SingletonCache} from "@/utils/cache/base/SingletonCache.ts";

export class GeoLocationCache extends SingletonCache<GeoLocationBook> {

    public static readonly instance = new GeoLocationCache()

    //
    // EntityCache
    //

    protected async load(): Promise<GeoLocationBook> {
        let result: GeoLocationBook
        try {
            const m = await import("@/assets/node-locations.json")
            const json = m.default as { places: GeoPlace[], entries: GeoLocationBookEntry[]}
            result = new GeoLocationBook(json.places, m.entries)
        } catch(error) {
            console.error(error)
            result = new GeoLocationBook([], [])
        }
        return result
    }
}

export type LabelPlacement = "south" | "north" | "east" | "west"

export interface GeoPlace {
    name: string,
    lat: number,
    lon: number,
    labelPlacement?: LabelPlacement
}

export interface GeoLocationBookEntry {
    nodeName: string,
    nodePublicKey: string,
    placeName: string
}

export class GeoLocationBook {

    private readonly placeMap = new Map<string, GeoPlace>()
    private readonly entryMap = new Map<string, GeoLocationBookEntry>()

    constructor(public readonly places: GeoPlace[], public readonly entries: GeoLocationBookEntry[]) {
        for (const p of places) {
            this.placeMap.set(p.name, p)
        }
        for (const e of entries) {
            this.entryMap.set(e.nodePublicKey, e)
        }
        this.checkConsistency()
    }

    public checkConsistency() {
        // Verifies that each GeoLocationBookEntry.placeName matches a GeoPlace.name
        let warningCount = 0
        for (const e of this.entries) {
            if (this.placeMap.get(e.placeName) === null) {
                console.log(`"${e.nodeName}" has an unknown place name "${e.placeName}"`)
                warningCount += 1
            }
        }
        if (warningCount > 0) {
            console.log("Check node-locations.json !!!!")
        }
    }

    public findPlace(nodePublicKey: string): GeoPlace|null {
        const entry = this.entryMap.get(nodePublicKey)
        const place = entry ? this.placeMap.get(entry.placeName) : null
        return place ?? null
    }
}
