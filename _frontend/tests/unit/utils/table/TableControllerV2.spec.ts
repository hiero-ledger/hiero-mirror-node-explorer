// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test, vi} from "vitest";
import {Router} from "vue-router";
import {RouteManager} from "@/utils/RouteManager.ts";
import {flushPromises} from "@vue/test-utils";
import {TableControllerV2} from "@/utils/table/TableControllerV2.ts";
import {ref} from "vue";

function makeRouter(): Router {
    const routeManager = new RouteManager()
    return routeManager.router
}


describe("TableControllerV2.ts", () => {

    test("mount + auto-refresh + goToPage + unmount", async () => {
        const PAGE_SIZE = 7
        const UPDATE_PERIOD = 10

        const tc = new TestTableController(makeRouter(), UPDATE_PERIOD, PAGE_SIZE)
        vi.useFakeTimers()

        // Just after construction
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(0)

        // After any promise execution (none are expected so nothing should change)
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(0)

        // After mount()
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(1)

        // After half auto refresh period
        vi.advanceTimersByTime(UPDATE_PERIOD / 2)   // Not enough to trigger a refresh
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(1)

        // After half auto refresh period
        vi.advanceTimersByTime(UPDATE_PERIOD / 2)   // full period => refresh
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(1)

        // After another auto refresh period
        vi.advanceTimersByTime(UPDATE_PERIOD)   // +10 => next refresh
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(2)
        expect(tc.tailLoadCount).toBe(1)

        // Move to page 2 => auto refresh stop
        await tc.moveToPage(2)
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(2)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([93, 92, 91, 90, 89, 88, 87])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(2)
        expect(tc.tailLoadCount).toBe(2)

        // Wait for another period => check auto refresh is still disable
        vi.advanceTimersByTime(UPDATE_PERIOD)
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(2)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([93, 92, 91, 90, 89, 88, 87])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(2)
        expect(tc.tailLoadCount).toBe(2)


        // After unmount()
        tc.unmount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(2)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([93, 92, 91, 90, 89, 88, 87])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(2)
        expect(tc.tailLoadCount).toBe(2)

        // After reset()
        await tc.reset()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(2)
        expect(tc.tailLoadCount).toBe(2)

    })

    test("mount + goToPage x 3 + startAutoRefresh + unmount", async () => {
        const PAGE_SIZE = 7
        const UPDATE_PERIOD = 10

        const tc = new TestTableController(makeRouter(), UPDATE_PERIOD, PAGE_SIZE)

        // Just after construction
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(0)

        // After any promise execution (none are expected so nothing should change)
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(0)

        // After mount()
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(1)

        // Move to page 1
        await tc.moveToPage(1)
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)            // auto-refresh is now stopped
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(1)

        // Move to page 2
        await tc.moveToPage(2)
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(2)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([93, 92, 91, 90, 89, 88, 87])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(2)

        // Move to page 15  (last page of 3 rows)
        await tc.moveToPage(15)
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(15)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(101) // Exact row number because data have been drained
        expect(tc.rows.value).toStrictEqual([2, 1, 0])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(15)

        // Start auto-refresh
        tc.startAutoRefresh()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(15)

        // After unmount()
        tc.unmount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(15)

        // After reset()
        await tc.reset()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(15)
    })

    test("mount + refresh + sourcesDidChange + moveToPage + sourcesDidChange + unmount", async () => {
        const PAGE_SIZE = 7
        const UPDATE_PERIOD = 10

        const tc = new TestTableController(makeRouter(), UPDATE_PERIOD, PAGE_SIZE)
        vi.useFakeTimers()

        // Just after construction
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(0)

        // After any promise execution (none are expected so nothing should change)
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(0)

        // After mount()
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(0)
        expect(tc.tailLoadCount).toBe(1)

        // After an auto refresh period
        vi.advanceTimersByTime(UPDATE_PERIOD)   // +10 => refresh
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(1)

        // Update tc.source => preserves auto-refresh and triggers a refresh
        tc.source.value += 1
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(2) // Changing source resets buffer => tailLoad is called

        // Move to page 2 => disables auto-refresh
        await tc.moveToPage(2)
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(2)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([93, 92, 91, 90, 89, 88, 87])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(3)

        // Update tc.source => keeps auto-refreshes disabled and moves to page 1
        tc.source.value += 1
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(true)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(4)

        // After unmount()
        tc.unmount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([100, 99, 98, 97, 96, 95, 94])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(4)

        // After reset()
        await tc.reset()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(70)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)
        expect(tc.headLoadCount).toBe(1)
        expect(tc.tailLoadCount).toBe(4)

    })


    test("TestTableController", async () => {

        const tc = new TestTableController(makeRouter(), 10, 5)
        expect(tc.keyFor(10)).toBe(10)
        expect(tc.stringFromKey(10)).toBe("10")
        expect(tc.keyFromString("10")).toBe(10)

        expect(await tc.headLoad(10, 3)).toStrictEqual([13, 12, 11])
        expect(await tc.headLoad(98, 10)).toStrictEqual([100, 99])

        expect(await tc.tailLoad(10, 4)).toStrictEqual([9, 8, 7, 6])
        expect(await tc.tailLoad(5, 10)).toStrictEqual([4, 3, 2, 1, 0])
    })

})


class TestTableController extends TableControllerV2<number, number> {

    public source = ref<number>(0)
    public headLoadCount = 0
    public tailLoadCount = 0
    private testRows: number[] = []

    //
    // Package
    //

    constructor(router: Router, updatePeriod: number, defaultPageSize: number) {
        super(router, updatePeriod, 3, "p", defaultPageSize, "testStorageKey")
        for (let i = 0; i <= 100; i += 1) {
            this.testRows.push(i)
        }
        this.watchAndReload([this.source])
    }

    //
    // TableControllerV2
    //

    public keyFor(row: number): number {
        return row
    }

    public stringFromKey(key: number): string {
        return key.toString()
    }

    public keyFromString(s: string): number | null {
        const result = Number(s)
        return Number.isNaN(result) ? null : result
    }


    public async headLoad(afterKey: number, limit: number): Promise<number[] | null> {
        this.headLoadCount += 1
        const startIndex = afterKey+1
        const endIndex = Math.min(startIndex + limit, this.testRows.length)
        return this.testRows.slice(startIndex, endIndex).reverse()
    }

    public async tailLoad(beforeKey: number|null, limit: number): Promise<number[] | null> {
        this.tailLoadCount += 1
        const bk = beforeKey ?? this.testRows.length
        const startIndex = Math.max(bk - limit, 0)
        const endIndex = Math.min(startIndex + limit, bk)
        return this.testRows.slice(startIndex, endIndex).reverse()
    }

}
