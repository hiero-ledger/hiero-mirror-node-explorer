// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {SingletonCache} from "@/utils/cache/base/SingletonCache";
import {routeManager} from "@/router";

export class LabelDefinitionsCache extends SingletonCache<LabelDefinition[]> {

    public static readonly instance = new LabelDefinitionsCache()

    public async lookupEntity(entityId: string): Promise<LabelDefinition | null> {
        const tokens = await this.lookup()
        let result = null as LabelDefinition | null
        for (const t of tokens) {
            if (entityId === t.entityId) {
                result = t
                break
            }
        }
        return Promise.resolve(result)
    }

    public async search(name: string): Promise<LabelDefinition[]> {
        name = name.toLowerCase()
        const result: LabelDefinition[] = []
        const tokens = await this.lookup()
        for (const t of tokens) {
            if (t.name && t.name.toLowerCase().indexOf(name) != -1) {
                result.push(t)
            }
        }
        return Promise.resolve(result)
    }

    //
    // Cache
    //

    protected async load(): Promise<LabelDefinition[]> {
        let result: LabelDefinition[]
        const url = routeManager.currentNetworkEntry.value.publicLabelsURL
        if (url !== null) {
            result = (await axios.get<LabelDefinition[]>(url)).data
        } else {
            result = []
        }
        return Promise.resolve(result)
    }

}

export interface LabelDefinition {
    entityId: string
    name: string
    type?: string
    description?: string
    website?: string
}
