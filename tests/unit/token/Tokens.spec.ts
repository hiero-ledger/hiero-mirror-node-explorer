// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {SAMPLE_TOKENS} from "../Mocks";
import Tokens from "@/pages/Tokens.vue";
import TokenTable from "@/components/token/TokenTable.vue";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import {fetchGetURLs} from "../MockUtils";
import router from "@/utils/RouteManager.ts";
import Tokens_Fungible from "@/pages/Tokens_Fungible.vue";
import Tokens_Nfts from "@/pages/Tokens_Nfts.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("Tokens.vue", () => {

    test("no props", async () => {

        await router.push("/")

        const mock = new MockAdapter(axios as any);

        const matcher = "/api/v1/tokens"
        mock.onGet(matcher).reply(200, SAMPLE_TOKENS);

        const wrapper = mount(Tokens, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())


        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/tokens",
        ])

        const fungibleTab = wrapper.getComponent(Tokens_Fungible)
        expect(fungibleTab.text()).toMatch(RegExp("^Recent Fungible Token"))
        const table1 = fungibleTab.getComponent(TokenTable)
        expect(table1.get('thead').text()).toBe("TOKEN NAME SYMBOL")
        expect(table1.get('tbody').text()).toBe(
            SAMPLE_TOKENS.tokens[0].token_id +
            SAMPLE_TOKENS.tokens[0].name +
            SAMPLE_TOKENS.tokens[0].symbol +
            SAMPLE_TOKENS.tokens[1].token_id +
            SAMPLE_TOKENS.tokens[1].name +
            SAMPLE_TOKENS.tokens[1].symbol
        )

        const wrapper2 = mount(Tokens_Nfts, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())

        const nftsTab = wrapper2.getComponent(Tokens_Nfts)
        expect(nftsTab.text()).toMatch(RegExp("^Recent NFTs"))
        const table2 = nftsTab.getComponent(TokenTable)
        expect(table2.get('thead').text()).toBe("TOKEN NAME SYMBOL")
        expect(table2.get('tbody').text()).toBe(
            SAMPLE_TOKENS.tokens[0].token_id +
            SAMPLE_TOKENS.tokens[0].name +
            SAMPLE_TOKENS.tokens[0].symbol +
            SAMPLE_TOKENS.tokens[1].token_id +
            SAMPLE_TOKENS.tokens[1].name +
            SAMPLE_TOKENS.tokens[1].symbol
        )

        mock.restore()
        wrapper.unmount()
        wrapper2.unmount()
        await flushPromises()
    });

});
