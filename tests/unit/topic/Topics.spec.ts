// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import axios from "axios";
import {SAMPLE_CREATETOPIC_TRANSACTIONS} from "../Mocks";
import Topics from "@/pages/Topics.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import TopicTable from "@/components/topic/TopicTable.vue";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("Topics.vue", () => {

    test("no props", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any)

        const matcher = "api/v1/transactions"
        mock.onGet(matcher).reply(200, SAMPLE_CREATETOPIC_TRANSACTIONS)

        const wrapper = mount(Topics, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())

        const card = wrapper.findComponent(DashboardCardV2)
        expect(card.exists()).toBe(true)
        expect(card.text()).toMatch(RegExp("^Recent Topics"))

        const table = card.findComponent(TopicTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("TOPICCREATEDMEMO")
        expect(table.get('tbody').text()).toBe(
            "0.0.750040" +
            "6:14:56.3105 PMMar 7, 2022, UTC" +
            "None"
            +
            "0.0.749794" +
            "3:14:06.1051 PMMar 7, 2022, UTC" +
            "Mirror Node acceptance test: 2022-03-07T15:14:18.167555058Z Create Topic"
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

});
