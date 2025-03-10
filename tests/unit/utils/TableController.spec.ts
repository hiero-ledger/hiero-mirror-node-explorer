// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest'
import {computed, nextTick, Ref, ref} from "vue";
import {flushPromises} from "@vue/test-utils";
import {KeyOperator, SortOrder, TableController} from "@/utils/table/TableController";
import {RouteManager} from "@/utils/RouteManager";
import {Router} from "vue-router";

describe("TableController.ts", () => {

    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    test("load() sanity check", async () => {
        const tc = new TestTableController(0, 50, 10)
        expect(tc.bare.value).toBe(true)

        const dummyOp = KeyOperator.lt

        // No key

        let rows = await tc.load(null, dummyOp, SortOrder.ASC, 10)
        expect(rows).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])

        rows = await tc.load(null, dummyOp, SortOrder.DESC, 10)
        expect(rows).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])


        // With key
        const key = 7

        // ASC
        rows = await tc.load(key, KeyOperator.lt, SortOrder.ASC, 10)
        expect(rows).toStrictEqual([0, 1, 2, 3, 4, 5, 6])

        rows = await tc.load(key, KeyOperator.lte, SortOrder.ASC, 10)
        expect(rows).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7])

        rows = await tc.load(key, KeyOperator.gt, SortOrder.ASC, 10)
        expect(rows).toStrictEqual([8, 9, 10, 11, 12, 13, 14, 15, 16, 17])

        rows = await tc.load(key, KeyOperator.gte, SortOrder.ASC, 10)
        expect(rows).toStrictEqual([7, 8, 9, 10, 11, 12, 13, 14, 15, 16])

        // DESC

        rows = await tc.load(key, KeyOperator.lt, SortOrder.DESC, 10)
        expect(rows).toStrictEqual([6, 5, 4, 3, 2, 1, 0])

        rows = await tc.load(key, KeyOperator.lte, SortOrder.DESC, 10)
        expect(rows).toStrictEqual([7, 6, 5, 4, 3, 2, 1, 0])

        rows = await tc.load(key, KeyOperator.gt, SortOrder.DESC, 10)
        expect(rows).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])

        rows = await tc.load(key, KeyOperator.gte, SortOrder.DESC, 10)
        expect(rows).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])

        // Load count
        expect(tc.loadCounter).toBe(10)

    })


    test("mount / unmount", async () => {
        const tc = new TestTableController(0, 50, 10)
        const currentRoute = tc.router.currentRoute

        expect(tc.pageSize.value).toBe(10)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(TestTableController.PRESUMED_ROW_COUNT)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.loadCounter).toBe(0)
        expect(tc.bare.value).toBe(true)
        expect(currentRoute.value.query).toStrictEqual({})

        await flushPromises()

        expect(tc.pageSize.value).toBe(10)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(TestTableController.PRESUMED_ROW_COUNT)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.loadCounter).toBe(0)
        expect(tc.bare.value).toBe(true)
        expect(currentRoute.value.query).toStrictEqual({})

        // 1) mount

        tc.mount()
        await flushPromises()

        expect(tc.pageSize.value).toBe(10)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(TestTableController.PRESUMED_ROW_COUNT)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.mounted.value).toBe(true)
        expect(tc.loadCounter).toBe(1)
        expect(tc.bare.value).toBe(false)
        expect(currentRoute.value.query).toStrictEqual({})

        // 2) unmount
        tc.unmount()
        await flushPromises()

        expect(tc.pageSize.value).toBe(10)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(TestTableController.PRESUMED_ROW_COUNT)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.loadCounter).toBe(1)
        expect(tc.bare.value).toBe(true)
        expect(currentRoute.value.query).toStrictEqual({})

    })


    test("autoRefresh & autoStopped", async () => {
        const tc = new TestTableController(0, 50, 10)
        const currentRoute = tc.router.currentRoute

        // Mount
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.loadCounter).toBe(1)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #1
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #2
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(2)
        expect(tc.loadCounter).toBe(3)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #3
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(3)
        expect(tc.loadCounter).toBe(4)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #4
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(4)
        expect(tc.loadCounter).toBe(5)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #5
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(5)
        expect(tc.loadCounter).toBe(6)
        expect(currentRoute.value.query).toStrictEqual({k: "49", p: "1"})

        // Unmount
        tc.unmount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.refreshCount.value).toBe(5)
        expect(tc.loadCounter).toBe(6)
        expect(currentRoute.value.query).toStrictEqual({k: "49", p: "1"})

    })


    test("autoRefresh & new entries", async () => {
        const tc = new TestTableController(0, 50, 10)
        const currentRoute = tc.router.currentRoute

        // Mount
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.loadCounter).toBe(1)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #1
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({})

        // Generates 2 new entries in tc
        tc.endKey += 2

        // Refresh #2
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([51, 50, 49, 48, 47, 46, 45, 44, 43, 42])
        expect(tc.refreshCount.value).toBe(2)
        expect(tc.loadCounter).toBe(3)
        expect(currentRoute.value.query).toStrictEqual({})

        // Generates one page of entries => tc will trash buffer tail
        tc.endKey += tc.pageSize.value

        // Refresh #3
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([61, 60, 59, 58, 57, 56, 55, 54, 53, 52])
        expect(tc.refreshCount.value).toBe(3)
        expect(tc.loadCounter).toBe(4)
        expect(currentRoute.value.query).toStrictEqual({})

        // Unmount
        tc.unmount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.refreshCount.value).toBe(3)
        expect(tc.loadCounter).toBe(4)
        expect(currentRoute.value.query).toStrictEqual({})

    })


    test("source watch and reload", async () => {
        const scale = ref(1)
        const tc = new TestTableController(0, 50, 10, computed(() => scale.value))
        const currentRoute = tc.router.currentRoute

        // Mount
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.loadCounter).toBe(1)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #1
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({})

        // Updates scale value
        scale.value = 2
        await nextTick()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([98, 96, 94, 92, 90, 88, 86, 84, 82, 80])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.loadCounter).toBe(3)
        expect(currentRoute.value.query).toStrictEqual({})

        // Unmount
        tc.unmount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.loadCounter).toBe(3)
        expect(currentRoute.value.query).toStrictEqual({})

    })


    test("paging", async () => {
        const tc = new TestTableController(0, 50, 10)
        const currentRoute = tc.router.currentRoute

        // Mount
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(1)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #1
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({})

        // Goto page #2
        tc.onPageChange(2)
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([39, 38, 37, 36, 35, 34, 33, 32, 31, 30])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.currentPage.value).toBe(2)
        expect(tc.loadCounter).toBe(3)
        expect(currentRoute.value.query).toStrictEqual({p: "2", k: "39"})

        // Goto page #4
        tc.onPageChange(4)
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([19, 18, 17, 16, 15, 14, 13, 12, 11, 10])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.currentPage.value).toBe(4)
        expect(tc.loadCounter).toBe(5) // 20 rows needed => one load for 12 + one load for 8
        expect(currentRoute.value.query).toStrictEqual({p: "4", k: "19"})
    })


    test("shadow pages", async () => {

        const tc = new TestTableController(0, 50, 10)
        const currentRoute = tc.router.currentRoute

        // Preset page and key query params
        await tc.router.replace({query: {p: "4", k: "19"}})
        await flushPromises()

        // Mount => page 4 is loaded
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([19, 18, 17, 16, 15, 14, 13, 12, 11, 10])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(4)
        expect(tc.loadCounter).toBe(1)
        expect(currentRoute.value.query).toStrictEqual({p: "4", k: "19"})

        // Goto page #2
        tc.onPageChange(2)
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([39, 38, 37, 36, 35, 34, 33, 32, 31, 30])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(2)
        expect(tc.loadCounter).toBe(3)
        expect(currentRoute.value.query).toStrictEqual({p: "2", k: "39"})

        // Goto page #3
        tc.onPageChange(3)
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([29, 28, 27, 26, 25, 24, 23, 22, 21, 20])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(3)
        expect(tc.loadCounter).toBe(3) // Page #3 has been loaded at the same time as page #2
        expect(currentRoute.value.query).toStrictEqual({p: "3", k: "29"})

        // Goto page #1
        tc.onPageChange(1)
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(4)
        expect(currentRoute.value.query).toStrictEqual({p: "1", k: "49"})

    })


    test("shadow pages (inconsistent)", async () => {

        const tc = new TestTableController(0, 50, 10)
        const currentRoute = tc.router.currentRoute

        // Preset page and key query params
        await tc.router.replace({query: {p: "40", k: "21"}})
        await flushPromises()

        // Mount => page 40 is loaded
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([21, 20, 19, 18, 17, 16, 15, 14, 13, 12])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(40)
        expect(tc.loadCounter).toBe(1)
        expect(currentRoute.value.query).toStrictEqual({p: "40", k: "21"})

        // Goto page #38
        tc.onPageChange(38)
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([41, 40, 39, 38, 37, 36, 35, 34, 33, 32])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(38)
        expect(tc.loadCounter).toBe(3)
        expect(currentRoute.value.query).toStrictEqual({p: "38", k: "41"})

        // Goto page #1
        tc.onPageChange(1)
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(4)
        expect(currentRoute.value.query).toStrictEqual({p: "1", k: "49"})

    })

    test("multiple controllers (sharing same router)", async () => {

        const router = makeRouter()
        const currentRoute = router.currentRoute

        const scale = computed(() => 1)
        const tc1 = new TestTableController(0, 50, 10, scale, "p1", "k1", router)
        const tc2 = new TestTableController(100, 200, 10, scale, "p2", "k2", router)

        // Mount tc1 and tc2
        tc1.mount()
        tc2.mount()
        await flushPromises()

        expect(tc1.autoRefresh.value).toBe(true)
        expect(tc1.totalRowCount.value).toBe(TestTableController.PRESUMED_ROW_COUNT)
        expect(tc1.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc1.refreshCount.value).toBe(0)
        expect(tc1.currentPage.value).toBe(1)
        expect(tc1.loadCounter).toBe(1)
        expect(currentRoute.value.query).toStrictEqual({})

        expect(tc2.autoRefresh.value).toBe(true)
        expect(tc2.rows.value).toStrictEqual([199, 198, 197, 196, 195, 194, 193, 192, 191, 190])
        expect(tc2.refreshCount.value).toBe(0)
        expect(tc2.currentPage.value).toBe(1)
        expect(tc2.loadCounter).toBe(1)
        expect(currentRoute.value.query).toStrictEqual({})

        // Goto page #4 in tc1
        tc1.onPageChange(4)
        await flushPromises()
        expect(tc1.autoRefresh.value).toBe(false)
        expect(tc1.rows.value).toStrictEqual([19, 18, 17, 16, 15, 14, 13, 12, 11, 10])
        expect(tc1.refreshCount.value).toBe(0)
        expect(tc1.currentPage.value).toBe(4)
        expect(tc1.loadCounter).toBe(4)
        expect(currentRoute.value.query).toStrictEqual({p1: "4", k1: "19"})

        // Goto page #2 in tc2
        tc2.onPageChange(2)
        await flushPromises()
        expect(tc2.autoRefresh.value).toBe(false)
        expect(tc2.rows.value).toStrictEqual([189, 188, 187, 186, 185, 184, 183, 182, 181, 180])
        expect(tc2.refreshCount.value).toBe(0)
        expect(tc2.currentPage.value).toBe(2)
        expect(tc2.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({p1: "4", k1: "19", p2: "2", k2: "189"})


    })

    test("mount + immediate stop auto refresh + unmount", async () => {
        const tc = new TestTableController(0, 50, 10)
        const currentRoute = tc.router.currentRoute

        // Mount + brutal stop
        tc.mount()
        tc.stopAutoRefresh()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({p: "1", k: "49"})
        expect(tc.getExecutedAbortCounter()).toBe(1)

        // Unmount
        tc.unmount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({p: "1", k: "49"})
        expect(tc.getExecutedAbortCounter()).toBe(1)
    })

    test("mount + stop + immediate start auto refresh", async () => {
        const tc = new TestTableController(0, 50, 10)
        const currentRoute = tc.router.currentRoute

        // Mount
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(1) // +1 "refresh" operation
        expect(currentRoute.value.query).toStrictEqual({})
        expect(tc.getExecutedAbortCounter()).toBe(0)

        // Stop + immediate start auto refresh
        tc.stopAutoRefresh() // Starts "move to page" operation : all rows are loaded => completes instantaneously
        tc.startAutoRefresh() // Starts a "refresh" operation
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(2) // +1 "refresh"
        expect(currentRoute.value.query).toStrictEqual({})
        expect(tc.getExecutedAbortCounter()).toBe(0)

        // Unmount
        tc.unmount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({})
        expect(tc.getExecutedAbortCounter()).toBe(0)
    })

    test("brutal", async () => {

        const tc = new TestTableController(0, 500, 10)
        const currentRoute = tc.router.currentRoute

        // Mount
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([499, 498, 497, 496, 495, 494, 493, 492, 491, 490])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(1) // +1 "refresh" operation
        expect(currentRoute.value.query).toStrictEqual({})
        expect(tc.getExecutedAbortCounter()).toBe(0)

        // Goto page 10, 20, 30 + play
        tc.onPageChange(10)
        tc.onPageChange(20)
        tc.onPageChange(30)
        tc.startAutoRefresh()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([499, 498, 497, 496, 495, 494, 493, 492, 491, 490])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(51) // +10 +20 +30 (aborted) "move to page" + 1 refresh
        expect(currentRoute.value.query).toStrictEqual({})
        expect(tc.getExecutedAbortCounter()).toBe(3)

        // Unmount
        tc.unmount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.loadCounter).toBe(51)
        expect(currentRoute.value.query).toStrictEqual({})
        expect(tc.getExecutedAbortCounter()).toBe(3)
    })

    test("updating sources between mount / unmount", async () => {

        const scale = ref(1)
        const tc = new TestTableController(0, 50, 10, scale)
        const currentRoute = tc.router.currentRoute

        // Mount
        tc.mount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(1) // +1 "refresh" operation
        expect(currentRoute.value.query).toStrictEqual({})
        expect(tc.getExecutedAbortCounter()).toBe(0)

        // Refresh #1
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([49, 48, 47, 46, 45, 44, 43, 42, 41, 40])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(2)
        expect(currentRoute.value.query).toStrictEqual({})

        // Update scale => this cancels scheduled refresh and starts another one
        scale.value = 2
        await nextTick()
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([98, 96, 94, 92, 90, 88, 86, 84, 82, 80])
        expect(tc.refreshCount.value).toBe(0)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(3)
        expect(currentRoute.value.query).toStrictEqual({})

        // Refresh #2
        vi.runOnlyPendingTimers()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.rows.value).toStrictEqual([98, 96, 94, 92, 90, 88, 86, 84, 82, 80])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loadCounter).toBe(4)
        expect(currentRoute.value.query).toStrictEqual({})

        // Unmount
        tc.unmount()
        await flushPromises()
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.refreshCount.value).toBe(1)
        expect(tc.loadCounter).toBe(4)
        expect(currentRoute.value.query).toStrictEqual({})
    })
})

