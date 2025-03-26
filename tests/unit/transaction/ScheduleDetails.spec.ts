// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import router from "@/router";
import axios, {AxiosRequestConfig} from "axios";
import {SAMPLE_SCHEDULE, SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import {HMSF} from "@/utils/HMSF";
import {TransactionID} from "@/utils/TransactionID";
import Oruga from "@oruga-ui/oruga-next";
import {fetchGetURLs} from "../MockUtils";
import ScheduleDetails from "@/pages/ScheduleDetails.vue";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("TransactionDetails.vue", () => {

    it("Should display the schedule details", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const SCHEDULING = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![0]
        const SCHEDULED = SAMPLE_SCHEDULING_SCHEDULED_TRANSACTIONS.transactions![1]
        const SCHEDULE = SAMPLE_SCHEDULE
        const SCHEDULE_ID = SAMPLE_SCHEDULE.schedule_id



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
        const matcher2 = "/api/v1/schedules/" + SCHEDULE_ID
        mock.onGet(matcher2).reply(200, SAMPLE_SCHEDULE);

        const wrapper = mount(ScheduleDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                scheduleId: SCHEDULE_ID!
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/schedules/" + SCHEDULE_ID,
            "api/v1/transactions",
            "api/v1/contracts/" + SCHEDULE.payer_account_id,
            "api/v1/contracts/" + SCHEDULE.creator_account_id,
            "api/v1/transactions",
        ])

        expect(wrapper.text()).toMatch(RegExp("Schedule " + SCHEDULE_ID + " EXECUTED"))

        const scheduled = wrapper.get("#scheduled-transactionValue")
        expect(scheduled.text()).toBe("TOKEN MINT")
        const link1 = scheduled.get('a')
        expect(link1.attributes("href")).toBe(
            "/mainnet/transaction/" + SCHEDULE.executed_timestamp
        )

        expect (wrapper.get("#executed-atValue").text()).toBe("3:28:45.5087 AMOct 26, 2022, UTC")
        expect (wrapper.get("#memoValue").text()).toBe("None")

        const createTx = wrapper.get("#create-transactionValue")
        expect(createTx.text()).toBe(TransactionID.normalizeForDisplay(SCHEDULING.transaction_id))
        const link2 = createTx.get('a')
        expect(link2.attributes("href")).toBe(
            "/mainnet/transaction/" + SCHEDULE.consensus_timestamp
        )

        expect (wrapper.get("#creator-idValue").text()).toBe("0.0.503733")
        expect (wrapper.get("#payer-idValue").text()).toBe("0.0.540286")
        expect (wrapper.get("#admin-keyValue").text()).toBe("None")
        expect (wrapper.get("#transaction-bodyValue").text()).toContain("192a230b-43a0-490a-b070-a327e22763de")

        const timestamps = wrapper.findAll("#timestampValue")
        expect(timestamps.length).toBe(2)
        expect(timestamps[0].text()).toBe("3:28:45.5087 AMOct 26, 2022, UTC")
        expect(timestamps[1].text()).toBe("3:28:45.5087 AMOct 26, 2022, UTC")

        const keyPrefixes = wrapper.findAll("#key-prefixValue")
        expect(keyPrefixes.length).toBe(2)
        expect(keyPrefixes[0].text()).toBe("0x02c7afbeda329af3029987bdf8c4f2c809afd0685788878b7268e7b07033d932fa" + "Copy")
        expect(keyPrefixes[1].text()).toBe("0x02d1a8c8de9aea78ecaa3cfad59388f87d8cc474feb6d49a08f1fc4e974f5d1c62" + "Copy")

        const signatures = wrapper.findAll("#signatureValue")
        expect(signatures.length).toBe(2)
        expect(signatures[0].text()).toBe("0x0ad75895d50136b0d4bf5e29017e4de170d83a26e81240c03d57a556b35af484521fecfbdb0902935ab4e864e0cc3619f119690438c521894a68762cd91b25f7" + "Copy" + "ECDSA_SECP256K1")
        expect(signatures[1].text()).toBe("0x1226fba76e1737250b4ef97281563989031c039287432ff45aa203d72186d1885e226b96836f17c01eec43440b2cf2bb58849ac5da9723ce6b0c6a5a0a00d9e7" + "Copy" + "ECDSA_SECP256K1")

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

    it("Should display a banner for invalid schedule ID", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const INVALID_SCHEDULE_ID = "0.0.98"

        const mock = new MockAdapter(axios as any)
        const matcher2 = "/api/v1/schedules/" + INVALID_SCHEDULE_ID
        mock.onGet(matcher2).reply(404);

        const wrapper = mount(ScheduleDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                scheduleId: INVALID_SCHEDULE_ID!
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/network/nodes",
            "api/v1/schedules/" + INVALID_SCHEDULE_ID,
        ])

        expect(wrapper.text()).toMatch(RegExp("Schedule with ID " + INVALID_SCHEDULE_ID + " was not found"))

        wrapper.unmount()
        await flushPromises()
        mock.restore()
    });

});
