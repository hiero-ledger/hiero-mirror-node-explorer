// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, it} from 'vitest'
import {flushPromises, mount} from "@vue/test-utils"
import axios from "axios";
import {SAMPLE_BLOCKSRESPONSE, SAMPLE_CONTRACTCALL_TRANSACTIONS, SAMPLE_TOKEN, SAMPLE_TRANSACTIONS,} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import Oruga from "@oruga-ui/oruga-next";
import {HMSF} from "@/utils/HMSF";
import NotificationBanner from "@/components/NotificationBanner.vue";
import BlockDetails from "@/pages/BlockDetails.vue";
import BlockTransactionTable from "@/components/block/BlockTransactionTable.vue";
import {PathParam} from "@/utils/PathParam";
import {fetchGetURLs} from "../MockUtils";
import router from "@/utils/RouteManager.ts";

/*
    Bookmarks
        https://jestjs.io/docs/api
        https://test-utils.vuejs.org/api/

 */

HMSF.forceUTC = true

describe("BlockDetails.vue", () => {

    const BLOCK = SAMPLE_BLOCKSRESPONSE.blocks[0]
    const BLOCK_NUMBER = BLOCK.number.toString()
    const BLOCK_HASH = BLOCK.hash
    const NORMALIZED_BLOCK_HASH = PathParam.parseBlockLoc(BLOCK_HASH)!.toString()

    it("Should display block details from block number", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/blocks/" + BLOCK_NUMBER
        mock.onGet(matcher1).reply(200, BLOCK);

        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_TRANSACTIONS);

        const token = SAMPLE_TOKEN
        const matcher3 = "/api/v1/tokens/" + token.token_id
        mock.onGet(matcher3).reply(200, token);

        const wrapper = mount(BlockDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                blockHon: BLOCK_NUMBER
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + BLOCK_NUMBER,
            "api/v1/transactions",
            "api/v1/network/nodes",
            "api/v1/tokens/" + token.token_id,
            "api/v1/blocks",
        ])

        expect(wrapper.text()).toMatch(RegExp("Block " + BLOCK_NUMBER))
        expect(wrapper.findComponent(NotificationBanner).exists()).toBe(false)

        expect(wrapper.get("#countValue").text()).toBe("3")
        expect(wrapper.get("#blockHashValue").text()).toBe(
            "0xe9630d7d8cc86d0e0d3de5316995bbdf9f2a584524cf18da233abdcff82df97da0a0ec38c6b4046101294896ff88a86bCopySHA384")
        expect(wrapper.get("#fromTimestampValue").text()).toBe("6:58:31.3281 AMSep 23, 2022, UTC")
        expect(wrapper.get("#toTimestampValue").text()).toBe("6:58:31.3281 AMSep 23, 2022, UTC")
        expect(wrapper.get("#gasUsedValue").text()).toBe("0")
        expect(wrapper.get("#recordFileNameValue").text()).toBe("2022-09-23T06_58_31.328130742Z.rcd.gz")
        expect(wrapper.get("#blockTransactions").text()).toMatch(RegExp("^Block Transactions"))
        const table = wrapper.findComponent(BlockTransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe("0.0.29624024@1646025139.152901498CRYPTO TRANSFER0.0.29624024\n" + "\n" +
            "123423\n" + "\n" +
            "0.0.296939115:12:31.6676 AMFeb 28, 2022, UTC")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should display block details from block hash", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/blocks/" + NORMALIZED_BLOCK_HASH
        mock.onGet(matcher1).reply(200, BLOCK);

        const matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_TRANSACTIONS);

        const token = SAMPLE_TOKEN
        const matcher3 = "/api/v1/tokens/" + token.token_id
        mock.onGet(matcher3).reply(200, token);

        const wrapper = mount(BlockDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                blockHon: BLOCK_HASH
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + NORMALIZED_BLOCK_HASH,
            "api/v1/transactions",
            "api/v1/network/nodes",
            "api/v1/tokens/" + token.token_id,
            "api/v1/blocks",
        ])

        expect(wrapper.text()).toMatch(RegExp("Block " + BLOCK_NUMBER))
        expect(wrapper.findComponent(NotificationBanner).exists()).toBe(false)

        expect(wrapper.get("#countValue").text()).toBe("3")
        expect(wrapper.get("#blockHashValue").text()).toBe(
            "0xe9630d7d8cc86d0e0d3de5316995bbdf9f2a584524cf18da233abdcff82df97da0a0ec38c6b4046101294896ff88a86bCopySHA384")
        expect(wrapper.get("#fromTimestampValue").text()).toBe("6:58:31.3281 AMSep 23, 2022, UTC")
        expect(wrapper.get("#toTimestampValue").text()).toBe("6:58:31.3281 AMSep 23, 2022, UTC")
        expect(wrapper.get("#gasUsedValue").text()).toBe("0")
        expect(wrapper.get("#recordFileNameValue").text()).toBe("2022-09-23T06_58_31.328130742Z.rcd.gz")
        expect(wrapper.get("#blockTransactions").text()).toMatch(RegExp("^Block Transactions"))
        const table = wrapper.findComponent(BlockTransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe("0.0.29624024@1646025139.152901498CRYPTO TRANSFER0.0.29624024\n" + "\n" +
            "123423\n" + "\n" +
            "0.0.296939115:12:31.6676 AMFeb 28, 2022, UTC")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should update when block hash changes", async () => {

        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);

        let normalizedBlockHash = PathParam.parseBlockLoc(BLOCK_HASH)
        let matcher1 = "/api/v1/blocks/" + normalizedBlockHash!.toString()
        mock.onGet(matcher1).reply(200, BLOCK);

        let matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_TRANSACTIONS);

        const token = SAMPLE_TOKEN
        const matcher3 = "/api/v1/tokens/" + token.token_id
        mock.onGet(matcher3).reply(200, token);

        const wrapper = mount(BlockDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                blockHon: BLOCK_HASH
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + normalizedBlockHash,
            "api/v1/transactions",
            "api/v1/network/nodes",
            "api/v1/tokens/" + token.token_id,
            "api/v1/blocks",
        ])

        expect(wrapper.text()).toMatch(RegExp("Block " + BLOCK_NUMBER))
        expect(wrapper.findComponent(NotificationBanner).exists()).toBe(false)

        expect(wrapper.get("#countValue").text()).toBe("3")
        expect(wrapper.get("#blockHashValue").text()).toBe(
            "0xe9630d7d8cc86d0e0d3de5316995bbdf9f2a584524cf18da233abdcff82df97da0a0ec38c6b4046101294896ff88a86bCopySHA384")
        expect(wrapper.get("#fromTimestampValue").text()).toBe("6:58:31.3281 AMSep 23, 2022, UTC")
        expect(wrapper.get("#toTimestampValue").text()).toBe("6:58:31.3281 AMSep 23, 2022, UTC")
        expect(wrapper.get("#gasUsedValue").text()).toBe("0")
        expect(wrapper.get("#recordFileNameValue").text()).toBe("2022-09-23T06_58_31.328130742Z.rcd.gz")
        expect(wrapper.get("#blockTransactions").text()).toMatch(RegExp("^Block Transactions"))
        let table = wrapper.findComponent(BlockTransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe("0.0.29624024@1646025139.152901498CRYPTO TRANSFER0.0.29624024\n" + "\n" +
            "123423\n" + "\n" +
            "0.0.296939115:12:31.6676 AMFeb 28, 2022, UTC")

        mock.resetHistory()

        // Change Block Number
        const NEW_BLOCK = SAMPLE_BLOCKSRESPONSE.blocks[1]
        const NEW_BLOCK_NUMBER = NEW_BLOCK.number.toString()
        const NEW_BLOCK_HASH = NEW_BLOCK.hash

        normalizedBlockHash = PathParam.parseBlockLoc(NEW_BLOCK_HASH)
        matcher1 = "/api/v1/blocks/" + normalizedBlockHash!.toString()
        mock.onGet(matcher1).reply(200, NEW_BLOCK);
        matcher2 = "/api/v1/transactions"
        mock.onGet(matcher2).reply(200, SAMPLE_CONTRACTCALL_TRANSACTIONS);

        await wrapper.setProps({
            blockHon: NEW_BLOCK_HASH
        })
        await flushPromises()
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + normalizedBlockHash,
            "api/v1/transactions",
            "api/v1/contracts/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[1].entity_id,
            "api/v1/contracts/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].entity_id,
            "api/v1/contracts/results/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[1].transaction_id,
            "api/v1/contracts/results/" + SAMPLE_CONTRACTCALL_TRANSACTIONS.transactions[0].transaction_id,
            "api/v1/accounts/",
            "api/v1/blocks",
            "api/v1/blocks",
        ])

        expect(wrapper.text()).toMatch(RegExp("Block " + NEW_BLOCK_NUMBER))
        expect(wrapper.findComponent(NotificationBanner).exists()).toBe(false)

        expect(wrapper.get("#countValue").text()).toBe("5")
        expect(wrapper.get("#blockHashValue").text()).toBe(
            "0x7ece042fa9369ac7d6a407ffd4d4b76b284b54077abf2f5212e969a9fcbe34676f9eaae9dc718e8ca9987a48f92aa7c6CopySHA384")
        expect(wrapper.get("#fromTimestampValue").text()).toBe("6:58:28.2114 AMSep 23, 2022, UTC")
        expect(wrapper.get("#toTimestampValue").text()).toBe("6:58:29.2397 AMSep 23, 2022, UTC")
        expect(wrapper.get("#gasUsedValue").text()).toBe("0")
        expect(wrapper.get("#recordFileNameValue").text()).toBe("2022-09-23T06_58_28.211469425Z.rcd.gz")
        expect(wrapper.get("#blockTransactions").text()).toMatch(RegExp("^Block Transactions"))
        table = wrapper.findComponent(BlockTransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe(
            "0.0.950@1646665756.235554077" +
            "CONTRACT CALL" +
            "Contract:0.0.749774" +
            "3:09:26.5747 PMMar 7, 2022, UTC" +
            "0.0.950@1646664143.028737238" +
            "CONTRACT CALL" +
            "Contract:0.0.749723" +
            "2:42:34.8669 PMMar 7, 2022, UTC")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should detect invalid block number", async () => {
        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any)
        const INVALID_BLOCK_NUMBER = "-42"
        const wrapper = mount(BlockDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                blockHon: INVALID_BLOCK_NUMBER
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([])

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.text()).toBe("Invalid block number or hash: " + INVALID_BLOCK_NUMBER)

        expect(wrapper.get("#countValue").text()).toBe("None")
        expect(wrapper.get("#blockHashValue").text()).toBe("None")
        expect(wrapper.get("#fromTimestampValue").text()).toBe("None")
        expect(wrapper.get("#toTimestampValue").text()).toBe("None")
        expect(wrapper.get("#gasUsedValue").text()).toBe("None")
        expect(wrapper.get("#recordFileNameValue").text()).toBe("None")
        expect(wrapper.get("#blockTransactions").text()).toMatch(RegExp("^Block Transactions"))
        const table = wrapper.findComponent(BlockTransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe("")

        wrapper.unmount()
        await flushPromises()
    });

    it("Should detect invalid block hash", async () => {
        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any)
        const INVALID_BLOCK_HASH = "0xABCDEF"
        const wrapper = mount(BlockDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                blockHon: INVALID_BLOCK_HASH
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([])

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.text()).toBe("Invalid block number or hash: " + INVALID_BLOCK_HASH)

        expect(wrapper.get("#countValue").text()).toBe("None")
        expect(wrapper.get("#blockHashValue").text()).toBe("None")
        expect(wrapper.get("#fromTimestampValue").text()).toBe("None")
        expect(wrapper.get("#toTimestampValue").text()).toBe("None")
        expect(wrapper.get("#gasUsedValue").text()).toBe("None")
        expect(wrapper.get("#recordFileNameValue").text()).toBe("None")
        expect(wrapper.get("#blockTransactions").text()).toMatch(RegExp("^Block Transactions"))
        const table = wrapper.findComponent(BlockTransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe("")

        wrapper.unmount()
        await flushPromises()
    });

    it("Should detect non-existent block number", async () => {
        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/blocks/" + BLOCK_NUMBER
        mock.onGet(matcher1).reply(404);

        const wrapper = mount(BlockDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                blockHon: BLOCK_NUMBER
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + BLOCK_NUMBER,
        ])

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.text()).toBe("Block with number " + BLOCK_NUMBER + " was not found")

        expect(wrapper.get("#countValue").text()).toBe("None")
        expect(wrapper.get("#blockHashValue").text()).toBe("None")
        expect(wrapper.get("#fromTimestampValue").text()).toBe("None")
        expect(wrapper.get("#toTimestampValue").text()).toBe("None")
        expect(wrapper.get("#gasUsedValue").text()).toBe("None")
        expect(wrapper.get("#recordFileNameValue").text()).toBe("None")
        expect(wrapper.get("#blockTransactions").text()).toMatch(RegExp("^Block Transactions"))
        const table = wrapper.findComponent(BlockTransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe("")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });

    it("Should detect non-existent block hash", async () => {
        await router.push("/") // To avoid "missing required param 'network'" error

        const mock = new MockAdapter(axios as any);
        const matcher1 = "/api/v1/blocks/" + NORMALIZED_BLOCK_HASH
        mock.onGet(matcher1).reply(404);

        const wrapper = mount(BlockDetails, {
            global: {
                plugins: [router, Oruga],
                provide: {"isMediumScreen": false}
            },
            props: {
                blockHon: BLOCK_HASH
            },
        });

        await flushPromises()
        // console.log(wrapper.html())
        // console.log(wrapper.text())

        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/blocks/" + NORMALIZED_BLOCK_HASH,
        ])

        const banner = wrapper.findComponent(NotificationBanner)
        expect(banner.text()).toBe("Block with hash " + NORMALIZED_BLOCK_HASH + " was not found")

        expect(wrapper.get("#countValue").text()).toBe("None")
        expect(wrapper.get("#blockHashValue").text()).toBe("None")
        expect(wrapper.get("#fromTimestampValue").text()).toBe("None")
        expect(wrapper.get("#toTimestampValue").text()).toBe("None")
        expect(wrapper.get("#gasUsedValue").text()).toBe("None")
        expect(wrapper.get("#recordFileNameValue").text()).toBe("None")
        expect(wrapper.get("#blockTransactions").text()).toMatch(RegExp("^Block Transactions"))
        const table = wrapper.findComponent(BlockTransactionTable)
        expect(table.exists()).toBe(true)
        expect(table.get('thead').text()).toBe("ID TYPE CONTENT TIME")
        expect(table.get('tbody').text()).toBe("")

        mock.restore()
        wrapper.unmount()
        await flushPromises()
    });
});
