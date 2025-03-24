// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {nextTick, ref} from "vue";
import {SearchController} from "@/components/search/SearchController";
import {EntityID} from "@/utils/EntityID"
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {
    SAMPLE_ACCOUNT,
    SAMPLE_ACCOUNTS,
    SAMPLE_BLOCK,
    SAMPLE_CONTRACT,
    SAMPLE_CONTRACT_AS_ACCOUNT,
    SAMPLE_CONTRACT_RESULT_DETAILS,
    SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS,
    SAMPLE_TOKEN,
    SAMPLE_TOKEN_DUDE,
    SAMPLE_TOPIC,
    SAMPLE_TRANSACTION,
    SAMPLE_TRANSACTIONS
} from "../Mocks";
import {fetchGetURLs} from "../MockUtils";
import {base64DecToArr, byteToHex} from "@/utils/B64Utils.ts";
import {SelectedTokensCache} from "@/utils/cache/SelectedTokensCache.ts";

describe("SearchController.vue", () => {

    const mock = new MockAdapter(axios as any)
    const TRANSACTION_HASH = byteToHex(base64DecToArr(SAMPLE_TRANSACTION.transaction_hash))
    const SAMPLE_SCHEDULING_TRANSACTION = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![0]
    const SAMPLE_SCHEDULED_TRANSACTION = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![1]

    // We duplicate SAMPLE_ACCOUNT and patch its account id so that it conflicts with block number
    const SAMPLE_PATCHED_ACCOUNT = JSON.parse(JSON.stringify(SAMPLE_ACCOUNT))
    const SAMPLE_PATCHED_ACCOUNT_ID = new EntityID(0, 0, SAMPLE_BLOCK.number, null)
    SAMPLE_PATCHED_ACCOUNT.account = SAMPLE_PATCHED_ACCOUNT_ID.toString()

    // We derive a NAME_PATTERN from SAMPLE_TOKEN.name
    const SAMPLE_TOKEN_NAME = SAMPLE_TOKEN.name.slice(2, 5)
    expect(SAMPLE_TOKEN.name.indexOf(SAMPLE_TOKEN_NAME)).not.toBe(-1)
    expect(SAMPLE_TOKEN_DUDE.name.indexOf(SAMPLE_TOKEN_NAME)).not.toBe(-1)

    beforeEach(() => {

        {
            // Account search

            const matcher0 = "api/v1/accounts/" + SAMPLE_ACCOUNT.account
            mock.onGet(matcher0).reply(200, SAMPLE_ACCOUNT)

            const matcher1 = "api/v1/accounts/" + SAMPLE_ACCOUNT.evm_address.slice(2)
            mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT)

            const matcher2 = "api/v1/accounts/" + SAMPLE_ACCOUNT.alias
            mock.onGet(matcher2).reply(200, SAMPLE_ACCOUNT)

            const matcher3 = "api/v1/accounts/?account.publickey="
                + SAMPLE_ACCOUNTS.accounts[0].key.key + "&limit=10"
            mock.onGet(matcher3).reply(200, SAMPLE_ACCOUNTS)
        }

        {
            // Contract search

            const matcher0 = "api/v1/accounts/" + SAMPLE_CONTRACT_AS_ACCOUNT.account
            mock.onGet(matcher0).reply(200, SAMPLE_CONTRACT_AS_ACCOUNT)

            const matcher1 = "api/v1/accounts/" + SAMPLE_CONTRACT_AS_ACCOUNT.evm_address.slice(2)
            mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT_AS_ACCOUNT)

            const matcher2 = "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
            mock.onGet(matcher2).reply(200, SAMPLE_CONTRACT)

            const matcher3 = "api/v1/contracts/" + SAMPLE_CONTRACT.evm_address.slice(2)
            mock.onGet(matcher3).reply(200, SAMPLE_CONTRACT)

        }

        {
            // Token search

            const matcher0 = "api/v1/tokens/" + SAMPLE_TOKEN.token_id
            mock.onGet(matcher0).reply(200, SAMPLE_TOKEN)
        }

        {
            // Token search by name

            // const abi = require('../../../public/selected-tokens.json')
            // const matcher = "http://localhost:3000/selected-tokens.json"
            // mock.onGet(matcher).reply(200, abi)
            //
            const matcher0 = "api/v1/tokens/?name=" + SAMPLE_TOKEN_NAME + "&limit=100"
            mock.onGet(matcher0).reply(200, {
                tokens: [SAMPLE_TOKEN, SAMPLE_TOKEN_DUDE],
                links: {next: null}
            })
        }

        {
            // Topic search
            const matcher0 = "api/v1/topics/" + SAMPLE_TOPIC.topic_id
            mock.onGet(matcher0).reply(200, SAMPLE_TOPIC)
        }

        {
            // Transaction search

            const matcher0 = "api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id
            mock.onGet(matcher0).reply(200, SAMPLE_TRANSACTIONS)

            const matcher1 = "api/v1/transactions?timestamp=" + SAMPLE_TRANSACTION.consensus_timestamp
            mock.onGet(matcher1).reply(200, SAMPLE_TRANSACTIONS)

            const matcher2 = "api/v1/transactions/" + TRANSACTION_HASH
            mock.onGet(matcher2).reply(200, SAMPLE_TRANSACTIONS)

            const matcher3 = "api/v1/contracts/results/" + SAMPLE_CONTRACT_RESULT_DETAILS.hash.slice(2)
            mock.onGet(matcher3).reply(200, SAMPLE_CONTRACT_RESULT_DETAILS)

            const matcher4 = "api/v1/transactions/" + SAMPLE_SCHEDULED_TRANSACTION.transaction_id
            mock.onGet(matcher4).reply(200, SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS)

            const matcher5 = "api/v1/transactions/" + SAMPLE_SCHEDULED_TRANSACTION.transaction_id + "?scheduled=true"
            const data = { transactions: [ SAMPLE_SCHEDULED_TRANSACTION ], links: {next: null}}
            mock.onGet(matcher5).reply(200, data)

        }

        {
            // Block

            const matcher0 = "api/v1/blocks/" + SAMPLE_BLOCK.number
            mock.onGet(matcher0).reply(200, SAMPLE_BLOCK)

            const matcher1 = "api/v1/blocks/" + SAMPLE_BLOCK.hash.slice(2)
            mock.onGet(matcher1).reply(200, SAMPLE_BLOCK)

            const matcher = "/api/v1/accounts/" + SAMPLE_PATCHED_ACCOUNT.account
            mock.onGet(matcher).reply(200, SAMPLE_PATCHED_ACCOUNT)

        }

        vi.useFakeTimers()
    })

    afterEach(() => {
        SelectedTokensCache.instance.clear()
        mock.reset()
        vi.useRealTimers()
    })

    it("basic", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

    })

    it("should trim leading/trailing whitespaces from the search input text", async () => {
        const inputText = ref<string>("")
        const controller = new SearchController(inputText)

        await flushPromises()

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = `   ${SAMPLE_ACCOUNT.account}   `
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        vi.advanceTimersToNextTimer()
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.account)  // Text should be trimmed
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0.0.730631",
            "api/v1/contracts/0.0.730631",
            "api/v1/tokens/0.0.730631",
            "api/v1/topics/0.0.730631",
        ])

        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.account)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_ACCOUNT.account)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_ACCOUNT)
    })


    //
    // Account
    //

    it("search account with id", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_ACCOUNT.account
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.account)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0.0.730631",
            "api/v1/contracts/0.0.730631",
            "api/v1/tokens/0.0.730631",
            "api/v1/topics/0.0.730631",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.account)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_ACCOUNT.account)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_ACCOUNT)
    })

    it("search account with evm address", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_ACCOUNT.evm_address
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.evm_address)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/00000000000000000000000000000000000b2607",
            "api/v1/contracts/00000000000000000000000000000000000b2607",
            "api/v1/tokens/0.0.730631",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.evm_address)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_ACCOUNT.account)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_ACCOUNT)


    })

    it("search account with partial evm address", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        const PARTIAL_ADDRESS = "0x0b2607"
        inputText.value = PARTIAL_ADDRESS
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(PARTIAL_ADDRESS)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/00000000000000000000000000000000000b2607",
            "api/v1/contracts/00000000000000000000000000000000000b2607",
            "api/v1/tokens/0.0.730631",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(PARTIAL_ADDRESS)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_ACCOUNT.account)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_ACCOUNT)

    })

    it("search account with alias", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_ACCOUNT.alias
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.alias)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ",
            "api/v1/tokens/?name=CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ&limit=100",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.alias)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_ACCOUNT.account)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_ACCOUNT)

    })

    it("search account with public key", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_ACCOUNT.key.key
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.key.key)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/?account.publickey=aa2f7b3e759f4531ec2e7941afa449e6a6e610efb52adae89e9cd8e9d40ddcbf&limit=10",
            "api/v1/contracts/results/aa2f7b3e759f4531ec2e7941afa449e6a6e610efb52adae89e9cd8e9d40ddcbf",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_ACCOUNT.key.key)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_ACCOUNT.account)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_ACCOUNT)

    })


    //
    // Contract
    //

    it("search contract with id", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_CONTRACT.contract_id
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0.0.749775",
            "api/v1/contracts/0.0.749775",
            "api/v1/tokens/0.0.749775",
            "api/v1/topics/0.0.749775",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(2)
        expect(controller.visibleAgents.value.length).toBe(2)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const agent0 = controller.visibleAgents.value[0]
        expect(agent0.candidates.value.length).toBe(1)
        expect(agent0.candidates.value[0].description).toBe(SAMPLE_CONTRACT.contract_id)
        expect(agent0.candidates.value[0].extra).toBeNull()
        expect(agent0.candidates.value[0].secondary).toBe(false)
        expect(agent0.candidates.value[0].entity).toStrictEqual(SAMPLE_CONTRACT)
        const agent1 = controller.visibleAgents.value[1]
        expect(agent1.candidates.value.length).toBe(1)
        expect(agent1.candidates.value[0].description).toBe(SAMPLE_CONTRACT_AS_ACCOUNT.account)
        expect(agent1.candidates.value[0].extra).toBeNull()
        expect(agent1.candidates.value[0].secondary).toBe(false)
        expect(agent1.candidates.value[0].entity).toStrictEqual(SAMPLE_CONTRACT_AS_ACCOUNT)

    })

    it("search contract with evm address", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_CONTRACT.evm_address
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_CONTRACT.evm_address)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/00000000000000000000000000000000000b70cf",
            "api/v1/contracts/00000000000000000000000000000000000b70cf",
            "api/v1/tokens/0.0.749775",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_CONTRACT.evm_address)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(2)
        expect(controller.visibleAgents.value.length).toBe(2)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const agent0 = controller.visibleAgents.value[0]
        expect(agent0.candidates.value.length).toBe(1)
        expect(agent0.candidates.value[0].description).toBe(SAMPLE_CONTRACT.contract_id)
        expect(agent0.candidates.value[0].extra).toBeNull()
        expect(agent0.candidates.value[0].secondary).toBe(false)
        expect(agent0.candidates.value[0].entity).toStrictEqual(SAMPLE_CONTRACT)
        const agent1 = controller.visibleAgents.value[1]
        expect(agent1.candidates.value.length).toBe(1)
        expect(agent1.candidates.value[0].description).toBe(SAMPLE_CONTRACT_AS_ACCOUNT.account)
        expect(agent1.candidates.value[0].extra).toBeNull()
        expect(agent1.candidates.value[0].secondary).toBe(false)
        expect(agent1.candidates.value[0].entity).toStrictEqual(SAMPLE_CONTRACT_AS_ACCOUNT)

    })

    it("search contract with partial evm address", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        const PARTIAL_EVM_ADDRESS = "0x0b70cf"
        inputText.value = PARTIAL_EVM_ADDRESS
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(PARTIAL_EVM_ADDRESS)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/00000000000000000000000000000000000b70cf",
            "api/v1/contracts/00000000000000000000000000000000000b70cf",
            "api/v1/tokens/0.0.749775",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(PARTIAL_EVM_ADDRESS)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(2)
        expect(controller.visibleAgents.value.length).toBe(2)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const agent0 = controller.visibleAgents.value[0]
        expect(agent0.candidates.value.length).toBe(1)
        expect(agent0.candidates.value[0].description).toBe(SAMPLE_CONTRACT.contract_id)
        expect(agent0.candidates.value[0].extra).toBeNull()
        expect(agent0.candidates.value[0].secondary).toBe(false)
        expect(agent0.candidates.value[0].entity).toStrictEqual(SAMPLE_CONTRACT)
        const agent1 = controller.visibleAgents.value[1]
        expect(agent1.candidates.value.length).toBe(1)
        expect(agent1.candidates.value[0].description).toBe(SAMPLE_CONTRACT_AS_ACCOUNT.account)
        expect(agent1.candidates.value[0].extra).toBeNull()
        expect(agent1.candidates.value[0].secondary).toBe(false)
        expect(agent1.candidates.value[0].entity).toStrictEqual(SAMPLE_CONTRACT_AS_ACCOUNT)

    })


    //
    // Token
    //

    it("search token with id", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_TOKEN.token_id
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TOKEN.token_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0.0.29662956",
            "api/v1/contracts/0.0.29662956",
            "api/v1/tokens/0.0.29662956",
            "api/v1/topics/0.0.29662956",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TOKEN.token_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_TOKEN.token_id)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TOKEN)

    })

    it("search token with evm address", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        const SAMPLE_TOKEN_EVM_ADDRESS = EntityID.parse(SAMPLE_TOKEN.token_id)!.toAddress()
        inputText.value = SAMPLE_TOKEN_EVM_ADDRESS
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TOKEN_EVM_ADDRESS)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0000000000000000000000000000000001c49eec",
            "api/v1/contracts/0000000000000000000000000000000001c49eec",
            "api/v1/tokens/0.0.29662956",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TOKEN_EVM_ADDRESS)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_TOKEN.token_id)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TOKEN)

    })

    it("search token with partial evm address", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        const PARTIAL_EVM_ADDRESS = "0x01c49eec"
        inputText.value = PARTIAL_EVM_ADDRESS
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(PARTIAL_EVM_ADDRESS)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0000000000000000000000000000000001c49eec",
            "api/v1/contracts/0000000000000000000000000000000001c49eec",
            "api/v1/tokens/0.0.29662956",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(PARTIAL_EVM_ADDRESS)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_TOKEN.token_id)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TOKEN)

    })


    //
    // Token with name
    //

    it("search token with name", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_TOKEN_NAME
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TOKEN_NAME)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/tokens/?name=" + SAMPLE_TOKEN_NAME + "&limit=100",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TOKEN_NAME)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(2)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(2)
        expect(candidates[0].description).toBe("QmVGABnvpbPwLcfG4iuW2JSzY8MLkALhd54…")
        expect(candidates[0].extra).toBe(" " + SAMPLE_TOKEN.token_id)
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TOKEN)
        expect(candidates[1].description).toBe("QmVGABnvpbPwLcfG4iuW2JSzY8MLkALhd54…")
        expect(candidates[1].extra).toBe(" " + SAMPLE_TOKEN_DUDE.token_id)
        expect(candidates[1].secondary).toBe(false)
        expect(candidates[1].entity).toStrictEqual(SAMPLE_TOKEN_DUDE)

    })


    //
    // Topic
    //

    it("search topic with id", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_TOPIC.topic_id
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TOPIC.topic_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0.0.31407",
            "api/v1/contracts/0.0.31407",
            "api/v1/tokens/0.0.31407",
            "api/v1/topics/0.0.31407",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TOPIC.topic_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_TOPIC.topic_id)
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TOPIC)

    })

    //
    // Transaction
    //

    it("search transaction with id", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_TRANSACTION.transaction_id
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TRANSACTION.transaction_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions/" + SAMPLE_TRANSACTION.transaction_id,
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TRANSACTION.transaction_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe("0.0.29624024@1646025139.152901498")
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TRANSACTION)

    })

    it("search scheduled transaction with id but without scheduled", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_SCHEDULED_TRANSACTION.transaction_id
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_SCHEDULED_TRANSACTION.transaction_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions/" + SAMPLE_SCHEDULED_TRANSACTION.transaction_id,
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_SCHEDULED_TRANSACTION.transaction_id)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toMatch("All transactions with ID")
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_SCHEDULING_TRANSACTION)


    })

    it("search transaction with id and scheduled", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_SCHEDULED_TRANSACTION.transaction_id + "?scheduled"
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_SCHEDULED_TRANSACTION.transaction_id + "?scheduled")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions/" + SAMPLE_SCHEDULED_TRANSACTION.transaction_id + "?scheduled=true",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_SCHEDULED_TRANSACTION.transaction_id + "?scheduled")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const nextCandidates = controller.visibleAgents.value[0].candidates.value
        expect(nextCandidates.length).toBe(1)
        expect(nextCandidates[0].description).toMatch("0.0.503733@1666754898.238965661")
        expect(nextCandidates[0].extra).toBeNull()
        expect(nextCandidates[0].secondary).toBe(false)
        expect(nextCandidates[0].entity).toStrictEqual(SAMPLE_SCHEDULED_TRANSACTION)
    })

    it("search transaction with timestamp", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_TRANSACTION.consensus_timestamp
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions?timestamp=" + SAMPLE_TRANSACTION.consensus_timestamp,
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_TRANSACTION.consensus_timestamp)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe("0.0.29624024@1646025139.152901498")
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TRANSACTION)

    })

    it.skip("search transaction with hedera hash", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = TRANSACTION_HASH
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(TRANSACTION_HASH)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/UAJJMERS5V6SQQUDN2K7P2OEGVX57YW6BAMZBELQDKLJYHI73E3HDUYHR3UDWKH3IYFIRNGL3DWNE",
            "api/v1/transactions/a012961232ed7d2842836e95f7e9c4356fdfe2de08199091701a969c1d1fd93671d3078ee83b28fb460a88b4cbd8ecd2",
            "api/v1/blocks/a012961232ed7d2842836e95f7e9c4356fdfe2de08199091701a969c1d1fd93671d3078ee83b28fb460a88b4cbd8ecd2",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(TRANSACTION_HASH)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe("0.0.29624024@1646025139.152901498")
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TRANSACTION)

    })

    it("search transaction with ethereum hash", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        const ETHEREUM_TRANSACTION_HASH = SAMPLE_CONTRACT_RESULT_DETAILS.hash
        expect(SAMPLE_CONTRACT_RESULT_DETAILS.timestamp).toBe(SAMPLE_TRANSACTION.consensus_timestamp)

        inputText.value = ETHEREUM_TRANSACTION_HASH
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(ETHEREUM_TRANSACTION_HASH)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/?account.publickey=c43db9eacf72c91629ac03088535dd9ae41059a2c1eefce3a528e04e7e908d2d&limit=10",
            "api/v1/contracts/results/c43db9eacf72c91629ac03088535dd9ae41059a2c1eefce3a528e04e7e908d2d",
            "api/v1/transactions?timestamp=1646025151.667604000",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(ETHEREUM_TRANSACTION_HASH)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe("0.0.29624024@1646025139.152901498")
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_TRANSACTION)

    })

    //
    // Block
    //

    it("search block with number", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_BLOCK.number.toString()
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_BLOCK.number.toString())
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0.0.25175998",
            "api/v1/contracts/0.0.25175998",
            "api/v1/tokens/0.0.25175998",
            "api/v1/topics/0.0.25175998",
            "api/v1/blocks/25175998",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_BLOCK.number.toString())
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(2) // SAMPLE_PATCHED_ACCOUNT + SAMPLE_BLOCK
        expect(controller.visibleAgents.value.length).toBe(2)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const agent0 = controller.visibleAgents.value[0]
        expect(agent0.candidates.value.length).toBe(1)
        expect(agent0.candidates.value[0].description).toBe(SAMPLE_PATCHED_ACCOUNT.account)
        expect(agent0.candidates.value[0].extra).toBeNull()
        expect(agent0.candidates.value[0].secondary).toBe(false)
        expect(agent0.candidates.value[0].entity).toStrictEqual(SAMPLE_PATCHED_ACCOUNT)
        const agent1 = controller.visibleAgents.value[1]
        expect(agent1.candidates.value.length).toBe(1)
        expect(agent1.candidates.value[0].description).toBe(SAMPLE_BLOCK.number.toString())
        expect(agent1.candidates.value[0].extra).toBeNull()
        expect(agent1.candidates.value[0].secondary).toBe(false)
        expect(agent1.candidates.value[0].entity).toStrictEqual(SAMPLE_BLOCK)

    })

    it("search block with hash", async () => {

        const inputText = ref<string>("")
        const controller = new SearchController(inputText)
        await flushPromises()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        inputText.value = SAMPLE_BLOCK.hash
        await nextTick()
        expect(vi.getTimerCount()).toBe(1)
        expect(controller.visible.value).toBe(false)
        expect(controller.actualInputText.value).toBe("")
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        vi.advanceTimersToNextTimer()
        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_BLOCK.hash)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(0)
        expect(controller.visibleAgents.value.length).toBe(0)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)

        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/5FRQ27MMZBWQ4DJ54UYWTFN336PSUWCFETHRRWRDHK6476BN7F62BIHMHDDLIBDBAEUURFX7RCUGW",
            "api/v1/transactions/e9630d7d8cc86d0e0d3de5316995bbdf9f2a584524cf18da233abdcff82df97da0a0ec38c6b4046101294896ff88a86b",
            "api/v1/blocks/e9630d7d8cc86d0e0d3de5316995bbdf9f2a584524cf18da233abdcff82df97da0a0ec38c6b4046101294896ff88a86b",
        ])

        expect(vi.getTimerCount()).toBe(0)
        expect(controller.visible.value).toBe(true)
        expect(controller.actualInputText.value).toBe(SAMPLE_BLOCK.hash)
        expect(controller.loading.value).toBe(false)
        expect(controller.candidateCount.value).toBe(1)
        expect(controller.visibleAgents.value.length).toBe(1)
        expect(controller.loadingDomainNameSearchAgents.value.length).toBe(0)
        const candidates = controller.visibleAgents.value[0].candidates.value
        expect(candidates.length).toBe(1)
        expect(candidates[0].description).toBe(SAMPLE_BLOCK.number.toString())
        expect(candidates[0].extra).toBeNull()
        expect(candidates[0].secondary).toBe(false)
        expect(candidates[0].entity).toStrictEqual(SAMPLE_BLOCK)

    })


})

