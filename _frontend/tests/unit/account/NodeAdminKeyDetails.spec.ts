// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {SAMPLE_NETWORK_NODES,} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import ComplexKeyValue from "@/components/values/ComplexKeyValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import {fetchGetURLs} from "../MockUtils";
import NodeAdminKeyDetails from "@/pages/NodeAdminKeyDetails.vue";
import router from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("NodeAdminKeyDetails.vue", () => {

    test("NodeAdminKeyDetails displaying complex (Protobuf) key", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error
        const mock = new MockAdapter(axios as any);

        const node = 2
        const matcher1 = "api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const wrapper = mount(NodeAdminKeyDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                nodeId: node.toString()
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
        ])

        expect(wrapper.text()).toMatch("Admin Key for Node " + node + ' - Hosted by Hedera')
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

    test("NodeAdminKeyDetails displaying simple (ED25519) key", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error
        const mock = new MockAdapter(axios as any);

        const node = 0
        const matcher1 = "api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const wrapper = mount(NodeAdminKeyDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                nodeId: node.toString()
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
        ])

        expect(wrapper.text()).toMatch("Admin Key for Node " + node + ' - Hosted by Hedera')
        const key = wrapper.findComponent(KeyValue)
        expect(key.exists()).toBe(true)
        expect(key.text()).toBe("ED25519: c67e3c4172e3eea8e4f45714240e453ab8702e7fc13d7ea58e523e6caeb8a38e")

        wrapper.unmount()
        await flushPromises()
    });
});
