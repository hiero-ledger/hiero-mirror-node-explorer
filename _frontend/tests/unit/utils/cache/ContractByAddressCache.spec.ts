// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0


import {describe, expect, test} from 'vitest'
import {SAMPLE_CONTRACT} from "../../Mocks";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache";

describe("ContractByAddressCache", () => {

    test("ContractByAddressCache", async () => {

        expect(ContractByAddressCache.instance.isEmpty()).toBeTruthy()

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.evm_address
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        // 1) First lookup() triggers http requests
        const contractAddress = SAMPLE_CONTRACT.evm_address
        const contract = await ContractByAddressCache.instance.lookup(contractAddress)
        expect(contract).toStrictEqual(SAMPLE_CONTRACT)
        expect(mock.history.get.length).toBe(1)

        // 2) Second lookup() triggers no http requests
        mock.resetHistory()
        const contract2 = await ContractByAddressCache.instance.lookup(contractAddress)
        await flushPromises()
        expect(contract2).toStrictEqual(SAMPLE_CONTRACT)
        expect(mock.history.get.length).toBe(0)

        // Checks that ContractByAddressCache has been populated
        if (contract?.contract_id) {
            expect(ContractByIdCache.instance.contains(contract.contract_id))
        }

        mock.restore()
    })
})
