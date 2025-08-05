// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {SingletonCache} from "@/utils/cache/base/SingletonCache";

import {routeManager} from "@/utils/RouteManager.ts";

export class ERC721Cache extends SingletonCache<ERC721Contract[]> {

    public static readonly instance = new ERC721Cache()

    //
    // Public
    //

    public async lookupContract(contractId: string) {
        const tokens = await this.lookup()
        let result = null as ERC721Contract | null
        for (const t of tokens) {
            if (contractId === t.contractId) {
                result = t
                break
            }
        }
        return Promise.resolve(result)
    }

    public async search(name: string): Promise<ERC721Contract[]> {
        name = name.toLowerCase()
        const result: ERC721Contract[] = []
        const tokens = await this.lookup()
        for (const t of tokens) {
            if (t.name && t.name.toLowerCase().indexOf(name) != -1) {
                result.push(t)
            }
        }
        return Promise.resolve(result)
    }

    public async populate(contractId: string, erc721Contract: ERC721Contract): Promise<void> {
        const entries = await ERC721Cache.instance.lookup()
        entries.push(erc721Contract)
    }

    //
    // Cache
    //

    protected async load(): Promise<ERC721Contract[]> {
        let result: ERC721Contract[]
        const url = routeManager.currentNetworkEntry.value.erc721IndexURL
        if (url !== null) {
            result = (await axios.get<ERC721Contract[]>(url)).data
        } else {
            result = []
        }
        return Promise.resolve(result)
    }

}

export interface ERC721Contract {
    contractId: string
    address: string
    name: string
    symbol: string
}
