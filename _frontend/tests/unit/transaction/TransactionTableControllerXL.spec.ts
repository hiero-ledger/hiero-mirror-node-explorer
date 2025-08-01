// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {RouteManager} from "@/utils/RouteManager";
import {ref} from "vue";
import {TransactionTableControllerXL} from "@/components/transaction/TransactionTableControllerXL";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {Router} from "vue-router";
import {SAMPLE_CONTRACTCALL_TRANSACTIONS} from "../Mocks";

function makeRouter(): Router {
    const routeManager = new RouteManager()
    return routeManager.router
}

describe("TransactionTableController.ts", () => {

    test("mount + unmount", async () => {
        const PAGE_SIZE = 5
        //
        // const mock = new MockAdapter(axios as any)

        const router = makeRouter()
        const accountId = ref<string | null>(null)

        const tc = new TransactionTableControllerXL(router, accountId, PAGE_SIZE, true, "testKey")

        // Just after construction
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)

        // After any promise execution (none are expected so nothing should change)
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)

        // After mount()
        // tc.accountId is null
        //      => rows array is empty
        //      => auto refresh is active
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(true)

        // After unmount()
        tc.unmount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
    })

    test("route with p/k + mount + accountId setup + unmount", async () => {
        const PAGE_SIZE = 5

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS)

        const router = makeRouter()
        const accountId = ref<string | null>(null)

        const tc = new TransactionTableControllerXL(router, accountId, PAGE_SIZE, true, "testKey")

        // Preset p and k params in current route
        const TIMESTAMP0 = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].consensus_timestamp
        await tc.router.replace({query: {p: 10, k: TIMESTAMP0}})
        await flushPromises()

        // Mount
        // After mount:
        //      - auto-refresh is disabled because p/k is set
        //      - row array is empty because accountId is null
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(true)

        // Setup account id
        // After setup:
        //      - auto-refresh is enabled
        //      - row array contains transactions from SAMPLE_CONTRACTCALL_TRANSACTIONS
        accountId.value = "0.0.4" // Value is unimportant
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(2)
        expect(tc.rows.value).toStrictEqual(SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions)
        expect(tc.mounted.value).toBe(true)


        // After unmount()
        tc.unmount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)

        mock.restore()
    })

    test("route with p/k + accountId setup + mount + unmount", async () => {
        const PAGE_SIZE = 5

        const ACCOUNT_ID = "0.0.4"
        const TIMESTAMP0 = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].consensus_timestamp

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions"
        const param1 = {
            limit: PAGE_SIZE,
            order: "desc",
            "account.id": ACCOUNT_ID,
            "timestamp": "lte:" + TIMESTAMP0
        }
        mock.onGet(matcher1, {params: param1}).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS)

        // Setup controller
        const router = makeRouter()
        const accountId = ref<string | null>(null)
        const tc = new TransactionTableControllerXL(router, accountId, PAGE_SIZE, true, "testKey")

        // Preset p and k params in current route
        await tc.router.replace({query: {p: 10, k: TIMESTAMP0}})
        await flushPromises()

        // Setup account id
        accountId.value = "0.0.4" // Value is unimportant
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)

        // Mount
        // After mount:
        //      - auto-refresh is disabled because p/k is set
        //      - current page is 10
        //      - row array contains SAMPLE_CONTRACTCALL_TRANSACTIONS
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(10)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(47)
        expect(tc.rows.value).toStrictEqual(SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions)
        expect(tc.mounted.value).toBe(true)


        // After unmount()
        tc.unmount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(10)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)

        mock.restore()
    })

    test("mount + transactionType setup + unmount [accountMandatory=false]", async () => {
        const PAGE_SIZE = 5

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/transactions"
        const params1 = {limit: 5, order: "desc"}
        mock.onGet(matcher1, {params: params1}).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS)

        const matcher2 = "/api/v1/transactions"
        const params2 = {limit: 5, order: "desc", transactiontype: "CONTRACTCALL"}
        mock.onGet(matcher2, {params: params2}).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS)

        const matcher3 = "/api/v1/transactions"
        const params3 = {limit: 5, order: "desc", transactiontype: "CRYPTOTRANSFER"}
        mock.onGet(matcher3, {params: params3}).reply(200, [])

        const router = makeRouter()
        const accountId = ref<string | null>(null)
        const tc = new TransactionTableControllerXL(router, accountId, PAGE_SIZE, false, "testKey")
        const currentRoute = tc.router.currentRoute

        // Sanity checks
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(currentRoute.value.query).toStrictEqual({})
        expect(mock.history.get.length).toBe(0)

        // Mount
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(2)
        expect(tc.rows.value).toStrictEqual(SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions)
        expect(tc.mounted.value).toBe(true)
        expect(currentRoute.value.query).toStrictEqual({})
        expect(mock.history.get.length).toBe(1)

        // Filter CRYPTOTRANSFER
        tc.transactionType.value = "CRYPTOTRANSFER"
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(0)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(true)
        expect(currentRoute.value.query).toStrictEqual({type: "cryptotransfer"})
        expect(mock.history.get.length).toBe(2)

        // Filter CONTRACTCALL
        tc.transactionType.value = "CONTRACTCALL"
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(2)
        expect(tc.rows.value).toStrictEqual(SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions)
        expect(tc.mounted.value).toBe(true)
        expect(currentRoute.value.query).toStrictEqual({type: "contractcall"})
        expect(mock.history.get.length).toBe(3)

        // All transaction types
        tc.transactionType.value = ""
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.totalRowCount.value).toBe(2)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(2)
        expect(tc.rows.value).toStrictEqual(SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions)
        expect(tc.mounted.value).toBe(true)
        expect(currentRoute.value.query).toStrictEqual({})
        expect(mock.history.get.length).toBe(4)


        // After unmount()
        tc.unmount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(50)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(currentRoute.value.query).toStrictEqual({})
        expect(mock.history.get.length).toBe(4)

        mock.restore()
    })
})
