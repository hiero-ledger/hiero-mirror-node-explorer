// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {
    SAMPLE_ACCOUNT_BALANCES,
    SAMPLE_CONTRACT,
    SAMPLE_CONTRACT_AS_ACCOUNT,
    SAMPLE_CONTRACT_DELETED,
    SAMPLE_CONTRACT_DELETED_AS_ACCOUNT,
    SAMPLE_CONTRACT_DUDE,
    SAMPLE_CONTRACT_DUDE_AS_ACCOUNT,
    SAMPLE_CONTRACT_RESULTS,
    SAMPLE_NETWORK_CONFIG,
    SAMPLE_NETWORK_EXCHANGERATE,
    SAMPLE_PUBLIC_LABELS_JSON,
    SAMPLE_PUBLIC_LABELS_URL,
    SAMPLE_TRANSACTIONS
} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import ContractDetails from "@/pages/ContractDetails.vue";
import {HMSF} from "@/utils/HMSF";
import NotificationBanner from "@/components/NotificationBanner.vue";
import ContractResultTable from "@/components/contract/ContractResultTable.vue";
import {ContractStateResponse} from "@/schemas/MirrorNodeSchemas.ts";
import {fetchGetURLs} from "../MockUtils";
import {networkConfigKey} from "@/AppKeys.ts";
import PageHeader from "@/components/page/header/PageHeader.vue";
import router, {routeManager} from "@/utils/RouteManager.ts";
import ContractDetails_ByteCode from "@/pages/ContractDetails_ByteCode.vue";
import ContractDetails_Calls from "@/pages/ContractDetails_Calls.vue";
import ContractDetails_Summary from "@/pages/ContractDetails_Summary.vue";
import Tabs from "@/components/Tabs.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("ContractDetails.vue", () => {

    it("Should display contract details (using contract id)", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        const matcher4 = "/api/v1/network/exchangerate"
        mock.onGet(matcher4).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const matcher5 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id + "/results?internal=true"
        mock.onGet(matcher5).reply(200, SAMPLE_CONTRACT_RESULTS);


        //
        // ContractDetails
        //

        const wrapper = mount(ContractDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.contract_id
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id,
            "api/v1/network/exchangerate",
            "api/v1/network/supply",
            "http://localhost:3000/files/any/295/" + SAMPLE_CONTRACT.evm_address,
            "http://localhost:3000/mainnet/erc-20.json",
            "http://localhost:3000/mainnet/erc-721.json",
            "http://localhost:3000/mainnet/erc-1155.json",
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_CONTRACT.evm_address,
        ])

        expect(wrapper.getComponent(PageHeader).text()).toMatch("Contract " + SAMPLE_CONTRACT.contract_id)

        expect(wrapper.get("#entityIdValue").text()).toBe(SAMPLE_CONTRACT.contract_id + "Copy-cqohr")
        expect(wrapper.get("#obtainerValue").text()).toBe("None")
        expect(wrapper.get("#proxyAccountValue").text()).toBe("None")
        expect(wrapper.get("#fileValue").text()).toBe("0.0.749773")
        expect(wrapper.get("#evmAddress").text()).toBe("EVM Address 0x00000000000000000000000000000000000b70cfCopy")

        // None of the elements related to contract verification should be present in this context
        expect(wrapper.find('#verify-button').exists()).toBe(false)
        expect(wrapper.find('#showSource').exists()).toBe(false)
        expect(wrapper.find('#verificationStatus').exists()).toBe(false)
        expect(wrapper.find('#contractName').exists()).toBe(false)

        //
        // ContractDetails_ByteCode
        //
        mock.resetHistory()
        const wrapper2 = mount(ContractDetails_ByteCode, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.contract_id
            },
        });
        await flushPromises()

        expect(fetchGetURLs(mock)).toStrictEqual([])

        const tabComponent = wrapper2.findComponent(Tabs)
        expect(tabComponent.exists()).toBe(true)

        const tabs = tabComponent.findAll('li')
        expect(tabs.length).toBe(2)
        expect(tabs[0].text()).toBe('Runtime Bytecode')
        expect(tabs[1].text()).toBe('Creation Bytecode')

        expect(wrapper2.get("#bytecode").text()).toContain(
            "6080 6040 5236 606d 5730 73ff ffff ffff ffff ffff ffff ffff ffff ffff ffff ff16 3373 ffff ffff ffff ffff" +
            " ffff ffff ffff ffff ffff ffff 167f ddf2 52ad 1be2 c89b 69c2 b068 fc37 8daa 952b a7f1 63c4 a116 28f5 5a4d" +
            " f523 b3ef 3460 4051 6063 9190 607f 565b 6040 5180 9103 90a3 005b 6000 80fd 5b60 7981 6098 565b 8252 5050" +
            " 565b 6000 6020 8201 9050 6092 6000 8301 8460 7256 5b92 9150 5056 5b60 0081 9050 9190 5056 fea2 6469 7066" +
            " 7358 2212 20b9 4efc a641 a0cf 62b2 bd50 5f79 fe4b e165 c582 520b c615 e5c5 fa34 0215 6eaf d864 736f 6c63" +
            " 4300 0804 0033"
        )


        const tab = tabComponent.find("#tab-creation")
        await tab.trigger('click')

        // Check show assembly bytecode checkbox
        const checkbox = wrapper2.get("#show-assembly-bytecode")
        expect((checkbox.element as HTMLInputElement).checked).toBe(false);
        await checkbox.setValue(true);
        expect((checkbox.element as HTMLInputElement).checked).toBe(true);

        expect(wrapper2.get("#creation-bytecode").text()).toContain(
            "0x0000:60-PUSH10x800x0002:60-PUSH10x400x0004:52-MSTORE0x0005:36-CALLDATASIZE0x0006:60-PUSH10x6d" +
            "0x0008:57-JUMPI0x0009:30-ADDRESS0x000a:73-PUSH200xffffffffffffffffffffffffffffffffffffffff" +
            "0x001f:16-AND0x0020:33-CALLER0x0021:73-PUSH200xffffffffffffffffffffffffffffffffffffffff" +
            "0x0036:16-AND0x0037:7f-PUSH320xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" +
            "0x0058:34-CALLVALUE0x0059:60-PUSH10x400x005b:51-MLOAD0x005c:60-PUSH10x630x005e:91-SWAP2" +
            "0x005f:90-SWAP10x0060:60-PUSH10x7f0x0062:56-JUMP0x0063:5b-JUMPDEST0x0064:60-PUSH10x400x0066:51-MLOAD" +
            "0x0067:80-DUP10x0068:91-SWAP20x0069:03-SUB0x006a:90-SWAP10x006b:a3-LOG30x006c:00-STOP0x006d:5b-JUMPDEST" +
            "0x006e:60-PUSH10x000x0070:80-DUP10x0071:fd-REVERT0x0072:5b-JUMPDEST0x0073:60-PUSH10x790x0075:81-DUP2" +
            "0x0076:60-PUSH10x980x0078:56-JUMP0x0079:5b-JUMPDEST0x007a:82-DUP30x007b:52-MSTORE0x007c:50-POP" +
            "0x007d:50-POP0x007e:56-JUMP0x007f:5b-JUMPDEST0x0080:60-PUSH10x000x0082:60-PUSH10x200x0084:82-DUP3" +
            "0x0085:01-ADD0x0086:90-SWAP10x0087:50-POP0x0088:60-PUSH10x920x008a:60-PUSH10x000x008c:83-DUP4" +
            "0x008d:01-ADD0x008e:84-DUP50x008f:60-PUSH10x720x0091:56-JUMP0x0092:5b-JUMPDEST0x0093:92-SWAP3" +
            "0x0094:91-SWAP20x0095:50-POP0x0096:50-POP0x0097:56-JUMP0x0098:5b-JUMPDEST0x0099:60-PUSH10x00" +
            "0x009b:81-DUP20x009c:90-SWAP10x009d:50-POP0x009e:91-SWAP20x009f:90-SWAP10x00a0:50-POP" +
            "0x00a1:56-JUMP0x00a2:fe-INVALID"
        )
        expect(wrapper2.get("#solcVersion").text()).toBe("Solidity Compiler Version0.8.4")

        //
        // ContractDetails_Calls
        //
        mock.resetHistory()
        const wrapper3 = mount(ContractDetails_Calls, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.contract_id
            },
        });
        await flushPromises()

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id + "/results?internal=true",
            "api/v1/accounts/0xffffffffffffffffffffffffffffffffffffffff",
            "api/v1/contracts/0.0.1260",
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULTS.results[0].from,
            "api/v1/tokens/0.0.1260",
            "api/v1/accounts/" + SAMPLE_CONTRACT_RESULTS.results[0].from,
        ])

        expect(wrapper3.findComponent(ContractResultTable).exists()).toBe(true)

        // Uncheck show assembly bytecode checkbox
        await checkbox.setValue(false);
        expect((checkbox.element as HTMLInputElement).checked).toBe(false);

        mock.restore()
        wrapper.unmount()
        wrapper2.unmount()
        wrapper3.unmount()
        await flushPromises()
    });

    it("Should display contract details (using evm address)", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.evm_address
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        const matcher4 = "/api/v1/network/exchangerate"
        mock.onGet(matcher4).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const matcher5 = "/api/v1/contracts/" + SAMPLE_CONTRACT.evm_address + "/results?internal=true"
        mock.onGet(matcher5).reply(200, SAMPLE_CONTRACT_RESULTS);

        const wrapper = mount(ContractDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.evm_address
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_CONTRACT.evm_address,
            "api/v1/network/exchangerate",
            "api/v1/network/supply",
            "http://localhost:3000/files/any/295/" + SAMPLE_CONTRACT.evm_address,
            "api/v1/contracts/" + SAMPLE_CONTRACT.evm_address,
            "http://localhost:3000/mainnet/erc-20.json",
            "http://localhost:3000/mainnet/erc-721.json",
            "http://localhost:3000/mainnet/erc-1155.json",
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_CONTRACT.evm_address,
            "http://localhost:3000/files/any/295/" + SAMPLE_CONTRACT.evm_address,
        ])

        expect(wrapper.getComponent(PageHeader).text()).toMatch("Contract " + SAMPLE_CONTRACT.contract_id)

        expect(wrapper.get("#entityIdValue").text()).toBe(SAMPLE_CONTRACT.contract_id + "Copy-cqohr")
        expect(wrapper.get("#obtainerValue").text()).toBe("None")
        expect(wrapper.get("#proxyAccountValue").text()).toBe("None")
        expect(wrapper.get("#fileValue").text()).toBe("0.0.749773")
        expect(wrapper.get("#evmAddress").text()).toBe("EVM Address 0x00000000000000000000000000000000000b70cfCopy")

        // None of the elements related to contract verification should be present in this context
        expect(wrapper.find('#verify-button').exists()).toBe(false)
        expect(wrapper.find('#showSource').exists()).toBe(false)
        expect(wrapper.find('#verificationStatus').exists()).toBe(false)
        expect(wrapper.find('#contractName').exists()).toBe(false)

        // expect(wrapper.findComponent(ContractResultTable).exists()).toBe(true)

        mock.resetHistory()

        const wrapper2 = mount(ContractDetails_ByteCode, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.evm_address
            },
        });
        await flushPromises()

        // expect(fetchGetURLs(mock)).toStrictEqual([
        //     "api/v1/contracts/0xffffffffffffffffffffffffffffffffffffffff",
        //     "api/v1/accounts/0xffffffffffffffffffffffffffffffffffffffff",
        // ])

        let tab = wrapper2.find("#tab-runtime")
        await tab.trigger('click')
        await flushPromises()

        expect(wrapper2.get("#bytecode").text()).toContain(
            "6080 6040 5236 606d 5730 73ff ffff ffff ffff ffff ffff ffff ffff ffff ffff ff16 3373 ffff ffff ffff ffff " +
            "ffff ffff ffff ffff ffff ffff 167f ddf2 52ad 1be2 c89b 69c2 b068 fc37 8daa 952b a7f1 63c4 a116 28f5 5a4d " +
            "f523 b3ef 3460 4051 6063 9190 607f 565b 6040 5180 9103 90a3 005b 6000 80fd 5b60 7981 6098 565b 8252 5050 " +
            "565b 6000 6020 8201 9050 6092 6000 8301 8460 7256 5b92 9150 5056 5b60 0081 9050 9190 5056 fea2 6469 7066 " +
            "7358 2212 20b9 4efc a641 a0cf 62b2 bd50 5f79 fe4b e165 c582 520b c615 e5c5 fa34 0215 6eaf d864 736f 6c63 " +
            "4300 0804 0033")

        tab = wrapper2.find("#tab-creation")
        await tab.trigger('click')
        await flushPromises()

        // Check show assembly bytecode checkbox
        const checkbox = wrapper2.get("#show-assembly-bytecode")
        expect((checkbox.element as HTMLInputElement).checked).toBe(false);
        await checkbox.setValue(true);
        expect((checkbox.element as HTMLInputElement).checked).toBe(true);

        expect(wrapper2.get("#creation-bytecode").text()).toContain(
            "0x0000:60-PUSH10x800x0002:60-PUSH10x400x0004:52-MSTORE0x0005:36-CALLDATASIZE0x0006:60-PUSH10x6d" +
            "0x0008:57-JUMPI0x0009:30-ADDRESS0x000a:73-PUSH200xffffffffffffffffffffffffffffffffffffffff" +
            "0x001f:16-AND0x0020:33-CALLER0x0021:73-PUSH200xffffffffffffffffffffffffffffffffffffffff" +
            "0x0036:16-AND0x0037:7f-PUSH320xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" +
            "0x0058:34-CALLVALUE0x0059:60-PUSH10x400x005b:51-MLOAD0x005c:60-PUSH10x630x005e:91-SWAP20x005f:90-SWAP1" +
            "0x0060:60-PUSH10x7f0x0062:56-JUMP0x0063:5b-JUMPDEST0x0064:60-PUSH10x400x0066:51-MLOAD0x0067:80-DUP1" +
            "0x0068:91-SWAP20x0069:03-SUB0x006a:90-SWAP10x006b:a3-LOG30x006c:00-STOP0x006d:5b-JUMPDEST" +
            "0x006e:60-PUSH10x000x0070:80-DUP10x0071:fd-REVERT0x0072:5b-JUMPDEST0x0073:60-PUSH10x790x0075:81-DUP2" +
            "0x0076:60-PUSH10x980x0078:56-JUMP0x0079:5b-JUMPDEST0x007a:82-DUP30x007b:52-MSTORE0x007c:50-POP" +
            "0x007d:50-POP0x007e:56-JUMP0x007f:5b-JUMPDEST0x0080:60-PUSH10x000x0082:60-PUSH10x200x0084:82-DUP3" +
            "0x0085:01-ADD0x0086:90-SWAP10x0087:50-POP0x0088:60-PUSH10x920x008a:60-PUSH10x000x008c:83-DUP4" +
            "0x008d:01-ADD0x008e:84-DUP50x008f:60-PUSH10x720x0091:56-JUMP0x0092:5b-JUMPDEST0x0093:92-SWAP3" +
            "0x0094:91-SWAP20x0095:50-POP0x0096:50-POP0x0097:56-JUMP0x0098:5b-JUMPDEST0x0099:60-PUSH10x00" +
            "0x009b:81-DUP20x009c:90-SWAP10x009d:50-POP0x009e:91-SWAP20x009f:90-SWAP10x00a0:50-POP0x00a1:56-JUMP" +
            "0x00a2:fe-INVALID")
        expect(wrapper2.get("#solcVersion").text()).toBe("Solidity Compiler Version0.8.4")

        //
        // ContractDetails_Calls
        //
        mock.resetHistory()
        const wrapper3 = mount(ContractDetails_Calls, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.evm_address
            },
        });
        await flushPromises()

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + SAMPLE_CONTRACT.evm_address + "/results?internal=true",
            "api/v1/accounts/0xffffffffffffffffffffffffffffffffffffffff",
            "api/v1/contracts/0.0.1260",
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULTS.results[0].from,
            "api/v1/tokens/0.0.1260",
            "api/v1/accounts/" + SAMPLE_CONTRACT_RESULTS.results[0].from,
        ])

        expect(wrapper3.findComponent(ContractResultTable).exists()).toBe(true)

        // Uncheck show assembly bytecode checkbox
        await checkbox.setValue(false);
        expect((checkbox.element as HTMLInputElement).checked).toBe(false);

        mock.restore()
        wrapper.unmount()
        wrapper2.unmount()
        wrapper3.unmount()
        await flushPromises()
    });

    it("Should display recent contract calls table in contract details", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        const matcher2 = "/api/v1/accounts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT_AS_ACCOUNT);

        const matcher5 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id + "/results?internal=true"
        mock.onGet(matcher5).reply(200, SAMPLE_CONTRACT_RESULTS);

        const wrapper = mount(ContractDetails_Calls, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.contract_id
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id + "/results?internal=true",
            "api/v1/contracts/0.0.1260",
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULTS.results[0].from,
            "api/v1/tokens/0.0.1260",
            "api/v1/accounts/" + SAMPLE_CONTRACT_RESULTS.results[0].from,
        ])

        // expect(wrapper.text()).toMatch(RegExp("Contract " + "Associated account " + "Contract ID " + SAMPLE_CONTRACT.contract_id))

        const resultTable = wrapper.findComponent(ContractResultTable)
        expect(resultTable.exists()).toBe(true)

        expect(resultTable.find('thead').text()).toBe("TIMEFROMMESSAGETRANSFER AMOUNT")
        const rows = resultTable.find('tbody').findAll('tr')

        let cells = rows[0].findAll('td')
        expect(cells[0].text()).toBe("9:11:37.9739 AMFeb 3, 2023, UTC")
        expect(cells[1].text()).toBe("0x00000000000000000000000000000000000004ec(0.0.1260)")
        expect(cells[2].text()).toBe("None")
        expect(cells[3].text()).toBe("0.00000000ℏ")

        cells = rows[1].findAll('td')
        expect(cells[0].text()).toBe("9:09:24.5852 AMFeb 3, 2023, UTC")
        expect(cells[1].text()).toBe("0x00000000000000000000000000000000000004ec(0.0.1260)")
        expect(cells[2].text()).toBe("None")
        expect(cells[3].text()).toBe("0.00000000ℏ")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should update when contract id changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const contract1 = SAMPLE_CONTRACT
        let matcher1 = "/api/v1/contracts/" + contract1.contract_id
        mock.onGet(matcher1).reply(200, contract1);

        const matcher4 = "/api/v1/network/exchangerate"
        mock.onGet(matcher4).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        let matcher5 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id + "/results"
        mock.onGet(matcher5).reply(200, SAMPLE_CONTRACT_RESULTS);

        const wrapper = mount(ContractDetails_Summary, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.contract_id
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id,
            "http://localhost:3000/mainnet/erc-20.json",
            "http://localhost:3000/mainnet/erc-721.json",
            "http://localhost:3000/mainnet/erc-1155.json",
            "api/v1/network/nodes",
            "http://localhost:3000/files/any/295/" + SAMPLE_CONTRACT.evm_address,
        ])

        expect(wrapper.findComponent(NotificationBanner).exists()).toBe(false)

        expect(wrapper.get("#entityId").text()).toBe("Contract ID " + SAMPLE_CONTRACT.contract_id + "Copy-cqohr")
        expect(wrapper.get("#evmAddress").text()).toBe("EVM Address 0x00000000000000000000000000000000000b70cfCopy")

        const contract2 = SAMPLE_CONTRACT_DUDE

        matcher1 = "/api/v1/contracts/" + contract2.contract_id
        mock.onGet(matcher1).reply(200, contract2);

        matcher5 = "/api/v1/contracts/" + contract2.contract_id + "/results"
        mock.onGet(matcher5).reply(200, SAMPLE_CONTRACT_RESULTS);

        mock.resetHistory()
        await wrapper.setProps({
            contractId: SAMPLE_CONTRACT_DUDE.contract_id ?? undefined
        })
        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + SAMPLE_CONTRACT_DUDE.contract_id,
            "http://localhost:3000/files/any/295/0x00000000000000000000000000000000000C41Df",
        ])

        expect(wrapper.get("#entityId").text()).toBe("Contract ID " + SAMPLE_CONTRACT_DUDE.contract_id + "Copy-gazpt")
        expect(wrapper.get("#evmAddress").text()).toBe("EVM Address 0x00000000000000000000000000000000000c41dfCopy")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    // TODO: re-enable after activation of Contract Expiry
    it.skip("Should display notification of grace period", async () => {

        const mock = new MockAdapter(axios as any);

        const contract = SAMPLE_CONTRACT_DUDE
        const matcherAirdrop = "api/v1/accounts/" + contract.contract_id + "/airdrops/pending"
        mock.onGet(matcherAirdrop).reply(200, {"airdrops": []})

        const matcher1 = "/api/v1/contracts/" + contract.contract_id
        mock.onGet(matcher1).reply(200, contract);

        const matcher2 = "/api/v1/accounts/" + contract.contract_id
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT_AS_ACCOUNT);

        const matcher3 = "/api/v1/transactions"
        mock.onGet(matcher3).reply(200, SAMPLE_TRANSACTIONS);

        const matcher5 = "/api/v1/contracts/" + contract.contract_id + "/results"
        mock.onGet(matcher5).reply(200, SAMPLE_CONTRACT_RESULTS);

        const matcher7 = "api/v1/contracts/" + contract.contract_id + "/state?slot=0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
        mock.onGet(matcher7).reply<ContractStateResponse>(200, {state: [], links: undefined})

        const matcher8 = "api/v1/contracts/" + contract.contract_id + "/state?slot=0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"
        mock.onGet(matcher8).reply<ContractStateResponse>(200, {state: [], links: undefined})

        const wrapper = mount(ContractDetails, {
            global: {
                plugins: [Oruga]
            },
            props: {
                contractId: contract.contract_id
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/contracts/" + SAMPLE_CONTRACT_DELETED.contract_id,
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.contract_id,
            "api/v1/contracts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/results/logs",
            "api/v1/balances",
            "api/v1/transactions",
            "api/v1/contracts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/state?slot=0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc",
            "http://localhost:3000/files/any/295/0x00000000000000000000000000000000000C41Df",
            "api/v1/contracts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/state?slot=0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103",
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/nfts",
            "api/v1/tokens",
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/airdrops/pending",
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/airdrops/pending",
            "api/v1/contracts/" + SAMPLE_CONTRACT_DELETED.contract_id + "/results",
            "api/v1/contracts/0.0.1260",
            "api/v1/contracts/0x00000000000000000000000000000000000004ec",
            "api/v1/tokens/0.0.1260",
            "api/v1/accounts/0x00000000000000000000000000000000000004ec",
        ])

        expect(wrapper.text()).toMatch(RegExp("^Contract " + SAMPLE_CONTRACT_DUDE.contract_id))

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.exists()).toBe(true)
        expect(banner.text()).toBe("Contract has expired and is in grace period")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    // TODO: remove after activation of Contract Expiry
    it("Should NOT display notification of grace period", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const contract = SAMPLE_CONTRACT_DUDE
        const matcher1 = "/api/v1/contracts/" + contract.contract_id
        mock.onGet(matcher1).reply(200, contract);

        const matcher2 = "/api/v1/accounts/" + contract.contract_id
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT_DUDE_AS_ACCOUNT);

        const wrapper = mount(ContractDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: contract.contract_id
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_CONTRACT_DELETED.contract_id,
            "http://localhost:3000/files/any/295/0x00000000000000000000000000000000000C41Df",
            "http://localhost:3000/mainnet/erc-20.json",
            "http://localhost:3000/mainnet/erc-721.json",
            "http://localhost:3000/mainnet/erc-1155.json",
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.evm_address,
        ])

        expect(wrapper.text()).toMatch(RegExp("Contract " + SAMPLE_CONTRACT_DUDE.contract_id))

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.exists()).toBe(false)

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should display notification of deleted contract", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const contract = SAMPLE_CONTRACT_DELETED
        const matcher1 = "/api/v1/contracts/" + contract.contract_id
        mock.onGet(matcher1).reply(200, contract);

        const matcher2 = "/api/v1/accounts/" + contract.evm_address;
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT_DELETED_AS_ACCOUNT);

        const wrapper = mount(ContractDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: contract.contract_id
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_CONTRACT_DELETED.contract_id,
            "http://localhost:3000/files/any/295/0x00000000000000000000000000000000000C41Df",
            "http://localhost:3000/mainnet/erc-20.json",
            "http://localhost:3000/mainnet/erc-721.json",
            "http://localhost:3000/mainnet/erc-1155.json",
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_CONTRACT_DELETED.evm_address,
        ])

        expect(wrapper.getComponent(PageHeader).text()).toMatch("Contract " + contract.contract_id)

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.exists()).toBe(true)
        expect(banner.text()).toBe("Contract is deleted")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should detect invalid contract ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const invalidContractId = "0.0.0.1000"
        const wrapper = mount(ContractDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: invalidContractId
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + invalidContractId,
            "http://localhost:3000/mainnet/erc-20.json",
            "http://localhost:3000/mainnet/erc-721.json",
            "http://localhost:3000/mainnet/erc-1155.json",
            "api/v1/network/nodes",
            "api/v1/tokens/" + invalidContractId,
        ])

        expect(wrapper.get("#notificationBanner").text()).toBe("Invalid contract ID or address")

        wrapper.unmount()
        await flushPromises()
    });

    it("Should display ERC-1155 chip", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const SAMPLE_ERC1155 = [
            {
                contractId: SAMPLE_CONTRACT.contract_id,
                address: SAMPLE_CONTRACT.evm_address,
            }
        ]

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        const matcher2 = "/api/v1/accounts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT_AS_ACCOUNT);

        const matcher4 = "/api/v1/network/exchangerate"
        mock.onGet(matcher4).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const matcher12 = routeManager.currentNetworkEntry.value.erc1155IndexURL
        if (matcher12) {
            mock.onGet(matcher12).reply(200, SAMPLE_ERC1155);
        }
        const wrapper = mount(ContractDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                contractId: SAMPLE_CONTRACT.contract_id
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id,
            "api/v1/network/exchangerate",
            "api/v1/network/supply",
            "http://localhost:3000/files/any/295/" + SAMPLE_CONTRACT.evm_address,
            "http://localhost:3000/mainnet/erc-20.json",
            "http://localhost:3000/mainnet/erc-721.json",
            "http://localhost:3000/mainnet/erc-1155.json",
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_CONTRACT.evm_address,
        ])

        expect(wrapper.text()).toMatch(RegExp(
            "Contract " +
            "ERC 1155  " +
            "Contract ID " +
            SAMPLE_CONTRACT.contract_id
        ))

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should display contract details with public label", async () => {

        const mock = new MockAdapter(axios as any);

        const matcherAirdrop = "api/v1/accounts/" + SAMPLE_CONTRACT.contract_id + "/airdrops/pending"
        mock.onGet(matcherAirdrop).reply(200, {"airdrops": []})

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        const matcher2 = "/api/v1/accounts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT_AS_ACCOUNT);

        const matcher3 = "/api/v1/transactions"
        mock.onGet(matcher3).reply(200, SAMPLE_TRANSACTIONS);

        const matcher4 = "/api/v1/network/exchangerate"
        mock.onGet(matcher4).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const matcher5 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id + "/results"
        mock.onGet(matcher5).reply(200, SAMPLE_CONTRACT_RESULTS);

        const matcher6 = "/api/v1/balances"
        mock.onGet(matcher6).reply(200, SAMPLE_ACCOUNT_BALANCES);

        const matcher7 = "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id + "/state?slot=0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc"
        mock.onGet(matcher7).reply<ContractStateResponse>(200, {state: [], links: undefined})

        const matcher8 = "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id + "/state?slot=0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103"
        mock.onGet(matcher8).reply<ContractStateResponse>(200, {state: [], links: undefined})

        const matcher10 = "api/v1/tokens"
        mock.onGet(matcher10).reply(200, {tokens: []});

        const matcher11 = "api/v1/accounts/" + SAMPLE_CONTRACT.contract_id + "/nfts"
        mock.onGet(matcher11).reply(200, {nfts: []});

        mock.onGet(SAMPLE_PUBLIC_LABELS_URL).reply(200, SAMPLE_PUBLIC_LABELS_JSON);

        routeManager.configure(routeManager.coreConfig.value, SAMPLE_NETWORK_CONFIG) // global.provide is not enough
        const wrapper = mount(ContractDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {
                    "isMediumScreen": false,
                    [networkConfigKey]: SAMPLE_NETWORK_CONFIG
                }
            },
            props: {
                contractId: SAMPLE_CONTRACT.contract_id
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id,
            "http://localhost:3000/files/any/295/" + SAMPLE_CONTRACT.evm_address,
            "http://localhost:3000/mainnet/erc-20.json",
            "http://localhost:3000/mainnet/erc-721.json",
            "http://localhost:3000/mainnet/erc-1155.json",
            SAMPLE_PUBLIC_LABELS_URL,
            "api/v1/network/nodes",
            "api/v1/accounts/" + SAMPLE_CONTRACT.evm_address,
        ])

        expect(wrapper.text()).toMatch("Sample Contract LabelPublic Label for ID 0.0.749775 [Sample Type]Sample Contract Descriptionhttps://contract-example.com")

        const LABEL_INFO = SAMPLE_PUBLIC_LABELS_JSON[1]
        expect(wrapper.text()).toMatch(
            LABEL_INFO.name
            + "Public Label for ID "
            + LABEL_INFO.entityId
            + " [" + LABEL_INFO.type + "]"
            + LABEL_INFO.description
            + LABEL_INFO.website)

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

});







