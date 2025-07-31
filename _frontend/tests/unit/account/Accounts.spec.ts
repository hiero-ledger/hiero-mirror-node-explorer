// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {SAMPLE_ACCOUNTS, SAMPLE_TOKEN} from "../Mocks";
import Accounts from "@/pages/Accounts.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import AccountTable from "@/components/account/AccountTable.vue";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import router from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("Accounts.vue", () => {

    test("no props", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/accounts"
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNTS);

        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN)

        const wrapper = mount(Accounts, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())

        const card = wrapper.findComponent(DashboardCardV2)
        expect((wrapper.vm as any).accountTableController.mounted.value).toBe(true)
        expect(card.exists()).toBe(true)
        expect(card.text()).toMatch(RegExp("^Recent Accounts"))

        const table = card.findComponent(AccountTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("IDCREATEDTOKENSMEMOBALANCE")
        expect(table.get('tbody').text()).toBe(
            "0.0.730631" +
            "5:12:31.6676 AMFeb 28, 2022, UTC" +
            "1023423" +
            "None" +
            "23.42647909ℏ"
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()

        expect((wrapper.vm as any).accountTableController.mounted.value).toBe(false)
    });

});
