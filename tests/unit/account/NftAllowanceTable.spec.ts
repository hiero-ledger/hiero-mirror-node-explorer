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
import {NftAllowanceTableController} from "@/components/allowances/NftAllowanceTableController.ts";
import NftAllowanceTable from "@/components/allowances/NftAllowanceTable.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

const nfts = {
    "nfts": [
        {
            "account_id": "0.0.1437",
            "created_timestamp": "1718907067.177742003",
            "delegating_spender": null,
            "deleted": false,
            "metadata": "VGVzdA==",
            "modified_timestamp": "1719824983.267446180",
            "serial_number": 1,
            "spender": "0.0.1584",
            "token_id": "0.0.4458222"
        },
        {
            "account_id": "0.0.1437",
            "created_timestamp": "1718899707.180231003",
            "delegating_spender": null,
            "deleted": false,
            "metadata": "",
            "modified_timestamp": "1720771166.454882003",
            "serial_number": 12,
            "spender": "0.0.1789",
            "token_id": "0.0.4457902"
        },
        {
            "account_id": "0.0.1437",
            "created_timestamp": "1718899707.180231003",
            "delegating_spender": null,
            "deleted": false,
            "metadata": "",
            "modified_timestamp": "1720771166.454882003",
            "serial_number": 11,
            "spender": "0.0.1789",
            "token_id": "0.0.4457902"
        }
    ], "links": {"next": "/api/v1/accounts/0.0.1437/nfts?token.id=lte:0.0.4457902&serialnumber=lt:4"}
}

function makeRouter(): Router {
    const routeManager = new RouteManager()
    return routeManager.router
}

describe("HbarAllowanceTable.vue", () => {

    it("Should list nft allowances", async () => {

        const mock = new MockAdapter(axios as any);
        const router = makeRouter()
        const accountId = ref("0.0.1437")
        const controller = new NftAllowanceTableController(router, accountId, 15)

        mock
            .onGet("/api/v1/accounts/" + accountId.value + "/nfts")
            .reply(200, nfts)

        const wrapper = mount(NftAllowanceTable, {
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

        expect(wrapper.find('thead').text()).toBe("TOKEN ID SERIAL # SPENDER TIME")
        expect(wrapper.find('tbody').text()).toBe(
            "0.0.4458222" + "?" + "1" + "0.0.1584" + "9:09:43.2674 AMJul 1, 2024, UTC" +
            "0.0.4457902" + "?" + "12" + "0.0.1789" + "7:59:26.4548 AMJul 12, 2024, UTC" +
            "0.0.4457902" + "?" + "11" + "0.0.1789" + "7:59:26.4548 AMJul 12, 2024, UTC"
        )

        controller.unmount()
        wrapper.unmount()
        mock.restore()
        await flushPromises()
    });

});
