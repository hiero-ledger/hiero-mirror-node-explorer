// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from "vitest"
import MockAdapter from "axios-mock-adapter"
import axios from "axios"
import {ref} from "vue"
import {ContractActionAnalyzer} from "@/utils/analyzer/ContractActionAnalyzer"
import {flushPromises} from "@vue/test-utils"
import {SAMPLE_CONTRACT_ACTIONS, SAMPLE_TOKEN} from "../../Mocks"
import {ContractAction} from "@/schemas/MirrorNodeSchemas"
import {SignatureCache} from "@/utils/cache/SignatureCache";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {cloneMock, fetchGetURLs} from "../../MockUtils";

describe("ContractActionAnalyzer.spec.ts", () => {

    test("ContractAction caller and recipient are defined", async () => {

        const mock = new MockAdapter(axios as any)

        // 1) new
        const action = ref<ContractAction | null>(null)
        const analyzer = new ContractActionAnalyzer(action)
        expect(analyzer.action.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)
        expect(fetchGetURLs(mock)).toStrictEqual([])

        // 2) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.action.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([])

        // 3) setup action
        const SAMPLE_ACTION = SAMPLE_CONTRACT_ACTIONS.actions[1]
        action.value = SAMPLE_ACTION
        await flushPromises()
        expect(analyzer.action.value).toStrictEqual(SAMPLE_ACTION)
        expect(analyzer.fromId.value).toBe("0.0.96039")
        expect(analyzer.toId.value).toBe("0.0.96037")
        expect(fetchGetURLs(mock)).toStrictEqual([
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "api/v1/contracts/0.0.96037",
            "api/v1/tokens/0.0.96037",
        ])

        // 4) unmount
        analyzer.unmount()
        expect(analyzer.action.value).toStrictEqual(SAMPLE_ACTION)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "api/v1/contracts/0.0.96037",
            "api/v1/tokens/0.0.96037",
        ])

        SignatureCache.instance.clear()
        mock.restore()
        await flushPromises()

    })

    test("ContractAction caller is undefined", async () => {

        const mock = new MockAdapter(axios as any)

        const SAMPLE_ACTION = cloneMock(SAMPLE_CONTRACT_ACTIONS.actions[1])
        SAMPLE_ACTION.caller = undefined
        expect(SAMPLE_ACTION.from).toBe(SAMPLE_CALLER.evm_address)

        const matcher1 = "api/v1/accounts/" + SAMPLE_ACTION.from
        mock.onGet(matcher1).reply(200, SAMPLE_CALLER)

        // 1) new
        const action = ref<ContractAction | null>(null)
        const analyzer = new ContractActionAnalyzer(action)
        expect(analyzer.action.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)
        expect(fetchGetURLs(mock)).toStrictEqual([])

        // 2) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.action.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([])

        // 3) setup action
        action.value = SAMPLE_ACTION
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0x0000000000000000000000000000000000017727",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "api/v1/contracts/0.0.96037",
            "api/v1/tokens/0.0.96037",
        ])
        expect(analyzer.action.value).toStrictEqual(SAMPLE_ACTION)
        expect(analyzer.fromId.value).toBe("0.0.96039")
        expect(analyzer.toId.value).toBe("0.0.96037")

        // 4) unmount
        analyzer.unmount()
        expect(analyzer.action.value).toStrictEqual(SAMPLE_ACTION)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0x0000000000000000000000000000000000017727",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "api/v1/contracts/0.0.96037",
            "api/v1/tokens/0.0.96037",
        ])

        AccountByAddressCache.instance.clear()
        SignatureCache.instance.clear()
        mock.restore()
        await flushPromises()

    })

    test("ContractAction recipient is undefined", async () => {

        const mock = new MockAdapter(axios as any)

        const SAMPLE_ACTION = cloneMock(SAMPLE_CONTRACT_ACTIONS.actions[1])
        SAMPLE_ACTION.recipient = undefined
        expect(SAMPLE_ACTION.to).toBe(SAMPLE_RECIPIENT.evm_address)

        const matcher1 = "api/v1/accounts/" + SAMPLE_ACTION.to
        mock.onGet(matcher1).reply(200, SAMPLE_RECIPIENT)

        // 1) new
        const action = ref<ContractAction | null>(null)
        const analyzer = new ContractActionAnalyzer(action)
        expect(analyzer.action.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)
        expect(fetchGetURLs(mock)).toStrictEqual([])

        // 2) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.action.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([])

        // 3) setup action
        action.value = SAMPLE_ACTION
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0x0000000000000000000000000000000000017725",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "api/v1/contracts/0.0.96037",
            "api/v1/tokens/0.0.96037",
        ])
        expect(analyzer.action.value).toStrictEqual(SAMPLE_ACTION)
        expect(analyzer.fromId.value).toBe("0.0.96039")
        expect(analyzer.toId.value).toBe("0.0.96037")

        // 4) unmount
        analyzer.unmount()
        expect(analyzer.action.value).toStrictEqual(SAMPLE_ACTION)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/accounts/0x0000000000000000000000000000000000017725",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "api/v1/contracts/0.0.96037",
            "api/v1/tokens/0.0.96037",
        ])

        AccountByAddressCache.instance.clear()
        SignatureCache.instance.clear()
        mock.restore()
        await flushPromises()

    })

    test("ContractAction recipient is undefined and to is HTS", async () => {

        const mock = new MockAdapter(axios as any)

        const SAMPLE_ACTION = cloneMock(SAMPLE_CONTRACT_ACTIONS.actions[1])
        SAMPLE_ACTION.recipient = undefined
        SAMPLE_ACTION.to = "0x0000000000000000000000000000000000000167"

        // 1) new
        const action = ref<ContractAction | null>(null)
        const analyzer = new ContractActionAnalyzer(action)
        expect(analyzer.action.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)
        expect(fetchGetURLs(mock)).toStrictEqual([])

        // 2) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.action.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([])

        // 3) setup action
        action.value = SAMPLE_ACTION
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "http://localhost:3000/abi/IHederaTokenService.json",
        ])
        expect(analyzer.action.value).toStrictEqual(SAMPLE_ACTION)
        expect(analyzer.fromId.value).toBe("0.0.96039")
        expect(analyzer.toId.value).toBe("0.0.359")

        // 4) unmount
        analyzer.unmount()
        expect(analyzer.action.value).toStrictEqual(SAMPLE_ACTION)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "http://localhost:3000/abi/IHederaTokenService.json",
        ])

        SignatureCache.instance.clear()
        mock.restore()
        await flushPromises()

    })

})


