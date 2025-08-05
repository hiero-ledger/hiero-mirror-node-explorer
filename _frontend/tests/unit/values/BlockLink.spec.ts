// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {mount} from "@vue/test-utils"
import BlockLink from "@/components/values/BlockLink.vue";
import router from "@/utils/RouteManager.ts";

describe("BlockLink.vue", () => {

    it("should construct a valid BlockLink to block #12", async () => {

        const testBlockNumber = 12
        const wrapper = mount(BlockLink, {
            global: {
                plugins: [router]
            },
            props: {
                blockNumber: testBlockNumber
            },
        });

        expect(wrapper.text()).toBe(testBlockNumber.toString())
        expect(wrapper.findComponent("a").attributes("href")).toMatch(
            RegExp("/block/" + testBlockNumber + "$")
        )

        wrapper.unmount()
    });

    it("should construct an empty BlockLink", async () => {

        const wrapper = mount(BlockLink, {
            global: {
                plugins: [router]
            },
            props: {},
        });

        expect(wrapper.text()).toBe("")
        expect(wrapper.findComponent("a").exists()).toBe(false)

        wrapper.unmount()
    });
});
