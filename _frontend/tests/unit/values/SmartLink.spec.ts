// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import SmartLink from "@/components/values/link/SmartLink.vue";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {SAMPLE_NETWORK_NODES} from "../Mocks";
import router from "@/utils/RouteManager.ts";

describe("SmartLink.vue", () => {

    test("AccountLink; no extra", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const testEntityId = "0.0.4"
        const testRouteName = "AccountDetails"
        const testShowExtra = false
        const expectedEntityPath = "/account/" + testEntityId

        await testBody(testEntityId, testRouteName, testShowExtra, expectedEntityPath)

        mock.restore()
    });

    test("AccountLink; extra", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const testEntityId = "0.0.4"
        const testRouteName = "AccountDetails"
        const testShowExtra = true
        const expectedEntityPath = "/account/" + testEntityId

        await testBody(testEntityId, testRouteName, testShowExtra, expectedEntityPath)

        mock.restore()
    });

    test("TokenLink", async () => {
        const testEntityId = "0.0.42"
        const testRouteName = "TokenDetails"
        const testShowExtra = false
        const expectedEntityPath = "/token/" + testEntityId

        await testBody(testEntityId, testRouteName, testShowExtra, expectedEntityPath)
    });

    test("ContractLink", async () => {
        const testEntityId = "0.0.42"
        const testRouteName = "ContractDetails"
        const testShowExtra = false
        const expectedEntityPath = "/contract/" + testEntityId

        await testBody(testEntityId, testRouteName, testShowExtra, expectedEntityPath)
    });

    test("TopicLink", async () => {
        const testEntityId = "0.0.42"
        const testRouteName = "TopicDetails"
        const testShowExtra = false
        const expectedEntityPath = "/topic/" + testEntityId

        await testBody(testEntityId, testRouteName, testShowExtra, expectedEntityPath)
    });

    test("Invalid route", async () => {
        const testEntityId = ""
        const testRouteName = "InvalidRoute"
        const testShowExtra = false
        const expectedEntityPath = ""

        await testBody(testEntityId, testRouteName, testShowExtra, expectedEntityPath)
    });

});

const testBody = async (testEntityId: string, testRouteName: string, testShowExtra: boolean, expectedPath: string) => {

    await router.push("/") // To avoid "missing required param 'network'" error

    const wrapper = mount(SmartLink, {
        global: {
            plugins: [router]
        },
        props: {
            entityId: testEntityId,
            routeName: testRouteName,
            showExtra: testShowExtra
        },
    });
    await flushPromises()

    expect(wrapper.text()).toMatch(RegExp("^" + testEntityId))
    if (testEntityId) {
        expect(wrapper.findComponent("a").attributes("href")).toMatch(RegExp(expectedPath))
    }
    expect(wrapper.find(".h-is-extra-text").exists()).toBe(testShowExtra)

    wrapper.unmount()
    await flushPromises()
}
