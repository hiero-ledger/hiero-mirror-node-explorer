// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {TransactionLocParser} from "@/utils/parser/TransactionLocParser";
import {Ref, ref} from "vue";
import {flushPromises} from "@vue/test-utils";
import {
    SAMPLE_CONTRACT_CALL_TRANSACTION,
    SAMPLE_CONTRACT_RESULT_DETAILS,
    SAMPLE_PARENT_CHILD_TRANSACTIONS,
    SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS,
    SAMPLE_TRANSACTION
} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios, {AxiosRequestConfig} from "axios";
import {TransactionHash} from "@/utils/TransactionHash";

describe("TransactionLocParser.ts", () => {

    //
    // mount + set/unset transaction loc + unmount
    //

    test("mount + set/unset transaction loc + unmount", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SAMPLE_TRANSACTION.consensus_timestamp) {
                return [200, {transactions: [SAMPLE_TRANSACTION]}]
            } else {
                return [404]
            }
        }) as any);

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with consensus timestamp
        transactionLoc.value = SAMPLE_TRANSACTION.consensus_timestamp
        expect(parser.transactionLoc.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transaction.value).toStrictEqual(SAMPLE_TRANSACTION)
        expect(parser.transactionId.value).toBe(SAMPLE_TRANSACTION.transaction_id)
        expect(parser.consensusTimestamp.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transactionHash.value).toBe(SAMPLE_TRANSACTION.transaction_hash)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set transaction loc + mount + unmount + unset transaction loc
    //

    test("set transaction loc + mount + unmount + unset transaction loc", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SAMPLE_TRANSACTION.consensus_timestamp) {
                return [200, {transactions: [SAMPLE_TRANSACTION]}]
            } else {
                return [404]
            }
        }) as any);

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Sets with consensus timestamp
        transactionLoc.value = SAMPLE_TRANSACTION.consensus_timestamp
        expect(parser.transactionLoc.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transaction.value).toStrictEqual(SAMPLE_TRANSACTION)
        expect(parser.transactionId.value).toBe(SAMPLE_TRANSACTION.transaction_id)
        expect(parser.consensusTimestamp.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transactionHash.value).toBe(SAMPLE_TRANSACTION.transaction_hash)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set transaction loc with transaction hash
    //

    test("set transaction loc with transaction hash", async () => {

        const mock = new MockAdapter(axios as any)

        const transactionHash = TransactionHash.parseBase64(SAMPLE_TRANSACTION.transaction_hash)!.toString()
        const matcher1 = "/api/v1/transactions/" + transactionHash
        mock.onGet(matcher1).reply(200, {transactions: [SAMPLE_TRANSACTION]});

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with transaction hash
        transactionLoc.value = transactionHash
        expect(parser.transactionLoc.value).toBe(transactionHash)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(transactionHash)
        expect(parser.transaction.value).toStrictEqual(SAMPLE_TRANSACTION)
        expect(parser.transactionId.value).toBe(SAMPLE_TRANSACTION.transaction_id)
        expect(parser.consensusTimestamp.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(parser.transactionHash.value).toBe(SAMPLE_TRANSACTION.transaction_hash)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set transaction loc with ethereum hash
    //

    test("set transaction loc with ethereum hash", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/contracts/results/" + SAMPLE_CONTRACT_RESULT_DETAILS.hash
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT_RESULT_DETAILS);
        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == SAMPLE_CONTRACT_CALL_TRANSACTION.consensus_timestamp) {
                return [200, {transactions: [SAMPLE_CONTRACT_CALL_TRANSACTION]}]
            } else {
                return [404]
            }
        }) as any);

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with transaction hash
        transactionLoc.value = SAMPLE_CONTRACT_RESULT_DETAILS.hash
        expect(parser.transactionLoc.value).toBe(SAMPLE_CONTRACT_RESULT_DETAILS.hash)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(SAMPLE_CONTRACT_RESULT_DETAILS.hash)
        expect(parser.transaction.value).toStrictEqual(SAMPLE_CONTRACT_CALL_TRANSACTION)
        expect(parser.transactionId.value).toBe(SAMPLE_CONTRACT_CALL_TRANSACTION.transaction_id)
        expect(parser.consensusTimestamp.value).toBe(SAMPLE_CONTRACT_CALL_TRANSACTION.consensus_timestamp)
        expect(parser.transactionHash.value).toBe(SAMPLE_CONTRACT_CALL_TRANSACTION.transaction_hash)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set transaction loc with transaction id (single transaction with nonce 0)
    //

    test("set transaction loc with transaction id (single transaction with nonce 0)", async () => {

        const mock = new MockAdapter(axios as any)

        const PARENT_TRANSACTION = SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions![0]
        const matcher1 = "/api/v1/transactions/" + PARENT_TRANSACTION.transaction_id
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.nonce == 0) {
                return [200, {transactions: [PARENT_TRANSACTION]}]
            } else {
                return [200, SAMPLE_PARENT_CHILD_TRANSACTIONS]
            }
        }) as any);

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with transaction id
        transactionLoc.value = PARENT_TRANSACTION.transaction_id
        expect(parser.transactionLoc.value).toBe(PARENT_TRANSACTION.transaction_id)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(PARENT_TRANSACTION.transaction_id)
        expect(parser.transaction.value).toStrictEqual(PARENT_TRANSACTION)
        expect(parser.transactionId.value).toBe(PARENT_TRANSACTION.transaction_id)
        expect(parser.consensusTimestamp.value).toBe(PARENT_TRANSACTION.consensus_timestamp)
        expect(parser.transactionHash.value).toBe(PARENT_TRANSACTION.transaction_hash)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set transaction loc with transaction id (single transaction with nonce 0)
    //

    test("set transaction loc with transaction id (two transactions with nonce 0)", async () => {

        const mock = new MockAdapter(axios as any)

        const SCHEDULING_TRANSACTION = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![0]
        const SCHEDULED_TRANSACTION = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![1]
        expect(SCHEDULING_TRANSACTION.transaction_id).toBe(SCHEDULED_TRANSACTION.transaction_id)
        expect(SCHEDULING_TRANSACTION.scheduled).toBeFalsy()
        expect(SCHEDULED_TRANSACTION.scheduled).toBeTruthy()
        const TRANSACTION_ID = SCHEDULED_TRANSACTION.transaction_id

        const matcher1 = "/api/v1/transactions/" + TRANSACTION_ID
        mock.onGet(matcher1).reply(200, SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS);

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with transaction id
        transactionLoc.value = TRANSACTION_ID
        expect(parser.transactionLoc.value).toBe(TRANSACTION_ID)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(TRANSACTION_ID)
        expect(parser.transaction.value).toStrictEqual(SCHEDULED_TRANSACTION)
        expect(parser.transactionId.value).toBe(SCHEDULED_TRANSACTION.transaction_id)
        expect(parser.consensusTimestamp.value).toBe(SCHEDULED_TRANSACTION.consensus_timestamp)
        expect(parser.transactionHash.value).toBe(SCHEDULED_TRANSACTION.transaction_hash)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })


    //
    // set transaction loc with unknown consensus timestamp
    //

    test("set transaction loc with unknown consensus timestamp", async () => {

        const mock = new MockAdapter(axios as any)

        const UNKNOWN_TIMESTAMP = "7777777777.888888888"
        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(((config: AxiosRequestConfig) => {
            if (config.params.timestamp == UNKNOWN_TIMESTAMP) {
                return [404]
            } else {
                return [500]
            }
        }) as any);

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with consensus timestamp
        transactionLoc.value = UNKNOWN_TIMESTAMP
        expect(parser.transactionLoc.value).toBe(UNKNOWN_TIMESTAMP)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(UNKNOWN_TIMESTAMP)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Transaction with timestamp 7777777777.888888888 was not found")

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })


    //
    // set transaction loc with unknown transaction hash
    //

    test("set transaction loc with unknown transaction hash", async () => {

        const mock = new MockAdapter(axios as any)

        const UNKNOWN_HASH = "0x001122334455667788990011223344556677889900112233445566778899001122334455667788990011223344556677"
        const matcher1 = "/api/v1/transactions/" + UNKNOWN_HASH
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with consensus timestamp
        transactionLoc.value = UNKNOWN_HASH
        expect(parser.transactionLoc.value).toBe(UNKNOWN_HASH)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(UNKNOWN_HASH)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Transaction with hash 001122334455667788990011223344556677889900112233445566778899001122334455667788990011223344556677 was not found")

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })


    //
    // set transaction loc with unknown ethereum hash
    //

    test("set transaction loc with unknown ethereum hash", async () => {

        const mock = new MockAdapter(axios as any)

        const UNKNOWN_ETH_HASH = "0x0011223344556677001122334455667700112233445566770011223344556677"
        const matcher1 = "/api/v1/contracts/results/" + UNKNOWN_ETH_HASH
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with consensus timestamp
        transactionLoc.value = UNKNOWN_ETH_HASH
        expect(parser.transactionLoc.value).toBe(UNKNOWN_ETH_HASH)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(UNKNOWN_ETH_HASH)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Transaction with ethereum hash 0x0011223344556677001122334455667700112233445566770011223344556677 was not found")

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })


    //
    // set transaction loc with dummy value
    //

    test("set transaction loc with dummy value", async () => {

        const DUMMY_LOC = "dummy transaction loc"

        // 0) Creates parser
        const transactionLoc: Ref<string | null> = ref(null)
        const parser = new TransactionLocParser(transactionLoc)
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with consensus timestamp
        transactionLoc.value = DUMMY_LOC
        expect(parser.transactionLoc.value).toBe(DUMMY_LOC)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Invalid transaction id, timestamp or hash")
        await flushPromises()
        expect(parser.transactionLoc.value).toBe(DUMMY_LOC)
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Invalid transaction id, timestamp or hash")

        // 3) Unsets
        transactionLoc.value = null
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.transactionLoc.value).toBeNull()
        expect(parser.transaction.value).toBeNull()
        expect(parser.transactionId.value).toBeNull()
        expect(parser.consensusTimestamp.value).toBeNull()
        expect(parser.transactionHash.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

})
