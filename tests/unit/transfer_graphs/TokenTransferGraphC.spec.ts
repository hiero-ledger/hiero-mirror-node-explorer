// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils";
import TokenTransferGraphC from "@/components/transfer_graphs/TokenTransferGraphC.vue";
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import {SAMPLE_TOKEN, SAMPLE_TOKEN_DUDE} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import router from "@/utils/RouteManager.ts";


const mock = new MockAdapter(axios as any);
const matcher1 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
mock.onGet(matcher1).reply(200, SAMPLE_TOKEN);
const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN_DUDE.token_id
mock.onGet(matcher2).reply(200, SAMPLE_TOKEN_DUDE);


describe("TokenTransferGraphC.vue", () => {

    test("Without transaction", async () => {

        const wrapper = mount(TokenTransferGraphC, {
            props: {},
        })

        await flushPromises()

        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe("")

        wrapper.unmount()
        await flushPromises()
    })

    //
    // Single Token
    //

    test("Single token, zero source, single dest", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.200", "amount": +10, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const wrapper = mount(TokenTransferGraphC, {
            global: {
                plugins: [router]
            },
            props: {
                transaction: transaction as Transaction
            },
        })

        await flushPromises()

        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe("MINT\n\n" +
            "1023423\n\n" +
            "0.0.200")

        wrapper.unmount()
        await flushPromises()
    })

    test("Single token, single source, single dest", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.100", "amount": -10, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +10, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const wrapper = mount(TokenTransferGraphC, {
            global: {
                plugins: [router]
            },
            props: {
                transaction: transaction as Transaction
            },
        })

        await flushPromises()

        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe(
            "0.0.100\n\n" +
            "1023423\n\n" +
            "0.0.200")

        wrapper.unmount()
        await flushPromises()
    })

    test("Single token, single source, two dest", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.100", "amount": -10, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +2, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.201", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const wrapper = mount(TokenTransferGraphC, {
            global: {
                plugins: [router]
            },
            props: {
                transaction: transaction as Transaction,
            },
        })

        await flushPromises()

        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe(
            "0.0.100\n\n" +
            "1023423\n\n" +
            "0.0.200\n\n\n\n" +
            "0.0.201")

        wrapper.unmount()
        await flushPromises()
    })

    test("Single token, two sources, zero dest", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.101", "amount": -3, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.100", "amount": -7, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const wrapper = mount(TokenTransferGraphC, {
            global: {
                plugins: [router]
            },
            props: {
                transaction: transaction as Transaction
            },
        })

        await flushPromises()

        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe("0.0.100\n\n" +
            "1023423\n\n" +
            "BURN0.0.101")

        wrapper.unmount()
        await flushPromises()
    })

    test("Single token, two sources, single dest", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.101", "amount": -3, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.100", "amount": -7, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +10, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const wrapper = mount(TokenTransferGraphC, {
            global: {
                plugins: [router]
            },
            props: {
                transaction: transaction as Transaction
            },
        })

        await flushPromises()

        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe(
            "0.0.100\n\n" +
            "1023423\n\n" +
            "0.0.2000.0.101")

        wrapper.unmount()
        await flushPromises()
    })

    test("Single token, two sources, two dest", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.101", "amount": -3, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.100", "amount": -7, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.201", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +2, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const wrapper = mount(TokenTransferGraphC, {
            global: {
                plugins: [router]
            },
            props: {
                transaction: transaction as Transaction
            },
        })

        await flushPromises()

        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe(
            "0.0.100\n\n" +
            "1023423\n\n" +
            "0.0.2000.0.101\n\n\n\n" +
            "0.0.201")

        wrapper.unmount()
        await flushPromises()
    })


    //
    // Two Tokens
    //

    test("Two token", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.101", "amount": -3, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.100", "amount": -7, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.201", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +2, "token_id": SAMPLE_TOKEN.token_id},

                {"account": "0.0.100", "amount": -6, "token_id": SAMPLE_TOKEN_DUDE.token_id},
                {"account": "0.0.200", "amount": +6, "token_id": SAMPLE_TOKEN_DUDE.token_id},
            ],
        }

        const wrapper = mount(TokenTransferGraphC, {
            global: {
                plugins: [router]
            },
            props: {
                transaction: transaction as Transaction
            },
        })

        await flushPromises()

        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toBe("0.0.100\n\n" +
            "1023423\n\n" +
            "0.0.2000.0.101\n\n\n\n" +
            "0.0.2010.0.100\n\n" +
            "0.0623423 DUDE\n\n" +
            "0.0.200")

        wrapper.unmount()
        await flushPromises()
    })

})
