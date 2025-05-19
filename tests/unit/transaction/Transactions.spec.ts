// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import axios from "axios";
import {SAMPLE_TOKEN, SAMPLE_TRANSACTION, SAMPLE_TRANSACTIONS} from "../Mocks";
import Transactions from "@/pages/Transactions.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import TransactionFilterSelect from "@/components/transaction/TransactionFilterSelect.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import TransactionTable from "@/components/transaction/TransactionTable.vue";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import {fetchGetURLs} from "../MockUtils";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("Transactions.vue", () => {

    test("no props", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(200, SAMPLE_TRANSACTIONS)

        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN)

        const wrapper = mount(Transactions, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions",
            "api/v1/transactions",
            "api/v1/network/nodes",
            "api/v1/tokens/" + SAMPLE_TOKEN.token_id,
            "api/v1/blocks",
        ])

        const card = wrapper.findComponent(DashboardCardV2)
        expect(card.exists()).toBe(true)
        expect(card.text()).toMatch(RegExp("^Recent Transactions"))

        const playPause = card.findComponent(PlayPauseButton)
        expect(playPause.exists()).toBe(true)

        const select = card.findComponent(TransactionFilterSelect)
        expect(select.exists()).toBe(true)
        expect(select.text()).toBe(
            "TYPES: ALLADD LIVE HASHAPPROVE ALLOWANCEATOMIC BATCHCANCEL AIRDROPCLAIM AIRDROPCONTRACT CALLCONTRACT CREATE" +
            "CONTRACT DELETECONTRACT UPDATECREATE ACCOUNTCREATE TOPICCRYPTO TRANSFERDELETE ACCOUNTDELETE ALLOWANCE" +
            "DELETE LIVE HASHDELETE TOPICETHEREUM TRANSACTIONFILE APPENDFILE CREATEFILE DELETEFILE UPDATE" +
            "FREEZENODE CREATENODE DELETENODE STAKE UPDATENODE UPDATEPSEUDORANDOM NUMBER GENERATESCHEDULE CREATE" +
            "SCHEDULE DELETESCHEDULE SIGNSUBMIT MESSAGESYSTEM DELETESYSTEM UNDELETETOKEN AIRDROPTOKEN ASSOCIATE" +
            "TOKEN BURNTOKEN CREATETOKEN DELETETOKEN DISSOCIATETOKEN FEE SCHEDULE UPDATETOKEN FREEZETOKEN KYC GRANT" +
            "TOKEN KYC REVOKETOKEN MINTTOKEN PAUSETOKEN REJECTTOKEN UNFREEZETOKEN UNPAUSETOKEN UPDATE" +
            "TOKEN WIPEUNCHECKED SUBMITUPDATE ACCOUNTUPDATE NFTSUPDATE TOPIC")

        const table = card.findComponent(TransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe(
            "0.0.29624024@1646025139.152901498CRYPTO TRANSFER0.0.29624024\n\n" +
            "123423\n\n" +
            "0.0.296939115:12:31.6676 AMFeb 28, 2022, UTC"
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    test("without page size selector", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(200, {
            "transactions": [
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
            ]
        })

        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN)

        const wrapper = mount(Transactions, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions",
            "api/v1/transactions",
            "api/v1/network/nodes",
            "api/v1/tokens/" + SAMPLE_TOKEN.token_id,
            "api/v1/blocks",
        ])

        const card = wrapper.findComponent(DashboardCardV2)
        expect(card.exists()).toBe(true)
        expect(card.text()).toMatch(RegExp("^Recent Transactions"))

        const select = card.findComponent(TablePageSize)
        expect(select.exists()).toBe(false)

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    test("page size selector", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/transactions"
        mock.onGet(matcher1).reply(200, {
            "transactions": [
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
                SAMPLE_TRANSACTION,
            ]
        })

        const matcher2 = "/api/v1/tokens/" + SAMPLE_TOKEN.token_id
        mock.onGet(matcher2).reply(200, SAMPLE_TOKEN)

        const wrapper = mount(Transactions, {
            global: {
                plugins: [router, Oruga]
            },
            props: {},
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/transactions",
            "api/v1/transactions",
            "api/v1/network/nodes",
            "api/v1/tokens/" + SAMPLE_TOKEN.token_id,
            "api/v1/blocks",
        ])

        const card = wrapper.findComponent(DashboardCardV2)
        expect(card.exists()).toBe(true)
        expect(card.text()).toMatch(RegExp("^Recent Transactions"))

        const select = card.findComponent(TablePageSize)
        expect(select.exists()).toBe(true)

        expect(select.text()).toBe(
            "5 per page" +
            "10 per page" +
            "15 per page" +
            "20 per page" +
            "50 per pag" +
            "e100 per page")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

});
