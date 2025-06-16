// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {RouteManager} from "@/utils/RouteManager.ts";
import {Router} from "vue-router";
import {ref} from "vue";
import {TokenAllowanceTableController} from "@/components/allowances/TokenAllowanceTableController.ts";
import TokenAllowanceTable from "@/components/allowances/TokenAllowanceTable.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

const tokenAllowances = {
    "allowances": [
        {
            "amount": 2132000000,
            "amount_granted": 2132000000,
            "owner": "0.0.1437",
            "spender": "0.0.1580",
            "timestamp": {"from": "1720188352.354070003", "to": null},
            "token_id": "0.0.3038008"
        },
        {
            "amount": 1200,
            "amount_granted": 1200,
            "owner": "0.0.1437",
            "spender": "0.0.1584",
            "timestamp": {"from": "1720624336.763775003", "to": null},
            "token_id": "0.0.3038008"
        },
        {
            "amount": 1400,
            "amount_granted": 1400,
            "owner": "0.0.1437",
            "spender": "0.0.1584",
            "timestamp": {"from": "1718973345.354498003", "to": null},
            "token_id": "0.0.3038433"
        }
    ], "links": {"next": null}
}

function makeRouter(): Router {
    const routeManager = new RouteManager()
    return routeManager.router
}

describe("HbarAllowanceTable.vue", () => {

    it("Should list token allowances", async () => {

        const mock = new MockAdapter(axios as any);
        const router = makeRouter()
        const accountId = ref("0.0.1437")
        const controller = new TokenAllowanceTableController(router, accountId, 15)

        mock
            .onGet("/api/v1/accounts/" + accountId.value + "/allowances/tokens")
            .reply(200, tokenAllowances)

        for (const allowance of tokenAllowances.allowances) {
            const tokenId = allowance.token_id
            const params = {
                'token.id': tokenId,
            }
            mock
                .onGet("/api/v1/accounts/" + accountId.value + "/tokens", {params: params})
                .reply(200, [{token_id: tokenId}])
        }

        const wrapper = mount(TokenAllowanceTable, {
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

        expect(wrapper.find('thead').text()).toBe("SPENDER TOKEN ID AMOUNT REMAINING AMOUNT GRANTED TIME")
        expect(wrapper.find('tbody').text()).toBe(
            "0.0.1580" + "0.0.3038008" + "?" + "2:05:52.3540 PMJul 5, 2024, UTC" +
            "0.0.1584" + "0.0.3038008" + "?" + "3:12:16.7637 PMJul 10, 2024, UTC" +
            "0.0.1584" + "0.0.3038433" + "?" + "12:35:45.3544 PMJun 21, 2024, UTC"
        )

        controller.unmount()
        wrapper.unmount()
        mock.restore()
        await flushPromises()
    });

});
