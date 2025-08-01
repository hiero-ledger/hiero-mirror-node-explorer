// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {SAMPLE_CONTRACT_RESULT_DETAILS,} from "../../Mocks";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {ContractResultByTransactionIdCache} from "@/utils/cache/ContractResultByTransactionIdCache";

describe("ContractResultByTransactionIdCache", () => {

    test("ContractResultByTransactionIdCache", async () => {

        expect(ContractResultByTransactionIdCache.instance.isEmpty()).toBeTruthy()

        const mock = new MockAdapter(axios as any);

        const transactionId = "0.0.2307776@1683720888.979207121"
        const matcher1 = "/api/v1/contracts/results/" + transactionId
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT_RESULT_DETAILS);

        // 1) First lookup() triggers http requests
        const contractResult = await ContractResultByTransactionIdCache.instance.lookup(transactionId)
        expect(contractResult).toStrictEqual(SAMPLE_CONTRACT_RESULT_DETAILS)
        expect(mock.history.get.length).toBe(1)

        // 2) Second lookup() triggers no http requests
        mock.resetHistory()
        const contractResult2 = await ContractResultByTransactionIdCache.instance.lookup(transactionId)
        await flushPromises()
        expect(contractResult2).toStrictEqual(SAMPLE_CONTRACT_RESULT_DETAILS)
        expect(mock.history.get.length).toBe(0)

        // Checks that ContractResultByTransactionIdCache has been populated
        expect(ContractResultByTransactionIdCache.instance.contains(transactionId))

        mock.restore()
    })
})
