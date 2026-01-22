// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {SAMPLE_NETWORK_NODES, SAMPLE_NETWORK_STAKE} from "../Mocks";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import Nodes from "@/pages/Nodes.vue";
import NodeTable from "@/components/node/NodeTable.vue";
import NetworkDashboardItemV2 from "@/components/node/NetworkDashboardItemV2.vue";
import {fetchGetURLs} from "../MockUtils";
import router from "@/utils/RouteManager.ts";
import Nodes_NodeTable from "@/pages/Nodes_NodeTable.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("Nodes.vue", () => {

    const tooltipStake = "Total amount of HBAR staked to this specific validator for consensus."
    const tooltipRewardRate = "Approximate annual reward rate based on the reward earned during the " +
        "last 24h period."

    it("should display the nodes pages containing the node table", async () => {

        const mock = new MockAdapter(axios as any);

        // const config = [
        //     {
        //         "name": "mainnet",
        //         "displayName": "MAINNET",
        //         "url": "https://mainnet-public.mirrornode.hedera.com/",
        //         "ledgerID": "00",
        //         "enableWallet": true,
        //         "enableStaking": true,
        //         "sourcifySetup": null
        //     }
        // ]
        // const configUrl = NetworkRegistry.NETWORKS_CONFIG_URL
        // mock.onGet(configUrl).reply(200, config)
        // networkRegistry.readCustomConfig()

        const matcher1 = "/api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const matcher2 = "/api/v1/network/stake"
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_STAKE);

        const wrapper = mount(Nodes, {
            global: {
                plugins: [router, Oruga]
            }
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/network/stake",
        ])

        const cards = wrapper.findAllComponents(DashboardCardV2)
        expect(cards.length).toBe(2)

        expect(cards[0].text()).toMatch(RegExp("^Network"))
        const items = cards[0].findAllComponents(NetworkDashboardItemV2)
        expect(items.length).toBe(9)
        expect(items[0].text()).toMatch("LAST STAKED")
        expect(items[1].text()).toMatch("NEXT STAKING PERIOD")
        expect(items[2].text()).toMatch("STAKING PERIOD 24h")
        expect(items[3].text()).toMatch("TOTAL STAKED 24,000,000HBAR")
        expect(items[4].text()).toMatch("STAKED FOR REWARD 19,000,000HBAR")
        expect(items[5].text()).toMatch("MAXIMUM STAKED FOR REWARD 0HBAR")
        expect(items[6].text()).toMatch("REWARDED LAST PERIOD 1,095HBAR")
        expect(items[7].text()).toMatch("MAXIMUM REWARD RATE 0%")
        expect(items[8].text()).toMatch("CURRENT GLOBAL REWARD RATE 2.105%")

        mock.resetHistory()
        const wrapper2 = mount(Nodes_NodeTable, {
            global: {
                plugins: [router, Oruga]
            }
        });

        await flushPromises()
        // console.log(wrapper2.text())

        expect(fetchGetURLs(mock)).toStrictEqual([])

        expect(wrapper2.text()).toMatch("3  Nodes")
        const table = wrapper2.findComponent(NodeTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("IDACCOUNTDESCRIPTIONSTAKE FOR CONSENSUSSTAKE RANGEREWARD RATE")
        expect(wrapper2.get('tbody').text()).toBe(
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
            "Rewarded:7,000,000ℏ" +
            "Not Rewarded:2,000,000ℏMin:1,000,000ℏMax:30,000,000ℏ" +
            "3%" +
            tooltipRewardRate
        )

        mock.restore()
        wrapper.unmount()
        wrapper2.unmount()
        await flushPromises()
    });

});
