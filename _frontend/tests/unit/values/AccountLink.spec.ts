// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import AccountLink from "@/components/values/link/AccountLink.vue";
import {SAMPLE_NETWORK_NODES} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import router from "@/utils/RouteManager.ts";

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
        const testExtra = "Node 1 (Hedera)"
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


    it("props.enableCopy unset: no copy button", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const wrapper = mount(AccountLink, {
            global: {
                plugins: [router]
            },
            props: {
                accountId: "0.0.42"
            },
        });
        await flushPromises()

        expect(wrapper.find("button.copy-icon-button").exists()).toBe(false)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });


    it("props.enableCopy set: copy button next to the account id", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const testAccountId = "0.0.42"
        const wrapper = mount(AccountLink, {
            global: {
                plugins: [router]
            },
            props: {
                accountId: testAccountId,
                noAnchor: true,
                enableCopy: true
            },
        });
        await flushPromises()

        expect(wrapper.text()).toBe(testAccountId)
        expect(wrapper.get("button.copy-icon-button").attributes("aria-label")).toBe("Copy " + testAccountId)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });


    it("props.enableCopy set but accountId unset: no copy button", async () => {

        const wrapper = mount(AccountLink, {
            global: {
                plugins: [router]
            },
            props: {
                nullLabel: "MINT",
                enableCopy: true
            },
        });
        await flushPromises()

        expect(wrapper.text()).toBe("MINT")
        expect(wrapper.find("button.copy-icon-button").exists()).toBe(false)

        wrapper.unmount()
        await flushPromises()
    });


});
