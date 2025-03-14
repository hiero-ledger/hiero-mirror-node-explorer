// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import axios from "axios";
import {SAMPLE_CONTRACTS} from "../Mocks";
import Contracts from "@/pages/Contracts.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ContractTable from "@/components/contract/ContractTable.vue";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import {fetchGetURLs} from "../MockUtils";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("Contracts.vue", () => {

    test("no props", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const contracts = SAMPLE_CONTRACTS
        const matcher1 = "api/v1/contracts"
        mock.onGet(matcher1).reply(200, contracts);

        const wrapper = mount(Contracts, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts",
            "api/v1/contracts/" + SAMPLE_CONTRACTS.contracts[0].contract_id,
            "api/v1/tokens/" + SAMPLE_CONTRACTS.contracts[0].contract_id,
        ])

        expect((wrapper.vm as any).contractTableController.mounted.value).toBe(true)

        const card = wrapper.findComponent(DashboardCardV2)
        expect(card.exists()).toBe(true)
        expect(card.text()).toMatch(RegExp("^Recent Contracts"))

        const table = card.findComponent(ContractTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("IDCONTRACT NAMECREATEDMEMO")
        expect(table.get('tbody').text()).toBe(
            "0.0.749775" +
            " NOT VERIFIED " +
            "3:09:15.9474 PMMar 7, 2022, UTC" +
            "Mirror Node acceptance test: 2022-03-07T15:09:15.228564328Z Create contract"
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()

        // we now expect the controller to be still mounted since it is mounted by the ContractTable component
        // expect(wrapper.vm.contractTableController.mounted.value).toBe(true)
    });

});
