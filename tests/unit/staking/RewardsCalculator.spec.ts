// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {SAMPLE_ACCOUNT_STAKING_ACCOUNT, SAMPLE_NETWORK_NODES} from "../Mocks";
import RewardsCalculator from "@/components/staking/RewardsCalculator.vue";
import {fetchGetURLs} from "../MockUtils";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("RewardsCalculator.vue", () => {

    it("should display an empty Rewards Estimator", async () => {

        // Mocks axios
        const mock = new MockAdapter(axios as any);
        const matcher2 = "/api/v1/network/nodes"
        for (const node of SAMPLE_NETWORK_NODES.nodes) {
            const body = {params: {"node.id": node.node_id}}
            const response = {nodes: [node]}
            mock.onGet(matcher2, body).reply(200, response)
        }
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_NODES)

        const wrapper = mount(RewardsCalculator, {
            global: {
                plugins: [Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
        ])

        expect(wrapper.text()).toMatch(RegExp("^Rewards Estimator"))

        const options = wrapper.find('select').findAll('option')
        expect(options.length).toBe(SAMPLE_NETWORK_NODES.nodes.length)
        expect(options[0].element.text).toBe('0 - Hosted by Hedera | East Coast, USA - Rewarding (staked for reward is 16.7% of max)')
        expect(options[1].element.text).toBe('1 - Hosted by Hedera | East Coast, USA - Rewarding (staked for reward is 23.3% of max)')
        expect(options[2].element.text).toBe('2 - Hosted by Hedera | Central, USA - Rewarding (staked for reward is 23.3% of max)')

        expect(options[0].element.selected).toBe(false)
        expect(options[1].element.selected).toBe(false)
        expect(options[2].element.selected).toBe(false)

        expect(wrapper.find('#currentReward').text()).toBe("Current 24h Period Reward 0HBAR".toUpperCase())
        expect(wrapper.find('#monthlyReward').text()).toBe("Approx Monthly Reward 0HBAR".toUpperCase())
        expect(wrapper.find('#yearlyReward').text()).toBe("Approx Yearly Reward 0HBAR".toUpperCase())
        expect(wrapper.find('#yearlyRate').text()).toBe("Approx Yearly Reward Rate 0%".toUpperCase())

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    })

    it("should display a Rewards Estimator preset with 10000Hbar and Node1", async () => {

        // Mocks axios
        const mock = new MockAdapter(axios as any);
        const matcher2 = "/api/v1/network/nodes"
        for (const node of SAMPLE_NETWORK_NODES.nodes) {
            const body = {params: {"node.id": node.node_id}}
            const response = {nodes: [node]}
            mock.onGet(matcher2, body).reply(200, response)
        }
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_NODES)

        const wrapper = mount(RewardsCalculator, {
            global: {
                plugins: [Oruga]
            },
            props: {
                amountInHbar: 10000,
                nodeId: 1
            },
        });

        await flushPromises()
        // console.log(wrapper.text())
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
        ])

        expect(wrapper.text()).toMatch(RegExp("^Rewards Estimator"))

        const options = wrapper.find('select').findAll('option')
        expect(options.length).toBe(SAMPLE_NETWORK_NODES.nodes.length)
        expect(options[0].element.text).toBe('0 - Hosted by Hedera | East Coast, USA - Rewarding (staked for reward is 16.7% of max)')
        expect(options[1].element.text).toBe('1 - Hosted by Hedera | East Coast, USA - Rewarding (staked for reward is 23.3% of max)')
        expect(options[2].element.text).toBe('2 - Hosted by Hedera | Central, USA - Rewarding (staked for reward is 23.3% of max)')

        expect(options[0].element.selected).toBe(false)
        expect(options[1].element.selected).toBe(true)
        expect(options[2].element.selected).toBe(false)

        expect(wrapper.find('#currentReward').text()).toBe("Current 24h Period Reward 0.5479HBAR".toUpperCase())
        expect(wrapper.find('#monthlyReward').text()).toBe("Approx Monthly Reward 16.44HBAR".toUpperCase())
        expect(wrapper.find('#yearlyReward').text()).toBe("Approx Yearly Reward 200HBAR".toUpperCase())
        expect(wrapper.find('#yearlyRate').text()).toBe("Approx Yearly Reward Rate 2%".toUpperCase())

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    })

    it("should input different values for Hbar amount and selected Node", async () => {

        const TEST_ACCOUNT = SAMPLE_ACCOUNT_STAKING_ACCOUNT

        // Mocks axios
        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/accounts/" + TEST_ACCOUNT.account
        mock.onGet(matcher1).reply(200, TEST_ACCOUNT)
        const matcher2 = "/api/v1/network/nodes"
        for (const node of SAMPLE_NETWORK_NODES.nodes) {
            const body = {params: {"node.id": node.node_id}}
            const response = {nodes: [node]}
            mock.onGet(matcher2, body).reply(200, response)
        }
        mock.onGet(matcher2).reply(200, SAMPLE_NETWORK_NODES)

        const wrapper = mount(RewardsCalculator, {
            global: {
                plugins: [Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
        ])

        expect(wrapper.text()).toMatch(RegExp("^Rewards Estimator"))

        const options = wrapper.find('select').findAll('option')

        expect(options.length).toBe(SAMPLE_NETWORK_NODES.nodes.length)
        expect(options[0].element.text).toBe('0 - Hosted by Hedera | East Coast, USA - Rewarding (staked for reward is 16.7% of max)')
        expect(options[1].element.text).toBe('1 - Hosted by Hedera | East Coast, USA - Rewarding (staked for reward is 23.3% of max)')
        expect(options[2].element.text).toBe('2 - Hosted by Hedera | Central, USA - Rewarding (staked for reward is 23.3% of max)')

        expect(options[0].element.selected).toBe(false)
        expect(options[1].element.selected).toBe(false)
        expect(options[2].element.selected).toBe(false)

        expect(wrapper.find('#currentReward').text()).toBe("Current 24h Period Reward 0HBAR".toUpperCase())
        expect(wrapper.find('#monthlyReward').text()).toBe("Approx Monthly Reward 0HBAR".toUpperCase())
        expect(wrapper.find('#yearlyReward').text()).toBe("Approx Yearly Reward 0HBAR".toUpperCase())
        expect(wrapper.find('#yearlyRate').text()).toBe("Approx Yearly Reward Rate 0%".toUpperCase())

        // Change Node Selection
        // await  wrapper.find('select').findAll('option').at(2)?.setValue(false)
        await options[1].setValue(false)

        // Change Hbar Amount
        await wrapper.find('input[type="number"]').setValue('10000')

        expect(wrapper.find('#currentReward').text()).toBe("CURRENT 24H PERIOD REWARD 0.5479HBAR".toUpperCase())
        expect(wrapper.find('#monthlyReward').text()).toBe("APPROX MONTHLY REWARD 16.44HBAR".toUpperCase())
        expect(wrapper.find('#yearlyReward').text()).toBe("APPROX YEARLY REWARD 200HBAR".toUpperCase())
        expect(wrapper.find('#yearlyRate').text()).toBe("APPROX YEARLY REWARD RATE 2%".toUpperCase())

        wrapper.unmount()
        await flushPromises()
    })
});
