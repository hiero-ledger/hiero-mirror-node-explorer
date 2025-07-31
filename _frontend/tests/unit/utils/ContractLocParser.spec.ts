// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {Ref, ref} from "vue";
import {flushPromises} from "@vue/test-utils";
import {SAMPLE_CONTRACT} from "../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {ContractLocParser} from "@/utils/parser/ContractLocParser";

describe("ContractLocParser.ts", () => {

    //
    // mount + set/unset contract loc + unmount
    //

    test("mount + set/unset contract loc + unmount", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        // 0) Creates parser
        const contractLoc: Ref<string | null> = ref(null)
        const parser = new ContractLocParser(contractLoc)
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account id
        contractLoc.value = SAMPLE_CONTRACT.contract_id
        expect(parser.contractLoc.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.contractLoc.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.contractResponse.value).toStrictEqual(SAMPLE_CONTRACT)
        expect(parser.contractId.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.ethereumAddress.value).toBe(SAMPLE_CONTRACT.evm_address)
        expect(parser.errorNotification.value).toBeNull()

        // 3) Unsets
        contractLoc.value = null
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set contract loc + mount + unmount + unset contract loc
    //

    test("set contract loc + mount + unmount + unset account loc", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        // 0) Creates parser
        const contractLoc: Ref<string | null> = ref(null)
        const parser = new ContractLocParser(contractLoc)
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with contract id
        contractLoc.value = SAMPLE_CONTRACT.contract_id
        expect(parser.contractLoc.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.contractLoc.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.contractLoc.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.contractResponse.value).toStrictEqual(SAMPLE_CONTRACT)
        expect(parser.contractId.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.ethereumAddress.value).toBe(SAMPLE_CONTRACT.evm_address)
        expect(parser.errorNotification.value).toBeNull()

        // 3) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.contractLoc.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // Unsets
        contractLoc.value = null
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set contract loc with contract address
    //

    test("set contract with contract address", async () => {

        const mock = new MockAdapter(axios as any)

        const matcher1 = "/api/v1/contracts/" + SAMPLE_CONTRACT.evm_address
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT);

        // 0) Creates parser
        const contractLoc: Ref<string | null> = ref(null)
        const parser = new ContractLocParser(contractLoc)
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with account address
        contractLoc.value = SAMPLE_CONTRACT.evm_address
        expect(parser.contractLoc.value).toBe(SAMPLE_CONTRACT.evm_address)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.contractLoc.value).toBe(SAMPLE_CONTRACT.evm_address)
        expect(parser.contractResponse.value).toStrictEqual(SAMPLE_CONTRACT)
        expect(parser.contractId.value).toBe(SAMPLE_CONTRACT.contract_id)
        expect(parser.ethereumAddress.value).toBe(SAMPLE_CONTRACT.evm_address)
        expect(parser.errorNotification.value).toBeNull()

        // 3) Unsets
        contractLoc.value = null
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set account loc with unknown account id
    //

    test("set contract loc with unknown contract id", async () => {

        const mock = new MockAdapter(axios as any)

        const UNKNOWN_ACCOUNT_ID = "0.0.42"
        const matcher1 = "/api/v1/contracts/" + UNKNOWN_ACCOUNT_ID
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const contractLoc: Ref<string | null> = ref(null)
        const parser = new ContractLocParser(contractLoc)
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with contract id
        contractLoc.value = UNKNOWN_ACCOUNT_ID
        expect(parser.contractLoc.value).toBe(UNKNOWN_ACCOUNT_ID)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.contractLoc.value).toBe(UNKNOWN_ACCOUNT_ID)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Contract with ID " + UNKNOWN_ACCOUNT_ID + " was not found")

        // 3) Unsets
        contractLoc.value = null
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

    //
    // set account loc with unknown contract address
    //

    test("set contract loc with unknown contract address", async () => {

        const mock = new MockAdapter(axios as any)

        const UNKNOWN_ACCOUNT_ADDRESS = "0x0001020304050607080900010203040506070809"
        const matcher1 = "/api/v1/contracts/" + UNKNOWN_ACCOUNT_ADDRESS
        mock.onGet(matcher1).reply(404);

        // 0) Creates parser
        const contractLoc: Ref<string | null> = ref(null)
        const parser = new ContractLocParser(contractLoc)
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with contract id
        contractLoc.value = UNKNOWN_ACCOUNT_ADDRESS
        expect(parser.contractLoc.value).toBe(UNKNOWN_ACCOUNT_ADDRESS)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()
        await flushPromises()
        expect(parser.contractLoc.value).toBe(UNKNOWN_ACCOUNT_ADDRESS)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Contract with address " + UNKNOWN_ACCOUNT_ADDRESS + " was not found")

        // 3) Unsets
        contractLoc.value = null
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })


    //
    // set account loc with dummy value
    //

    test("set contract loc with dummy value", async () => {

        const mock = new MockAdapter(axios as any)

        const DUMMY_LOC = "dummy loc"
        const matcher1 = "/api/v1/accounts/" + DUMMY_LOC
        mock.onGet(matcher1).reply(404);


        // 0) Creates parser
        const contractLoc: Ref<string | null> = ref(null)
        const parser = new ContractLocParser(contractLoc)
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 1) Mounts parser
        parser.mount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 2) Sets with contract id
        contractLoc.value = DUMMY_LOC
        expect(parser.contractLoc.value).toBe(DUMMY_LOC)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Invalid contract ID or address: " + DUMMY_LOC)
        await flushPromises()
        expect(parser.contractLoc.value).toBe(DUMMY_LOC)
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBe("Invalid contract ID or address: " + DUMMY_LOC)

        // 3) Unsets
        contractLoc.value = null
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        // 4) Unmounts parser
        parser.unmount()
        await flushPromises()
        expect(parser.contractLoc.value).toBeNull()
        expect(parser.contractResponse.value).toBeNull()
        expect(parser.contractId.value).toBeNull()
        expect(parser.ethereumAddress.value).toBeNull()
        expect(parser.errorNotification.value).toBeNull()

        mock.restore()
    })

})
