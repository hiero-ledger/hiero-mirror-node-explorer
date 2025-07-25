// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import {
    SAMPLE_DUDE_WITH_KEYS,
    SAMPLE_PARENT_CHILD_AND_UNRELATED_TRANSACTIONS,
    SAMPLE_PARENT_CHILD_TRANSACTIONS,
    SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS,
    SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS,
    SAMPLE_TOKEN
} from "../Mocks";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import TransactionByIdTable from "@/components/transaction/TransactionByIdTable.vue";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import router from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("TransactionByIdTable.vue", () => {

    it("Should list transactions as parent and child", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/tokens/" + "0.0.48193741"
        mock.onGet(matcher1).reply(200, SAMPLE_DUDE_WITH_KEYS)

        const wrapper = mount(TransactionByIdTable, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                narrowed: true,
                nbItems: 42,
                transactions: SAMPLE_PARENT_CHILD_TRANSACTIONS.transactions,
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.find('thead').text()).toBe("Time Type Content Relationship Nonce".toUpperCase())
        expect(wrapper.find('tbody').text()).toBe(
            "1:29:17.0144 PMSep 6, 2022, UTC" + "CONTRACT CALL" + "0.0.48113503\n\n" + "50.00000000ℏ\n\n" + "0.0.48193749" + "Parent" + "0" +
            "1:29:17.0144 PMSep 6, 2022, UTC" + "TOKEN MINT" + "MINT\n\n" + "0.0.48193741" + "RSSE\n\n" + "0.0.48113503" + "Child" + "1" +
            "1:29:17.0144 PMSep 6, 2022, UTC" + "CRYPTO TRANSFER" + "0.0.48113503\n\n" + "0.0.48193741" + "RSSE\n\n" + "0.0.48193739" + "Child" + "2"
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should list transactions as scheduling and scheduled", async () => {

        const SCHEDULED = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![1]
        const TOKEN_ID = SCHEDULED.token_transfers ? SCHEDULED.token_transfers[0].token_id : "0.0.1304757"
        const mock = new MockAdapter(axios as any);
        const matcher5 = "/api/v1/tokens/" + TOKEN_ID
        mock.onGet(matcher5).reply(200, SAMPLE_TOKEN)
        const matcher1 = "/api/v1/tokens/" + "0.0.48193741"
        mock.onGet(matcher1).reply(200, SAMPLE_DUDE_WITH_KEYS)

        const wrapper = mount(TransactionByIdTable, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                narrowed: true,
                nbItems: 42,
                transactions: SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions!,
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.find('thead').text()).toBe("Time Type Content Relationship".toUpperCase())
        const rows = wrapper.find('tbody').findAll('tr')

        let cells = rows[0].findAll('td')
        expect(cells[1].text()).toBe("SCHEDULE CREATE")
        expect(cells[3].text()).toBe("Schedule Create")

        cells = rows[1].findAll('td')
        expect(cells[1].text()).toBe("TOKEN MINT")
        expect(cells[3].text()).toBe("Scheduled")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should list transactions as unrelated", async () => {

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/tokens/" + "0.0.48193741"
        mock.onGet(matcher1).reply(200, SAMPLE_DUDE_WITH_KEYS)

        const wrapper = mount(TransactionByIdTable, {
            global: {
                plugins: [Oruga]
            },
            props: {
                narrowed: true,
                nbItems: 42,
                transactions: SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS.transactions as Array<Transaction>,
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.find('thead').text()).toBe("Time Type Content Nonce".toUpperCase())
        const rows = wrapper.find('tbody').findAll('tr')

        let cells = rows[0].findAll('td')
        expect(cells[1].text()).toBe("DELETE ALLOWANCE")
        expect(cells[3].text()).toBe("0")

        cells = rows[1].findAll('td')
        expect(cells[1].text()).toBe("CONTRACT DELETE")
        expect(cells[3].text()).toBe("1")

        cells = rows[2].findAll('td')
        expect(cells[1].text()).toBe("CONTRACT DELETE")
        expect(cells[3].text()).toBe("2")

        wrapper.unmount()
        await flushPromises()
    });

    it("Should list transactions as parent, child, and unrelated", async () => {

        const mock = new MockAdapter(axios as any);

        const wrapper = mount(TransactionByIdTable, {
            global: {
                plugins: [router, Oruga]
            },
            props: {
                narrowed: true,
                nbItems: 42,
                transactions: SAMPLE_PARENT_CHILD_AND_UNRELATED_TRANSACTIONS.transactions,
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.find('thead').text()).toBe("Time Type Content Relationship Nonce".toUpperCase())
        expect(wrapper.find('tbody').text()).toBe(
            "8:43:12.3706 PMJul 30, 2024, UTC" + "UPDATE ACCOUNT" + "Account:0.0.4452547" + "n/a" + "1" +
            "8:43:12.3706 PMJul 30, 2024, UTC" + "ETHEREUM TRANSACTION" + "Account:0.0.4640464" + "Parent" + "0" +
            "8:43:12.3706 PMJul 30, 2024, UTC" + "CONTRACT CREATE" + "Contract:0.0.4640464" + "Child" + "2"
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });
});
