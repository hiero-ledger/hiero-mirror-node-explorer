// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import axios from "axios";
import {
    SAMPLE_CONTRACT_RESULT_DETAILS,
    SAMPLE_REVERT_CONTRACT_RESULT_ACTIONS,
    SAMPLE_REVERT_CONTRACT_RESULT_DETAILS,
    SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES,
    SAMPLE_TRANSACTION
} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import {HMSF} from "@/utils/HMSF";
import ContractResult from "@/components/contract/ContractResult.vue";
import Oruga from "@oruga-ui/oruga-next";
import ContractResultTrace from "@/components/contract/ContractResultTrace.vue";
import ContractResultStates from "@/components/contract/ContractResultStates.vue";
import ContractActionsTable from "@/components/contract/ContractActionsTable.vue";
import ContractResultStateChangeEntry from "@/components/contract/ContractResultStateChangeEntry.vue";
import {fetchGetURLs} from "../MockUtils";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("ContractResult.vue", () => {

    it("Should display the contract result and logs, given consensus timestamp", async () => {

        const contractId = SAMPLE_CONTRACT_RESULT_DETAILS.contract_id
        const timestamp = SAMPLE_CONTRACT_RESULT_DETAILS.timestamp

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/contracts/results"
        const param1 = {timestamp: timestamp, internal: true, limit: 1}
        mock.onGet(matcher1, {params: param1}).reply(200, {
            results: [SAMPLE_CONTRACT_RESULT_DETAILS], "links": {"next": null}
        });

        const matcher2 = "/api/v1/contracts/" + contractId + "/results/" + timestamp
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT_RESULT_DETAILS);

        const wrapper = mount(ContractResult, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                transaction: SAMPLE_TRANSACTION as unknown as Transaction
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results",
            "api/v1/transactions",
            "api/v1/network/fees",
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id + "/results/" + SAMPLE_CONTRACT_RESULT_DETAILS.timestamp,
            "api/v1/contracts/0.0.846260",
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id,
            "api/v1/contracts/results/" + SAMPLE_CONTRACT_RESULT_DETAILS.hash + "/actions?limit=100",
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.logs[1].contract_id,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.from,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.to,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.logs[1].address,
            "api/v1/tokens/0.0.846260",
            "api/v1/accounts/" + SAMPLE_CONTRACT_RESULT_DETAILS.from,
            "api/v1/accounts/" + SAMPLE_CONTRACT_RESULT_DETAILS.to,
            "api/v1/accounts/" + SAMPLE_CONTRACT_RESULT_DETAILS.logs[2].address,
            "api/v1/tokens/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id,
            "api/v1/tokens/" + SAMPLE_CONTRACT_RESULT_DETAILS.logs[1].contract_id,
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x18cbafe5",
        ])

        expect(wrapper.text()).toMatch(RegExp("^Contract Result"))
        expect(wrapper.get("#resultValue").text()).toBe("SUCCESS")
        expect(wrapper.get("#fromValue").text()).toBe("0x00000000000000000000000000000000000ce9b4Copy(0.0.846260)")
        expect(wrapper.get("#toValue").text()).toBe("0x0000000000000000000000000000000000103783Copy(0.0.1062787)")
        expect(wrapper.find("#typeValue").exists()).toBe(false)
        // expect(wrapper.get("#functionParametersValue").text()).toBe("18cb afe5 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0017 4876 e800 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 001b 2702 b2a0 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 00a0 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 000c e9b4 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0183 1e10 602d 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0003 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 000c ba44 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 000d 1ea6 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0010 3708Copy")
        expect(wrapper.get("#errorMessageValue").text()).toBe("None")
        expect(wrapper.get("#gasLimitValue").text()).toBe("480,000")
        expect(wrapper.get("#gasUsedValue").text()).toBe("384,000")
        expect(wrapper.find("#maxFeePerGasValue").exists()).toBe(false)
        expect(wrapper.find("#maxPriorityFeePerGasValue").exists()).toBe(false)
        expect(wrapper.get("#gasPriceValue").text()).toBe("None")
        expect(wrapper.get("#ethereumNonceValue").text()).toBe("104")

        expect(wrapper.findAll("#transactionHash").length).toBe(3)

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should display the reverted contract result and decode the error message", async () => {

        const contractId = SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.contract_id
        const timestamp = SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.timestamp

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/contracts/results"
        const param1 = {timestamp: timestamp, internal: true, limit: 1}
        mock.onGet(matcher1, {params: param1}).reply(200, {
            results: [SAMPLE_REVERT_CONTRACT_RESULT_DETAILS], "links": {"next": null}
        });

        const matcher2 = "/api/v1/contracts/" + contractId + "/results/" + timestamp
        mock.onGet(matcher2).reply(200, SAMPLE_REVERT_CONTRACT_RESULT_DETAILS);

        const wrapper = mount(ContractResult, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                transaction: SAMPLE_TRANSACTION as unknown as Transaction
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results",
            "api/v1/transactions",
            "api/v1/network/fees",
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.contract_id + "/results/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.timestamp,
            "api/v1/contracts/0.0.1466",
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.contract_id,
            "api/v1/contracts/results/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.hash + "/actions?limit=100",
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.from,
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.to,
            "api/v1/tokens/0.0.1466",
            "api/v1/accounts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.from,
            "api/v1/accounts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.to,
            "api/v1/tokens/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS.contract_id,
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x49257b42",
        ])

        expect(wrapper.text()).toMatch(RegExp("^Contract Result"))
        expect(wrapper.get("#resultValue").text()).toBe("CONTRACT_REVERT_EXECUTED")
        expect(wrapper.get("#errorMessageValue").text()).toBe("Error(\"Insufficient token balance for wiped\")")
        expect(wrapper.get("#ethereumNonceValue").text()).toBe("None")

        expect(wrapper.findAll("#transactionHash").length).toBe(0)

        wrapper.unmount()
        await flushPromises()
    });

    it("Should display the reverted contract result with call trace and state trace", async () => {

        const mock = new MockAdapter(axios as any);

        const timestamp = SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.timestamp
        const matcher1 = "/api/v1/contracts/results"
        const param1 = {timestamp: timestamp, internal: true, limit: 1}
        mock.onGet(matcher1, {params: param1}).reply(200, {
            results: [SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES], "links": {"next": null}
        });

        const contractId = SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.contract_id
        const matcher2 = "/api/v1/contracts/" + contractId + "/results/" + timestamp
        mock.onGet(matcher2).reply(200, SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES);

        const hash = SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.hash
        const matcher3 = "/api/v1/contracts/results/" + hash + '/actions?limit=100'
        mock.onGet(matcher3).reply(200, SAMPLE_REVERT_CONTRACT_RESULT_ACTIONS)

        const wrapper = mount(ContractResult, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                transaction: SAMPLE_TRANSACTION as unknown as Transaction
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results",
            "api/v1/transactions",
            "api/v1/network/fees",
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.contract_id + "/results/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.timestamp,
            "api/v1/contracts/0.0.8942",
            "api/v1/contracts/results/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.hash + "/actions?limit=100",
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[0].contract_id,
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[3].contract_id,
            // "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[9].contract_id,
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.contract_id,
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.from,
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[0].address,
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[3].address,
            // "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[9].address,
            "api/v1/accounts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.from,
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[9].contract_id,
            "api/v1/tokens/0.0.8942",
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_ACTIONS.actions[0].to,
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_ACTIONS.actions[1].to,
            "api/v1/contracts/" + SAMPLE_REVERT_CONTRACT_RESULT_ACTIONS.actions[2].to,
            "api/v1/accounts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[0].address,
            "api/v1/accounts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[3].address,
            // "api/v1/accounts/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[9].address,
            "api/v1/tokens/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[0].contract_id,
            "api/v1/tokens/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[3].contract_id,
            "api/v1/tokens/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.contract_id,
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x7d1ee005",
            "api/v1/tokens/" + SAMPLE_REVERT_CONTRACT_RESULT_DETAILS_WITH_TRACES.state_changes[9].contract_id,
        ])

        expect(wrapper.text()).toMatch(RegExp("^Contract Result"))
        expect(wrapper.get("#resultValue").text()).toBe("CONTRACT_REVERT_EXECUTED")
        expect(wrapper.get("#errorMessageValue").text()).toBe("Error(\"payWithCardNFT - failed to call accept contract method\")")

        const stackTrace = wrapper.findComponent(ContractResultTrace)
        expect(stackTrace.exists()).toBe(true)
        expect(stackTrace.text()).toMatch(RegExp("^Call Trace"))

        const actionsTable = stackTrace.findComponent(ContractActionsTable)
        expect(actionsTable.exists()).toBe(true)
        expect(actionsTable.find('thead').text()).toBe("CALL TYPE FROM AMOUNT TO GAS LIMIT")

        const actions = actionsTable.find('tbody').findAll('tr')
        expect(actions.length).toBe(3)
        expect(actions[0].text()).toBe(
            "1 ! CALL0x00…0022eeCopy(0.0.8942)→0.00000000ℏ→0x00…0028aaCopy(0.0.10410)7979000")
        expect(actions[1].text()).toBe(
            "1_1 ! CALL0x00…0028aaCopy(0.0.10410)→0.00000000ℏ→0x00…0082c9Copy(0.0.33481)7840814")
        expect(actions[2].text()).toBe(
            "1_1_1 CALL0x00…0082c9Copy(0.0.33481)→0.00000000ℏ→0x00…0082cbCopy(0.0.33483)7700872")

        const stateTrace = wrapper.findComponent(ContractResultStates)
        expect(stateTrace.exists()).toBe(true)
        expect(stateTrace.text()).toMatch(RegExp("^Contract States Accessed & Changed"))

        const options = stateTrace.find('select').findAll('option')
        expect(options.length).toBe(4)
        expect(options.at(0)?.element.text).toBe('Show 5 items')
        expect(options.at(1)?.element.text).toBe('Show 10 items')
        expect(options.at(2)?.element.text).toBe('Show 15 items')
        expect(options.at(3)?.element.text).toBe('Show all items')

        expect(options.at(0)?.element.selected).toBe(true)
        expect(options.at(1)?.element.selected).toBe(false)
        expect(options.at(2)?.element.selected).toBe(false)
        expect(options.at(3)?.element.selected).toBe(false)

        const entries = stateTrace.findAllComponents(ContractResultStateChangeEntry)
        expect(entries.length).toBe(5)
        expect(entries[0].text()).toBe(
            "0x20…d39b19Copy" +
            "(0.0.10410) " +
            "HBar Balance Difference: None" +
            "10a8 1eed 9d63 d16f ace5 e763 5790 5348 e625 3d33 9408 6026 bb2b f214 5d7c c249Copy" +
            "Decimal: not available" +
            "0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0001Copy" +
            "Decimal: 1" +
            "None"
        )
        expect(entries[1].text()).toBe(
            "10a8 1eed 9d63 d16f ace5 e763 5790 5348 e625 3d33 9408 6026 bb2b f214 5d7c c24aCopy" +
            "Decimal: not available" +
            "41ba 5057 6c59 ba82 f084 85ca 644d d627 db89 235f b6e2 1635 5ebb 2aa8 8cce b961Copy" +
            "Decimal: not available" +
            "None"
        )

        expect(wrapper.findAll("#transactionHash").length).toBe(0)

        wrapper.unmount()
        await flushPromises()
    });

});
