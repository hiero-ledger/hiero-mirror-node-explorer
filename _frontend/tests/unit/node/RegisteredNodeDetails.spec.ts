// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {SAMPLE_NETWORK_NODES, SAMPLE_REGISTERED_NODES} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import RegisteredNodeDetails from "@/pages/RegisteredNodeDetails.vue";
import {fetchGetURLs} from "../MockUtils";
import router from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("RegisteredNodeDetails.vue", () => {

    it("should display block node details", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);
        const matcher1 = "api/v1/network/registered-nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_REGISTERED_NODES);
        const matcher2 = "api/v1/network/nodes"
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_NODES);

        const wrapper = mount(RegisteredNodeDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                nodeId: "0"
            }
        });

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/network/registered-nodes",
            "api/v1/network/registered-nodes",
            "api/v1/network/registered-nodes",
            "api/v1/network/registered-nodes",
        ])

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toMatch("Block Node")

        expect(wrapper.get("#node-idValue").text()).toBe("0")
        expect(wrapper.get("#descriptionValue").text()).toBe("Block Node | East Coast, USA")
        expect(wrapper.get("#admin-keyValue").text()).toBe(
            "0xd6e8334cd8594e88c82ff266b4974b4e4ac596962dcfab7314f935e7fdda672f" + "Copy" + "ED25519"
        )
        expect(wrapper.get("#service-typeValue").text()).toBe("Block Node")

        // Service endpoints table: 3 endpoints (all have ip_address or domain_name)
        const endpointsTable = wrapper.get("#service-endpoint-table")
        expect(endpointsTable.get("thead").text()).toBe("ENDPOINTPORTTLS REQUIRED")
        expect(endpointsTable.get("tbody").findAll("tr").length).toBe(2)
        expect(endpointsTable.get("tbody").text()).toBe(
            "block.example.com" + "50211" + "\u2713" +
            "1.2.3.4" + "50212"
        )

        // Associated consensus nodes: node_id=0 has associated_registered_nodes=[3,6,10], includes 3
        const nodeTable = wrapper.get("#node-table")
        expect(nodeTable.get("thead").text()).toBe("IDACCOUNTDESCRIPTION")
        expect(nodeTable.get("tbody").findAll("tr").length).toBe(1)
        expect(nodeTable.get("tbody").text()).toBe(
            "0" + "0.0.3" + "Hosted by " + "Hedera | East Coast, USA"
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("should update when registered node ID changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);
        const matcher1 = "api/v1/network/registered-nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_REGISTERED_NODES);
        const matcher2 = "api/v1/network/nodes"
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_NODES);

        const wrapper = mount(RegisteredNodeDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                nodeId: "1"
            }
        });

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/network/registered-nodes",
            "api/v1/network/registered-nodes",
            "api/v1/network/registered-nodes",
            "api/v1/network/registered-nodes",
        ])

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toMatch("Mirror Node")

        expect(wrapper.get("#node-idValue").text()).toBe("1")
        expect(wrapper.get("#descriptionValue").text()).toBe("Mirror Node | West Coast, USA")
        expect(wrapper.get("#service-typeValue").text()).toBe("Mirror Node")

        mock.resetHistory()
        await wrapper.setProps({nodeId: "2"})
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        // No new HTTP requests: all cache data is already loaded
        expect(fetchGetURLs(mock)).toStrictEqual([])

        expect(wrapper.text()).toMatch("JSON-RPC Relay")
        expect(wrapper.get("#node-idValue").text()).toBe("2")
        expect(wrapper.get("#descriptionValue").text()).toBe("RPC Relay | Central, USA")
        expect(wrapper.get("#service-typeValue").text()).toBe("JSON-RPC Relay")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("should display notification for unknown registered node ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);
        const matcher1 = "api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const UNKNOWN_ID = "99999"
        const wrapper = mount(RegisteredNodeDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                nodeId: UNKNOWN_ID
            }
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toMatch("Invalid Registered Node ID")
        expect(wrapper.get("#node-idValue").text()).toBe("None")
        expect(wrapper.get("#descriptionValue").text()).toBe("None")
        expect(wrapper.get("#admin-keyValue").text()).toBe("None")
        expect(wrapper.get("#service-typeValue").text()).toBe("None")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

});
