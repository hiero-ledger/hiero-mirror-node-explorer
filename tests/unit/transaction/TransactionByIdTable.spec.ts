// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import {
    SAMPLE_DUDE_WITH_KEYS,
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

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("TransactionByIdTable.vue", () => {

    it("Should list transactions as parent and child", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

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

        expect(wrapper.find('thead').text()).toBe("TimeTypeContentRelationshipNonce".toUpperCase())
        expect(wrapper.find('tbody').text()).toBe(
            "1:29:17.0144 PMSep 6, 2022, UTCCONTRACT CALLContract ID: 0.0.48193749Parent0" +
            "1:29:17.0144 PMSep 6, 2022, UTCTOKEN MINTMINT\n\n0.0.48193741RSSE\n\n0.0.48113503Child1" +
            "1:29:17.0144 PMSep 6, 2022, UTCCRYPTO TRANSFER0.0.48113503\n\n0.0.48193741RSSE\n\n0.0.48193739Child2"
        )

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should list transactions as scheduling and scheduled", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

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

        expect(wrapper.find('thead').text()).toBe("TimeTypeContentRelationship".toUpperCase())
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

        await router.push("/") // To avoid "missing required param 'network'" error
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
                transactions: SAMPLE_SAME_ID_NOT_PARENT_TRANSACTIONS.transactions as Array<Transaction>,
            },
        });

        await flushPromises()
        // console.log(wrapper.text())

        expect(wrapper.find('thead').text()).toBe("TimeTypeContentNonce".toUpperCase())
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
});
