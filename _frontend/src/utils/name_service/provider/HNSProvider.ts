// SPDX-License-Identifier: Apache-2.0

import {NameServiceProvider} from "@/utils/name_service/provider/NameServiceProvider";
import {Resolver} from '@hedera-name-service/hns-resolution-sdk'
import {NetworkType} from "@hedera-name-service/hns-resolution-sdk/dist/types/NetworkType";

export class HNSProvider extends NameServiceProvider {

    private readonly resolverCache = new Map<string, Resolver>()

    //
    // Public
    //

    public constructor() {
        super("HNS", "Hashgraph Name Service", "https://www.hashgraph.name");
    }

    //
    // NameServiceProvider
    //

    public async resolve(name: string, network: string): Promise<string | null> {
        let result: string | null
        const r = this.findResolver(network)
        if (r !== null) {
            result = await r.resolveSLD(name) ?? null
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

    //
    // Private
    //

    private findResolver(network: string): Resolver | null {

        let service: NetworkType | null
        switch (network) {
            case "mainnet":
                service = "hedera_main"
                break
            case "testnet":
                service = "hedera_test"
                break
            default: // network is unsupported by HNS
                service = null
                break
        }

        let result: Resolver | null
        if (service !== null) {
            result = this.resolverCache.get(service) ?? null
            if (result == null) {
                result = new Resolver(service)
                this.resolverCache.set(service, result)
            }
        } else {
            result = null
        }

        return result
    }
}
