// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import {SAMPLE_NETWORK_NODES} from "../Mocks";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import NodeTable from "@/components/node/NodeTable.vue";
import {NetworkNode} from "@/schemas/MirrorNodeSchemas";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {fetchGetURLs} from "../MockUtils";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("NodeTable.vue", () => {

    const tooltipStake = "Total amount of HBAR staked to this specific validator for consensus."
    const tooltipRewardRate = "Approximate annual reward rate based on the reward earned during the last 24h period."

    it("should list the 3 nodes in the table", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        let testTotalStaked = 0
        for (const node of SAMPLE_NETWORK_NODES.nodes) {
            testTotalStaked += node.stake
        }
        const wrapper = mount(NodeTable, {
            global: {
                plugins: [Oruga]
            },
            props: {
                nodes: SAMPLE_NETWORK_NODES.nodes as Array<NetworkNode>,
                stakeTotal: testTotalStaked
            }
        });

        await flushPromises()
        // console.log(wrapper.text())
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
        ])

        expect(wrapper.get('thead').text()).toBe("IDACCOUNTDESCRIPTIONSTAKE FOR CONSENSUSSTAKE RANGEREWARD RATE")
        expect(wrapper.get('tbody').findAll('tr').length).toBe(3)
        expect(wrapper.get('tbody').text()).toBe(
            "0" +
            "0.0.3" +
            "Hosted by Hedera | East Coast, USA" +
            "6,000,000ℏ" + tooltipStake + "(25.00% of the total of all validators)" +
            " min  max " +
            "Rewarded:5,000,000ℏNot Rewarded:1,000,000ℏMin:1,000,000ℏMax:30,000,000ℏ" +
            "1%" + tooltipRewardRate +

            "1" +
            "0.0.4" +
            "Hosted by Hedera | East Coast, USA" +
            "9,000,000ℏ" + tooltipStake + "(37.50% of the total of all validators)" +
            " min  max " +
            "Rewarded:7,000,000ℏNot Rewarded:2,000,000ℏMin:1,000,000ℏMax:30,000,000ℏ" +
            "2%" + tooltipRewardRate +

            "2" +
            "0.0.5" +
            "Hosted by Hedera | Central, USA" +
            "9,000,000ℏ" + tooltipStake + "(37.50% of the total of all validators)" +
            " min  max " +
            "Rewarded:7,000,000ℏNot Rewarded:2,000,000ℏMin:1,000,000ℏMax:30,000,000ℏ" +
            "3%" + tooltipRewardRate
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

});
