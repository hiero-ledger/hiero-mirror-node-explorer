// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache.ts";
import {routeManager} from "@/router.ts";
import axios from "axios";

export class ERC1155Cache extends EntityCache<string, ERC1155Contract | null> {

    private contracts: ERC1155Contract[] = [];
    private loaded = false;

    //
    // Public
    //

    public static readonly instance = new ERC1155Cache()

    //
    // EntityCache
    //

    protected async load(key: string): Promise<ERC1155Contract | null> {
        let result: ERC1155Contract | null = null

        if (!this.loaded) {
            this.loaded = true
            await this.loadERC1155Contracts()
        }
        for (const contract of this.contracts) {
            if (contract.contractId === key) {
                result = contract
                break
            }
        }
        return Promise.resolve(result)
    }

    public override clear(): void {
        super.clear()
        this.loaded = false
    }

    //
    // Private
    //

    private async loadERC1155Contracts(): Promise<void> {
        const url = routeManager.currentNetworkEntry.value.erc1155IndexURL
        if (url !== null) {
            this.contracts = (await axios.get<ERC1155Contract[]>(url)).data
        } else {
            this.contracts = []
        }
        return Promise.resolve()
    }
}

export interface ERC1155Contract {
    contractId: string,
    address: string
}
