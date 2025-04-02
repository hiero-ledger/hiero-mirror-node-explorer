// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import {routeManager} from "@/router.ts";
import axios from "axios";

export class LabelByIdCache extends EntityCache<string, LabelDefinition | null> {

    private labels: LabelDefinition[] | null = null;

    //
    // Public
    //
    public static readonly instance = new LabelByIdCache()

    public async search(name: string): Promise<LabelDefinition[]> {
        const result: LabelDefinition[] = []

        if (this.labels === null) {
            this.labels = await this.loadLabelDefinitions()
        }
        name = name.toLowerCase()
        for (const label of this.labels) {
            if (label.name.toLowerCase().indexOf(name) != -1) {
                result.push(label)
            }
        }
        return Promise.resolve(result)
    }

    //
    // EntityCache
    //
    protected async load(key: string): Promise<LabelDefinition | null> {
        let result: LabelDefinition | null = null

        if (this.labels === null) {
            this.labels = await this.loadLabelDefinitions()
        }
        for (const label of this.labels) {
            if (label.entityId === key) {
                result = label
            }
        }
        return Promise.resolve(result)
    }

    //
    // Private
    //
    private async loadLabelDefinitions(): Promise<LabelDefinition[]> {
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


