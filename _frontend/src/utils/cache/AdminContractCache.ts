// SPDX-License-Identifier: Apache-2.0

import {EntityCache} from "@/utils/cache/base/EntityCache";
import {ContractResponse} from "@/schemas/MirrorNodeSchemas";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache";
import {LogicContractCache} from "@/utils/cache/LogicContractCache";

export class AdminContractCache extends EntityCache<string, ContractResponse | null> {

    public static readonly instance = new AdminContractCache()


    //
    // Cache
    //

    protected async load(contractId: string): Promise<ContractResponse | null> {
        let result: ContractResponse | null

        // See https://eips.ethereum.org/EIPS/eip-1967
        const adminContractSlotAddress = "0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"
        const logicContractAddress = await LogicContractCache.fetchContractAddress(contractId, adminContractSlotAddress)
        if (logicContractAddress !== null) {
            result = await ContractByAddressCache.instance.lookup(logicContractAddress)
        } else {
            result = null
        }
        return Promise.resolve(result)
    }

}