function makeRouter(): Router {
    const routeManager = new RouteManager()
    return routeManager.router
}

class TestTableController extends TableController<number, number> {

    public static readonly PRESUMED_ROW_COUNT = 100
    public static readonly UPDATED_PERIOD = 5000
    public static readonly MAX_UPDATE_COUNT = 5
    public static readonly MAX_LIMIT = 12
    public static readonly STORAGE_KEY = "testTable"

    public startKey: number
    public endKey: number

    public loadCounter = 0

    private readonly scale: Ref<number>

    constructor(startKey: number, endKey: number, pageSize: number,
                scale: Ref<number> = computed(() => 1),
                pageParamName = "p", keyParamName = "k",
                router = makeRouter()) {
        super(router, pageSize,
            TestTableController.UPDATED_PERIOD,
            TestTableController.MAX_UPDATE_COUNT,
            TestTableController.MAX_LIMIT,
            TestTableController.STORAGE_KEY,
            pageParamName,
            keyParamName)
        this.startKey = startKey
        this.endKey = endKey
        this.scale = scale
        this.watchAndReload([scale])
    }

    //
    // TableController
    //

    keyFor(row: number): number {
        return row;
    }

    public stringFromKey(key: number): string {
        return key.toString()
    }

    public keyFromString(s: string): number | null {
        const n = parseInt(s)
        return isNaN(n) ? null : n
    }

