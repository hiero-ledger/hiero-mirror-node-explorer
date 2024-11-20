/*-
 *
 * Hedera Mirror Node Explorer
 *
 * Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import axios from "axios";
import {SingletonCache} from "@/utils/cache/base/SingletonCache";
import {routeManager} from "@/router";

export class ERC20Cache extends SingletonCache<ERC20Token[]> {

    public static readonly instance = new ERC20Cache()

    public async lookupContract(contractId: string) {
        const tokens = await this.lookup()
        let result = null as ERC20Token | null
        for (const t of tokens) {
            if (contractId === t.contractId) {
                result = t
                break
            }
        }
        return Promise.resolve(result)
    }

    //
    // Cache
    //

    protected async load(): Promise<ERC20Token[]> {
        let result: Promise<ERC20Token[]>
        try {
            const network = routeManager.currentNetwork.value
            const url = window.location.origin + "/erc20-tokens-" + network + ".json"
            const response = await axios.get<ERC20Token[]>(url)
            result = Promise.resolve(response.data)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = Promise.resolve([])
            } else {
                throw error
            }
        }
        return result
    }

}

export interface ERC20Token {
    contractId: string
    evmAddress: string
    name: string
    symbol: string
    decimals: number,
    owner: string
    totalSupply: string
    maxSupply: string
}
