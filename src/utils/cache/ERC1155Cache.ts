// SPDX-License-Identifier: Apache-2.0

import {SingletonCache} from "@/utils/cache/base/SingletonCache";
import axios from "axios";

import {routeManager} from "@/utils/RouteManager.ts";

export class ERC1155Cache extends SingletonCache<ERC1155Index> {

    public static readonly instance = new ERC1155Cache()

    //
    // Cache
    //

    protected async load(): Promise<ERC1155Index> {
        let contracts: ERC1155Contract[]
        const url = routeManager.currentNetworkEntry.value.erc1155IndexURL
        if (url !== null) {
            const response = await axios.get<ERC1155Contract[]>(url)
            if (response.status === 200 && typeof response.data === "object" && response.data !== null) {
                contracts = response.data
                console.log(`Read ${contracts.length} contracts from url: ${url}`)
            } else {
                contracts = []
                console.warn(`Could not read contracts from url: ${url}`)
            }
        } else {
            contracts = []
        }
        return new ERC1155Index(contracts)
    }
}

export class ERC1155Index {

    constructor(private readonly contracts: ERC1155Contract[]) {
    }

    public lookup(contractId: string): ERC1155Contract | null {
        let result: ERC1155Contract | null = null
        for (const c of this.contracts) {
            if (c.contractId === contractId) {
                result = c
            }
        }
        return result
    }
}

export interface ERC1155Contract {
    contractId: string,
    address: string
}
