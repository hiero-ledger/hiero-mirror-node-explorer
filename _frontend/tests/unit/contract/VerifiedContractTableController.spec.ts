// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test, vi} from 'vitest'
import {RouteManager} from "@/utils/RouteManager";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {Router} from "vue-router";
import {VerifiedContractTableController} from "@/components/contract/verified/VerifiedContractTableController.ts";
import {TableController} from "@/utils/table/TableController.ts";
import {fetchGetURLs} from "../MockUtils.ts";

function makeRouter(): Router {
    const routeManager = new RouteManager()
    return routeManager.router
}


describe("VerifiedContractTableController.ts", () => {

    test("mount + unmount", async () => {
        const PAGE_SIZE = 15

        const router = makeRouter()

        const mock = new MockAdapter(axios as any)
        const matcher1 = "http://localhost:3000/v2/contracts/295?limit=15"
        mock.onGet(matcher1).reply(200, SOURCIFY_RESPONSE_1)

        const tc = new VerifiedContractTableController(router, PAGE_SIZE)

        // Just after construction
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(150)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)

        // After any promise execution (none are expected so nothing should change)
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(150)
        expect(tc.rows.value).toStrictEqual([])
        expect(tc.mounted.value).toBe(false)

        // After mount()
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(150)
        expect(tc.rows.value).toStrictEqual(SOURCIFY_RESPONSE_1.results)
        expect(tc.mounted.value).toBe(true)

        // After unmount()
        await tc.unmount()
        expect(tc.pageSize.value).toBe(PAGE_SIZE)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(150)
        expect(tc.rows.value).toStrictEqual(SOURCIFY_RESPONSE_1.results)
        expect(tc.mounted.value).toBe(false)

        mock.restore()
    }, 30_000)


    test("", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "http://localhost:3000/v2/contracts/295?limit=15"
        mock.onGet(matcher1).reply(200, SOURCIFY_RESPONSE_1)
        const matcher2 = "http://localhost:3000/v2/contracts/295?limit=16&afterMatchId=27961334&sort=asc"
        mock.onGet(matcher2).reply(200, SOURCIFY_RESPONSE_2)
        const matcher3 = "http://localhost:3000/v2/contracts/295?limit=16&afterMatchId=28139683&sort=asc"
        mock.onGet(matcher3).reply(200, SOURCIFY_RESPONSE_3)

        const router = makeRouter()
        // await router.push("/testnet")

        const defaultPageSize = 15
        const tc = new VerifiedContractTableController(router, defaultPageSize)
        vi.useFakeTimers()

        // After mount()
        tc.mount()
        await flushPromises()
        expect(tc.pageSize.value).toBe(defaultPageSize)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(150) // 10 * defaultPageSize
        expect(tc.rows.value).toStrictEqual(SOURCIFY_RESPONSE_1.results)
        expect(tc.mounted.value).toBe(true)
        expect(fetchGetURLs(mock)).toStrictEqual([
            "http://localhost:3000/v2/contracts/295?limit=15",
        ])

        // After an auto refresh period
        vi.advanceTimersByTime(TableController.SLOW_REFRESH_PERIOD)   // => refresh
        await flushPromises()
        expect(tc.pageSize.value).toBe(defaultPageSize)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(150)
        expect(tc.rows.value.length).toBe(defaultPageSize)
        expect(tc.rows.value[0]).toStrictEqual(SOURCIFY_RESPONSE_2.results[1])
        expect(tc.rows.value[1]).toStrictEqual(SOURCIFY_RESPONSE_2.results[0])
        expect(tc.rows.value[2]).toStrictEqual(SOURCIFY_RESPONSE_1.results[0])
        expect(tc.mounted.value).toBe(true)
        expect(fetchGetURLs(mock)).toStrictEqual([
            "http://localhost:3000/v2/contracts/295?limit=15",
            "http://localhost:3000/v2/contracts/295?limit=16&afterMatchId=27961334&sort=asc",
        ])

        // After a second auto refresh period
        vi.advanceTimersByTime(TableController.SLOW_REFRESH_PERIOD)   // => refresh
        await flushPromises()
        expect(tc.pageSize.value).toBe(defaultPageSize)
        expect(tc.autoRefresh.value).toBe(true)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(150)
        expect(tc.rows.value.length).toBe(defaultPageSize)
        expect(tc.rows.value[0]).toStrictEqual(SOURCIFY_RESPONSE_3.results[1])
        expect(tc.rows.value[1]).toStrictEqual(SOURCIFY_RESPONSE_3.results[0])
        expect(tc.rows.value[2]).toStrictEqual(SOURCIFY_RESPONSE_2.results[1])
        expect(tc.rows.value[3]).toStrictEqual(SOURCIFY_RESPONSE_2.results[0])
        expect(tc.rows.value[4]).toStrictEqual(SOURCIFY_RESPONSE_1.results[0])
        expect(tc.mounted.value).toBe(true)
        expect(fetchGetURLs(mock)).toStrictEqual([
            "http://localhost:3000/v2/contracts/295?limit=15",
            "http://localhost:3000/v2/contracts/295?limit=16&afterMatchId=27961334&sort=asc",
            "http://localhost:3000/v2/contracts/295?limit=16&afterMatchId=28139683&sort=asc",
        ])

        // After unmount()
        await tc.unmount()
        expect(tc.pageSize.value).toBe(defaultPageSize)
        expect(tc.autoRefresh.value).toBe(false)
        expect(tc.currentPage.value).toBe(1)
        expect(tc.loading.value).toBe(false)
        expect(tc.totalRowCount.value).toBe(150)
        expect(tc.rows.value.length).toBe(defaultPageSize)
        expect(tc.rows.value[0]).toStrictEqual(SOURCIFY_RESPONSE_3.results[1])
        expect(tc.rows.value[1]).toStrictEqual(SOURCIFY_RESPONSE_3.results[0])
        expect(tc.rows.value[2]).toStrictEqual(SOURCIFY_RESPONSE_2.results[1])
        expect(tc.rows.value[3]).toStrictEqual(SOURCIFY_RESPONSE_2.results[0])
        expect(tc.rows.value[4]).toStrictEqual(SOURCIFY_RESPONSE_1.results[0])
        expect(tc.mounted.value).toBe(false)
        expect(fetchGetURLs(mock)).toStrictEqual([
            "http://localhost:3000/v2/contracts/295?limit=15",
            "http://localhost:3000/v2/contracts/295?limit=16&afterMatchId=27961334&sort=asc",
            "http://localhost:3000/v2/contracts/295?limit=16&afterMatchId=28139683&sort=asc",
        ])

        vi.useRealTimers()
        mock.restore()
    })
})