    public async load(key: number | null, operator: KeyOperator, order: SortOrder, limit: number): Promise<number[] | null> {
        const result = new Array<number>()

        this.loadCounter += 1

        let fromKey: number
        let toKey: number
        if (key !== null) {
            key = key / this.scale.value
            key = Math.max(Math.min(key, this.endKey), this.startKey)
            switch (operator) {
                case KeyOperator.gt:
                    if (order == SortOrder.ASC) {
                        /*
                                  startKey                         key                             endKey
                                 |________________________________|_______________________________|
                                                                   |...................|
                         */
                        fromKey = key + 1
                        toKey = Math.min(fromKey + limit, this.endKey)
                    } else {
                        /*
                                  startKey                         key                             endKey
                                 |________________________________|_______________________________|
                                                                              |...................|
                         */
                        toKey = this.endKey
                        fromKey = Math.max(toKey - limit, key + 1)
                    }
                    break
                case KeyOperator.gte:
                    if (order == SortOrder.ASC) {
                        /*
                                  startKey                         key                             endKey
                                 |________________________________|_______________________________|
                                                                  |...................|
                         */
                        fromKey = key
                        toKey = Math.min(fromKey + limit, this.endKey)
                    } else {
                        /*
                                  startKey                         key                             endKey
                                 |________________________________|_______________________________|
                                                                              |...................|
                         */
                        toKey = this.endKey
                        fromKey = Math.max(toKey - limit, key)
                    }
                    break
                case KeyOperator.lt:
                    if (order == SortOrder.ASC) {
                        /*
                                  startKey                         key                             endKey
                                 |________________________________|_______________________________|
                                 |...................|
                         */
                        fromKey = this.startKey
                        toKey = Math.min(fromKey + limit, key)
                    } else {
                        /*
                                  startKey                         key                             endKey
                                 |________________________________|_______________________________|
                                              |...................|
                         */
                        toKey = key
                        fromKey = Math.max(toKey - limit, this.startKey)
                    }
                    break
                case KeyOperator.lte:
                    if (order == SortOrder.ASC) {
                        /*
                                  startKey                         key                             endKey
                                 |________________________________|_______________________________|
                                 |...................|
                         */
                        fromKey = this.startKey
                        toKey = Math.min(fromKey + limit, key + 1)
                    } else {
                        /*
                                  startKey                         key                             endKey
                                 |________________________________|_______________________________|
                                               |...................|
                         */
                        toKey = key + 1
                        fromKey = Math.max(toKey - limit, this.startKey)
                    }
                    break
            }
        } else {
            if (order == SortOrder.ASC) {
                /*
                          startKey                                                          endKey
                         |________________________________________________________________|
                         |...................|
                 */
                fromKey = this.startKey
                toKey = Math.min(fromKey + limit, this.endKey)
            } else {
                /*
                          startKey                                                          endKey
                         |________________________________________________________________|
                                                                      |...................|
                 */
                toKey = this.endKey
                fromKey = Math.max(this.endKey - limit, this.startKey)
            }
        }
        for (let k = fromKey; k < toKey; k += 1) {
            result.push(k * this.scale.value)
        }
        if (order == SortOrder.DESC) {
            result.reverse()
        }

        return result
    }
}
