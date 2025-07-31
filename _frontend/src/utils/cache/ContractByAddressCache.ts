// SPDX-License-Identifier: Apache-2.0

import {ContractResponse} from "@/schemas/MirrorNodeSchemas";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";

export class ContractByAddressCache extends EntityCache<string, ContractResponse | null> {

    public static readonly instance = new ContractByAddressCache()

    //
    // Public
    //

    public updateWithContractResponse(contractResponse: ContractResponse): void {
        if (contractResponse.evm_address) {
            this.forget(contractResponse.evm_address)
            this.mutate(contractResponse.evm_address, Promise.resolve(contractResponse))
        }
    }

    //
    // Cache
    //

    protected async load(address: string): Promise<ContractResponse | null> {
        let result: Promise<ContractResponse | null>
        try {
            const response = await axios.get<ContractResponse>("api/v1/contracts/" + address)
            result = Promise.resolve(response.data)
            ContractByIdCache.instance.updateWithContractResponse(response.data)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                result = Promise.resolve(null)
            } else {
                throw error
            }
        }
        return result
    }
}
