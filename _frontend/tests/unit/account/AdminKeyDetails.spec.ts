// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import AccountDetails from "@/pages/AccountDetails.vue";
import {SAMPLE_ACCOUNT, SAMPLE_ACCOUNT_PROTOBUF_KEY, SAMPLE_TOKEN, SAMPLE_TRANSACTIONS,} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import AdminKeyDetails from "@/pages/AdminKeyDetails.vue";
import ComplexKeyValue from "@/components/values/ComplexKeyValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import {fetchGetURLs} from "../MockUtils";
import router from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("AdminKeyDetails.vue", () => {

    test("Account view displaying link to key details", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT_PROTOBUF_KEY);
        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_TRANSACTIONS);
        const matcher3 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account + "/rewards"
        mock.onGet(matcher3).reply(200, {rewards: []})
        const matcher31 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account + "/allowances/crypto"
        mock.onGet(matcher31).reply(200, {rewards: []})
        const matcher32 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account + "/allowances/tokens"
        mock.onGet(matcher32).reply(200, {rewards: []})
        const matcher33 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account + "/allowances/nfts"
        mock.onGet(matcher33).reply(200, {nfts: []})
        const matcher4 = "/api/v1/tokens/0.0.29662956"
        mock.onGet(matcher4).reply(200, SAMPLE_TOKEN);
        const matcher5 = "api/v1/tokens"
        mock.onGet(matcher5).reply(200, {tokens: []});
        const matcher6 = "api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account + "/nfts"
        mock.onGet(matcher6).reply(200, {nfts: []});
        const matcher7 = "api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account + "/airdrops/pending"
        mock.onGet(matcher7).reply(200, {airdrops: []});

        const wrapper = mount(AccountDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                accountId: SAMPLE_ACCOUNT_PROTOBUF_KEY.account
            },
        });

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account,
            "api/v1/network/nodes",
        ])

        await flushPromises()
        // console.log(wrapper.html())

        expect(wrapper.text()).toMatch("Account  Account ID " + SAMPLE_ACCOUNT_PROTOBUF_KEY.account)
        expect(wrapper.get("#keyValue").text()).toBe("Complex Key (6 levels) See details")

        mock.restore()
        wrapper.unmount()
        await flushPromises()

    });

    test("AdminKeyDetails displaying complex (Protobuf) key", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT_PROTOBUF_KEY);

        const wrapper = mount(AdminKeyDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                accountId: SAMPLE_ACCOUNT_PROTOBUF_KEY.account
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account,
            "api/v1/network/nodes",
            "api/v1/contracts/" + SAMPLE_ACCOUNT_PROTOBUF_KEY.account,
        ])

        expect(wrapper.text()).toMatch("Admin Key for Account " + SAMPLE_ACCOUNT_PROTOBUF_KEY.account)
        const key = wrapper.findComponent(ComplexKeyValue)
        expect(key.exists()).toBe(true)
        expect(key.text()).toBe(
            "THRESHOLD (2 of 3)" +
            "ED25519: d40d60cfe24c1e6e63eddbbbb857c6540759e02514b1a151d8147f07d4e3eaee" +
            "THRESHOLD (1 of 6)" +
            "ED25519: 775334a1a5d250c3bfc75b8b81fa2d5fc8fed7d5dab4b2a5ec272aa952aa377c" +
            "ED25519: 5b18a5aa454e99759a2e5d9c4f3239dbc3584f69ab26383470446874bb7f79d1" +
            "ED25519: 3aa16f6f6cf5b95057ba1854cf5822a446d082b37212a3f1c164babadb713f87" +
            "LIST (all of 4)" +
            "ED25519: b3a3e302a74198085e0752495528a6bc475b6bc1f4ba9ae246d9235e5a45e43c" +
            "ED25519: b31d0cfc76ea431928330adfc3094780985876c87864bfe094f956dee4e05d9a" +
            "ED25519: c5b759fee0f23620330deea250bd1a66602f8d847bc181482e268d63e16ae16a" +
            "LIST (all of 2)" +
            "THRESHOLD (1 of 3)" +
            "ED25519: b5d243760381ec28f8df73ca2707761720482612071fead9a8a14ff1e0c2f36a" +
            "ED25519: 2f170df8b57ee630c42e408a6fc749e4ee62174fce66b9e03c9d9b4e68d35d40" +
            "ED25519: bce139f0d9e6d69076f8915fcc32209ade6debaca3f05ee5a713e652b65e7329" +
            "ED25519: a4c8bfd29c164be686c18d9ddbb09c3a47a375a57f32f6df6aec9ccef80f817c" +
            "ED25519: c5040cb52c20d2ab9496893fca0b690cb13855e6e55231e63360c3976e64a25c" +
            "ED25519: 78b769551a81d0fd10c3b5390abb3de92ed4878977a119c2be2039247d8182da" +
            "ED25519: 5b18a5aa454e99759a2e5d9c4f3239dbc3584f69ab26383470446874bb7f79d1"
        )

        wrapper.unmount()
        await flushPromises()
    });

    test("AdminKeyDetails displaying simple (ED25519) key", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/accounts/" + SAMPLE_ACCOUNT.account
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT);

        const wrapper = mount(AdminKeyDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                accountId: SAMPLE_ACCOUNT.account
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/" + SAMPLE_ACCOUNT.account,
            "api/v1/network/nodes",
            "api/v1/contracts/" + SAMPLE_ACCOUNT.account,
        ])

        expect(wrapper.text()).toMatch("Admin Key for Account " + SAMPLE_ACCOUNT.account)
        const key = wrapper.findComponent(KeyValue)
        expect(key.exists()).toBe(true)
        const complexKey = wrapper.findComponent(ComplexKeyValue)
        expect(complexKey.exists()).toBe(false)

        expect(key.text()).toBe("ED25519: aa2f7b3e759f4531ec2e7941afa449e6a6e610efb52adae89e9cd8e9d40ddcbf")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });
});
