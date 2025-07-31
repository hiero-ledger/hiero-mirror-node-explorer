// SPDX-License-Identifier: Apache-2.0


import {describe, expect, test} from 'vitest'
import {TransactionGroupByBlockCache} from "@/utils/cache/TransactionGroupByBlockCache";
import {SAMPLE_BLOCK, SAMPLE_PARENT_CHILD_TRANSACTIONS} from "../../Mocks";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios, {AxiosRequestConfig} from "axios";
import {TransactionByHashCache} from "@/utils/cache/TransactionByHashCache";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache";

describe("TransactionGroupByBlockCache", () => {

    test("TransactionGroupByBlockCache", async () => {

        expect(TransactionGroupByBlockCache.instance.isEmpty()).toBeTruthy()


        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/blocks/" + SAMPLE_BLOCK.number
        mock.onGet(matcher1).reply(200, SAMPLE_BLOCK);

        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == "lte:" + SAMPLE_BLOCK.timestamp.to
                && config.params.limit == SAMPLE_BLOCK.count) {
                return [200, SAMPLE_PARENT_CHILD_TRANSACTIONS]
            } else {
                return [404]
            }
        }) as any)

        // lookup() triggers http requests
        const blockNumber = SAMPLE_BLOCK.number
        const transactions = await TransactionGroupByBlockCache.instance.lookup(blockNumber)
        await flushPromises()
        expect(transactions).toStrictEqual(SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions)
        expect(mock.history.get.length).toBe(2)

        // lookup() triggers no http requests
        mock.resetHistory()
        const transactions2 = await TransactionGroupByBlockCache.instance.lookup(blockNumber)
        await flushPromises()
        expect(transactions2).toStrictEqual(SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions)
        expect(mock.history.get.length).toBe(0)

        // Checks that TransactionByHashCache and TransactionByTsCache has been populated
        for (const t of SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions!) {
            expect(TransactionByHashCache.instance.contains(t.transaction_hash)).toBeTruthy()
            expect(TransactionByTsCache.instance.contains(t.consensus_timestamp)).toBeTruthy()
        }

        mock.restore()
    })
})
