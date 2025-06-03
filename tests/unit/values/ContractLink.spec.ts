// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {mount} from "@vue/test-utils"
import ContractLink from "@/components/values/link/ContractLink.vue";
import router from "@/utils/RouteManager.ts";

describe("ContractLink.vue", () => {

    test("topicId set", async () => {

        const testContractId = "0.0.42"
        const wrapper = mount(ContractLink, {
            global: {
                plugins: [router]
            },
            props: {
                contractId: testContractId
            },
        });

        expect(wrapper.text()).toBe(testContractId)
        expect(wrapper.findComponent("a").attributes("href")).toMatch(
            RegExp("/contract/" + testContractId + "$")
        )

        wrapper.unmount()
    });

    test("topicId unset", async () => {

        const wrapper = mount(ContractLink, {
            global: {
                plugins: [router]
            },
            props: {},
        });

        expect(wrapper.text()).toBe("None")
        expect(wrapper.findComponent("a").exists()).toBe(false)

        wrapper.unmount()
    });

});
