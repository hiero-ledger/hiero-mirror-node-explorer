// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {SAMPLE_NETWORK_NODES} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("AccountLink.vue", () => {

    it("props.accountId set ; no extra", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const testAccountId = "0.0.42"
        const wrapper = mount(AccountLink, {
            global: {
                plugins: [router]
            },
            props: {
                accountId: testAccountId
            },
        });
        await flushPromises()

        expect(wrapper.text()).toBe(testAccountId)
        expect(wrapper.findComponent("a").attributes("href")).toMatch(
            RegExp("/account/" + testAccountId)
        )

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });


    it("props.accountId unset, nullLabel unset", async () => {

        const wrapper = mount(AccountLink, {
            global: {
                plugins: [router]
            },
            props: {},
        });

        expect(wrapper.text()).toBe("None")
        expect(wrapper.findComponent("a").exists()).toBe(false)

        wrapper.unmount()
        await flushPromises()
    });


    it("props.accountId unset, nullLabel set", async () => {

        const wrapper = mount(AccountLink, {
            global: {
                plugins: [router]
            },
            props: {
                nullLabel: "MINT"
            },
        });

        expect(wrapper.text()).toBe("MINT")
        expect(wrapper.findComponent("a").exists()).toBe(false)

        wrapper.unmount()
        await flushPromises()
    });


    it("props.extra set", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const testAccountId = "0.0.4"
        const testExtra = "Hosted by Hedera | East Coast, USA"
        const wrapper = mount(AccountLink, {
            global: {
                plugins: [router]
            },
            props: {
                accountId: testAccountId,
                showExtra: true
            },
        });

        await flushPromises()

        expect(wrapper.text()).toBe(testAccountId + testExtra)
        expect(wrapper.find(".h-is-extra-text").text()).toBe(testExtra)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });


});
