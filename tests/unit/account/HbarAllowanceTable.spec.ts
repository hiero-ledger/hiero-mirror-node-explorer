// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {RouteManager} from "@/utils/RouteManager.ts";
import HbarAllowanceTable from "@/components/allowances/HbarAllowanceTable.vue";
import {HbarAllowanceTableController} from "@/components/allowances/HbarAllowanceTableController.ts";
import {Router} from "vue-router";
import {ref} from "vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

const cryptoAllowances = {
    "allowances": [
        {
            "amount": 10000000000,
            "amount_granted": 10000000000,
            "owner": "0.0.1437",
            "spender": "0.0.1584",
            "timestamp": {"from": "1739314530.266092586", "to": null}
        },
        {
            "amount": 1500000000,
            "amount_granted": 1500000000,
            "owner": "0.0.1437",
            "spender": "0.0.1515",
            "timestamp": {"from": "1718973027.174709785", "to": null}
        },
        {
            "amount": 1400000000,
            "amount_granted": 1400000000,
            "owner": "0.0.1437",
            "spender": "0.0.1414",
            "timestamp": {"from": "1718972957.394744003", "to": null}
        }
    ],
    "links": {"next": null}
}

function makeRouter(): Router {
    const routeManager = new RouteManager()
    return routeManager.router
}

describe("HbarAllowanceTable.vue", () => {

    it("Should list hbar allowances", async () => {

        const mock = new MockAdapter(axios as any);
        const router = makeRouter()
        const accountId = ref("0.0.1437")
        const controller = new HbarAllowanceTableController(router, accountId, 15)

        const matcher1 = "/api/v1/accounts/" + accountId.value + "/allowances/crypto"
        mock.onGet(matcher1).reply(200, cryptoAllowances)

        const wrapper = mount(HbarAllowanceTable, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                controller: controller
            },
        });
        controller.mount()
        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.find('thead').text()).toBe("SPENDER TIME AMOUNT AMOUNT GRANTED")
        expect(wrapper.find('tbody').text()).toBe(
            "0.0.1584" + "10:55:30.2660 PMFeb 11, 2025, UTC" + "100.00000000ℏ" + "100.00000000ℏ" +
            "0.0.1515" + "12:30:27.1747 PMJun 21, 2024, UTC" + "15.00000000ℏ" + "15.00000000ℏ" +
            "0.0.1414" + "12:29:17.3947 PMJun 21, 2024, UTC" + "14.00000000ℏ" + "14.00000000ℏ"
        )

        controller.unmount()
        wrapper.unmount()
        mock.restore()
        await flushPromises()
    });

});
