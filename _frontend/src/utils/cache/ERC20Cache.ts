// SPDX-License-Identifier: Apache-2.0

import axios from "axios";
import {SingletonCache} from "@/utils/cache/base/SingletonCache";

import {routeManager} from "@/utils/RouteManager.ts";

export class ERC20Cache extends SingletonCache<ERC20Contract[]> {

    public static readonly instance = new ERC20Cache()

    public async lookupContract(contractId: string): Promise<ERC20Contract | null> {
        const tokens = await this.lookup()
        let result = null as ERC20Contract | null
        for (const t of tokens) {
            if (contractId === t.contractId) {
                result = t
                break
            }
        }
        return Promise.resolve(result)
    }

    public async search(name: string): Promise<ERC20Contract[]> {
        name = name.toLowerCase()
        const result: ERC20Contract[] = []
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

    protected async load(): Promise<ERC20Contract[]> {
        let result: ERC20Contract[]
        const url = routeManager.currentNetworkEntry.value.erc20IndexURL
        if (url !== null) {
            result = (await axios.get<ERC20Contract[]>(url)).data
        } else {
            result = []
        }
        return Promise.resolve(result)
    }

}

export interface ERC20Contract {
    contractId: string,
    address: string,
    name: string | null,
    symbol: string | null,
    totalSupply: number | null,
    decimals: number | null
}
