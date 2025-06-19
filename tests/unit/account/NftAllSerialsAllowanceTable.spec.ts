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
import {NftAllSerialsAllowanceTableController} from "@/components/allowances/NftAllSerialsAllowanceTableController.ts";
import NftAllSerialsAllowanceTable from "@/components/allowances/NftAllSerialsAllowanceTable.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

const nftAllSerialAllowances = {
    "allowances": [
        {
            "approved_for_all": true,
            "owner": "0.0.1437",
            "spender": "0.0.1500",
            "timestamp": {"from": "1719932599.298779090", "to": null},
            "token_id": "0.0.4457902"
        },
        {
            "approved_for_all": true,
            "owner": "0.0.1437",
            "spender": "0.0.1584",
            "timestamp": {"from": "1719932655.925687003", "to": null},
            "token_id": "0.0.4457902"
        },
        {
            "approved_for_all": true,
            "owner": "0.0.1437",
            "spender": "0.0.1584",
            "timestamp": {"from": "1719841119.811055842", "to": null},
            "token_id": "0.0.4458222"
        }
    ], "links": {"next": null}
}

function makeRouter(): Router {
    const routeManager = new RouteManager()
    return routeManager.router
}

describe("HbarAllowanceTable.vue", () => {

    it("Should list nft (approved for all) allowances", async () => {

        const mock = new MockAdapter(axios as any);
        const router = makeRouter()
        const accountId = ref("0.0.1437")
        const controller = new NftAllSerialsAllowanceTableController(router, accountId, 15)

        mock
            .onGet("/api/v1/accounts/" + accountId.value + "/allowances/nfts")
            .reply(200, nftAllSerialAllowances)

        for (const allowance of nftAllSerialAllowances.allowances) {
            const tokenId = allowance.token_id
            const params = {
                'token.id': tokenId,
            }
            mock
                .onGet("/api/v1/accounts/" + accountId.value + "/tokens", {params: params})
                .reply(200, [{token_id: tokenId}])
        }

        const wrapper = mount(NftAllSerialsAllowanceTable, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                controller: controller
            },
        });
        controller.mount()
        await flushPromises()

        expect(wrapper.find('thead').text()).toBe("SPENDER TOKEN ID TIME")
        expect(wrapper.find('tbody').text()).toBe(
            "0.0.1500" + "0.0.4457902" + "?" + "3:03:19.2987 PMJul 2, 2024, UTC" +
            "0.0.1584" + "0.0.4457902" + "?" + "3:04:15.9256 PMJul 2, 2024, UTC" +
            "0.0.1584" + "0.0.4458222" + "?" + "1:38:39.8110 PMJul 1, 2024, UTC"
        )

        controller.unmount()
        wrapper.unmount()
        mock.restore()
        await flushPromises()
    });

});
