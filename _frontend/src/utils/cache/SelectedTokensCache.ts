// SPDX-License-Identifier: Apache-2.0

import {SingletonCache} from "@/utils/cache/base/SingletonCache";
import axios from "axios";

import {routeManager} from "@/utils/RouteManager.ts";

export class SelectedTokensCache extends SingletonCache<SelectedTokensIndex> {

    public static readonly instance = new SelectedTokensCache()

    //
    // Cache
    //

    protected async load(): Promise<SelectedTokensIndex> {
        let selectedTokenEntries: SelectedTokenEntry[]
        const popularTokenIndexURL = routeManager.currentNetworkEntry.value.popularTokenIndexURL
        if (popularTokenIndexURL !== null) {
            try {
                selectedTokenEntries = (await axios.get<SelectedTokenEntry[]>(popularTokenIndexURL)).data
            } catch (reason) {
                console.log("reason=" + reason)
                throw reason
            }
        } else {
            selectedTokenEntries = []
        }
        return new SelectedTokensIndex(selectedTokenEntries)
    }
}

export class SelectedTokensIndex {

    constructor(private readonly entries: SelectedTokenEntry[]) {
    }

    search(name: string): SelectedTokenEntry[] {
        name = name.toLowerCase()
        const result: SelectedTokenEntry[] = []
        for (const e of this.entries) {
            if (e.name.toLowerCase().indexOf(name) != -1) {
                result.push(e)
            }
        }
        return result
    }
}

export interface SelectedTokenEntry {
    token_id: string,
    name: string
}
