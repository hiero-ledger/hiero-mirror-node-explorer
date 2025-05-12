// SPDX-License-Identifier: Apache-2.0

import {SingletonCache} from "@/utils/cache/base/SingletonCache";
import axios from "axios";
import {routeManager} from "@/router";

export class PublicLabelsCache extends SingletonCache<PublicLabelsIndex> {

    public static readonly instance = new PublicLabelsCache()

    //
    // Cache
    //

    protected async load(): Promise<PublicLabelsIndex> {
        let labelDefinitions: LabelDefinition[]
        const url = routeManager.currentNetworkEntry.value.publicLabelsURL

        if (url !== null) {
            const response = await axios.get<LabelDefinition[]>(url)
            if (response.status === 200 && typeof response.data === "object" && response.data !== null) {
                labelDefinitions = response.data
                // console.log(`Read ${this.labels.length} labels from url: ${url}`)
            } else {
                labelDefinitions = []
                console.warn(`Could not read labels from url: ${url}`)
            }
        } else {
            labelDefinitions = []
        }
        return new PublicLabelsIndex(labelDefinitions)
    }
}

export class PublicLabelsIndex {

    constructor(private readonly labels: LabelDefinition[]) {
    }

    public search(name: string): LabelDefinition[] {
        name = name.toLowerCase()
        const result: LabelDefinition[] = []
        for (const e of this.labels) {
            if (e.name.toLowerCase().indexOf(name) != -1) {
                result.push(e)
            }
        }
        return result
    }

    public lookup(entityId: string): LabelDefinition | null {
        let result: LabelDefinition | null = null

        for (const label of this.labels) {
            if (label.entityId === entityId) {
                result = label
            }
        }
        return result
    }
}

export interface LabelDefinition {
    entityId: string
    name: string
    type?: string
    description?: string
    website?: string
}
