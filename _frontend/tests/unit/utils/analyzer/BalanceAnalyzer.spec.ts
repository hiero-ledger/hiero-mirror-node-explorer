// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {Ref, ref} from "vue";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {BalanceAnalyzer} from "@/utils/analyzer/BalanceAnalyzer";
import {SAMPLE_ACCOUNT, SAMPLE_ACCOUNT_BALANCES} from "../../Mocks";

describe("BalanceAnalyzer.spec.ts", () => {

    test("set account before mount()", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/balances"
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT_BALANCES)

        const contractId: Ref<string | null> = ref(null)
        const balanceAnalyzer = new BalanceAnalyzer(contractId, 100);
        expect(balanceAnalyzer.accountId.value).toBeNull()
        expect(balanceAnalyzer.hbarBalance.value).toBeNull()
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual([])
        expect(balanceAnalyzer.balanceTimeStamp.value).toBeNull()
        expect(balanceAnalyzer.balanceAge.value).toBeNull()

        // sets contract id before mount
        contractId.value = SAMPLE_ACCOUNT.account
        expect(balanceAnalyzer.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(balanceAnalyzer.hbarBalance.value).toBeNull()
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual([])
        expect(balanceAnalyzer.balanceTimeStamp.value).toBeNull()
        expect(balanceAnalyzer.balanceAge.value).toBeNull()
        await flushPromises()
        expect(balanceAnalyzer.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(balanceAnalyzer.hbarBalance.value).toBeNull() // because it's not mounted ;)
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual([])
        expect(balanceAnalyzer.balanceTimeStamp.value).toBeNull()
        expect(balanceAnalyzer.balanceAge.value).toBeNull()

        // mount
        balanceAnalyzer.mount()
        await flushPromises()
        expect(balanceAnalyzer.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(balanceAnalyzer.hbarBalance.value).toBe(SAMPLE_ACCOUNT_BALANCES.balances[0].balance)
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual(SAMPLE_ACCOUNT_BALANCES.balances[0].tokens)
        expect(balanceAnalyzer.balanceTimeStamp.value).toBe(SAMPLE_ACCOUNT_BALANCES.timestamp)
        expect(balanceAnalyzer.balanceAge.value?.years).toBeGreaterThan(1)

        // unmount
        balanceAnalyzer.unmount()
        await flushPromises()
        expect(balanceAnalyzer.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(balanceAnalyzer.hbarBalance.value).toBeNull()
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual([])
        expect(balanceAnalyzer.balanceTimeStamp.value).toBeNull()
        expect(balanceAnalyzer.balanceAge.value).toBeNull()

        mock.restore()
    })

    test("set account between mount() and unmount() ", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/balances"
        mock.onGet(matcher1).reply(200, SAMPLE_ACCOUNT_BALANCES)

        const contractId: Ref<string | null> = ref(null)
        const balanceAnalyzer = new BalanceAnalyzer(contractId, 100);
        expect(balanceAnalyzer.accountId.value).toBeNull()
        expect(balanceAnalyzer.hbarBalance.value).toBeNull()
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual([])
        expect(balanceAnalyzer.balanceTimeStamp.value).toBeNull()
        expect(balanceAnalyzer.balanceAge.value).toBeNull()

        // mount
        balanceAnalyzer.mount()
        await flushPromises()
        expect(balanceAnalyzer.accountId.value).toBeNull()
        expect(balanceAnalyzer.hbarBalance.value).toBeNull()
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual([])
        expect(balanceAnalyzer.balanceTimeStamp.value).toBeNull()
        expect(balanceAnalyzer.balanceAge.value).toBeNull()

        // sets contract id between mount and unmount
        contractId.value = SAMPLE_ACCOUNT.account
        expect(balanceAnalyzer.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(balanceAnalyzer.hbarBalance.value).toBeNull()
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual([])
        expect(balanceAnalyzer.balanceTimeStamp.value).toBeNull()
        expect(balanceAnalyzer.balanceAge.value).toBeNull()
        await flushPromises()
        expect(balanceAnalyzer.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(balanceAnalyzer.hbarBalance.value).toBe(SAMPLE_ACCOUNT_BALANCES.balances[0].balance)
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual(SAMPLE_ACCOUNT_BALANCES.balances[0].tokens)
        expect(balanceAnalyzer.balanceTimeStamp.value).toBe(SAMPLE_ACCOUNT_BALANCES.timestamp)
        expect(balanceAnalyzer.balanceAge.value?.years).toBeGreaterThan(1)

        // unmount
        balanceAnalyzer.unmount()
        await flushPromises()
        expect(balanceAnalyzer.accountId.value).toBe(SAMPLE_ACCOUNT.account)
        expect(balanceAnalyzer.hbarBalance.value).toBeNull()
        expect(balanceAnalyzer.tokenBalances.value).toStrictEqual([])
        expect(balanceAnalyzer.balanceTimeStamp.value).toBeNull()
        expect(balanceAnalyzer.balanceAge.value).toBeNull()

        mock.restore()
    })

})