//
// https://sourcify.dev/server/v2/contracts/295?limit=15
//

const SOURCIFY_RESPONSE_1 = {
    "results": [
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x0000000000000000000000000000000000841784",
        "verifiedAt": "2026-04-15T04:32:53Z",
        "matchId": "27961334"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x000000000000000000000000000000000082A489",
        "verifiedAt": "2026-04-14T04:52:13Z",
        "matchId": "27924908"
    },
    {
        "match": "match",
        "creationMatch": null,
        "runtimeMatch": "match",
        "chainId": "296",
        "address": "0x8226214188f22B9ddA901fb9ac85781eA4500D83",
        "verifiedAt": "2026-04-11T21:48:05Z",
        "matchId": "27854486"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0xAf5f10FeFCa285F26e02ad8fdF7a9E845E1cA223",
        "verifiedAt": "2026-04-10T12:13:41Z",
        "matchId": "27811334"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x8DE8bBdbCD33Fe12fe21CC3B50A6FE079F184Fdc",
        "verifiedAt": "2026-04-10T12:13:29Z",
        "matchId": "27811332"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x84E1e6F9dAefAf91AD690f6E251505286A98F089",
        "verifiedAt": "2026-04-10T12:12:52Z",
        "matchId": "27811330"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x46ca89481a150369836c02f8D9b72916e42a7E46",
        "verifiedAt": "2026-04-10T12:12:27Z",
        "matchId": "27811280"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x454E24ee7FBa33Ab61563baaf23091ec42b25F59",
        "verifiedAt": "2026-04-10T12:12:08Z",
        "matchId": "27811276"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0xe158872cD19b8C13260ef66B0B33652376a36E73",
        "verifiedAt": "2026-04-10T12:11:46Z",
        "matchId": "27811266"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x873b64F255605AD219ddcCA96382422B1Bf578E9",
        "verifiedAt": "2026-04-10T12:11:26Z",
        "matchId": "27811262"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x315DBb37BB19220F932aA25Ba881AFC705c3C67E",
        "verifiedAt": "2026-04-10T12:11:14Z",
        "matchId": "27811260"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0xC618490530af70b6Ce22729250Ffe8b5086225cE",
        "verifiedAt": "2026-04-04T19:48:09Z",
        "matchId": "27595604"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x6238a4f9ad158dA64a4478FE64Ba0416b176cFC7",
        "verifiedAt": "2026-04-04T19:47:58Z",
        "matchId": "27595599"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0x281Feb02bb3AA41d3A75E24a06A1f142eEEA5C85",
        "verifiedAt": "2026-04-04T19:47:57Z",
        "matchId": "27595598"
    },
    {
        "match": "exact_match",
        "creationMatch": null,
        "runtimeMatch": "exact_match",
        "chainId": "296",
        "address": "0xe619F278352B4eED4465a176Df0B2A2F2CAf3557",
        "verifiedAt": "2026-04-04T19:47:40Z",
        "matchId": "27595597"
    }
]
}

//
// http://localhost:3000/v2/contracts/295?limit=151&afterMatchId=27961334&sort=asc
//

const SOURCIFY_RESPONSE_2 = {
    "results": [
        {
            "match": "exact_match",
            "creationMatch": null,
            "runtimeMatch": "exact_match",
            "chainId": "296",
            "address": "0x0000000000000000000000000000000000844BB0",
            "verifiedAt": "2026-04-16T05:18:05Z",
            "matchId": "27992736"
        },
        {
            "match": "exact_match",
            "creationMatch": null,
            "runtimeMatch": "exact_match",
            "chainId": "296",
            "address": "0xD9290C685B064F3A809Da7f2D9477Fe1DdAd6698",
            "verifiedAt": "2026-04-21T04:59:23Z",
            "matchId": "28139683"
        }
    ]
}

//
// http://localhost:3000/v2/contracts/295?limit=151&afterMatchId=28139683&sort=asc
//

const SOURCIFY_RESPONSE_3 = {
    "results": [
        {
            "match": "exact_match",
            "creationMatch": null,
            "runtimeMatch": "exact_match",
            "chainId": "296",
            "address": "0x32029A05e1340E99F811e730c34BE53CdbfE99E8",
            "verifiedAt": "2026-04-27T14:11:54Z",
            "matchId": "28342137"
        },
        {
            "match": "match",
            "creationMatch": null,
            "runtimeMatch": "match",
            "chainId": "296",
            "address": "0x000000000000000000000000000000000036a148",
            "verifiedAt": "2026-04-23T07:01:09Z",
            "matchId": "28201817"
        }
    ]
}

