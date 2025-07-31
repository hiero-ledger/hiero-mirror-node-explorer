// SPDX-License-Identifier: Apache-2.0

import {NameServiceProvider} from "@/utils/name_service/provider/NameServiceProvider";
import {KNS, NameNotFoundError} from "@kabuto-sh/ns";

export class KNSProvider extends NameServiceProvider {

    private readonly serviceCache = new Map<string, KNS>()

    //
    // Public
    //

    public constructor() {
        super("KNS", "Kabuto Name Service", "https://kabuto.sh");
    }

    //
    // NameServiceProvider
    //

    public async resolve(name: string, network: string): Promise<string | null> {
        let result: string | null
        const s = this.findService(network)
        if (s !== null) {
            try {
                const accountId = await s.getHederaAddress(name)
                result = accountId.toString()
            } catch (error) {
                if (error instanceof NameNotFoundError) {
                    result = null
                } else {
                    throw error
                }
            }
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

    //
    // Private
    //

    private findService(network: string): KNS | null {
        let result: KNS | null
        if (network == "mainnet" || network == "testnet") {
            result = this.serviceCache.get(network) ?? null
            if (result === null) {
                result = new KNS({network})
                this.serviceCache.set(network, result)
            }
        } else {
            result = null
        }
        return result
    }
}
