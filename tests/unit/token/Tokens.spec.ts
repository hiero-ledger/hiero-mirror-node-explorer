// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import axios from "axios";
import {SAMPLE_TOKENS} from "../Mocks";
import Tokens from "@/pages/Tokens.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import TokenTable from "@/components/token/TokenTable.vue";
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

describe("Tokens.vue", () => {

    test("no props", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

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
            "api/v1/tokens",
            "api/v1/tokens",
        ])

        expect((wrapper.vm as any).nftTableController.mounted.value).toBe(true)
        expect((wrapper.vm as any).tokenTableController.mounted.value).toBe(true)

        const cards = wrapper.findAllComponents(DashboardCardV2)
        expect(cards.length).toBe(2)

        expect(cards[0].text()).toMatch(RegExp("^Recent NFTs"))
        const table1 = cards[0].findComponent(TokenTable)
        expect(table1.exists()).toBe(true)
        expect(table1.get('thead').text()).toBe("TOKENNAMESYMBOL")
        expect(table1.get('tbody').text()).toBe(
            SAMPLE_TOKENS.tokens[0].token_id +
            SAMPLE_TOKENS.tokens[0].name +
            SAMPLE_TOKENS.tokens[0].symbol +
            SAMPLE_TOKENS.tokens[1].token_id +
            SAMPLE_TOKENS.tokens[1].name +
            SAMPLE_TOKENS.tokens[1].symbol
        )

        expect(cards[1].text()).toMatch(RegExp("^Recent Fungible Tokens"))
        const table2 = cards[1].findComponent(TokenTable)
        expect(table2.exists()).toBe(true)
        expect(table2.get('thead').text()).toBe("TOKENNAMESYMBOL")
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
        await flushPromises()

        expect((wrapper.vm as any).nftTableController.mounted.value).toBe(false)
        expect((wrapper.vm as any).tokenTableController.mounted.value).toBe(false)
    });

});
