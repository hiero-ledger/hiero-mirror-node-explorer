// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils";
import TokenCell, {TokenCellItem} from "@/components/token/TokenCell.vue";
import Oruga from "@oruga-ui/oruga-next";
import {SAMPLE_ASSOCIATED_TOKEN, SAMPLE_NONFUNGIBLE} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {fetchGetURLs} from "../MockUtils";
import router from "@/utils/RouteManager.ts";

describe("TokenCell.vue", () => {

    test("default props", async () => {

        const mock = new MockAdapter(axios as any);

        const wrapper = mount(TokenCell, {
            global: {
                plugins: [Oruga]
            },
            props: {},
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([])

        expect(wrapper.text()).toBe('?')

        wrapper.unmount()
    })

    test("tokenId and default property", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)

        const tokenId = SAMPLE_NONFUNGIBLE.token_id
        const name = SAMPLE_NONFUNGIBLE.name

        const matcher1 = "/api/v1/tokens/" + tokenId
        mock.onGet(matcher1).reply(200, SAMPLE_NONFUNGIBLE);

        const wrapper = mount(TokenCell, {
            global: {
                plugins: [Oruga]
            },
            props: {
                tokenId: tokenId
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id,
        ])

        expect(wrapper.text()).toBe(name)

        wrapper.unmount()
    })

    test("tokenId and property for NFT", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)

        const token = SAMPLE_NONFUNGIBLE
        const tokenId = token.token_id

        const matcher1 = "/api/v1/tokens/" + tokenId
        mock.onGet(matcher1).reply(200, token);

        const wrapper = mount(TokenCell, {
            global: {
                plugins: [Oruga]
            },
            props: {
                tokenId: tokenId,
                property: TokenCellItem.tokenName
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/tokens/" + SAMPLE_NONFUNGIBLE.token_id,
        ])

        expect(wrapper.text()).toBe(token.name)

        await wrapper.setProps({
            property: TokenCellItem.tokenSymbol
        })
        await flushPromises()
        expect(wrapper.text()).toBe("ĦFRENSKINGD…")

        await wrapper.setProps({
            property: TokenCellItem.tokenType
        })
        await flushPromises()
        expect(wrapper.text()).toBe('NFT')

        await wrapper.setProps({
            property: TokenCellItem.tokenNbSerials,
            balanceOrNbSerials: 42,
        })
        await flushPromises()
        expect(wrapper.text()).toBe('42')

        await wrapper.setProps({
            property: TokenCellItem.tokenBalance,
            balanceOrNbSerials: 42,
        })
        await flushPromises()
        expect(wrapper.text()).toBe('')

        wrapper.unmount()
    })

    test("tokenId and property for Fungible", async () => {

        // Mock axios
        const mock = new MockAdapter(axios as any)

        const token = SAMPLE_ASSOCIATED_TOKEN
        const tokenId = token.token_id

        const matcher1 = "/api/v1/tokens/" + tokenId
        mock.onGet(matcher1).reply(200, token);

        const wrapper = mount(TokenCell, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                tokenId: tokenId,
                property: TokenCellItem.tokenName
            },
        })

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN.token_id,
        ])

        expect(wrapper.text()).toBe(token.name)

        await wrapper.setProps({
            property: TokenCellItem.tokenSymbol
        })
        await flushPromises()
        expect(wrapper.text()).toBe(token.symbol)

        await wrapper.setProps({
            property: TokenCellItem.tokenType
        })
        await flushPromises()
        expect(wrapper.text()).toBe('Fungible')

        await wrapper.setProps({
            property: TokenCellItem.tokenNbSerials,
            balanceOrNbSerials: 42,
        })
        await flushPromises()
        expect(wrapper.text()).toBe('')

        await wrapper.setProps({
            property: TokenCellItem.tokenBalance,
            balanceOrNbSerials: 42,
        })
        await flushPromises()
        expect(wrapper.text()).toBe('0.0042')

        wrapper.unmount()
    })
})

