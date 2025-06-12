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

    it("should not output an endpoint when both domain_name and address are undefined", async () => {
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

    it("should output endpoint address without port when port is 0", async () => {
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

    it("should ouput all variants of endpoint", async () => {
        const wrapper = mount(Endpoints, {
            props: {
                endpoints: SAMPLE_NETWORK_NODES.nodes[0].service_endpoints as Array<ServiceEndPoint>
            }
        });
        await flushPromises()
        expect(wrapper.text()).toBe(
            "www.example.com:50211(3.211.248.172)" +
            "www.example.com:50212" +
            "www.example.com(35.231.208.148)" +
            "35.231.208.148:50211" +
            "35.231.208.148"
        )

        wrapper.unmount()
        await flushPromises()
    })

})