const SAMPLE_CALLER = {
    "account": "0.0.96039",
    "alias": "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ",
    "auto_renew_period": 7776000,
    "balance": {
        "balance": 2342647909,
        "timestamp": "1646333100.356842286",
        "tokens": [
            {
                "token_id": SAMPLE_TOKEN.token_id,
                "balance": 10
            }
        ]
    },
    "created_timestamp": "1646025151.667604000",
    "deleted": false,
    "expiry_timestamp": null,
    "key":
        {
            "_type": "ED25519",
            "key": "aa2f7b3e759f4531ec2e7941afa449e6a6e610efb52adae89e9cd8e9d40ddcbf"
        },
    "max_automatic_token_associations": 0,
    "memo": "",
    "receiver_sig_required": false,
    "evm_address": "0x0000000000000000000000000000000000017727",
    "ethereum_nonce": 0,
    "decline_reward": null,
    "staked_node_id": null,
    "staked_account_id": null,
    "stake_period_start": null
}

const SAMPLE_RECIPIENT = {
    "account": "0.0.96037",
    "alias": "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ",
    "auto_renew_period": 7776000,
    "balance": {
        "balance": 2342647909,
        "timestamp": "1646333100.356842286",
        "tokens": [
            {
                "token_id": SAMPLE_TOKEN.token_id,
                "balance": 10
            }
        ]
    },
    "created_timestamp": "1646025151.667604000",
    "deleted": false,
    "expiry_timestamp": null,
    "key":
        {
            "_type": "ED25519",
            "key": "aa2f7b3e759f4531ec2e7941afa449e6a6e610efb52adae89e9cd8e9d40ddcbf"
        },
    "max_automatic_token_associations": 0,
    "memo": "",
    "receiver_sig_required": false,
    "evm_address": "0x0000000000000000000000000000000000017725",
    "ethereum_nonce": 0,
    "decline_reward": null,
    "staked_node_id": null,
    "staked_account_id": null,
    "stake_period_start": null
}
