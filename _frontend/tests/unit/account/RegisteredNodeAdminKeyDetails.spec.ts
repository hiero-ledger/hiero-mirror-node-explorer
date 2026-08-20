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
import router from "@/utils/RouteManager.ts"

describe("RegisteredNodeAdminKeyDetails.vue", () => {

    it("displays the registered node admin key", async () => {
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
