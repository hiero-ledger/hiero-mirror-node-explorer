// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {SAMPLE_NETWORK_EXCHANGERATE, SAMPLE_NETWORK_SUPPLY,} from "../Mocks";
import Home from "@/pages/Home.vue";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import MarketDashboard from "@/components/dashboard/MarketDashboard.vue";
import {fetchGetURLs} from "../MockUtils";
import router from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("Home.vue", () => {

    test("no props", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher3 = "/api/v1/network/supply"
        mock.onGet(matcher3).reply(200, SAMPLE_NETWORK_SUPPLY);

        const matcher4 = "/api/v1/network/exchangerate"
        mock.onGet(matcher4).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const wrapper = mount(Home, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/network/exchangerate",
            "api/v1/network/supply",
            "api/v1/network/supply",
        ])

        const dash = wrapper.findComponent(MarketDashboard)
        expect(dash.exists()).toBe(true)
        expect(dash.text()).toBe(
            "HBAR PRICE" +
            "$0.2460" +
            "HBAR MARKET CAP" +
            "$5,186,816,738" +
            "HBAR RELEASED" +
            "21,084,620,884.43" +
            "HBAR TOTAL50,000,000,000")


        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });
});
