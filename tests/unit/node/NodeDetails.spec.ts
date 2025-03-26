// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import axios from "axios";
import {SAMPLE_NETWORK_NODES, SAMPLE_NETWORK_STAKE} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import NodeDetails from "@/pages/NodeDetails.vue";
import {fetchGetURLs} from "../MockUtils";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("NodeDetails.vue", () => {

    it("should display node details", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error
        //
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

        const mock = new MockAdapter(axios as any);
        //
        //
        // const configUrl = NetworkRegistry.NETWORKS_CONFIG_URL
        // mock.onGet(configUrl).reply(200, config)
        // networkRegistry.readCustomConfig()

        const node = 0
        const matcher1 = "api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const matcher2 = "api/v1/network/stake"
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_STAKE);

        const wrapper = mount(NodeDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                nodeId: node.toString()
            }
        });

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/network/stake",
        ])

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toMatch(RegExp("Node " + node))

        expect(wrapper.get("#adminKeyValue").text()).toBe("0xc67e3c4172e3eea8e4f45714240e453ab8702e7fc13d7ea58e523e6caeb8a38e" + "Copy" + "ED25519")
        expect(wrapper.get("#nodeAccountValue").text()).toBe("0.0.3")
        expect(wrapper.get("#descriptionValue").text()).toBe("Hosted by Hedera | East Coast, USA")
        expect(wrapper.get("#publicKeyValue").text()).toBe("0x308201a2300d0609CopyRSA")
        expect(wrapper.get("#fileValue").text()).toBe("0.0.102")
        expect(wrapper.get("#rangeFromValue").text()).toBe("4:10:06.0411 PMJun 6, 2022, UTC")
        expect(wrapper.get("#rangeToValue").text()).toBe("None")
        expect(wrapper.get("#nodeCertHashValue").text()).toBe("0xd316b5ef57b76daf37e3bebbe3b69e6f67b669ce1dd1ed75e5c69a69bf75f36d376f475f7b571d79a6f8e37e37f1f736f3d69b73c6daf1ae9a7dff3775be5fd5bdf7e34e3a75af3c73Copy")
        expect(wrapper.get("#serviceEndpointsValue").text()).toBe("3.211.248.172:502113.211.248.172:5021235.231.208.148:035.231.208.148:5021135.231.208.148:50212")

        expect(wrapper.get("#yearlyRate").text()).toBe("LAST PERIOD REWARD RATE 1%APPROX ANNUAL EQUIVALENT")
        expect(wrapper.get("#consensusStake").text()).toBe("STAKE FOR CONSENSUS 6,000,000HBAR25.00% of total")
        expect(wrapper.get("#minStake").text()).toBe("MIN STAKE 1,000,000HBAR")
        expect(wrapper.get("#maxStake").text()).toBe("MAX STAKE 30,000,000HBAR")
        expect(wrapper.get("#rewarded").text()).toBe("STAKED FOR REWARD 5,000,000HBAR26.32% of total")
        expect(wrapper.get("#notRewarded").text()).toBe("STAKED FOR NO REWARD 1,000,000HBAR20% of total")
        expect(wrapper.get("#stakingPeriod").text()).toMatch("CURRENT STAKING PERIOD 24HOURS")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("should update when node id changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error
        const mock = new MockAdapter(axios as any);

        let node = 0
        const matcher1 = "api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const matcher2 = "api/v1/network/stake"
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_STAKE);

        const wrapper = mount(NodeDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                nodeId: node.toString()
            }
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/network/stake",
            "api/v1/contracts/0.0.3",
        ])

        expect(wrapper.text()).toMatch(RegExp("Node " + node))
        expect(wrapper.get("#nodeAccountValue").text()).toBe("0.0.3")
        expect(wrapper.get("#descriptionValue").text()).toBe("Hosted by Hedera | East Coast, USA")
        expect(wrapper.get("#nodeCertHashValue").text()).toBe("0xd316b5ef57b76daf37e3bebbe3b69e6f67b669ce1dd1ed75e5c69a69bf75f36d376f475f7b571d79a6f8e37e37f1f736f3d69b73c6daf1ae9a7dff3775be5fd5bdf7e34e3a75af3c73Copy")

        mock.resetHistory()
        node = 1
        await wrapper.setProps({
            nodeId: node.toString()
        })
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.4",
        ])

        expect(wrapper.text()).toMatch(RegExp("Node " + node))
        expect(wrapper.get("#nodeAccountValue").text()).toBe("0.0.4")
        expect(wrapper.get("#descriptionValue").text()).toBe("Hosted by Hedera | East Coast, USA")
        expect(wrapper.get("#nodeCertHashValue").text()).toBe("0xd31ef8d3d75e7367b8f786fadbb79ee3d73af5bdbde1b7b571e69e6dc6b77dd71a7f7ebbf3d7bcf1f73b7796f479e7f9e7ad5fe766fcd9ddf9d7dd5adfd7367db79deb4dbbdbaef5ebCopy")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("should display node details with complex admin-key and link", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error
        const mock = new MockAdapter(axios as any);

        const node = 2
        const matcher1 = "api/v1/network/nodes"
        mock.onGet(matcher1).reply(200, SAMPLE_NETWORK_NODES);

        const wrapper = mount(NodeDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                nodeId: node.toString()
            }
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/network/stake",
            "api/v1/contracts/0.0.5",
        ])

        expect(wrapper.text()).toMatch(RegExp("Node " + node))

        expect(wrapper.get("#adminKeyValue").text()).toBe("Complex Key (6 levels) See details")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("should display notification for unknown node ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error
        const mock = new MockAdapter(axios as any);

        const UNKNOWN_ID = "99999"
        const matcher1 = "api/v1/network/nodes?node.id=" + UNKNOWN_ID
        mock.onGet(matcher1).reply(404);

        const matcher2 = "api/v1/network/stake"
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_STAKE);

        const wrapper = mount(NodeDetails, {
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

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/network/stake",
        ])

        expect(wrapper.text()).toMatch(RegExp("Node with ID " + UNKNOWN_ID + " was not found"))
        expect(wrapper.get("#adminKeyValue").text()).toBe("None")
        expect(wrapper.get("#nodeAccountValue").text()).toBe("None")
        expect(wrapper.get("#descriptionValue").text()).toBe("None")
        expect(wrapper.get("#publicKeyValue").text()).toBe("None")
        expect(wrapper.get("#fileValue").text()).toBe("None")
        expect(wrapper.get("#rangeFromValue").text()).toBe("None")
        expect(wrapper.get("#rangeToValue").text()).toBe("None")
        expect(wrapper.get("#nodeCertHashValue").text()).toBe("None")
        expect(wrapper.get("#serviceEndpointsValue").text()).toBe("None")

        expect(wrapper.get("#yearlyRate").text()).toBe("LAST PERIOD REWARD RATE None")
        expect(wrapper.get("#consensusStake").text()).toBe("STAKE FOR CONSENSUS None")
        expect(wrapper.get("#minStake").text()).toBe("MIN STAKE None")
        expect(wrapper.get("#maxStake").text()).toBe("MAX STAKE None")
        expect(wrapper.get("#rewarded").text()).toBe("STAKED FOR REWARD None")
        expect(wrapper.get("#notRewarded").text()).toBe("STAKED FOR NO REWARD None")
        expect(wrapper.get("#stakingPeriod").text()).toBe("CURRENT STAKING PERIOD None")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

});
