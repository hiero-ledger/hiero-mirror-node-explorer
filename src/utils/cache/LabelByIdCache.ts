// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import {routeManager} from "@/router.ts";
import axios from "axios";

export class LabelByIdCache extends EntityCache<string, LabelDefinition | null> {

    private labels: LabelDefinition[] = [];
    private loaded = false;

    //
    // Public
    //
    public static readonly instance = new LabelByIdCache()

    public async search(name: string): Promise<LabelDefinition[]> {
        const result: LabelDefinition[] = []

        if (!this.loaded) {
            this.loaded = true
            await this.loadLabelDefinitions()
        }
        name = name.toLowerCase()
        for (const label of this.labels) {
            if (label.name.toLowerCase().indexOf(name) != -1) {
                result.push(label)
            }
        }
        return Promise.resolve(result)
    }

    public override clear(): void {
        super.clear()
        this.loaded = false
    }

    //
    // EntityCache
    //
    protected async load(key: string): Promise<LabelDefinition | null> {
        let result: LabelDefinition | null = null

        if (!this.loaded) {
            await this.loadLabelDefinitions()
            this.loaded = true
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
    private async loadLabelDefinitions(): Promise<void> {
        const url = routeManager.currentNetworkEntry.value.publicLabelsURL
        console.log(`Reading labels from url: ${url}`)

        if (url !== null) {
            this.labels = (await axios.get<LabelDefinition[]>(url)).data
            console.log(`Read ${this.labels.length} labels from url: ${url}`)
        } else {
            this.labels = []
        }
    }
}

export interface LabelDefinition {
    entityId: string
    name: string
    type?: string
    description?: string
    website?: string
}


