// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {SAMPLE_CONTRACT} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import {HMSF} from "@/utils/HMSF";
import Oruga from "@oruga-ui/oruga-next";
import ContractResultLogEntry from "@/components/contract/ContractResultLogEntry.vue";
import {SAMPLE_LOG_RESULT, SAMPLE_SOURCIFY_RESPONSE} from "../utils/analyzer/ContractLogAnalyzer.spec";
import {fetchGetURLs} from "../MockUtils";
import router, {routeManager} from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("ContractResultLogEntry.vue", () => {

    it("Should display the verified contract result logs, given consensus timestamp", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const matcher1 = "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        const mock = new MockAdapter(axios as any);
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT)

        const networkEntry = routeManager.currentNetworkEntry.value
        const requestURL = networkEntry.sourcifySetup?.makeRequestURL(SAMPLE_CONTRACT.evm_address)
        mock.onGet(requestURL).reply(200, SAMPLE_SOURCIFY_RESPONSE)

        const wrapper = mount(ContractResultLogEntry, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                log: SAMPLE_LOG_RESULT,
                transactionHash: "0xc7b2ecffdefdec56b809f93bef6c8528dad22e58a02a33c20d275f2ef27936d56b1ed64b53f920fbac85d9cada4a4e78",
                blockNumber: 9
            },
        });
        await flushPromises()

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id,
            "api/v1/contracts/" + SAMPLE_CONTRACT.evm_address,
            "http://localhost:3000/files/any/295/" + SAMPLE_CONTRACT.evm_address,
            "api/v1/accounts/" + SAMPLE_CONTRACT.evm_address,
        ])

        expect(wrapper.get("#transactionHash").text()).toBe("Transaction Hashc7b2 ecff defd ec56 b809 f93b ef6c 8528 dad2 2e58 a02a 33c2 0d27 5f2e f279 36d5 6b1e d64b 53f9 20fb ac85 d9ca da4a 4e78Copy")
        expect(wrapper.get("#blockNumber").find("a").exists()).toBeTruthy()
        expect(wrapper.get("#blockNumber").get("a").text()).toBe('9')
        expect(wrapper.get("#blockNumber").text()).toBe("Block9")
        expect(wrapper.get("#address").text()).toBe("Address0x00…0b70cfCopy(TestEvent)")
        expect(wrapper.get("#Args").text()).toBe("LogsFlightEvent (string phase, int256 airspeed, int256 verticalSpeed)Topic 0  signature hash0x01f789d670afa3030578cc570ac4d43ace6f1575dd6c395a711e72a30051efd2Copystring  phaseHolding pointCopyint256  airspeed0int256  verticalSpeed0")
        expect(wrapper.get("#logArg_phase").text()).toBe("string  phaseHolding pointCopy")
        expect(wrapper.get("#logArg_airspeed").text()).toBe("int256  airspeed0")
        expect(wrapper.get("#logArg_verticalSpeed").text()).toBe("int256  verticalSpeed0")

        wrapper.unmount()
        await flushPromises()
    });

    it("Should display the unverified contract result logs, given consensus timestamp", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const matcher1 = "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        const mock = new MockAdapter(axios as any);
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT)

        const wrapper = mount(ContractResultLogEntry, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                log: SAMPLE_LOG_RESULT,
                transactionHash: "0xc7b2ecffdefdec56b809f93bef6c8528dad22e58a02a33c20d275f2ef27936d56b1ed64b53f920fbac85d9cada4a4e78",
                blockNumber: 9
            },
        });
        await flushPromises()

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id,
            "api/v1/contracts/" + SAMPLE_CONTRACT.evm_address,
            "http://localhost:3000/files/any/295/" + SAMPLE_CONTRACT.evm_address,
            "api/v1/accounts/" + SAMPLE_CONTRACT.evm_address,
        ])

        expect(wrapper.get("#transactionHash").text()).toBe("Transaction Hashc7b2 ecff defd ec56 b809 f93b ef6c 8528 dad2 2e58 a02a 33c2 0d27 5f2e f279 36d5 6b1e d64b 53f9 20fb ac85 d9ca da4a 4e78Copy")
        expect(wrapper.get("#blockNumber").find("a").exists()).toBeTruthy()
        expect(wrapper.get("#blockNumber").get("a").text()).toBe('9')
        expect(wrapper.get("#blockNumber").text()).toBe("Block9")
        expect(wrapper.get("#address").text()).toBe(`Address0x00…0b70cfCopy(${SAMPLE_CONTRACT.contract_id})`)
        expect(wrapper.get("#Args").text()).toBe(
            "Logs" +
            "Topic 0" + "01f7 89d6 70af a303 0578 cc57 0ac4 d43a ce6f 1575 dd6c 395a 711e 72a3 0051 efd2Copy" +
            "Data" + "0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0060 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 000d 486f 6c64 696e 6720 706f 696e 7400 0000 0000 0000 0000 0000 0000 0000 0000 0000Copy"
        )

        wrapper.unmount()
        await flushPromises()
    });

});

