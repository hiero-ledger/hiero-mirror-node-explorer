// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {Ref, ref} from "vue";
import {flushPromises} from "@vue/test-utils";
import {SAMPLE_BLOCK} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {BlockLocParser} from "@/utils/parser/BlockLocParser";
import {PathParam} from "@/utils/PathParam";

describe("BlockLocParser.ts", () => {

    //
    // mount + set/unset block loc + unmount
    //

    test("mount + set/unset block loc + unmount", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/blocks/" + SAMPLE_BLOCK.number
        mock.onGet(matcher1).reply(200, SAMPLE_BLOCK);

        // 0) Creates parser
        const blockLoc: Ref<string | null> = ref(null)
        const parser = new BlockLocParser(blockLoc)
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with block number
        blockLoc.value = SAMPLE_BLOCK.number.toString()
        expect(parser.blockLoc.value).toBe(SAMPLE_BLOCK.number.toString())
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.blockLoc.value).toBe(SAMPLE_BLOCK.number.toString())
        expect(parser.block.value).toStrictEqual(SAMPLE_BLOCK)
        expect(parser.blockNumber.value).toBe(SAMPLE_BLOCK.number)
        expect(parser.blockCount.value).toBe(SAMPLE_BLOCK.count)
        expect(parser.toTimestamp.value).toBe(SAMPLE_BLOCK.timestamp.to)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unsets
        blockLoc.value = null
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set block loc + mount + unmount + unset block loc
    //

    test("set block loc + mount + unmount + unset block loc", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/blocks/" + SAMPLE_BLOCK.number
        mock.onGet(matcher1).reply(200, SAMPLE_BLOCK);

        // 0) Creates parser
        const blockLoc: Ref<string | null> = ref(null)
        const parser = new BlockLocParser(blockLoc)
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Sets with block number
        blockLoc.value = SAMPLE_BLOCK.number.toString()
        expect(parser.blockLoc.value).toBe(SAMPLE_BLOCK.number.toString())
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.blockLoc.value).toBe(SAMPLE_BLOCK.number.toString())
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.blockLoc.value).toBe(SAMPLE_BLOCK.number.toString())
        expect(parser.block.value).toStrictEqual(SAMPLE_BLOCK)
        expect(parser.blockNumber.value).toBe(SAMPLE_BLOCK.number)
        expect(parser.blockCount.value).toBe(SAMPLE_BLOCK.count)
        expect(parser.toTimestamp.value).toBe(SAMPLE_BLOCK.timestamp.to)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.blockLoc.value).toBe(SAMPLE_BLOCK.number.toString())
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // Unsets
        blockLoc.value = null
        await flushPromises()
        expect(parser.block.value).toBeNull()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set block loc with hash
    //

    test("set block loc with block hash", async () => {

        const mock = new MockAdapter(axios as any)

        const SAMPLE_BLOCK_HASH = PathParam.parseBlockLoc(SAMPLE_BLOCK.hash)!.toString()
        const matcher1 = "/api/v1/blocks/" + SAMPLE_BLOCK_HASH
        mock.onGet(matcher1).reply(200, SAMPLE_BLOCK);

        // 0) Creates parser
        const blockLoc: Ref<string | null> = ref(null)
        const parser = new BlockLocParser(blockLoc)
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with block hash
        blockLoc.value = SAMPLE_BLOCK.hash
        expect(parser.blockLoc.value).toBe(SAMPLE_BLOCK.hash)
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.blockLoc.value).toBe(SAMPLE_BLOCK.hash)
        expect(parser.block.value).toStrictEqual(SAMPLE_BLOCK)
        expect(parser.blockNumber.value).toBe(SAMPLE_BLOCK.number)
        expect(parser.blockCount.value).toBe(SAMPLE_BLOCK.count)
        expect(parser.toTimestamp.value).toBe(SAMPLE_BLOCK.timestamp.to)
        expect(parser.errorNotification.value).toBe(null)

        // 3) Unsets
        blockLoc.value = null
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set block loc with unknown block number
    //

    test("set block loc with unknown block number", async () => {

        const mock = new MockAdapter(axios as any)

        const UNKNOWN_NB = 42
        const matcher1 = "/api/v1/blocks/" + UNKNOWN_NB
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const blockLoc: Ref<string | null> = ref(null)
        const parser = new BlockLocParser(blockLoc)
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with block number
        blockLoc.value = UNKNOWN_NB.toString()
        expect(parser.blockLoc.value).toBe(UNKNOWN_NB.toString())
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.blockLoc.value).toBe(UNKNOWN_NB.toString())
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Block with number 42 was not found")

        // 3) Unsets
        blockLoc.value = null
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })


    //
    // set block loc with unknown hash
    //

    test("set block loc with unknown ethereum hash", async () => {

        const mock = new MockAdapter(axios as any)

        const UNKNOWN_HASH = "0x0011223344556677001122334455667700112233445566770011223344556677"
        const matcher1 = "/api/v1/blocks/" + UNKNOWN_HASH
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const blockLoc: Ref<string | null> = ref(null)
        const parser = new BlockLocParser(blockLoc)
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with block hash
        blockLoc.value = UNKNOWN_HASH
        expect(parser.blockLoc.value).toBe(UNKNOWN_HASH)
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.blockLoc.value).toBe(UNKNOWN_HASH)
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Block with hash 0x0011223344556677001122334455667700112233445566770011223344556677 was not found")

        // 3) Unsets
        blockLoc.value = null
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })


    //
    // set block loc with dummy value
    //

    test("set block loc with dummy value", async () => {

        const DUMMY_LOC = "dummy block loc"

        // 0) Creates parser
        const blockLoc: Ref<string | null> = ref(null)
        const parser = new BlockLocParser(blockLoc)
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with dummy loc
        blockLoc.value = DUMMY_LOC
        expect(parser.blockLoc.value).toBe(DUMMY_LOC)
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Invalid block number or hash: dummy block loc")
        await flushPromises()
        expect(parser.blockLoc.value).toBe(DUMMY_LOC)
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Invalid block number or hash: dummy block loc")

        // 3) Unsets
        blockLoc.value = null
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.blockLoc.value).toBeNull()
        expect(parser.block.value).toBeNull()
        expect(parser.blockNumber.value).toBeNull()
        expect(parser.blockCount.value).toBeNull()
        expect(parser.toTimestamp.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
    })

})
