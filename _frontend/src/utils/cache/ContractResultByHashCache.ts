// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache"
import {ContractResultDetails} from "@/schemas/MirrorNodeSchemas";
import axios from "axios";
import {ContractResultByTsCache} from "@/utils/cache/ContractResultByTsCache";

export class ContractResultByHashCache extends EntityCache<string, ContractResultDetails | null> {

    public static readonly instance = new ContractResultByHashCache()


    //
    // Public
    //

    public updateWithContractResult(contractResult: ContractResultDetails): void {
        if (contractResult.hash) {
            this.forget(contractResult.hash)
            this.mutate(contractResult.hash, Promise.resolve(contractResult))
        }
    }

    //
    // Cache
    //

    protected async load(ethHash: string): Promise<ContractResultDetails | null> {
        let result: ContractResultDetails | null
        try {
            const response = await axios.get<ContractResultDetails>("api/v1/contracts/results/" + ethHash)
            result = response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = null
            } else {
                throw error
            }
        }
        if (result !== null) {
            ContractResultByTsCache.instance.updateWithContractResult(result);
        }
        return Promise.resolve(result)
    }

}

