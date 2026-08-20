// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios"
import MockAdapter from "axios-mock-adapter"
import Oruga from "@oruga-ui/oruga-next"
import {SAMPLE_NETWORK_NODES, SAMPLE_REGISTERED_NODES} from "../Mocks"
import {fetchGetURLs} from "../MockUtils"
import RegisteredNodeAdminKeyDetails from "@/pages/RegisteredNodeAdminKeyDetails.vue"
import KeyValue from "@/components/values/KeyValue.vue"
import ComplexKeyValue from "@/components/values/ComplexKeyValue.vue"
import router from "@/utils/RouteManager.ts"

describe("RegisteredNodeAdminKeyDetails.vue", () => {

    it("displays a simple registered node admin key", async () => {
        await router.push("/")
        const mock = new MockAdapter(axios as any)
        mock.onGet("api/v1/network/registered-nodes").reply(200, SAMPLE_REGISTERED_NODES)
        mock.onGet("api/v1/network/nodes").reply(200, SAMPLE_NETWORK_NODES)

        const wrapper = mount(RegisteredNodeAdminKeyDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                nodeId: "0"
            }
        })

        await flushPromises()

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/registered-nodes",
            "api/v1/network/nodes"
        ])
        expect(wrapper.text()).toContain("Admin Key for RegisteredNode 0 - Block Node | East Coast, USA")

        const key = wrapper.findComponent(KeyValue)
        expect(key.exists()).toBe(true)
        expect(key.text()).toContain("ED25519")
        expect(key.text()).toContain("d6e8334")

        mock.restore()
        wrapper.unmount()
    })

    it("displays a complex registered node admin key", async () => {
        await router.push("/")
        const mock = new MockAdapter(axios as any)
        mock.onGet("api/v1/network/registered-nodes").reply(200, SAMPLE_REGISTERED_NODES)
        mock.onGet("api/v1/network/nodes").reply(200, SAMPLE_NETWORK_NODES)

        const wrapper = mount(RegisteredNodeAdminKeyDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                nodeId: "1"
            }
        })

        await flushPromises()

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/registered-nodes",
            "api/v1/network/nodes"
        ])
        expect(wrapper.text()).toContain("Admin Key for RegisteredNode 1 - Mirror Node | West Coast, USA")

        const key = wrapper.findComponent(ComplexKeyValue)
        expect(key.exists()).toBe(true)
        expect(key.text()).toBe(
            "THRESHOLD (2 of 2)" +
            "THRESHOLD (1 of 2)" +
            "ED25519: ef2d877b88b7464d9253560b8851316f5c2f6ddf935eb4eec0761a3262b0a48c" +
            "ED25519: a95d54cf49c1d08cd16d8908f37dfad95637134ffaf528a1d96da7f28d45f139" +
            "THRESHOLD (2 of 4)" +
            "ED25519: c44c911fa45166e356b498463184459dd9ee760bacc083de348691d6357e0634" +
            "ED25519: ef2d877b88b7464d9253560b8851316f5c2f6ddf935eb4eec0761a3262b0a48c" +
            "ED25519: a95d54cf49c1d08cd16d8908f37dfad95637134ffaf528a1d96da7f28d45f139" +
            "ED25519: daa5da866bf4e990c14eff4336f5ab4b416c85a31289c8cb8ae1b4a54ce8c111"
        )

        mock.restore()
        wrapper.unmount()
    })

    it("displays an error for an unknown registered node", async () => {
        await router.push("/")
        const mock = new MockAdapter(axios as any)
        mock.onGet("api/v1/network/registered-nodes").reply(200, SAMPLE_REGISTERED_NODES)
        mock.onGet("api/v1/network/nodes").reply(200, SAMPLE_NETWORK_NODES)

        const wrapper = mount(RegisteredNodeAdminKeyDetails, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                nodeId: "999"
            }
        })

        await flushPromises()

        expect(wrapper.text()).toContain("Registered Node 999 was not found")

        mock.restore()
        wrapper.unmount()
    })
})
