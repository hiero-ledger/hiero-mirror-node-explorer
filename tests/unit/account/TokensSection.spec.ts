// SPDX-License-Identifier: Apache-2.0

import {afterAll, beforeAll, describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {
    SAMPLE_ACCOUNT,
    SAMPLE_ASSOCIATED_TOKEN,
    SAMPLE_ASSOCIATED_TOKEN_2,
    SAMPLE_NFTS,
    SAMPLE_NONFUNGIBLE,
    SAMPLE_NONFUNGIBLE_DUDE,
    SAMPLE_PENDING_AIRDROPS,
    SAMPLE_TOKEN_RELATIONSHIP_1,
    SAMPLE_TOKEN_RELATIONSHIP_2
} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import TokensSection from "@/components/token/TokensSection.vue";
import Tabs from "@/components/Tabs.vue";
import {HMSF} from "@/utils/HMSF.ts";
import {fetchGetURLs} from "../MockUtils";
import router from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("TokensSection.vue", () => {

    const accountId = SAMPLE_ACCOUNT.account
    const SAMPLE_FUNGIBLE = {
        tokens: [
            SAMPLE_ASSOCIATED_TOKEN,
            SAMPLE_ASSOCIATED_TOKEN_2
        ]
    }

    const mock = new MockAdapter(axios as any);

    beforeAll(async () => {
        // For NFTs tab
        const matcher1 = `/api/v1/accounts/${accountId}/nfts`
        mock.onGet(matcher1).reply(200, SAMPLE_NFTS)
        const matcher2 = "/api/v1/tokens/" + SAMPLE_NFTS.nfts[0].token_id
        mock.onGet(matcher2).reply(200, SAMPLE_NONFUNGIBLE)

        // For Fungible tab
        const matcher3 = "/api/v1/tokens"
        mock.onGet(matcher3).reply(200, SAMPLE_FUNGIBLE)
        const matcher4 = "/api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN.token_id
        mock.onGet(matcher4).reply(200, SAMPLE_ASSOCIATED_TOKEN)
        const matcher5 = "/api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN_2.token_id
        mock.onGet(matcher5).reply(200, SAMPLE_ASSOCIATED_TOKEN_2)
        const token1 = SAMPLE_TOKEN_RELATIONSHIP_1.token_id
        const response1 = {tokens: [SAMPLE_TOKEN_RELATIONSHIP_1]}
        const matcher6 = "/api/v1/accounts/" + accountId + "/tokens?token.id=" + token1 + "&limit=1"
        mock.onGet(matcher6).reply(200, response1)
        const token2 = SAMPLE_TOKEN_RELATIONSHIP_2.token_id
        const response2 = {tokens: [SAMPLE_TOKEN_RELATIONSHIP_2]}
        const matcher7 = "/api/v1/accounts/" + accountId + "/tokens?token.id=" + token2 + "&limit=1"
        mock.onGet(matcher7).reply(200, response2)

        // For Pending Airdrops tab / NFTs sub-tab
        const matcher10 = `/api/v1/accounts/${accountId}/airdrops/pending`
        mock.onGet(matcher10).reply(200, SAMPLE_PENDING_AIRDROPS)
        const matcher11 = "/api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[0].token_id
        mock.onGet(matcher11).reply(200, SAMPLE_NONFUNGIBLE)
        const matcher12 = "/api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[3].token_id
        mock.onGet(matcher12).reply(200, SAMPLE_NONFUNGIBLE_DUDE)

        // For Pending Airdrops tab / Fungible sub-tab
        const matcher20 = `/api/v1/accounts/${accountId}/airdrops/pending`
        mock.onGet(matcher20).reply(200, SAMPLE_PENDING_AIRDROPS)
        const matcher21 = "/api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[1].token_id
        mock.onGet(matcher21).reply(200, SAMPLE_ASSOCIATED_TOKEN)
        const matcher22 = "/api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[2].token_id
        mock.onGet(matcher22).reply(200, SAMPLE_ASSOCIATED_TOKEN_2)
    })

    afterAll(() => {

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN.token_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/tokens?token.id=" + SAMPLE_ASSOCIATED_TOKEN.token_id + "&limit=1",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/tokens?token.id=" + SAMPLE_ASSOCIATED_TOKEN_2.token_id + "&limit=1",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN_2.token_id,

            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN.token_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/tokens?token.id=" + SAMPLE_ASSOCIATED_TOKEN.token_id + "&limit=1",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/tokens?token.id=" + SAMPLE_ASSOCIATED_TOKEN_2.token_id + "&limit=1",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN_2.token_id,

            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[1].token_id + "/nfts/2",
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[2].token_id,
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[2].token_id + "/nfts/1",

            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[1].token_id + "/nfts/2",
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[2].token_id,
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[2].token_id + "/nfts/1",
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id + "/nfts/2",
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id,
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id + "/nfts/1",
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id + "/nfts/342",

            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id + "/nfts/2",
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id,
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id + "/nfts/1",
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id + "/nfts/342",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN.token_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/tokens?token.id=" + SAMPLE_ASSOCIATED_TOKEN.token_id + "&limit=1",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/tokens?token.id=" + SAMPLE_ASSOCIATED_TOKEN_2.token_id + "&limit=1",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN_2.token_id,

            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/airdrops/pending",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN.token_id,
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/tokens?token.id=0.0.34332104&limit=1",
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account + "/tokens?token.id=0.0.49292859&limit=1",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN_2.token_id,

            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[1].token_id + "/nfts/2",
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[1].token_id,
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[2].token_id + "/nfts/1",
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[0].token_id,
            "api/v1/tokens/" + SAMPLE_PENDING_AIRDROPS.airdrops[3].token_id,

        ])

        mock.restore()
    })

    test("Tabs are present", async () => {

        const wrapper = mount(TokensSection, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                accountId: accountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const tokensSection = wrapper.find("#tokensSection")
        expect(tokensSection.exists()).toBe(true)

        const tab = tokensSection.findComponent(Tabs)
        expect(tab.exists()).toBe(true)

        const tabs = tab.findAll('li')
        expect(tabs.length).toBe(3)
        expect(tabs[0].text()).toBe('Fungible')
        expect(tabs[1].text()).toBe('NFTs')
        expect(tabs[2].text()).toBe('Pending Airdrops')

        wrapper.unmount()
        await flushPromises()
    });

    test("Airdrops sub-tabs are present", async () => {

        const wrapper = mount(TokensSection, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                accountId: accountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const tokensSection = wrapper.find("#tokensSection")
        expect(tokensSection.exists()).toBe(true)

        const tab = tokensSection.get('#tab-pendingAirdrop')
        await tab.trigger('click')

        const table = tokensSection.get('#pendingAirdropTable')

        const subtabs = table.findAll('li')
        expect(subtabs.length).toBe(2)
        expect(subtabs[0].text()).toBe('NFTs')
        expect(subtabs[1].text()).toBe('Fungible')

        wrapper.unmount()
        await flushPromises()
    });

    test("Content of NFTs tab", async () => {

        const wrapper = mount(TokensSection, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                accountId: accountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const tokensSection = wrapper.find("#tokensSection")
        const tab = tokensSection.get('#tab-nfts')
        await tab.trigger('click')
        await flushPromises()

        const nftsTable = tokensSection.get("#nftsTable")
        expect(nftsTable.find('thead').text()).toBe("IMAGE TOKEN ID SERIAL # COLLECTION NAME SYMBOL NFT NAME CREATOR")
        expect(nftsTable.find('tbody').text()).toBe(
            "NFT0.0.7483832Ħ Frens KingdomĦFRENSKINGD…" +
            "NFT0.0.7483831Ħ Frens KingdomĦFRENSKINGD…" +
            "NFT0.0.748383342Ħ Frens KingdomĦFRENSKINGD…"
        )

        wrapper.unmount()
        await flushPromises()
    });

    test("Content of Fungible tab", async () => {

        const wrapper = mount(TokensSection, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                accountId: accountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const tokensSection = wrapper.find("#tokensSection")
        const tab = tokensSection.get('#tab-fungible')
        await tab.trigger('click')
        await flushPromises()

        const associationsTable = tokensSection.get("#fungibleTable")
        expect(associationsTable.find('thead').text()).toBe("TOKEN ID NAME SYMBOL BALANCE")
        expect(associationsTable.find('tbody').text()).toBe(
            "0.0.34332104" + "HSUITE" + "HSuite" + "234,264.7909" +
            "0.0.49292859" + "Token SymbolA7" + "TokenA7" + "0.31669471"
        )

        wrapper.unmount()
        await flushPromises()
    });

    test("Content of Pending Airdrops tab", async () => {

        const wrapper = mount(TokensSection, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                accountId: accountId
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        const tokensSection = wrapper.find("#tokensSection")
        const tab = tokensSection.get('#tab-pendingAirdrop')
        await tab.trigger('click')
        await flushPromises()

        const table = tokensSection.get('#pendingAirdropTable')

        let subtab = table.get('#tab-nfts')
        await subtab.trigger('click')
        await flushPromises()

        const pendingNfts = table.get("#pendingNftsTable")
        expect(pendingNfts.find('thead').text()).toBe("IMAGE TOKEN ID SERIAL # COLLECTION NAME SYMBOL SENDER AIRDROP TIME")
        expect(pendingNfts.find('tbody').text()).toBe(
            "NFT" + "0.0.4901646" + "2" + "Token SymbolA7" + "TokenA7" + "0.0.1437" + "9:29:10.6225 AMOct 3, 2024, UTC" +
            "NFT" + "0.0.4901646" + "1" + "Token SymbolA7" + "TokenA7" + "0.0.1437" + "9:28:57.7817 AMOct 3, 2024, UTC"
        )

        subtab = table.get('#tab-fungible')
        await subtab.trigger('click')
        await flushPromises()

        const pendingFungible = table.get("#pendingFungibleTable")
        expect(pendingFungible.find('thead').text()).toBe("TOKEN ID NAME SYMBOL AMOUNT SENDER  AIRDROP TIME")
        expect(pendingFungible.find('tbody').text()).toBe(
            "0.0.4943664" + "Ħ Frens Kingdom" + "ĦFRENSKINGD…" + "84" + "0.0.1437" + "2:21:33.5553 PMOct 10, 2024, UTC" +
            "0.0.2255333" + "Ħ Frens Kingdom Dude" + "ĦFRENSKINGD…4,200" + "0.0.1437" + "2:27:26.2113 PMOct 10, 2024, UTC"
        )

        wrapper.unmount()
        await flushPromises()
    });
});
