// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import {SAMPLE_REGISTERED_NODES} from "../Mocks";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import RegisteredNodeTable from "@/components/node/RegisteredNodeTable.vue";
import {RegisteredNode} from "@/schemas/MirrorNodeSchemas";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("RegisteredNodeTable.vue", () => {

    it("should list the 3 registered nodes in the table", async () => {

        const wrapper = mount(RegisteredNodeTable, {
            global: {
                plugins: [Oruga]
            },
            props: {
                nodes: SAMPLE_REGISTERED_NODES.registered_nodes as Array<RegisteredNode>
            }
        });

        await flushPromises()
        // console.log(wrapper.text())
        // console.log(wrapper.html())

        expect(wrapper.get('thead').text()).toBe("REGISTERED NODE IDDESCRIPTIONSERVICE ENDPOINTNUMBER OF ENDPOINTS")
        expect(wrapper.get('tbody').findAll('tr').length).toBe(4)
        expect(wrapper.get('tbody').text()).toBe(
            "0" +
            "Block Node | East Coast, USA" +
            "block.example.com:50211" +
            "2" +

            "1" +
            "Mirror Node | West Coast, USA" +
            "5.6.7.8:443" +
            "1" +

            "2" +
            "RPC Relay | Central, USA" +
            "relay.example.com:8080" +
            "1" +

            "3" +
            "General Service | Central, USA" +
            "general.service.example.com:443" +
            "1"
        )

        wrapper.unmount()
        await flushPromises()
    });

});
