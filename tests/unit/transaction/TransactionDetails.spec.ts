// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import TransactionDetails from "@/pages/TransactionDetails.vue";
import HbarTransferGraphF from "@/components/transfer_graphs/HbarTransferGraphF.vue";
import TokenTransferGraph from "@/components/transfer_graphs/TokenTransferGraphF.vue";
import NftTransferGraph from "@/components/transfer_graphs/NftTransferGraph.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import axios, {AxiosRequestConfig} from "axios";
import {
    SAMPLE_ACCOUNT,
    SAMPLE_ASSOCIATED_TOKEN,
    SAMPLE_ASSOCIATED_TOKEN_2,
    SAMPLE_BLOCK_ZERO,
    SAMPLE_BLOCKSRESPONSE,
    SAMPLE_CONTRACT,
    SAMPLE_CONTRACT_RESULT_DETAILS,
    SAMPLE_CONTRACTCALL_TRANSACTIONS,
    SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN,
    SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT,
    SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT,
    SAMPLE_FAILED_TRANSACTION,
    SAMPLE_FAILED_TRANSACTIONS,
    SAMPLE_FILE_UPDATE_TRANSACTION,
    SAMPLE_NETWORK_EXCHANGERATE,
    SAMPLE_NETWORK_NODES,
    SAMPLE_NONFUNGIBLE,
    SAMPLE_PARENT_CHILD_TRANSACTIONS,
    SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS,
    SAMPLE_SCHEDULE,
    SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS,
    SAMPLE_SYSTEM_CONTRACT_CALL_TRANSACTIONS,
    SAMPLE_TOKEN,
    SAMPLE_TOKEN_ASSOCIATE_TRANSACTION,
    SAMPLE_TOKEN_CALL_TRANSACTIONS,
    SAMPLE_TOKEN_RELATIONSHIP_RESPONSE,
    SAMPLE_TRANSACTION,
    SAMPLE_TRANSACTIONS
} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import {HMSF} from "@/utils/HMSF";
import {TransactionID} from "@/utils/TransactionID";
import Oruga from "@oruga-ui/oruga-next";
import ContractResult from "@/components/contract/ContractResult.vue";
import {base64Decode, byteToHex} from "@/utils/B64Utils";
import {fetchGetURLs} from "../MockUtils";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("TransactionDetails.vue", () => {

    it("Should display transaction details with token transfers and hbar transfers", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id
        mock.onGet(matcher1).reply(200, SAMPLE_TRANSACTIONS);
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SAMPLE_TRANSACTION.consensus_timestamp) {
                return [200, {transactions: [SAMPLE_TRANSACTION]}]
            } else {
                return [404]
            }
        }) as any);

        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN);

        const matcher3 = "api/v1/network/nodes"
        mock.onGet(matcher3).reply(200, SAMPLE_NETWORK_NODES);
        const matcher4 = "/api/v1/blocks"
        mock.onGet(matcher4).reply(200, SAMPLE_BLOCKSRESPONSE);
        const matcher5 = "/api/v1/network/exchangerate"
        mock.onGet(matcher5).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: SAMPLE_TRANSACTION.consensus_timestamp,
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())


        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/blocks",
            "api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[2].account,
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[0].account,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[1].account,
            "api/v1/tokens/" + SAMPLE_TRANSACTION.token_transfers[0].token_id,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.token_transfers[1].account,
        ])


        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(SAMPLE_TRANSACTION.transaction_id)))

        expect(wrapper.get("#transactionTypeValue").text()).toBe("CRYPTO TRANSFER")
        expect(wrapper.get("#consensusAtValue").text()).toBe("5:12:31.6676 AMFeb 28, 2022, UTC") // UTC because of HMSF.forceUTC
        expect(wrapper.get("#transactionHashValue").text()).toBe("0xa012961232ed7d2842836e95f7e9c4356fdfe2de08199091701a969c1d1fd93671d3078ee83b28fb460a88b4cbd8ecd2Copy")
        expect(wrapper.get("#blockNumberValue").text()).toBe("25175998")
        expect(wrapper.get("#chargedFeeValue").text()).toBe("0.00470065ℏ$0.00116")
        expect(wrapper.get("#maxFeeName").text()).toBe("Max Fee")
        expect(wrapper.get("#maxFeeValue").text()).toBe("1.00000000ℏ$0.24603")

        expect(wrapper.get("#memoValue").text()).toBe("None")
        expect(wrapper.get("#operatorAccountValue").text()).toBe("0.0.29624024")
        expect(wrapper.get("#nodeAccountValue").text()).toBe("0.0.5Hosted by Hedera | Central, USA")
        expect(wrapper.get("#durationValue").text()).toBe("2min")
        expect(() => wrapper.get("#associatedTokenId")).toThrowError()
        expect(() => wrapper.get("#entityId")).toThrowError()

        expect(wrapper.findComponent(HbarTransferGraphF).exists()).toBe(true)
        expect(wrapper.findComponent(TokenTransferGraph).exists()).toBe(true)
        expect(wrapper.findComponent(NftTransferGraph).exists()).toBe(true)

        expect(wrapper.findComponent(HbarTransferGraphF).text()).toBe(
            "Hbar Transfers ACCOUNT  AMOUNT  ACCOUNT  AMOUNT 0.0.29624024-0.00470065ℏ-$0.00116\n\n" +
            "0.0.40.00022028ℏ$0.00005Node fee (Hedera)\n\n" +
            "0.0.980.00448037ℏ$0.00110Hedera fee collection account")

        expect(wrapper.findComponent(TokenTransferGraph).text()).toBe(
            "Token Transfers ACCOUNTAMOUNTACCOUNTAMOUNT0.0.29624024-123423\n\n" +
            "0.0.29693911123423Transfer")

        expect(wrapper.findComponent(NftTransferGraph).text()).toBe("")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display the contract result and logs (using consensus timestamp)", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const transactionId = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].transaction_id
        const contractId = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].entity_id
        const timestamp = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].consensus_timestamp

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions/" + transactionId
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS);
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == timestamp) {
                return [200, SAMPLE_CONTRACTCALL_TRANSACTIONS]
            } else {
                return [404]
            }
        }) as any);

        const matcher2 = "/api/v1/contracts/" + contractId
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT)


        const param3 = {timestamp: timestamp, internal: true, limit: 1}
        const matcher3 = "/api/v1/contracts/results"
        mock.onGet(matcher3, {params: param3}).reply(200, {
            results: [SAMPLE_CONTRACT_RESULT_DETAILS], "links": {"next": null}
        });

        const matcher4 = "/api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id + "/results/" + timestamp
        mock.onGet(matcher4).reply(200, SAMPLE_CONTRACT_RESULT_DETAILS);

        const matcher5 = "/api/v1/contracts/results/" + SAMPLE_CONTRACT_RESULT_DETAILS.hash + "/actions?limit=100"
        mock.onGet(matcher5).reply(200, "[]")

        const fromContract = {
            "contract_id": "0.0.846260",
            "evm_address": "0x00000000000000000000000000000000000ce9b4",
        }
        const toContract = {
            "contract_id": "0.0.1062787",
            "evm_address": "0x0000000000000000000000000000000000103783",
        }

        const matcher6 = "/api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.from
        const matcher61 = "/api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.to
        mock.onGet(matcher6).reply(200, fromContract)
        mock.onGet(matcher61).reply(200, toContract)

        const matcher7 = "api/v1/network/nodes"
        mock.onGet(matcher7).reply(200, SAMPLE_NETWORK_NODES);
        const matcher9 = "/api/v1/network/exchangerate"
        mock.onGet(matcher9).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: timestamp,
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/contracts/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].entity_id,
            "api/v1/transactions/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].transaction_id,
            "api/v1/contracts/results/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].transaction_id,
            "api/v1/contracts/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].transfers[0].account,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].transfers[2].account,
            "api/v1/contracts/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].transfers[1].account,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id + "/results/1646665766.574738471",
            "api/v1/accounts/",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x18cbafe5",
            "api/v1/contracts/0.0.846260", // SAMPLE_CONTRACT_RESULT_DETAILS.from as entity id
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id,
            "api/v1/contracts/results/" + SAMPLE_CONTRACT_RESULT_DETAILS.hash + "/actions?limit=100",
            "api/v1/transactions",
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.logs[1].contract_id,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.from,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.to,
            "api/v1/contracts/0x0000000000000000000000000000000000108a83",
            "api/v1/blocks",
            "api/v1/tokens/0.0.846260", // SAMPLE_CONTRACT_RESULT_DETAILS.from as entity id
            "api/v1/accounts/0x0000000000000000000000000000000000108a83",
            "api/v1/tokens/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id,
            "api/v1/tokens/" + SAMPLE_CONTRACT_RESULT_DETAILS.logs[1].contract_id,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transactionId)))
        expect(wrapper.get("#transactionTypeValue").text()).toBe("CONTRACT CALL")
        expect(wrapper.get("#entityId").text()).toBe("Contract ID" + contractId)
        expect(wrapper.get("#durationValue").text()).toBe("None")

        expect(wrapper.get("#chargedFeeName").text()).toBe("Charged Fee")
        expect(wrapper.get("#chargedFeeValue").text()).toBe("0.95515604ℏ$0.23500")
        expect(wrapper.get("#maxFeeName").text()).toBe("Max FeeMax Fee limit does not include the HBAR cost of gas consumed by transactions executed on the EVM.")
        expect(wrapper.get("#maxFeeValue").text()).toBe("0.20000000ℏ$0.04921")

        expect(wrapper.findComponent(ContractResult).exists()).toBe(true)
        expect(wrapper.findComponent(ContractResult).text()).toMatch(RegExp("^Contract Result"))
        expect(wrapper.get("#resultValue").text()).toBe("SUCCESS")
        expect(wrapper.get("#evm-hashValue").text()).toBe("0xc43db9eacf72c91629ac03088535dd9ae41059a2c1eefce3a528e04e7e908d2dCopy")
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
        expect(wrapper.findAll("#transactionHash").length).toBe(4)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display the contract result and logs (using transaction hash)", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const SAMPLE_TRANSACTION = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0]
        const transactionId = SAMPLE_TRANSACTION.transaction_id
        const transactionHashBase64 = SAMPLE_TRANSACTION.transaction_hash
        const transactionHash = byteToHex(base64Decode(transactionHashBase64))
        const contractId = SAMPLE_TRANSACTION.entity_id
        const timestamp = SAMPLE_TRANSACTION.consensus_timestamp

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions/" + transactionHash
        mock.onGet(matcher1).reply(200, {transactions: [SAMPLE_TRANSACTION]});
        const matcher11 = "/api/v1/transactions/" + transactionId
        mock.onGet(matcher11).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS);
        const matcher12 = "/api/v1/transactions"
        mock.onGet(matcher12).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == timestamp) {
                return [200, SAMPLE_CONTRACTCALL_TRANSACTIONS]
            } else {
                return [404]
            }
        }) as any);

        const matcher2 = "/api/v1/contracts/" + contractId
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT)

        const param3 = {timestamp: timestamp, internal: true, limit: 1}
        const matcher3 = "/api/v1/contracts/results"
        mock.onGet(matcher3, {params: param3}).reply(200, {
            results: [SAMPLE_CONTRACT_RESULT_DETAILS], "links": {"next": null}
        });

        const matcher4 = "/api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id + "/results/" + timestamp
        mock.onGet(matcher4).reply(200, SAMPLE_CONTRACT_RESULT_DETAILS);

        const hash = SAMPLE_CONTRACT_RESULT_DETAILS.hash
        const matcher5 = "/api/v1/contracts/results/" + hash + "/actions?limit=100"
        mock.onGet(matcher5).reply(200, "[]")

        const matcher7 = "api/v1/network/nodes"
        mock.onGet(matcher7).reply(200, SAMPLE_NETWORK_NODES);
        // const matcher8 = "/api/v1/blocks"
        // mock.onGet(matcher8).reply(200, SAMPLE_BLOCKSRESPONSE);
        const matcher9 = "/api/v1/network/exchangerate"
        mock.onGet(matcher9).reply(200, SAMPLE_NETWORK_EXCHANGERATE);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: transactionHash
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions/ad6fb2ddb8c33ead48ddded679ec8d6d13ae7ab87da06f3172d8620a8748e50d713075c89e7dea39447b4cb8fa2cd428",
            "api/v1/topics/messages/",
            "api/v1/contracts/" + SAMPLE_TRANSACTION.entity_id,
            "api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id,
            "api/v1/contracts/results/" + SAMPLE_TRANSACTION.transaction_id,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[0].account,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[2].account,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[1].account,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id + "/results/1646665766.574738471",
            "api/v1/accounts/",
            "api/v1/contracts/0.0.846260", // SAMPLE_CONTRACT_RESULT_DETAILS.from as entity id
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id,
            "api/v1/contracts/results/0xc43db9eacf72c91629ac03088535dd9ae41059a2c1eefce3a528e04e7e908d2d/actions?limit=100",
            "api/v1/transactions",
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.logs[1].contract_id,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.from,
            "api/v1/contracts/" + SAMPLE_CONTRACT_RESULT_DETAILS.to,
            "api/v1/contracts/0x0000000000000000000000000000000000108a83",
            "api/v1/blocks",
            "api/v1/tokens/0.0.846260", // SAMPLE_CONTRACT_RESULT_DETAILS.from as entity id
            "api/v1/accounts/" + SAMPLE_CONTRACT_RESULT_DETAILS.from,
            "api/v1/accounts/" + SAMPLE_CONTRACT_RESULT_DETAILS.to,
            "api/v1/accounts/0x0000000000000000000000000000000000108a83",
            "api/v1/tokens/" + SAMPLE_CONTRACT_RESULT_DETAILS.contract_id,
            "api/v1/tokens/" + SAMPLE_CONTRACT_RESULT_DETAILS.logs[1].contract_id,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transactionId)))
        expect(wrapper.get("#transactionTypeValue").text()).toBe("CONTRACT CALL")
        expect(wrapper.get("#entityId").text()).toBe("Contract ID" + contractId)

        expect(wrapper.findComponent(ContractResult).exists()).toBe(true)
        expect(wrapper.findComponent(ContractResult).text()).toMatch(RegExp("^Contract Result"))
        expect(wrapper.get("#resultValue").text()).toBe("SUCCESS")
        expect(wrapper.get("#evm-hashValue").text()).toBe("0xc43db9eacf72c91629ac03088535dd9ae41059a2c1eefce3a528e04e7e908d2dCopy")
        expect(wrapper.get("#fromValue").text()).toBe("0x00000000000000000000000000000000000ce9b4Copy(0.0.846260)")
        expect(wrapper.get("#toValue").text()).toBe("0x0000000000000000000000000000000000103783Copy(0.0.1062787)")
        expect(wrapper.find("#typeValue").exists()).toBe(false)
        // expect(wrapper.get("#functionParametersValue").text()).toBe("18cb afe5 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0017 4876 e800 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 001b 2702 b2a0 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 00a0 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 000c e9b4 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0183 1e10 602d 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0003 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 000c ba44 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 000d 1ea6 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0000 0010 3708Copy")
        // expect(wrapper.get("#errorMessageValue").text()).toBe("None")
        expect(wrapper.get("#gasLimitValue").text()).toBe("480,000")
        expect(wrapper.get("#gasUsedValue").text()).toBe("384,000")
        expect(wrapper.find("#maxFeePerGasValue").exists()).toBe(false)
        expect(wrapper.find("#maxPriorityFeePerGasValue").exists()).toBe(false)
        expect(wrapper.get("#gasPriceValue").text()).toBe("None")
        expect(wrapper.findAll("#transactionHash").length).toBe(4)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should update when consensus timestamp changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any)
        let matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SAMPLE_TRANSACTION.consensus_timestamp) {
                return [200, {transactions: [SAMPLE_TRANSACTION]}]
            } else {
                return [404]
            }
        }) as any);

        let matcher11 = "/api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id
        mock.onGet(matcher11).reply(200, SAMPLE_TRANSACTIONS)

        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: SAMPLE_TRANSACTION.consensus_timestamp
            },
        });

        await flushPromises()

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/blocks",
            "api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[2].account,
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[0].account,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[1].account,
            "api/v1/tokens/" + SAMPLE_TRANSACTION.token_transfers[0].token_id,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.token_transfers[1].account,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(SAMPLE_TRANSACTION.transaction_id)))
        expect(wrapper.get("#transactionTypeValue").text()).toBe("CRYPTO TRANSFER")
        expect(wrapper.get("#memoValue").text()).toBe("None")

        expect(wrapper.findComponent(HbarTransferGraphF).exists()).toBe(true)
        expect(wrapper.findComponent(TokenTransferGraph).exists()).toBe(true)
        expect(wrapper.findComponent(NftTransferGraph).text()).toBe("")

        const transaction = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0]
        matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == transaction.consensus_timestamp) {
                return [200, {transactions: [transaction]}]
            } else {
                return [404]
            }
        }) as any);
        matcher11 = "/api/v1/transactions/" + transaction.transaction_id
        mock.onGet(matcher11).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS)

        const entityId = SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].entity_id
        const matcher3 = "/api/v1/contracts/" + entityId
        mock.onGet(matcher3).reply(200, SAMPLE_CONTRACT)

        mock.resetHistory()

        await wrapper.setProps({
            transactionLoc: transaction.consensus_timestamp
        })
        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions",
            "api/v1/contracts/" + transaction.entity_id,
            "api/v1/transactions/" + transaction.transaction_id,
            "api/v1/contracts/results/" + transaction.transaction_id,
            "api/v1/contracts/" + transaction.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + transaction.transfers[2].account,
            "api/v1/accounts/",
            "api/v1/blocks",
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transaction.transaction_id)))
        expect(wrapper.get("#transactionTypeValue").text()).toBe("CONTRACT CALL")
        expect(wrapper.get("#memoValue").text()).toBe("Mirror Node acceptance test: 2022-03-07T15:09:26.066680977Z Execute contract")

        expect(wrapper.get('#entityIdName').text()).toBe("Contract ID")
        expect(wrapper.get('#entityIdValue').text()).toBe(entityId)

        expect(wrapper.findComponent(HbarTransferGraphF).exists()).toBe(true)
        expect(wrapper.findComponent(TokenTransferGraph).text()).toBe("")
        expect(wrapper.findComponent(NftTransferGraph).text()).toBe("")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display a notification banner for failed transaction", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SAMPLE_FAILED_TRANSACTION.consensus_timestamp) {
                return [200, {transactions: [SAMPLE_FAILED_TRANSACTION]}]
            } else {
                return [404]
            }
        }) as any);

        const matcher11 = "/api/v1/transactions/" + SAMPLE_FAILED_TRANSACTION.transaction_id
        mock.onGet(matcher11).reply(200, SAMPLE_FAILED_TRANSACTIONS);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: SAMPLE_FAILED_TRANSACTION.consensus_timestamp
            },
        });

        await flushPromises()
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/contracts/" + SAMPLE_FAILED_TRANSACTION.entity_id,
            "api/v1/transactions/" + SAMPLE_FAILED_TRANSACTION.transaction_id,
            "api/v1/contracts/" + SAMPLE_FAILED_TRANSACTION.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_FAILED_TRANSACTION.transfers[2].account,
            "api/v1/contracts/" + SAMPLE_FAILED_TRANSACTION.transfers[1].account,
            "api/v1/contracts/results/" + SAMPLE_FAILED_TRANSACTION.transaction_id,
            "api/v1/accounts/",
            "api/v1/blocks",
            "api/v1/tokens/" + SAMPLE_FAILED_TRANSACTION.entity_id,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(SAMPLE_FAILED_TRANSACTION.transaction_id)))

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.exists()).toBe(true)
        expect(banner.text()).toBe("CONTRACT_REVERT_EXECUTED")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should detect invalid transaction timestamp", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);
        const matcher3 = "api/v1/network/nodes"
        mock.onGet(matcher3).reply(200, SAMPLE_NETWORK_NODES);

        const invalidTimestamp = "1600000000.000000000"
        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: invalidTimestamp
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
        ])

        expect(wrapper.get("#notificationBanner").text()).toBe("Transaction with timestamp " + invalidTimestamp + " was not found")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display the name of the system contract called", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const transaction = SAMPLE_SYSTEM_CONTRACT_CALL_TRANSACTIONS.transactions[0]

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == transaction.consensus_timestamp) {
                return [200, {transactions: [transaction]}]
            } else {
                return [404]
            }
        }) as any);
        const matcher11 = "/api/v1/transactions/" + transaction.transaction_id
        mock.onGet(matcher11).reply(200, SAMPLE_SYSTEM_CONTRACT_CALL_TRANSACTIONS)

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: transaction.consensus_timestamp
            },
        });
        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/contracts/0.0.359",
            "api/v1/transactions/" + transaction.transaction_id,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/contracts/0.0.29511696",
            "api/v1/network/exchangerate",
            "api/v1/contracts/results/" + transaction.transaction_id,
            "api/v1/accounts/",
            "api/v1/blocks",
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transaction.transaction_id)))
        expect(wrapper.get("#transactionTypeValue").text()).toBe("CONTRACT CALL")
        expect(wrapper.get("#entityId").text()).toBe("Contract IDHedera Token Service System Contract")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display a link to the scheduled transaction", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const SCHEDULING = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![0]
        const SCHEDULED = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![1]
        const TOKEN_ID = SCHEDULED.token_transfers ? SCHEDULED.token_transfers[0].token_id : "0.0.1304757"

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SCHEDULING.consensus_timestamp) {
                return [200, {transactions: [SCHEDULING]}]
            } else if (config.params.timestamp == SCHEDULED.consensus_timestamp) {
                return [200, {transactions: [SCHEDULED]}]
            } else {
                return [404]
            }
        }) as any);
        const matcher11 = "/api/v1/transactions/" + SCHEDULING.transaction_id
        mock.onGet(matcher11).reply(200, SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS);
        const matcher2 = "/api/v1/schedules/" + SCHEDULING.entity_id
        mock.onGet(matcher2).reply(200, SAMPLE_SCHEDULE);
        const matcher5 = "/api/v1/tokens/" + TOKEN_ID
        mock.onGet(matcher5).reply(200, SAMPLE_TOKEN)

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: SCHEDULING.consensus_timestamp
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/transactions/" + SCHEDULING.transaction_id,
            "api/v1/blocks",
            "api/v1/schedules/0.0.1382775",
            "api/v1/contracts/" + SCHEDULING.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/transactions",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SCHEDULING.transfers[2].account,
            "api/v1/contracts/" + SCHEDULING.transfers[1].account,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(SCHEDULING.transaction_id)))

        const scheduled = wrapper.get("#scheduledTransactionValue")
        expect(scheduled.text()).toBe("0.0.503733@1666754898.238965661" + "EXECUTED")
        const link = scheduled.get('a')
        expect(link.attributes("href")).toBe(
            "/mainnet/transaction/" + SCHEDULED.consensus_timestamp
        )

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display a link to the scheduling transaction", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const SCHEDULING = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![0]
        const SCHEDULED = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![1]
        const TOKEN_ID = SCHEDULED.token_transfers ? SCHEDULED.token_transfers[0].token_id : "0.0.1304757"

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SCHEDULING.consensus_timestamp) {
                return [200, {transactions: [SCHEDULING]}]
            } else if (config.params.timestamp == SCHEDULED.consensus_timestamp) {
                return [200, {transactions: [SCHEDULED]}]
            } else {
                return [404]
            }
        }) as any);
        const matcher11 = "/api/v1/transactions/" + SCHEDULED.transaction_id
        mock.onGet(matcher11).reply(200, SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS);
        const matcher12 = "/api/v1/schedules/" + SCHEDULING.entity_id
        mock.onGet(matcher12).reply(200, SAMPLE_SCHEDULE);
        const matcher2 = "/api/v1/tokens/" + TOKEN_ID
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: SCHEDULED.consensus_timestamp
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/transactions/" + SCHEDULING.transaction_id,
            "api/v1/blocks",
            "api/v1/schedules/0.0.1382775",
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/contracts/" + SCHEDULING.transfers[2].account,
            "api/v1/network/exchangerate",
            "api/v1/transactions",
            "api/v1/tokens/" + SCHEDULED.entity_id,
            "api/v1/contracts/" + SCHEDULED.transfers[1].account,
            "api/v1/contracts/" + SCHEDULING.transfers[1].account,
            "api/v1/contracts/" + SCHEDULED.token_transfers[0].account,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(SCHEDULED.transaction_id)))

        const scheduling = wrapper.get("#scheduleCreateTransactionValue")
        expect(scheduling.text()).toBe(TransactionID.normalizeForDisplay(SCHEDULING.transaction_id))
        const link = scheduling.get('a')
        expect(link.attributes("href")).toBe(
            "/mainnet/transaction/" + SCHEDULING.consensus_timestamp
        )

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display a link to the parent transaction",
        async () => {

            await router.push("/") // To avoid "missing required param 'network'" error

            const PARENT = SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions![0]
            const CHILD = SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions![1]
            const TOKEN_ID = CHILD.nft_transfers ? CHILD.nft_transfers[0].token_id : "0.0.48193741"

            const mock = new MockAdapter(axios as any)
            const matcher1 = "/api/v1/transactions"
            mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
                if (config.params.timestamp == CHILD.consensus_timestamp) {
                    return [200, {transactions: [CHILD]}]
                } else {
                    return [404]
                }
            }) as any);
            const matcher11 = "/api/v1/transactions/" + CHILD.transaction_id
            mock.onGet(matcher11).reply(200, SAMPLE_PARENT_CHILD_TRANSACTIONS);
            const matcher2 = "/api/v1/tokens/" + TOKEN_ID
            mock.onGet(matcher2).reply(200, SAMPLE_TOKEN);

            const wrapper = mount(TransactionDetails, {
                global: {
                    plugins: [router, Oruga],
                    provide: {"isMediumScreen": false}
                },
                props: {
                    transactionLoc: CHILD.consensus_timestamp,
                },
            });

            await flushPromises()
            // console.log(wrapper.html())
            // console.log(wrapper.text())

            expect(fetchGetURLs(mock)).toStrictEqual([
                "api/v1/network/nodes",
                "api/v1/transactions",
                "api/v1/topics/messages/",
                "api/v1/transactions/" + PARENT.transaction_id,
                "api/v1/blocks",
                "api/v1/contracts/results",
                "api/v1/network/fees",
                "api/v1/contracts/" + SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions![0].transfers[1].account,
                "api/v1/network/exchangerate",
                "api/v1/tokens/" + CHILD.entity_id,
            ])

            expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(CHILD.transaction_id)))

            const link = wrapper.get("#parentTransactionValue")
            expect(link.text()).toBe("CONTRACT CALL")
            expect(link.get('a').attributes("href")).toBe(
                "/mainnet/transaction/" + PARENT.consensus_timestamp
            )

            wrapper.unmount()
            await flushPromises()
            mock.restore()
        });

    it("Should display link to the child transactions", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const PARENT = SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions![0]
        const CHILD1 = SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions![1]
        const CHILD2 = SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions![2]
        const TARGETED_TOKEN = CHILD1.entity_id

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == PARENT.consensus_timestamp) {
                return [200, {transactions: [PARENT]}]
            } else {
                return [404]
            }
        }) as any);
        const matcher11 = "/api/v1/transactions/" + PARENT.transaction_id
        mock.onGet(matcher11).reply(200, SAMPLE_PARENT_CHILD_TRANSACTIONS);
        const matcher2 = "/api/v1/tokens/" + TARGETED_TOKEN
        mock.onGet(matcher2).reply(200, SAMPLE_NONFUNGIBLE);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: PARENT.consensus_timestamp
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/contracts/" + PARENT.entity_id,
            "api/v1/transactions/" + PARENT.transaction_id,
            "api/v1/contracts/" + PARENT.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/contracts/" + PARENT.transfers[1].account,
            "api/v1/network/exchangerate",
            "api/v1/tokens/" + CHILD1.entity_id,
            "api/v1/contracts/" + PARENT.transfers[0].account,
            "api/v1/contracts/results/" + SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions![0].transaction_id,
            "api/v1/accounts/",
            "api/v1/blocks",
            "api/v1/tokens/" + PARENT.entity_id,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(PARENT.transaction_id)))

        const children = wrapper.get("#childTransactionsValue")
        expect(children.text()).toBe("" +
            "#1TOKEN MINTĦFRENSKINGDOM" +
            "#2CRYPTO TRANSFERĦFRENSKINGDOM")

        const links = children.findAll('a')
        expect(links[0].attributes("href")).toBe(
            "/mainnet/transaction/" + CHILD1.consensus_timestamp
        )
        expect(links[1].attributes("href")).toBe(
            "/mainnet/token/" + TARGETED_TOKEN
        )
        expect(links[2].attributes("href")).toBe(
            "/mainnet/transaction/" + CHILD2.consensus_timestamp
        )
        expect(links[3].attributes("href")).toBe(
            "/mainnet/token/" + TARGETED_TOKEN
        )

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should NOT display a link to the parent transaction", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any)
        const NONCE_1 = SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS.transactions[1]
        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == NONCE_1.consensus_timestamp) {
                return [200, {transactions: [NONCE_1]}]
            } else {
                return [404]
            }
        }) as any);
        const matcher11 = "/api/v1/transactions/" + NONCE_1.transaction_id
        mock.onGet(matcher11).reply(200, SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: NONCE_1.consensus_timestamp,
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/transactions/" + SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS.transactions[0].transaction_id,
            "api/v1/blocks",
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS.transactions[0].transfers[2].account,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(NONCE_1.transaction_id)))
        expect(wrapper.find("#parentTransaction").exists()).toBe(false)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display transaction details with account/token association", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const transaction = SAMPLE_TOKEN_ASSOCIATE_TRANSACTION
        const token1 = SAMPLE_ASSOCIATED_TOKEN
        const token2 = SAMPLE_ASSOCIATED_TOKEN_2

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions/" + transaction.transaction_id
        mock.onGet(matcher1).reply(200, {transactions: [transaction]});
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == transaction.consensus_timestamp) {
                return [200, {transactions: [transaction]}]
            } else {
                return [404]
            }
        }) as any);
        const matcher3 = "/api/v1/accounts/" + transaction.entity_id + "/tokens?limit=100"
        mock.onGet(matcher3).reply(200, SAMPLE_TOKEN_RELATIONSHIP_RESPONSE);
        const matcher4 = "/api/v1/tokens/" + token1.token_id
        mock.onGet(matcher4).reply(200, token1);
        const matcher5 = "/api/v1/tokens/" + token2.token_id
        mock.onGet(matcher5).reply(200, token2);

        const matcher10 = "/api/v1/network/exchangerate"
        mock.onGet(matcher10).reply(200, SAMPLE_NETWORK_EXCHANGERATE);
        const matcher20 = "/api/v1/blocks"
        mock.onGet(matcher20).reply(200, SAMPLE_BLOCKSRESPONSE);
        const matcher30 = "api/v1/network/nodes"
        mock.onGet(matcher30).reply(200, SAMPLE_NETWORK_NODES);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: transaction.consensus_timestamp,
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/transactions/" + SAMPLE_TOKEN_ASSOCIATE_TRANSACTION.transaction_id,
            "api/v1/blocks",
            "api/v1/contracts/" + SAMPLE_TOKEN_ASSOCIATE_TRANSACTION.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_TOKEN_ASSOCIATE_TRANSACTION.transfers[2].account,
            "api/v1/contracts/" + SAMPLE_TOKEN_ASSOCIATE_TRANSACTION.transfers[1].account,
            "api/v1/accounts/" + SAMPLE_TOKEN_ASSOCIATE_TRANSACTION.transfers[2].account + "/tokens?limit=100",
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN.token_id,
            "api/v1/tokens/" + SAMPLE_ASSOCIATED_TOKEN_2.token_id,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transaction.transaction_id)))

        expect(wrapper.get("#transactionTypeValue").text()).toBe("TOKEN ASSOCIATE")
        expect(wrapper.get("#consensusAtValue").text()).toBe("6:51:52.1505 PMDec 21, 2022, UTC") // UTC because of HMSF.forceUTC
        expect(wrapper.get("#transactionHashValue").text()).toBe("0x4786079999df169a38349249d3c9a5489a83f1c7c51b6b1edeb81347a496d93183e24a43ad03372ebc501528a6032debCopy")

        expect(wrapper.get("#associatedTokenIdValue").text()).toBe("0.0.34332104HSuite0.0.49292859TokenA7")
        expect(wrapper.get("#entityIdValue").text()).toBe("0.0.642949")

        expect(wrapper.findComponent(HbarTransferGraphF).exists()).toBe(true)
        expect(wrapper.findComponent(TokenTransferGraph).exists()).toBe(true)
        expect(wrapper.findComponent(NftTransferGraph).exists()).toBe(true)

        expect(wrapper.findComponent(HbarTransferGraphF).text()).toBe("Hbar Transfers ACCOUNT  AMOUNT  ACCOUNT  AMOUNT 0.0.642949-1.15905210ℏ-$0.28517\n\n" +
            "0.0.30.05805847ℏ$0.01428Node fee (Hedera)\n\n" +
            "0.0.981.10099363ℏ$0.27088Hedera fee collection account")
        expect(wrapper.findComponent(TokenTransferGraph).text()).toBe("")
        expect(wrapper.findComponent(NftTransferGraph).text()).toBe("")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display CONTRACT CALL details with link to (proxied) token as entity ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const transactionId = SAMPLE_TOKEN_CALL_TRANSACTIONS.transactions[0].transaction_id
        const entityId = SAMPLE_TOKEN_CALL_TRANSACTIONS.transactions[0].entity_id
        const timestamp = SAMPLE_TOKEN_CALL_TRANSACTIONS.transactions[0].consensus_timestamp

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions/" + transactionId
        mock.onGet(matcher1).reply(200, SAMPLE_TOKEN_CALL_TRANSACTIONS);
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == timestamp) {
                return [200, SAMPLE_TOKEN_CALL_TRANSACTIONS]
            } else {
                return [404]
            }
        }) as any);

        const matcher2 = "/api/v1/contracts/" + entityId
        mock.onGet(matcher2).reply(404)

        const matcher3 = "/api/v1/tokens/" + entityId
        mock.onGet(matcher3).reply(200, SAMPLE_TOKEN)

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: timestamp
            },
        });

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
        ])

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transactionId)))
        expect(wrapper.text()).toMatch(RegExp("CONTRACT CALL"))
        expect(wrapper.get("#entityIdName").text()).toBe("Token ID")
        expect(wrapper.get("#entityIdValue").text()).toMatch(entityId)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display ETHEREUM TX details with link to account as entity ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const transactionId = SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].transaction_id
        const entityId = SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].entity_id
        const timestamp = SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].consensus_timestamp

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions/" + transactionId
        mock.onGet(matcher1).reply(200, SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT);
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == timestamp) {
                return [200, SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT]
            } else {
                return [404]
            }
        }) as any);

        const matcher2 = "/api/v1/contracts/" + entityId
        mock.onGet(matcher2).reply(404)
        const matcher3 = "/api/v1/accounts/" + entityId
        mock.onGet(matcher3).reply(200, SAMPLE_ACCOUNT)

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: timestamp
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].entity_id,
            "api/v1/transactions/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].transaction_id,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].transfers[2].account,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].transfers[4].account,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].transfers[1].account,
            "api/v1/contracts/results/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].transaction_id,
            "api/v1/accounts/",
            "api/v1/accounts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_ACCOUNT.transactions[0].entity_id,
            "api/v1/blocks",
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transactionId)))
        expect(wrapper.text()).toMatch(RegExp("ETHEREUM TRANSACTION"))
        expect(wrapper.get("#entityIdName").text()).toBe("Account ID")
        expect(wrapper.get("#entityIdValue").text()).toMatch(entityId)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display ETHEREUM TX details with link to contract as entity ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const transactionId = SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].transaction_id
        const entityId = SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].entity_id
        const timestamp = SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].consensus_timestamp

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions/" + transactionId
        mock.onGet(matcher1).reply(200, SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT);
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == timestamp) {
                return [200, SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT]
            } else {
                return [404]
            }
        }) as any);

        const matcher2 = "/api/v1/contracts/" + entityId
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT)

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: timestamp
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].entity_id,
            "api/v1/transactions/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].transaction_id,
            "api/v1/contracts/results/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].transaction_id,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].transfers[2].account,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].transfers[3].account,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ON_CONTRACT.transactions[0].transfers[1].account,
            "api/v1/accounts/",
            "api/v1/blocks",
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transactionId)))
        expect(wrapper.text()).toMatch(RegExp("ETHEREUM TRANSACTION"))
        expect(wrapper.get("#entityIdName").text()).toBe("Contract ID")
        expect(wrapper.get("#entityIdValue").text()).toMatch(entityId)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display ETHEREUM TX details with link to token as entity ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const transaction = SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0]
        const transactionId = transaction.transaction_id
        const entityId = transaction.entity_id
        const timestamp = transaction.consensus_timestamp

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions/" + transactionId
        mock.onGet(matcher1).reply(200, SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN);
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == timestamp) {
                return [200, SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN]
            } else {
                return [404]
            }
        }) as any);

        const matcher2 = "/api/v1/tokens/" + entityId
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN)

        const result = {
            "address": "0x00000000000000000000000000000000000382a1",
            "amount": 0,
            "bloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "call_result": "0x0000000000000000000000000000000000000000000000000000000000000016",
            "contract_id": "0.0.230049",
            "created_contract_ids": [],
            "error_message": null,
            "from": "0x000000000000000000000000000000000000a4f0",
            "function_parameters": "0x0a754de6",
            "gas_limit": 4000000,
            "gas_used": 3200000,
            "timestamp": "1687555828.300024003",
            "to": "0x00000000000000000000000000000000000382a1",
            "hash": "0xa34851b8f0df391c38a73230265e5118741408ab982c5f64345db35cee22e360",
            "block_hash": "0xb020ca98489bf4ceecb650332de36b22b8bfe2cb8d2234d2160e2502b44198a12342ebe427b7ec8078be4afcaadd826b",
            "block_number": 1537712,
            "logs": [],
            "result": "SUCCESS",
            "transaction_index": 0,
            "state_changes": [],
            "status": "0x1",
            "failed_initcode": null,
            "access_list": "0x",
            "block_gas_used": 3200000,
            "chain_id": "0x129",
            "gas_price": "0x",
            "max_fee_per_gas": "0x55",
            "max_priority_fee_per_gas": "0x0",
            "r": "0x4b09e72f5b8a779411b92325dddb7a8a0d8e921f50fa09f0207e2b456b255be8",
            "s": "0x1506a024ac70fe91e3b1ecdd517e0ae473ba4c18af88ee63fc01285db03ada98",
            "type": 2,
            "v": 0,
            "nonce": 29
        }

        const param3 = {timestamp: timestamp, internal: true}
        const matcher3 = "/api/v1/contracts/results"
        mock.onGet(matcher3, {params: param3}).reply(200, {
            results: [result], "links": {"next": null}
        });

        const matcher4 = "/api/v1/contracts/" + result.contract_id + "/results/" + timestamp
        mock.onGet(matcher4).reply(200, result);

        const action = {
            "call_depth": 0,
            "call_operation_type": "CALL",
            "call_type": "CALL",
            "caller": "0.0.42224",
            "caller_type": "ACCOUNT",
            "from": "0x000000000000000000000000000000000000a4f0",
            "gas": 3979000,
            "gas_used": 706972,
            "index": 0,
            "input": "0x0a754de6",
            "recipient": "0.0.230049",
            "recipient_type": "CONTRACT",
            "result_data": "0x0000000000000000000000000000000000000000000000000000000000000016",
            "result_data_type": "OUTPUT",
            "timestamp": "1687555828.300024003",
            "to": "0x00000000000000000000000000000000000382a1",
            "value": 0
        }

        const matcher5 = "/api/v1/contracts/results/" + result.hash + "/actions?limit=100"
        mock.onGet(matcher5).reply(200, {
            actions: [action], "links": {"next": null}
        })

        const abi = require('../../../public/abi/IERC20+IHRC.json')
        const matcher6 = "http://localhost:3000/abi/IERC20+IHRC.json"
        mock.onGet(matcher6).reply(200, abi)

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: timestamp
            },
        });

        await flushPromises()
        // console.log(wrapper.text())
        // console.log(wrapper.html())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].entity_id,
            "api/v1/transactions/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].transaction_id,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].transfers[2].account,
            "api/v1/network/exchangerate",
            "api/v1/tokens/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].transfers[3].account,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].transfers[3].account,
            "api/v1/contracts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].transfers[1].account,
            "api/v1/contracts/results/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].transaction_id,
            "api/v1/accounts/",
            "api/v1/accounts/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].entity_id,
            "api/v1/blocks",
            "api/v1/tokens/" + SAMPLE_ETHEREUM_TRANSACTIONS_ASSOCIATING_TOKEN.transactions[0].entity_id,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transactionId)))
        expect(wrapper.text()).toMatch(RegExp("ETHEREUM TRANSACTION"))
        expect(wrapper.get("#entityIdName").text()).toBe("Token ID")
        expect(wrapper.get("#entityIdValue").text()).toMatch(entityId)

        // const actionTable = wrapper.findComponent(ContractActionsTable)
        // expect(actionTable.exists()).toBe(true)
        // expect(actionTable.get('thead').text()).toBe("Call Type From Amount To Gas Limit")
        // expect(actionTable.get('tbody').text()).toBe(
        //     "1" +
        //     "CALL" +
        //     "0x000000000000000000000000000000000000a4f0" + "Copy" + "(0.0.42224)" +
        //     "→" +
        //     "0.00000000" + "$0.00000" +
        //     "→" +
        //     "0x00000000000000000000000000000000000382a1" + "Copy" + "(0.0.230049)" +
        //     "3979000"
        // )
        //
        // const actionTableLines = actionTable.findAll("tr")
        // const toAddress = actionTableLines[1].findAll("td")[4]
        // const anchor = toAddress.find("a")
        // expect(anchor.attributes('href')).toMatch("/token/" + entityId)

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display transaction returning FEE_SCHEDULE_FILE_PART_UPLOADED as successful", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any)
        const transaction = SAMPLE_FILE_UPDATE_TRANSACTION
        const matcher1 = "/api/v1/transactions/" + transaction.transaction_id
        mock.onGet(matcher1).reply(200, {transactions: [transaction]});
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == transaction.consensus_timestamp) {
                return [200, {transactions: [transaction]}]
            } else {
                return [404]
            }
        }) as any);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: transaction.consensus_timestamp,
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/transactions/" + SAMPLE_FILE_UPDATE_TRANSACTION.transaction_id,
            "api/v1/blocks",
            "api/v1/contracts/" + SAMPLE_FILE_UPDATE_TRANSACTION.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/network/exchangerate",
            "api/v1/contracts/0.0.56",
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(transaction.transaction_id)))

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.exists()).toBe(false)

        expect(wrapper.text()).not.toContain("FAILURE")

        expect(wrapper.get("#transactionTypeValue").text()).toBe("FILE UPDATE")
        expect(wrapper.get("#resultValue").text()).toBe("FEE_SCHEDULE_FILE_PART_UPLOADED")
        expect(wrapper.get("#consensusAtValue").text()).toBe("5:42:14.5350 PMJun 9, 2022, UTC")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display block number 0", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any)
        const matcher1 = "/api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id
        mock.onGet(matcher1).reply(200, SAMPLE_TRANSACTIONS);
        const matcher11 = "/api/v1/transactions"
        mock.onGet(matcher11).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SAMPLE_TRANSACTION.consensus_timestamp) {
                return [200, {transactions: [SAMPLE_TRANSACTION]}]
            } else {
                return [404]
            }
        }) as any);
        const matcher111 = "/api/v1/blocks"
        mock.onGet(matcher111).reply(200, {blocks: [SAMPLE_BLOCK_ZERO]});
        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN);

        const wrapper = mount(TransactionDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                transactionLoc: SAMPLE_TRANSACTION.consensus_timestamp,
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/transactions",
            "api/v1/topics/messages/",
            "api/v1/blocks",
            "api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.node,
            "api/v1/contracts/results",
            "api/v1/network/fees",
            "api/v1/contracts/" + SAMPLE_TRANSACTION.token_transfers[0].account,
            "api/v1/network/exchangerate",
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[0].account,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.transfers[1].account,
            "api/v1/tokens/" + SAMPLE_TRANSACTION.token_transfers[0].token_id,
            "api/v1/contracts/" + SAMPLE_TRANSACTION.token_transfers[1].account,
        ])

        expect(wrapper.text()).toMatch(RegExp("Transaction " + TransactionID.normalizeForDisplay(SAMPLE_TRANSACTION.transaction_id)))

        expect(wrapper.get("#transactionTypeValue").text()).toBe("CRYPTO TRANSFER")
        expect(wrapper.get("#consensusAtValue").text()).toBe("5:12:31.6676 AMFeb 28, 2022, UTC") // UTC because of HMSF.forceUTC
        expect(wrapper.get("#blockNumberValue").text()).toBe("0")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

});
