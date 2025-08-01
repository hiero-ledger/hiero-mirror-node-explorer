// SPDX-License-Identifier: Apache-2.0

import {ContractResponse} from "@/schemas/MirrorNodeSchemas";
import {EntityCache} from "@/utils/cache/base/EntityCache";
import axios from "axios";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache";
import {EntityID} from "@/utils/EntityID";

export class ContractByIdCache extends EntityCache<string, ContractResponse | null> {

    public static readonly instance = new ContractByIdCache()

    //
    // Public
    //

    public async findContractAddress(contractId: string): Promise<string | null> {
        let result: string | null
        const contractInfo = await this.lookup(contractId)
        if (contractInfo !== null) {
            result = contractInfo.evm_address ?? EntityID.parse(contractId)?.toAddress() ?? null
        } else {
            result = null
        }
        return result
    }

    public updateWithContractResponse(contractResponse: ContractResponse): void {
        if (contractResponse.contract_id) {
            this.forget(contractResponse.contract_id)
            this.mutate(contractResponse.contract_id, Promise.resolve(contractResponse))
        }
    }

    //
    // Cache
    //

    protected async load(key: string): Promise<ContractResponse | null> {
        let result: Promise<ContractResponse | null>
        try {
            const response = await axios.get<ContractResponse>("api/v1/contracts/" + key)
            result = Promise.resolve(response.data)
            ContractByAddressCache.instance.updateWithContractResponse(response.data)
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
