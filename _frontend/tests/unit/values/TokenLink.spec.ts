// SPDX-License-Identifier: Apache-2.0


/*
    Bookmarks
        https://test-utils.vuejs.org/api/

 */


import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils";
import TokenLink from "@/components/values/link/TokenLink.vue";
import {SAMPLE_TOKEN, SAMPLE_TOKEN_DUDE} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import router from "@/utils/RouteManager.ts";

describe("TokenLink.vue", () => {

    it("props.topicId set", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher).reply(200, SAMPLE_TOKEN);

        const wrapper = mount(TokenLink, {
            global: {
                plugins: [router]
            },
            props: {
                tokenId: SAMPLE_TOKEN.token_id
            },
        });

        await flushPromises()

        const testTokenId = SAMPLE_TOKEN.token_id
        expect(wrapper.text()).toBe(testTokenId)
        expect(wrapper.get("a").attributes("href")).toMatch(RegExp("/token/" + testTokenId + "$"))
        expect(wrapper.find(".h-is-extra-text").exists()).toBe(false)

        wrapper.unmount()
        mock.restore()
        await flushPromises()
    });

    it("props.topicId set and showExtra", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher).reply(200, SAMPLE_TOKEN);
        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN_DUDE.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN_DUDE);

        const wrapper = mount(TokenLink, {
            global: {
                plugins: [router]
            },
            props: {
                tokenId: SAMPLE_TOKEN.token_id,
                showExtra: true
            },
        });

        await flushPromises()

        expect(wrapper.text()).toBe(SAMPLE_TOKEN.token_id + truncateTokenSymbol(SAMPLE_TOKEN.symbol))
        expect(wrapper.get("a").attributes("href")).toMatch(RegExp("/token/" + SAMPLE_TOKEN.token_id + "$"))
        expect(wrapper.get(".h-is-extra-text").text()).toBe(truncateTokenSymbol(SAMPLE_TOKEN.symbol))

        await wrapper.setProps({
            tokenId: SAMPLE_TOKEN_DUDE.token_id
        })
        await flushPromises()

        expect(wrapper.text()).toBe(SAMPLE_TOKEN_DUDE.token_id + truncateTokenSymbol(SAMPLE_TOKEN_DUDE.symbol))
        expect(wrapper.get("a").attributes("href")).toMatch(RegExp("/token/" + SAMPLE_TOKEN_DUDE.token_id + "$"))
        expect(wrapper.get(".h-is-extra-text").text()).toBe(truncateTokenSymbol(SAMPLE_TOKEN_DUDE.symbol))

        wrapper.unmount()
        mock.restore()
        await flushPromises()
    });

    it("props.topicId unset", async () => {

        const wrapper = mount(TokenLink, {
            global: {
                plugins: [router]
            },
            props: {
                showNone: true
            },
        });

        expect(wrapper.text()).toBe("None")
        expect(wrapper.find("a").exists()).toBe(false)

        wrapper.unmount()
    });
});

export function truncateTokenSymbol(name: string, max = 40): string {
    return name.length > max ? name.slice(0, max) + '…' : name
}
