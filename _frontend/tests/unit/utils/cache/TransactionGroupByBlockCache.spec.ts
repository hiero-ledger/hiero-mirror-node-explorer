// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {TransactionGroupByBlockCache} from "@/utils/cache/TransactionGroupByBlockCache";
import {SAMPLE_BLOCK, SAMPLE_BLOCK_TRANSACTIONS} from "../../Mocks";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios, {AxiosRequestConfig} from "axios";
import {TransactionByHashCache} from "@/utils/cache/TransactionByHashCache";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache";
import {TransactionResponse} from "@/schemas/MirrorNodeSchemas";
import {fetchGetURLs} from "../../MockUtils.ts";

describe("TransactionGroupByBlockCache", () => {

    test("fetches transactions using both gte and lte timestamps, caches result", async () => {

        expect(TransactionGroupByBlockCache.instance.isEmpty()).toBeTruthy()

        const mock = new MockAdapter(axios as any);

        mock.onGet("/api/v1/blocks/" + SAMPLE_BLOCK.number).reply(200, SAMPLE_BLOCK);

        mock.onGet("/api/v1/transactions").reply(((config: AxiosRequestConfig) => {
            const ts: string[] = config.params.timestamp
            if (Array.isArray(ts)
                && ts[0] === "gte:" + SAMPLE_BLOCK.timestamp!.from
                && ts[1] === "lte:" + SAMPLE_BLOCK.timestamp!.to
                && config.params.limit === SAMPLE_BLOCK.count) {
                return [200, SAMPLE_BLOCK_TRANSACTIONS]
            } else {
                return [404]
            }
        }) as any)

        // lookup() triggers http requests
        const blockNumber = SAMPLE_BLOCK.number!
        const transactions = await TransactionGroupByBlockCache.instance.lookup(blockNumber)
        await flushPromises()
        expect(transactions).toStrictEqual(SAMPLE_BLOCK_TRANSACTIONS.transactions)
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + blockNumber,
            "api/v1/transactions",
        ])

        // lookup() triggers no http requests (cached)
        mock.resetHistory()
        const transactions2 = await TransactionGroupByBlockCache.instance.lookup(blockNumber)
        await flushPromises()
        expect(transactions2).toStrictEqual(SAMPLE_BLOCK_TRANSACTIONS.transactions)
        expect(mock.history.get.length).toBe(0)

        // Checks that TransactionByHashCache and TransactionByTsCache have been populated
        for (const t of SAMPLE_BLOCK_TRANSACTIONS.transactions!) {
            expect(TransactionByHashCache.instance.contains(t.transaction_hash)).toBeTruthy()
            expect(TransactionByTsCache.instance.contains(t.consensus_timestamp)).toBeTruthy()
        }

        mock.restore()
    })

    test("returns null when block is not found (404)", async () => {
        const mock = new MockAdapter(axios as any);
        mock.onGet("/api/v1/blocks/99999999").reply(404);

        const transactions = await TransactionGroupByBlockCache.instance.lookup(99999999)
        await flushPromises()
        expect(transactions).toBeNull()

        mock.restore()
    })

    test("returns null when block timestamp.from is missing", async () => {
        const block = {...SAMPLE_BLOCK, timestamp: {from: undefined, to: SAMPLE_BLOCK.timestamp!.to}}
        const mock = new MockAdapter(axios as any);
        mock.onGet("/api/v1/blocks/" + SAMPLE_BLOCK.number).reply(200, block);

        const transactions = await TransactionGroupByBlockCache.instance.lookup(SAMPLE_BLOCK.number!)
        await flushPromises()
        expect(transactions).toBeNull()
        // transactions endpoint must not have been called
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + block.number!
        ])

        mock.restore()
    })

    test("returns null when block timestamp.to is missing", async () => {
        const block = {...SAMPLE_BLOCK, timestamp: {from: SAMPLE_BLOCK.timestamp!.from, to: null}}
        const mock = new MockAdapter(axios as any);
        mock.onGet("/api/v1/blocks/" + SAMPLE_BLOCK.number).reply(200, block);

        const transactions = await TransactionGroupByBlockCache.instance.lookup(SAMPLE_BLOCK.number!)
        await flushPromises()
        expect(transactions).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + block.number!
        ])

        mock.restore()
    })

    test("returns null when block count is missing", async () => {
        const block = {...SAMPLE_BLOCK, count: undefined}
        const mock = new MockAdapter(axios as any);
        mock.onGet("/api/v1/blocks/" + SAMPLE_BLOCK.number).reply(200, block);

        const transactions = await TransactionGroupByBlockCache.instance.lookup(SAMPLE_BLOCK.number!)
        await flushPromises()
        expect(transactions).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + block.number!
        ])

        mock.restore()
    })

    test("caps request limit at 100 when block count exceeds 100", async () => {
        const bigBlock = {...SAMPLE_BLOCK, count: 150}
        const mock = new MockAdapter(axios as any);
        mock.onGet("/api/v1/blocks/" + SAMPLE_BLOCK.number).reply(200, bigBlock);

        let capturedLimit: number | undefined
        mock.onGet("/api/v1/transactions").reply(((config: AxiosRequestConfig) => {
            capturedLimit = config.params.limit
            return [200, SAMPLE_BLOCK_TRANSACTIONS]
        }) as any)

        await TransactionGroupByBlockCache.instance.lookup(SAMPLE_BLOCK.number!)
        await flushPromises()
        expect(capturedLimit).toBe(100)

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + bigBlock.number!,
            "api/v1/transactions",
        ])

        mock.restore()
    })

    test("follows pagination links to collect all transactions", async () => {
        const block = SAMPLE_BLOCK
        const [t0, t1, t2] = SAMPLE_BLOCK_TRANSACTIONS.transactions!
        const page1: TransactionResponse = {
            transactions: [t0, t1],
            links: {next: "/api/v1/transactions?timestamp=gte:X&timestamp=lt:Y&limit=2"}
        }
        const page2: TransactionResponse = {transactions: [t2], links: {next: null}}

        const mock = new MockAdapter(axios as any);
        mock.onGet("/api/v1/blocks/" + SAMPLE_BLOCK.number).reply(200, block);

        let callCount = 0
        // Use regex to match both the initial request and the pagination URL (which embeds query params inline)
        mock.onGet(/\/api\/v1\/transactions/).reply((() => {
            callCount++
            return callCount === 1 ? [200, page1] : [200, page2]
        }) as any)

        const transactions = await TransactionGroupByBlockCache.instance.lookup(SAMPLE_BLOCK.number!)
        await flushPromises()
        expect(transactions).toStrictEqual([t0, t1, t2])
        // block fetch + first page + second page
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + block.number!,
            "api/v1/transactions",
            "/api/v1/transactions?timestamp=gte:X&timestamp=lt:Y&limit=2",
        ])

        mock.restore()
    })
})
