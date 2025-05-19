// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import Endpoints from "@/components/values/Endpoints.vue";
import {SAMPLE_NETWORK_NODES} from "../Mocks";
import {ServiceEndPoint} from "@/schemas/MirrorNodeSchemas";

describe("Endpoint.vue", () => {

    it("should output 'None' when the props is undefined", async () => {
        const wrapper = mount(Endpoints);
        await flushPromises()
        expect(wrapper.text()).toBe("None")

        wrapper.unmount()
        await flushPromises()
    })

    it("should output 'None' when the array of endpoints is empty", async () => {
        const wrapper = mount(Endpoints, {
            props: {
                endpoints: []
            }
        });
        await flushPromises()
        expect(wrapper.text()).toBe("None")

        wrapper.unmount()
        await flushPromises()
    })

    it("should not output an endpoint where the address is undefined", async () => {
        const wrapper = mount(Endpoints, {
            props: {
                endpoints: SAMPLE_NETWORK_NODES.nodes[1].service_endpoints as Array<ServiceEndPoint>
            }
        });
        await flushPromises()
        expect(wrapper.text()).toBe("3.133.213.146:50211")

        wrapper.unmount()
        await flushPromises()
    })

    it("should output an endpoint address alone when port is undefined", async () => {
        const wrapper = mount(Endpoints, {
            props: {
                endpoints: SAMPLE_NETWORK_NODES.nodes[2].service_endpoints as Array<ServiceEndPoint>
            }
        });
        await flushPromises()
        expect(wrapper.text()).toBe(
            "3.133.213.146:50211" +
            "3.133.213.147")

        wrapper.unmount()
        await flushPromises()
    })

    it("should ouput <address>:<port> for all 5 endpoints", async () => {
        const wrapper = mount(Endpoints, {
            props: {
                endpoints: SAMPLE_NETWORK_NODES.nodes[0].service_endpoints as Array<ServiceEndPoint>
            }
        });
        await flushPromises()
        expect(wrapper.text()).toBe(
            "3.211.248.172:50211" +
            "3.211.248.172:50212" +
            "35.231.208.148:0" +
            "35.231.208.148:50211" +
            "35.231.208.148:50212")

        wrapper.unmount()
        await flushPromises()
    })

})

