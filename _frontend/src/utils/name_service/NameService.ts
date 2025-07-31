// SPDX-License-Identifier: Apache-2.0

import {NameServiceProvider} from "@/utils/name_service/provider/NameServiceProvider";
import {nameServiceProviders} from "@/utils/name_service/provider/AllProviders";

export class NameService {

    public static readonly instance = new NameService()

    //
    // Public
    //

    public async resolve(name: string, network: string): Promise<NameRecord[]> {
        const promises: Promise<NameRecord | null>[] = []
        for (const p of nameServiceProviders) {
            promises.push(this.resolveWithProvider(name, network, p))
        }

        const result: NameRecord[] = []
        const responses = await Promise.allSettled(promises)
        for (const r of responses) {
            if (r.status == "fulfilled" && r.value !== null) {
                result.push(r.value)
            }
        }

        return Promise.resolve(result)
    }

    public async singleResolve(name: string, network: string, providerAlias: string): Promise<NameRecord | null> {
        let result: NameRecord | null
        const provider = this.lookupProvider(providerAlias)
        if (provider !== null) {
            result = await this.resolveWithProvider(name, network, provider)
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

    public lookupProvider(providerAlias: string): NameServiceProvider | null {
        let result: NameServiceProvider | null = null
        for (const p of nameServiceProviders) {
            if (p.providerAlias == providerAlias) {
                result = p
                break
            }
        }
        return result
    }

    //
    // Private
    //

    private constructor() {
    }

    private async resolveWithProvider(name: string, network: string, provider: NameServiceProvider): Promise<NameRecord | null> {
        let result: NameRecord | null
        const entityId = await provider.resolve(name, network)
        if (entityId !== null) {
            const timestamp = new Date().getTime()
            const providerAlias = provider.providerAlias
            result = {entityId, name, providerAlias, timestamp}
        } else {
            result = null
        }
        return Promise.resolve(result)
    }
}


export interface NameRecord {
    entityId: string
    name: string
    providerAlias: string
    timestamp: number // Date.getTime()
}
