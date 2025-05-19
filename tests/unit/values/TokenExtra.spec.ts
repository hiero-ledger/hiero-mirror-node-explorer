// SPDX-License-Identifier: Apache-2.0


/*
    Bookmarks
        https://test-utils.vuejs.org/api/

 */

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils";
import router from "@/router";
import {SAMPLE_TOKEN, SAMPLE_TOKEN_DUDE} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import TokenExtra from "@/components/values/link/TokenExtra.vue";
import {truncateTokenSymbol} from "./TokenLink.spec";

describe("TokenExtra.vue", () => {

    it("no props then with token id", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher).reply(200, SAMPLE_TOKEN);
        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN_DUDE.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN_DUDE);

        const wrapper = mount(TokenExtra, {
            global: {
                plugins: [router]
            },
            props: {},
        });
        await flushPromises()
        expect(wrapper.text()).toBe("")


        await wrapper.setProps({
            tokenId: SAMPLE_TOKEN.token_id
        })
        await flushPromises()
        expect(wrapper.find('a').exists()).toBeFalsy()
        expect(wrapper.get('.h-is-extra-text').text()).toBe(truncateTokenSymbol(SAMPLE_TOKEN.symbol))

        await wrapper.setProps({
            useAnchor: true
        })
        await flushPromises()
        expect(wrapper.get('a').attributes('href')).toMatch(RegExp("/token/" + SAMPLE_TOKEN.token_id + "$"))
        expect(wrapper.get('.h-is-extra-text').text()).toBe(truncateTokenSymbol(SAMPLE_TOKEN.symbol))

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

});
