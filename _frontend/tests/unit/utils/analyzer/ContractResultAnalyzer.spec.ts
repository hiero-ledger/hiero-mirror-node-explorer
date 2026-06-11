// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test, vi} from "vitest";
import {ref} from "vue";
import {ContractResultAnalyzer} from "@/utils/analyzer/ContractResultAnalyzer";
import {flushPromises} from "@vue/test-utils";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {fetchGetURLs} from "../../MockUtils";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {routeManager} from "@/utils/RouteManager.ts";

describe("ContractResultAnalyzer.spec.ts", () => {

    test("new + mount + setup + unmount", async () => {

        const sourcifyURL = routeManager.currentNetworkEntry.value.sourcifySetup?.repoURL

        const mock = new MockAdapter(axios as any);

        const matcher0 = "/api/v1/contracts/" + CONTRACT_RESULT.contract_id
        mock.onGet(matcher0).reply(200, CONTRACT);

        const matcher1 = "/api/v1/contracts/results"
        const param1 = {timestamp: CONTRACT_RESULT.timestamp, internal: true, limit: 1}
        mock.onGet(matcher1, {params: param1}).reply(200, {
            results: [CONTRACT_RESULT], "links": {"next": null}
        });

        const matcher2 = "/api/v1/contracts/" + CONTRACT_RESULT.contract_id + "/results/" + CONTRACT_RESULT.timestamp
        mock.onGet(matcher2).reply(200, CONTRACT_RESULT_DETAILS);

        const matcher3 = sourcifyURL + "v2/contract/295/" + CONTRACT_RESULT.address + "?fields=metadata,sources"
        mock.onGet(matcher3).reply(200, SOURCIFY_RESPONSE);

        // 1) new
        const transaction = ref<Transaction|null>(null)
        const analyzer = new ContractResultAnalyzer(transaction)
        expect(analyzer.transaction.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.transaction.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) setup transaction
        transaction.value = CONTRACT_TRANSACTION as any
        await flushPromises()
        expect(analyzer.transaction.value).toStrictEqual(CONTRACT_TRANSACTION)
        expect(analyzer.fromId.value).toBe("0.0.5939756")
        expect(analyzer.toId.value).toBe(CONTRACT_RESULT.contract_id)
        expect(analyzer.gasPrice.value).toBe(0)
        expect(analyzer.maxFeePerGas.value).toBe(0x70)
        expect(analyzer.maxPriorityFeePerGas.value).toBe(0)
        expect(analyzer.ethereumNonce.value).toBe(97)
        expect(analyzer.contractType.value).toBe("Post-Eip1559")
        expect(analyzer.contractResult.value).toStrictEqual(CONTRACT_RESULT_DETAILS)
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBe("0x5d123e3f")
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)
        // expect(analyzer.functionCallAnalyzer.signature.value).toBe("forwardDepositToICHIVault(address,address,address,uint256,uint256,address)")

        // 4) unmount
        analyzer.unmount()
        expect(analyzer.transaction.value).toStrictEqual(CONTRACT_TRANSACTION)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 5) check history
        // console.log(JSON.stringify(fetchGetURLs(mock), null, "  "))
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results",
            "api/v1/contracts/0.0.6810663/results/1704186823.658538003",
            "api/v1/contracts/0.0.6810663",
            sourcifyURL + "v2/contract/295/" + CONTRACT_RESULT.address + "?fields=metadata,sources",
        ])

        mock.restore()
        await flushPromises()
    })

    test("new + setup + mount + unmount", async () => {

        const sourcifyURL = routeManager.currentNetworkEntry.value.sourcifySetup?.repoURL

        const mock = new MockAdapter(axios as any);

        const matcher0 = "/api/v1/contracts/" + CONTRACT_RESULT.contract_id
        mock.onGet(matcher0).reply(200, CONTRACT);

        const matcher1 = "/api/v1/contracts/results"
        const param1 = {timestamp: CONTRACT_RESULT.timestamp, internal: true, limit: 1}
        mock.onGet(matcher1, {params: param1}).reply(200, {
            results: [CONTRACT_RESULT], "links": {"next": null}
        });

        const matcher2 = "/api/v1/contracts/" + CONTRACT_RESULT.contract_id + "/results/" + CONTRACT_RESULT.timestamp
        mock.onGet(matcher2).reply(200, CONTRACT_RESULT_DETAILS);

        const matcher3 = sourcifyURL + "v2/contract/295/" + CONTRACT_RESULT.address + "?fields=metadata,sources"
        mock.onGet(matcher3).reply(200, SOURCIFY_RESPONSE);

        // 1) new
        const transaction = ref<Transaction|null>(null)
        const analyzer = new ContractResultAnalyzer(transaction)
        expect(analyzer.transaction.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) setup timestamp
        transaction.value = CONTRACT_TRANSACTION as any
        await flushPromises()
        expect(analyzer.transaction.value).toStrictEqual(CONTRACT_TRANSACTION)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) mount
        analyzer.mount()
        await flushPromises()
        expect(analyzer.transaction.value).toStrictEqual(CONTRACT_TRANSACTION)
        expect(analyzer.fromId.value).toBe("0.0.5939756")
        expect(analyzer.toId.value).toBe(CONTRACT_RESULT.contract_id)
        expect(analyzer.gasPrice.value).toBe(0)
        expect(analyzer.maxFeePerGas.value).toBe(0x70)
        expect(analyzer.maxPriorityFeePerGas.value).toBe(0)
        expect(analyzer.ethereumNonce.value).toBe(97)
        expect(analyzer.contractType.value).toBe("Post-Eip1559")
        expect(analyzer.contractResult.value).toStrictEqual(CONTRACT_RESULT_DETAILS)
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBe("0x5d123e3f")
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)
        // expect(analyzer.functionCallAnalyzer.signature.value).toBe("forwardDepositToICHIVault(address,address,address,uint256,uint256,address)")

        // 4) unmount
        analyzer.unmount()
        expect(analyzer.transaction.value).toStrictEqual(CONTRACT_TRANSACTION)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 5) check history
        // console.log(JSON.stringify(fetchGetURLs(mock), null, "  "))
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results",
            "api/v1/contracts/" + CONTRACT_RESULT.contract_id + "/results/1704186823.658538003",
            "api/v1/contracts/" + CONTRACT_RESULT.contract_id,
            sourcifyURL + "v2/contract/295/" + CONTRACT_RESULT.address + "?fields=metadata,sources",
        ])

        mock.restore()
        await flushPromises()
    })

    test("new + setup with HTS result + mount + unmount", async () => {

        const mock = new MockAdapter(axios as any);

        const matcher1 = "/api/v1/contracts/results"
        const param1 = {timestamp: CONTRACT_RESULT_HTS.timestamp, internal: true, limit: 1}
        mock.onGet(matcher1, {params: param1}).reply(200, {
            results: [CONTRACT_RESULT_HTS], "links": {"next": null}
        });

        const matcher2 = "/api/v1/contracts/results/" + CONTRACT_RESULT_HTS.hash
        mock.onGet(matcher2).reply(200, CONTRACT_RESULT_DETAILS_HTS);

        // We also setup valid 4byte matcher to be sure it is ignored by ContractResultAnalyzer.
        const functionHash = "0x49146bde"
        const matcher4 = "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=" + functionHash
        mock.onGet(matcher4).reply(200, BYTES4_RESPONSE)

        // 1) new
        const transaction = ref<Transaction|null>(null)
        const analyzer = new ContractResultAnalyzer(transaction)
        expect(analyzer.transaction.value).toBeNull()
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) setup transaction
        transaction.value = CONTRACT_TRANSACTION_HTS as any
        await flushPromises()
        expect(analyzer.transaction.value).toStrictEqual(CONTRACT_TRANSACTION_HTS)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) mount
        analyzer.mount()
        await flushPromises()
        await vi.dynamicImportSettled()
        expect(analyzer.transaction.value).toStrictEqual(CONTRACT_TRANSACTION_HTS)
        expect(analyzer.fromId.value).toBe("0.0.1584")
        expect(analyzer.toId.value).toBe("0.0.359")
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toStrictEqual(CONTRACT_RESULT_DETAILS_HTS)
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBe("0x49146bde")
        expect(analyzer.functionCallAnalyzer.signature.value).toBe("function associateToken(address account, address token) returns (int64 responseCode)")
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 4) unmount
        analyzer.unmount()
        expect(analyzer.transaction.value).toStrictEqual(CONTRACT_TRANSACTION_HTS)
        expect(analyzer.fromId.value).toBeNull()
        expect(analyzer.toId.value).toBeNull()
        expect(analyzer.gasPrice.value).toBeNull()
        expect(analyzer.maxFeePerGas.value).toBeNull()
        expect(analyzer.maxPriorityFeePerGas.value).toBeNull()
        expect(analyzer.ethereumNonce.value).toBeNull()
        expect(analyzer.contractType.value).toBeNull()
        expect(analyzer.contractResult.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.functionHash.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.signature.value).toBeNull()
        expect(analyzer.functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 5) check history
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/results",
            "api/v1/contracts/results/0x4f0887dcc3c3f23ce2e80a2e3c3bfa246d488698d5e0cc17c76ef13262580d73",
        ])

        mock.restore()
        await flushPromises()
    })

})

const CONTRACT = {
    admin_key: null,
    auto_renew_account: null,
    auto_renew_period: null,
    contract_id: "0.0.6810663",
    created_timestamp: "1704186823.658538003",
    deleted: false,
    evm_address: "0x06a50d1f642ca50284efb59988af9b60683fad3f",
    expiration_timestamp: null,
    file_id: null,
    max_automatic_token_associations: null,
    memo: "0x",
    nonce: 0,
    obtainer_id: null,
    permanent_removal: null,
    proxy_account_id: null,
    timestamp: {},
    bytecode: null,
    runtime_bytecode: null
}

export const CONTRACT_TRANSACTION = {
    "bytes": null,
    "charged_tx_fee": 470065,
    "consensus_timestamp": "1704186823.658538003",
    "entity_id": null,
    "high_volume": false,
    "max_fee": "100000000",
    "memo_base64": "",
    "name": "CONTRACTCALL",
    "nft_transfers": [],
    "node": "0.0.5",
    "nonce": 0,
    "parent_consensus_timestamp": null,
    "result": "SUCCESS",
    "scheduled": false,
    "staking_reward_transfers": [],
    "token_transfers": [],
    "transaction_hash": "oBKWEjLtfShCg26V9+nENW/f4t4IGZCRcBqWnB0f2TZx0weO6Dso+0YKiLTL2OzS",
    "transaction_id": "0.0.29624024-1646025139-152901498",
    "transfers": [
        {
            "account": "0.0.4",
            "amount": 22028
        },
        {
            "account": "0.0.98",
            "amount": 448037
        },
        {
            "account": "0.0.29624024",
            "amount": -470065
        }
    ],
    "valid_duration_seconds": "120",
    "valid_start_timestamp": "1646025139.152901498",
}


const CONTRACT_RESULT = {
    "address": "0x06a50d1f642ca50284efb59988af9b60683fad3f",
    "amount": 0,
    "bloom": "0x0000000000000000000000000400000000000010000000000000000000000000000000000000000000004000000000000000002000000000020008004020000000000000000000000000000c0040000000010000000000000000000200000000000000000200000000000000000008000000004000040000000000100000000000000000000010000000000000000000000200000000000000002000a0000002032000000400000000000000001000000100000000000000040000000000000000040002001000000004000000000000000000000400000000000000000020000810080000000010000000010000000000000060001000890000000000000000",
    "call_result": "0x00000000000000000000000000000000000000000000000000000000000f4241",
    "contract_id": "0.0.6810663",
    "created_contract_ids": [],
    "error_message": null,
    "from": "0x00000000000000000000000000000000005aa22c",
    "function_parameters": "0x5d123e3f00000000000000000000000038959093ea3e1c60775329139fd9d34cac3273df000000000000000000000000ec7428cb95cd92e7556172ffbe735c6d48f6deb7000000000000000000000000000000000000000000000000000000000000ef5200000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000100000000000000000000000011111d16485aa71d2f2bffbd294dcacbae79c1d4",
    "gas_limit": 973971,
    "gas_used": 919261,
    "timestamp": "1704186823.658538003",
    "to": "0x06a50d1f642ca50284efb59988af9b60683fad3f",
    "hash": "0x69aa5c083fe35bc40f1bc48eb38a703faa8a6b5ec7934c77c9d5b907d5d24dab",
    "block_hash": "0x43b1928491211314186108854ea534de99c92be21a98ff576fe52049858178f52323e47f452171f9228522c6773b76c9",
    "block_number": 6664267,
    "result": "SUCCESS",
    "transaction_index": 32,
    "status": "0x1",
    "failed_initcode": null,
    "access_list": "0x",
    "block_gas_used": 919261,
    "chain_id": "0x128",
    "gas_price": "0x",
    "max_fee_per_gas": "0x70",
    "max_priority_fee_per_gas": "0x",
    "r": "0x244816583622650d4863daa674cf823b9d047ff855d968cbeac59fb254bdf5b6",
    "s": "0x72daf565dc27a4948897eb45272f1c9a7e377f7b1a2a5c6713b0734c5d4b6fe7",
    "type": 2,
    "v": 1,
    "nonce": 97
}

const CONTRACT_RESULT_DETAILS = {
    "address": "0x06a50d1f642ca50284efb59988af9b60683fad3f",
    "amount": 0,
    "bloom": "0x0000000000000000000000000400000000000010000000000000000000000000000000000000000000004000000000000000002000000000020008004020000000000000000000000000000c0040000000010000000000000000000200000000000000000200000000000000000008000000004000040000000000100000000000000000000010000000000000000000000200000000000000002000a0000002032000000400000000000000001000000100000000000000040000000000000000040002001000000004000000000000000000000400000000000000000020000810080000000010000000010000000000000060001000890000000000000000",
    "call_result": "0x00000000000000000000000000000000000000000000000000000000000f4241",
    "contract_id": "0.0.6810663",
    "created_contract_ids": [],
    "error_message": null,
    "from": "0x00000000000000000000000000000000005aa22c",
    "function_parameters": "0x5d123e3f00000000000000000000000038959093ea3e1c60775329139fd9d34cac3273df000000000000000000000000ec7428cb95cd92e7556172ffbe735c6d48f6deb7000000000000000000000000000000000000000000000000000000000000ef5200000000000000000000000000000000000000000000000000000000000f4240000000000000000000000000000000000000000000000000000000000000000100000000000000000000000011111d16485aa71d2f2bffbd294dcacbae79c1d4",
    "gas_limit": 973971,
    "gas_used": 919261,
    "timestamp": "1704186823.658538003",
    "to": "0x06a50d1f642ca50284efb59988af9b60683fad3f",
    "hash": "0x69aa5c083fe35bc40f1bc48eb38a703faa8a6b5ec7934c77c9d5b907d5d24dab",
    "block_hash": "0x43b1928491211314186108854ea534de99c92be21a98ff576fe52049858178f52323e47f452171f9228522c6773b76c9",
    "block_number": 6664267,
    "logs": [
        {
            "address": "0x000000000000000000000000000000000000ef52",
            "bloom": "0x00000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000008004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000010000000400000000000000001000000000000000000000040000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000800000000000000000",
            "contract_id": "0.0.61266",
            "data": "0x00000000000000000000000000000000000000000000000000000000000f4240",
            "index": 0,
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x00000000000000000000000011111d16485aa71d2f2bffbd294dcacbae79c1d4",
                "0x00000000000000000000000006a50d1f642ca50284efb59988af9b60683fad3f"
            ]
        },
        {
            "address": "0x000000000000000000000000000000000000ef52",
            "bloom": "0x00000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000004004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000030000000000000000000000001000000000000000000000040000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000040001000000000000000000000",
            "contract_id": "0.0.61266",
            "data": "0x00000000000000000000000000000000000000000000000000000000000f4240",
            "index": 1,
            "topics": [
                "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
                "0x00000000000000000000000006a50d1f642ca50284efb59988af9b60683fad3f",
                "0x00000000000000000000000038959093ea3e1c60775329139fd9d34cac3273df"
            ]
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "bloom": "0x00000000000000000000000004000000000000000000000000000000000000000000000000000000000040000000000000000000000000000200000000000000000000000000000000000004000000000000000000000000000000020000000000000000000000000000000000000000000000400004000000000000000000000000000000000000000000000000000000000000000000000000200080000002002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000800080000000000000000000000000000000040000000000000000000000000",
            "contract_id": "0.0.3254494",
            "data": "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "index": 2,
            "topics": [
                "0x0c396cd989a39f4459b5fa1aed6a9a8dcdbc45908acfd67e028cd568da98982c",
                "0x00000000000000000000000038959093ea3e1c60775329139fd9d34cac3273df",
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6c58",
                "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8044"
            ]
        },
        {
            "address": "0x000000000000000000000000000000000000ef52",
            "bloom": "0x0000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c004000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000080000000010000000000000000000000001000000000000000000000040000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040001000000000000000000000",
            "contract_id": "0.0.61266",
            "data": "0x00000000000000000000000000000000000000000000000000000000000f4240",
            "index": 3,
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x00000000000000000000000006a50d1f642ca50284efb59988af9b60683fad3f",
                "0x00000000000000000000000038959093ea3e1c60775329139fd9d34cac3273df"
            ]
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "bloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000020000000000000000000800000000000000000000000010000000000000000000001000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000002001000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000810000000000000000",
            "contract_id": "0.0.6771336",
            "data": "0x00000000000000000000000000000000000000000000000000000000000f4241",
            "index": 4,
            "topics": [
                "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
                "0x0000000000000000000000000000000000000000000000000000000000000000",
                "0x00000000000000000000000011111d16485aa71d2f2bffbd294dcacbae79c1d4"
            ]
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "bloom": "0x00000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000010000000400000000000000001000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000890000000000000000",
            "contract_id": "0.0.6771336",
            "data": "0x00000000000000000000000000000000000000000000000000000000000f4241000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f4240",
            "index": 5,
            "topics": [
                "0x4e2ca0515ed1aef1395f66b5303bb5d6f1bf9d61a353fa53f73f8ac9973fa9f6",
                "0x00000000000000000000000006a50d1f642ca50284efb59988af9b60683fad3f",
                "0x00000000000000000000000011111d16485aa71d2f2bffbd294dcacbae79c1d4"
            ]
        },
        {
            "address": "0x06a50d1f642ca50284efb59988af9b60683fad3f",
            "bloom": "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000400000000000000000000000000000040000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000200000000000000000000a0000000000000000400000000000000000000000100000000000000000000000000000000040000000000000004000000000000000000000000000000000000000000000000000000000000000000010000000000000060000000800000000000000000",
            "contract_id": "0.0.6810663",
            "data": "0x00000000000000000000000000000000000000000000000000000000000f424000000000000000000000000000000000000000000000000000000000000f424100000000000000000000000011111d16485aa71d2f2bffbd294dcacbae79c1d4",
            "index": 6,
            "topics": [
                "0x425e9f077f9db249ef795bd139f30608e86b0b6c06f049e167ddee551b8c891d",
                "0x00000000000000000000000011111d16485aa71d2f2bffbd294dcacbae79c1d4",
                "0x00000000000000000000000038959093ea3e1c60775329139fd9d34cac3273df",
                "0x000000000000000000000000000000000000000000000000000000000000ef52"
            ]
        }
    ],
    "result": "SUCCESS",
    "transaction_index": 32,
    "state_changes": [
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_read": "0x000100fde8fde801a4ff8060000000000000000031fb96e9e13467e9e5548dfb",
            "value_written": "0x000100fde8fde801a4ff8060000000000000000031fb96e9e13467e9e5548dfb"
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_read": "0x000000000000000000000000000000000cc86785795e1031cf72138dfadb9e5d",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x00000000000000000000000000000000000000000000000000000000000001ac",
            "value_read": "0x01000000000002e968c43ae5fd0c6d86843853ad8dffffdfd5fefd2e65731370",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000002",
            "value_read": "0x000000000000000000000000000000003b25d66f581c00e9f0b2349fd00d38f9",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000004",
            "value_read": "0x000000000000000000000000000000000000000000000000000284ed79825e12",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x1c914ed718265c899f44544dd01356b650c80b53c8ecb162fa67eca68df73d93",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x1c914ed718265c899f44544dd01356b650c80b53c8ecb162fa67eca68df73d94",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x1c914ed718265c899f44544dd01356b650c80b53c8ecb162fa67eca68df73d95",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x1c914ed718265c899f44544dd01356b650c80b53c8ecb162fa67eca68df73d96",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x369d5d979f436e2382b180f6f0da2be5ff0676cf6f9c6805d1aecf790d7eb511",
            "value_read": "0x000000000000000000000000000000000cc8659a80d8f0af4f150213bd3e2914",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x369d5d979f436e2382b180f6f0da2be5ff0676cf6f9c6805d1aecf790d7eb512",
            "value_read": "0x000000000000000000000000000000003b25d66efb1360c5a6b3460b5a24cacb",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x72247958777e9001cf848cba2cd51acdfabd9f39522a4a49eaccf96d20997ea2",
            "value_read": "0x00000000000000000000000000000000046597def955750e3ca0827aef2addd1",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0x72247958777e9001cf848cba2cd51acdfabd9f39522a4a49eaccf96d20997ea3",
            "value_read": "0x00000000000000000000000000000000000cd871a89cb3c0f0cb21f71980bc0c",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0xdc791415443121c02eb0feb9ec2877c92f465d0cdd5fa54a20fe8522614aa7e1",
            "value_read": "0x00000000000000000000000000000000000000000000000000000000015bb8af",
            "value_written": null
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0xdc791415443121c02eb0feb9ec2877c92f465d0cdd5fa54a20fe8522614aa7e2",
            "value_read": "0xfffffffffffffffffffffffffffffffff79d3244787c845eed8b806731ecb4bd",
            "value_written": "0xfffffffffffffffffffffffffffffffff79d3244787c845eed8b806731ecb4bd"
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0xdc791415443121c02eb0feb9ec2877c92f465d0cdd5fa54a20fe8522614aa7e3",
            "value_read": "0xffffffffffffffffffffffffffffffffc4e70202ad8952fb4a17dbebbf5bf141",
            "value_written": "0xffffffffffffffffffffffffffffffffc4e70202ad8952fb4a17dbebbf5bf141"
        },
        {
            "address": "0x3a33d4eacd091da4865b114fca92970e100b727f",
            "contract_id": "0.0.3254494",
            "slot": "0xdc791415443121c02eb0feb9ec2877c92f465d0cdd5fa54a20fe8522614aa7e4",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        },
        {
            "address": "0x3319a941c8cfe43a75632340c0b97bbd7900c83c",
            "contract_id": "0.0.6771308",
            "slot": "0xfa9131dea752d9c89be0b258c816e8928dc4bd5a4c0471157c40abba070955c4",
            "value_read": "0x00000000000000000000000038959093ea3e1c60775329139fd9d34cac3273df",
            "value_written": null
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000002",
            "value_read": "0x00000000000000000000000000000000000000000000000000000000000f4240",
            "value_written": "0x00000000000000000000000000000000000000000000000000000000001e8481"
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000006",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_written": "0x0000000000000000000000000000000000000000000000000000000000000001"
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000009",
            "value_read": "0xff8044ff6c580d89b4ff80441a2db660678a07c2b0bc34d9f52a5cced6f353ec",
            "value_written": null
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x000000000000000000000000000000000000000000000000000000000000000a",
            "value_read": "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            "value_written": null
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x000000000000000000000000000000000000000000000000000000000000000b",
            "value_read": "0x00000000000000000000000000000000000000000000000000005af3107a4000",
            "value_written": null
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x000000000000000000000000000000000000000000000000000000000000000c",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_written": null
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x000000000000000000000000000000000000000000000000000000000000000d",
            "value_read": "0x0000000000000000000000000000000000000000000000000011c37937e08000",
            "value_written": null
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x000000000000000000000000000000000000000000000000000000000000000e",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000708",
            "value_written": null
        },
        {
            "address": "0x38959093ea3e1c60775329139fd9d34cac3273df",
            "contract_id": "0.0.6771336",
            "slot": "0x6871481630456d71be1283f8676c6810fdcef41303b207eb4bf7b8c64e3ee37f",
            "value_read": "0x00000000000000000000000000000000000000000000000000000000000f4240",
            "value_written": "0x00000000000000000000000000000000000000000000000000000000001e8481"
        },
        {
            "address": "0x06a50d1f642ca50284efb59988af9b60683fad3f",
            "contract_id": "0.0.6810663",
            "slot": "0x0000000000000000000000000000000000000000000000000000000000000000",
            "value_read": "0x0000000000000000000000000000000000000000000000000000000000000001",
            "value_written": "0x0000000000000000000000000000000000000000000000000000000000000001"
        }
    ],
    "status": "0x1",
    "failed_initcode": null,
    "access_list": "0x",
    "block_gas_used": 919261,
    "chain_id": "0x128",
    "gas_price": "0x",
    "max_fee_per_gas": "0x70",
    "max_priority_fee_per_gas": "0x",
    "r": "0x244816583622650d4863daa674cf823b9d047ff855d968cbeac59fb254bdf5b6",
    "s": "0x72daf565dc27a4948897eb45272f1c9a7e377f7b1a2a5c6713b0734c5d4b6fe7",
    "type": 2,
    "v": 1,
    "nonce": 97
}

const SOURCIFY_RESPONSE = {
    "metadata": {
        "compiler": {
            "version": "0.6.12+commit.27d51765"
        },
        "language": "Solidity",
        "output": {
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_factory",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_WHBAR",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint64",
                            "name": "value",
                            "type": "uint64"
                        }
                    ],
                    "name": "Approve",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint64",
                            "name": "value",
                            "type": "uint64"
                        }
                    ],
                    "name": "Transfer",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "WHBAR",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "tokenA",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "tokenB",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountADesired",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountBDesired",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountAMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountBMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "addLiquidity",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountA",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountB",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "liquidity",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountTokenDesired",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountTokenMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountETHMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "addLiquidityETH",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountToken",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountETH",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "liquidity",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountTokenDesired",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountTokenMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountETHMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "addLiquidityETHNewPool",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountToken",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountETH",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "liquidity",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "tokenA",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "tokenB",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountADesired",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountBDesired",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountAMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountBMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "addLiquidityNewPool",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountA",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountB",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "liquidity",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "factory",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountOut",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reserveIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reserveOut",
                            "type": "uint256"
                        }
                    ],
                    "name": "getAmountIn",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reserveIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reserveOut",
                            "type": "uint256"
                        }
                    ],
                    "name": "getAmountOut",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountOut",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountOut",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        }
                    ],
                    "name": "getAmountsIn",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        }
                    ],
                    "name": "getAmountsOut",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountA",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reserveA",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "reserveB",
                            "type": "uint256"
                        }
                    ],
                    "name": "quote",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountB",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "pure",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "tokenA",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "tokenB",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "liquidity",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountAMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountBMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "removeLiquidity",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountA",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountB",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "liquidity",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountTokenMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountETHMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "removeLiquidityETH",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountToken",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountETH",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "liquidity",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountTokenMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountETHMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "removeLiquidityETHSupportingFeeOnTransferTokens",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountETH",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountOut",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapETHForExactTokens",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountOutMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapExactETHForTokens",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountOutMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapExactETHForTokensSupportingFeeOnTransferTokens",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOutMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapExactTokensForETH",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOutMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapExactTokensForETHSupportingFeeOnTransferTokens",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOutMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapExactTokensForTokens",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountIn",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountOutMin",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapExactTokensForTokensSupportingFeeOnTransferTokens",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountOut",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountInMax",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapTokensForExactETH",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "amountOut",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amountInMax",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address[]",
                            "name": "path",
                            "type": "address[]"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "deadline",
                            "type": "uint256"
                        }
                    ],
                    "name": "swapTokensForExactTokens",
                    "outputs": [
                        {
                            "internalType": "uint256[]",
                            "name": "amounts",
                            "type": "uint256[]"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tinycents",
                            "type": "uint256"
                        }
                    ],
                    "name": "tinycentsToTinybars",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "tinybars",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "whbar",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ],
            "devdoc": {
                "kind": "dev",
                "methods": {},
                "version": 1
            },
            "userdoc": {
                "kind": "user",
                "methods": {},
                "version": 1
            }
        },
        "settings": {
            "compilationTarget": {
                "project:/contracts/UniswapV2Router02.sol": "UniswapV2Router02"
            },
            "evmVersion": "istanbul",
            "libraries": {},
            "metadata": {
                "bytecodeHash": "ipfs"
            },
            "optimizer": {
                "enabled": true,
                "runs": 99
            },
            "remappings": []
        },
        "sources": {
            "project:/contracts/UniswapV2Router02.sol": {
                "keccak256": "0x4c9696d90dc1868c2372b461da86299941ff63594185a80fc7213a118b0ff51c",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://09fa4a34ee11005991e26255f95d594c7cd0e837d9b3ca75e1035cc91e2421ad",
                    "dweb:/ipfs/QmbKThD454CAvKewSsH2JE8ho1ogqhCvTf7HNZfo7FJ488"
                ]
            },
            "project:/contracts/hedera/HederaResponseCodes.sol": {
                "keccak256": "0x1cc4283cc20d6c832d3ed47c7d66cad5217a0948b0a1b76d124fe14892e7fef7",
                "license": "Apache-2.0",
                "urls": [
                    "bzz-raw://0cf17ce1eccb9b22d0c6a732208b8eb28e0f764ee3f7031e982ffb0a07c1063b",
                    "dweb:/ipfs/QmZ5mTWxbeBxbdqGBdUTS2fAQVqdHcY3itYQK15c4eFS21"
                ]
            },
            "project:/contracts/hedera/HederaTokenService.sol": {
                "keccak256": "0xfcf0c3f4e5963264c924932c3fcb0e45d621349fda664dd5eb604afd84bf1865",
                "license": "Apache-2.0",
                "urls": [
                    "bzz-raw://107952e5ad3d1054af826afa036af4d3ed9af011052911cbca36c15a9f95b28f",
                    "dweb:/ipfs/QmSmvzHbF14SwmPctYXK5zSDKK5MQcAbE7d9HsdxdLS73Q"
                ]
            },
            "project:/contracts/hedera/IExchangeRate.sol": {
                "keccak256": "0x353bc13da787da098536f9d2b88e6994135dcfa61bc3b052e2fb68a6dd53208e",
                "license": "Apache-2.0",
                "urls": [
                    "bzz-raw://1712188ee464769d4632e81eb93043a1cda0d97c627cff56d2b4c945b0127db6",
                    "dweb:/ipfs/QmTuhCnhtNdKjdYfsjLADky11Quw6MDqsV7wJ4vD4S87Gj"
                ]
            },
            "project:/contracts/hedera/IHederaTokenService.sol": {
                "keccak256": "0x890fe15d7269eee82d48d9ab2984b4b1f9b6e4c67932e98e884a3b1aa7863411",
                "license": "Apache-2.0",
                "urls": [
                    "bzz-raw://e0c6edd045522d5d0bfe1395b3f5515ee2b88e2d2cdb69d6fd0b844e32bd5502",
                    "dweb:/ipfs/QmRs7KpK32X7nXkiYUk26MUVvNhhNhbYpr4f7xKic75vfD"
                ]
            },
            "project:/contracts/hedera/SafeHederaTokenService.sol": {
                "keccak256": "0x2d60977667c7e6118f915090e870ee0bfa767e5c02972befcdc9c3a731ae4197",
                "license": "Apache-2.0",
                "urls": [
                    "bzz-raw://5c899b2ba6b18c59cb229357959fa83d7d4e127310434d37d1e7d2c44bb8d44b",
                    "dweb:/ipfs/QmUBNxGf51WixyGNbzHrz7idJQCjCmuJDaMCwmwrFLqGMf"
                ]
            },
            "project:/contracts/interfaces/IERC20.sol": {
                "keccak256": "0x5023e3bc1e2a2827721d26c02c265856d8918058995817c4f0d065267db2ca55",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://c3618188ff4cad3cc7dac381e9969182372971a3ee97b73411ab89923bdfbfe2",
                    "dweb:/ipfs/QmPwh1D6jugaE4JTvajfH5SXoEFynbcwGUM9VdnW6gaWg8"
                ]
            },
            "project:/contracts/interfaces/IUniswapV2Factory.sol": {
                "keccak256": "0x78118ad2334fb94be47798d43d7afe27628559bb8e21a04e5b021eb14d1e0f77",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://4c6b660602fc758d8483df93381f796fc935ac059b518a543aca59065e80c9b7",
                    "dweb:/ipfs/QmZYiuKdDUabD3ZMZ7WTtRuKdVS2T19Qi52gFzAg7gUvTg"
                ]
            },
            "project:/contracts/interfaces/IUniswapV2Pair.sol": {
                "keccak256": "0xf2f6f46f2471cdf555583c0c2ce1e54c535d2dbcbc3dfc2cd1d14b31c925d8ec",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://a4400ea17a9f9442597d0477d2073bea485a74a67e295cf9d0de5ed2d5d39806",
                    "dweb:/ipfs/QmSvuJzt7A91j2RYht5cnRQX1myHyChYsmHVTFPi38ZwHW"
                ]
            },
            "project:/contracts/interfaces/IUniswapV2Router01.sol": {
                "keccak256": "0x597f254cb8324c788d8038649fd7fef11984adbb0238f2f4d940f2156dbde763",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://f23d33d41fe8397b05c8e5a309017db2219d78fe74df05ff6a213dd713991fc6",
                    "dweb:/ipfs/QmaPaJRH1qWEJ7dzqM4BJQ93Xdysjjxgh2HktNu65SiqzN"
                ]
            },
            "project:/contracts/interfaces/IUniswapV2Router02.sol": {
                "keccak256": "0xe9cc61b753e42d0f550efde8402d2e0e8b9436ed2e790313d36cdaca84ce7cf1",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://cd9441a0859b2bdc124b37d3344c1012f86584e7ab7d7da665d4eed7afefe3fc",
                    "dweb:/ipfs/QmXDm8AYncrUQL17iZjmQs5TSgZ6aYuEua5F919MrcuRHn"
                ]
            },
            "project:/contracts/interfaces/IWHBAR.sol": {
                "keccak256": "0x0a1899299272081d044a5e7747e6bb008772ece32864dc22b6c8b7d29b13b2ce",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://849230242ca57c1dea6c721a39d985bf229818ff50d4f7a236cc066d8e09c67a",
                    "dweb:/ipfs/QmSwpE7DRP8RhJmWsjz2A9HKXVgcwSrEbfxGJqxqcnASBp"
                ]
            },
            "project:/contracts/libraries/SafeCast.sol": {
                "keccak256": "0x2c45b11375671f94917b89564bf0fed52aece58625badb0599defed18820b4ad",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://27d51bba8ba8e32f4420d06a770b0812176e868c61ff366bd439d7caa4d8343c",
                    "dweb:/ipfs/QmPVMBfVrgJVLF2buy2qyKeDH1DbVEUeDHbUPUNjGfhYrH"
                ]
            },
            "project:/contracts/libraries/SafeMath.sol": {
                "keccak256": "0x97845129a51dbb1869a765595d1c671fa473b97ef800756402afaadc7640a94e",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://5928803fe14654103d3f15b57b5b8df40b98f58cbe4e7044888f092f2462af04",
                    "dweb:/ipfs/QmdnB83EBtNjwoKFHizxsTo6e2ytKN97SCvYnX28p75DCu"
                ]
            },
            "project:/contracts/libraries/TransferHelper.sol": {
                "keccak256": "0x941d6f149dfbe18afb226c31d5f34f8905b7ab119ac6dae01586c5ceee8c45b3",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://51db5f7bb66f597def258cf05b410927c11ec8e57a9fb5bf148f24089fcc0416",
                    "dweb:/ipfs/QmUUm8yfhxtSjFJ8wxPZukT8415iRnUWKtPUSnasXfi9Wg"
                ]
            },
            "project:/contracts/libraries/UniswapV2Library.sol": {
                "keccak256": "0xd08ed3b68bd3ef13314ee0435d566423bf942181b3f574ff952a2bdce7311bca",
                "license": "GPL-3.0",
                "urls": [
                    "bzz-raw://1f8fe8859b744e1f1ce74561847aecb2ac614dc04f402648eebc783cc868602f",
                    "dweb:/ipfs/QmPNjfUnHXXQTftnV9kQCkjUfxKrhqj9z6ujiyWxUt65tJ"
                ]
            }
        },
        "version": 1
    },
    "sources": {
        "project:/contracts/UniswapV2Router02.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity =0.6.12;\n\nimport './interfaces/IUniswapV2Router02.sol';\nimport './interfaces/IUniswapV2Factory.sol';\nimport './libraries/UniswapV2Library.sol';\nimport './libraries/TransferHelper.sol';\nimport './hedera/SafeHederaTokenService.sol';\nimport './libraries/SafeMath.sol';\nimport './interfaces/IERC20.sol';\nimport './interfaces/IWHBAR.sol';\n\ncontract UniswapV2Router02 is IUniswapV2Router02, SafeHederaTokenService {\n    using SafeMath for uint;\n\n    address public immutable override factory;\n    address public immutable override WHBAR; // the contract addr\n    address public immutable override whbar; // the token addr\n\n    modifier ensure(uint deadline) {\n        require(deadline >= block.timestamp, 'UniswapV2Router: EXPIRED');\n        _;\n    }\n\n    constructor(address _factory, address _WHBAR) public {\n        factory = _factory;\n        WHBAR = _WHBAR;\n        address _whbar = IWHBAR(_WHBAR).token();\n        safeAssociateToken(address(this), _whbar);\n        whbar = _whbar;\n    }\n\n    // **** ADD LIQUIDITY ****\n    function _addLiquidity(\n        address tokenA,\n        address tokenB,\n        uint amountADesired,\n        uint amountBDesired,\n        uint amountAMin,\n        uint amountBMin\n    ) internal virtual view returns (uint amountA, uint amountB) {\n        (uint reserveA, uint reserveB) = UniswapV2Library.getReserves(factory, tokenA, tokenB);\n        if (reserveA == 0 && reserveB == 0) {\n            (amountA, amountB) = (amountADesired, amountBDesired);\n        } else {\n            uint amountBOptimal = UniswapV2Library.quote(amountADesired, reserveA, reserveB);\n            if (amountBOptimal <= amountBDesired) {\n                require(amountBOptimal >= amountBMin, 'UniswapV2Router: INSUFFICIENT_B_AMOUNT');\n                (amountA, amountB) = (amountADesired, amountBOptimal);\n            } else {\n                uint amountAOptimal = UniswapV2Library.quote(amountBDesired, reserveB, reserveA);\n                assert(amountAOptimal <= amountADesired);\n                require(amountAOptimal >= amountAMin, 'UniswapV2Router: INSUFFICIENT_A_AMOUNT');\n                (amountA, amountB) = (amountAOptimal, amountBDesired);\n            }\n        }\n    }\n\n    function addLiquidityNewPool(\n        address tokenA,\n        address tokenB,\n        uint amountADesired,\n        uint amountBDesired,\n        uint amountAMin,\n        uint amountBMin,\n        address to,\n        uint deadline\n    ) external virtual payable override ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {\n        \n        require (IUniswapV2Factory(factory).getPair(tokenA, tokenB) == address(0), \"UniswapV2Router: POOL ALREADY EXISTS\");\n        address pair = IUniswapV2Factory(factory).createPair{value: msg.value}(tokenA, tokenB);\n        \n        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);\n\n        safeTransferToken(\n            tokenA, msg.sender, pair, amountA\n        );\n        safeTransferToken(\n            tokenB, msg.sender, pair, amountB\n        );\n        liquidity = IUniswapV2Pair(pair).mint(to);\n    }\n    \n    function addLiquidityETHNewPool(\n        address token,\n        uint amountTokenDesired,\n        uint amountTokenMin,\n        uint amountETHMin,\n        address to,\n        uint deadline\n    ) external virtual payable override ensure(deadline) returns (uint amountToken, uint amountETH, uint liquidity) {\n        require (IUniswapV2Factory(factory).getPair(token, whbar) == address(0), \"UniswapV2Router: POOL ALREADY EXISTS\");\n        uint256 feeInTinybars = tinycentsToTinybars(IUniswapV2Factory(factory).pairCreateFee());\n        require(msg.value > feeInTinybars, 'UniswapV2Router: MSG.VALUE');\n        IUniswapV2Factory(factory).createPair{value: feeInTinybars}(token, whbar);\n\n        (amountToken, amountETH) = _addLiquidity(token, whbar, amountTokenDesired, msg.value - feeInTinybars, amountTokenMin, amountETHMin);\n        address pair = UniswapV2Library.pairFor(factory, token, whbar);\n        \n        safeTransferToken(\n            token, msg.sender, pair, amountToken\n        );\n        IWHBAR(WHBAR).deposit{value: amountETH}(msg.sender, pair);\n        liquidity = IUniswapV2Pair(pair).mint(to);\n        if (msg.value - feeInTinybars > amountETH) TransferHelper.safeTransferETH(msg.sender, msg.value - feeInTinybars - amountETH);\n    }\n    function addLiquidity(\n        address tokenA,\n        address tokenB,\n        uint amountADesired,\n        uint amountBDesired,\n        uint amountAMin,\n        uint amountBMin,\n        address to,\n        uint deadline\n    ) external virtual override ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {\n        address pair = IUniswapV2Factory(factory).getPair(tokenA, tokenB);\n        require(pair != address(0), \"UniswapV2Router: PAIR DOES NOT EXIST\");\n        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);\n        \n        safeTransferToken(\n            tokenA, msg.sender, pair, amountA\n        );\n        safeTransferToken(\n            tokenB, msg.sender, pair, amountB\n        );\n        liquidity = IUniswapV2Pair(pair).mint(to);\n    }\n\n    function addLiquidityETH(\n        address token,\n        uint amountTokenDesired,\n        uint amountTokenMin,\n        uint amountETHMin,\n        address to,\n        uint deadline\n    ) external virtual override payable ensure(deadline) returns (uint amountToken, uint amountETH, uint liquidity) {\n        (amountToken, amountETH) = _addLiquidity(\n            token,\n            whbar,\n            amountTokenDesired,\n            msg.value,\n            amountTokenMin,\n            amountETHMin\n        );\n\n        address pair = IUniswapV2Factory(factory).getPair(token, whbar);\n        require(pair != address(0), \"UniswapV2Router: PAIR DOES NOT EXIST\");\n\n        safeTransferToken(\n            token, msg.sender, pair, amountToken\n        );\n        IWHBAR(WHBAR).deposit{value: amountETH}(msg.sender, pair);\n        liquidity = IUniswapV2Pair(pair).mint(to);\n        // refund dust eth, if any\n        if (msg.value > amountETH) TransferHelper.safeTransferETH(msg.sender, msg.value - amountETH);\n    }\n\n    function removeLiquidity(\n        address tokenA,\n        address tokenB,\n        uint liquidity,\n        uint amountAMin,\n        uint amountBMin,\n        address to,\n        uint deadline\n    ) public virtual override ensure(deadline) returns (uint amountA, uint amountB) {\n        address pair = UniswapV2Library.pairFor(factory, tokenA, tokenB);\n        address lpToken = IUniswapV2Pair(pair).lpToken();\n\n        safeTransferToken(\n            lpToken, msg.sender, pair, liquidity\n        );\n        (uint amount0, uint amount1) = IUniswapV2Pair(pair).burn(to);\n        (address token0,) = UniswapV2Library.sortTokens(tokenA, tokenB);\n        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);\n        require(amountA >= amountAMin, 'UniswapV2Router: INSUFFICIENT_A_AMOUNT');\n        require(amountB >= amountBMin, 'UniswapV2Router: INSUFFICIENT_B_AMOUNT');\n    }\n\n    function removeLiquidityETH(\n        address token,\n        uint liquidity,\n        uint amountTokenMin,\n        uint amountETHMin,\n        address to,\n        uint deadline\n    ) public virtual override ensure(deadline) returns (uint amountToken, uint amountETH) {\n        safeAssociateToken(address(this), token);\n        (amountToken, amountETH) = removeLiquidity( \n            token,\n            whbar, \n            liquidity,\n            amountTokenMin,\n            amountETHMin,\n            address(this), // used to be msg.sender\n            deadline\n        );\n        safeTransferToken(token, address(this), to, amountToken);\n        safeApproveToken(whbar, WHBAR, amountETH);\n        IWHBAR(WHBAR).withdraw(address(this), to, amountETH);\n        safeDissociateToken(address(this), token);\n    }\n\n    function removeLiquidityETHSupportingFeeOnTransferTokens(\n        address token,\n        uint liquidity,\n        uint amountTokenMin,\n        uint amountETHMin,\n        address to,\n        uint deadline\n    ) public virtual override ensure(deadline) returns (uint amountETH) {\n            safeAssociateToken(address(this), token);\n            (, amountETH) = removeLiquidity(\n                token,\n                whbar, \n                liquidity,\n                amountTokenMin,\n                amountETHMin,\n                address(this),\n                deadline\n            );\n            uint256 amountToSend = IERC20(token).balanceOf(address(this));\n            require(amountToSend >= amountTokenMin, 'UniswapV2Router: INSUFFICIENT_A_AMOUNT_FOT'); // second slippage check\n            safeTransferToken(token, address(this), to, amountToSend);\n            safeApproveToken(whbar, WHBAR, amountETH);\n            IWHBAR(WHBAR).withdraw(address(this), to, amountETH);\n            safeDissociateToken(address(this), token);\n    }\n    \n    // **** SWAP ****\n    function _swap(uint[] memory amounts, address[] memory path, address _to) internal virtual {\n        for (uint i; i < path.length - 1; i++) {\n            (address input, address output) = (path[i], path[i + 1]);\n            (address token0,) = UniswapV2Library.sortTokens(input, output);\n            uint amountOut = amounts[i + 1];\n            (uint amount0Out, uint amount1Out) = input == token0 ? (uint(0), amountOut) : (amountOut, uint(0));\n            address to = i < path.length - 2 ? UniswapV2Library.pairFor(factory, output, path[i + 2]) : _to;\n            IUniswapV2Pair(UniswapV2Library.pairFor(factory, input, output)).swap(\n                amount0Out, amount1Out, to, new bytes(0)\n            );\n        }\n    }\n    function swapExactTokensForTokens(\n        uint amountIn,\n        uint amountOutMin,\n        address[] calldata path,\n        address to,\n        uint deadline\n    ) external virtual override ensure(deadline) returns (uint[] memory amounts) {\n        amounts = UniswapV2Library.getAmountsOut(factory, amountIn, path);\n        require(amounts[amounts.length - 1] >= amountOutMin, 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');\n\n        safeTransferToken(\n            path[0], msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]), amounts[0]\n        );\n        _swap(amounts, path, to);\n    }\n    function swapTokensForExactTokens(\n        uint amountOut,\n        uint amountInMax,\n        address[] calldata path,\n        address to,\n        uint deadline\n    ) external virtual override ensure(deadline) returns (uint[] memory amounts) {\n        amounts = UniswapV2Library.getAmountsIn(factory, amountOut, path);\n        require(amounts[0] <= amountInMax, 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT');\n\n        safeTransferToken(\n            path[0], msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]), amounts[0]\n        );\n        _swap(amounts, path, to);\n    }\n \n    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)\n        external\n        virtual\n        override\n        payable\n        ensure(deadline)\n        returns (uint[] memory amounts)\n    {\n        require(path[0] == whbar, 'UniswapV2Router: INVALID_PATH');\n        amounts = UniswapV2Library.getAmountsOut(factory, msg.value, path);\n        require(amounts[amounts.length - 1] >= amountOutMin, 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');\n        IWHBAR(WHBAR).deposit{value: amounts[0]}(msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]));\n        _swap(amounts, path, to);\n    }\n\n    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)\n        external\n        virtual\n        override\n        ensure(deadline)\n        returns (uint[] memory amounts)\n    {\n        require(path[path.length - 1] == whbar, 'UniswapV2Router: INVALID_PATH');\n        amounts = UniswapV2Library.getAmountsIn(factory, amountOut, path);\n        require(amounts[0] <= amountInMax, 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT');\n        safeTransferToken(\n            path[0], msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]), amounts[0]\n        );\n        \n        _swap(amounts, path, address(this));\n        safeApproveToken(whbar, WHBAR, amounts[amounts.length - 1]);       \n        IWHBAR(WHBAR).withdraw(address(this), to, amounts[amounts.length - 1]);\n    }\n    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)\n        external\n        virtual\n        override\n        ensure(deadline)\n        returns (uint[] memory amounts)\n    {\n        require(path[path.length - 1] == whbar, 'UniswapV2Router: INVALID_PATH');\n        amounts = UniswapV2Library.getAmountsOut(factory, amountIn, path);\n        require(amounts[amounts.length - 1] >= amountOutMin, 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');\n\n        safeTransferToken(\n            path[0], msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]), amounts[0]\n        );\n\n        _swap(amounts, path, address(this));   \n        safeApproveToken(whbar, WHBAR, amounts[amounts.length - 1]);  \n        IWHBAR(WHBAR).withdraw(address(this), to, amounts[amounts.length - 1]);\n    }\n\n    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)\n        external\n        virtual\n        override\n        payable\n        ensure(deadline)\n        returns (uint[] memory amounts)\n    {\n        require(path[0] == whbar, 'UniswapV2Router: INVALID_PATH');\n        amounts = UniswapV2Library.getAmountsIn(factory, amountOut, path);\n        require(amounts[0] <= msg.value, 'UniswapV2Router: EXCESSIVE_INPUT_AMOUNT');\n        IWHBAR(WHBAR).deposit{value: amounts[0]}(msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]));\n        _swap(amounts, path, to);\n        // refund dust eth, if any\n        if (msg.value > amounts[0]) TransferHelper.safeTransferETH(msg.sender, msg.value - amounts[0]);\n    }\n\n    function _swapSupportingFeeOnTransferTokens(address[] memory path, address _to) internal virtual {\n        for (uint i; i < path.length - 1; i++) {\n            (address input, address output) = (path[i], path[i + 1]);\n            (address token0,) = UniswapV2Library.sortTokens(input, output);\n            IUniswapV2Pair pair = IUniswapV2Pair(UniswapV2Library.pairFor(factory, input, output));\n            uint amountInput;\n            uint amountOutput;\n            { // scope to avoid stack too deep errors\n            (uint reserve0, uint reserve1,) = pair.getReserves();\n            (uint reserveInput, uint reserveOutput) = input == token0 ? (reserve0, reserve1) : (reserve1, reserve0);\n            amountInput = IERC20(input).balanceOf(address(pair)).sub(reserveInput);\n            amountOutput = UniswapV2Library.getAmountOut(amountInput, reserveInput, reserveOutput);\n            }\n            (uint amount0Out, uint amount1Out) = input == token0 ? (uint(0), amountOutput) : (amountOutput, uint(0));\n            address to = i < path.length - 2 ? UniswapV2Library.pairFor(factory, output, path[i + 2]) : _to;\n            pair.swap(amount0Out, amount1Out, to, new bytes(0));\n        }\n    }\n    function swapExactTokensForTokensSupportingFeeOnTransferTokens(\n        uint amountIn,\n        uint amountOutMin,\n        address[] calldata path,\n        address to,\n        uint deadline\n    ) external virtual override ensure(deadline) {\n        \n        safeTransferToken(\n            path[0], msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]), amountIn\n        );\n        uint balanceBefore = IERC20(path[path.length - 1]).balanceOf(to);\n        _swapSupportingFeeOnTransferTokens(path, to);\n        require(\n            IERC20(path[path.length - 1]).balanceOf(to).sub(balanceBefore) >= amountOutMin,\n            'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT'\n        );\n    }\n    function swapExactETHForTokensSupportingFeeOnTransferTokens(\n        uint amountOutMin,\n        address[] calldata path,\n        address to,\n        uint deadline\n    )\n        external\n        virtual\n        override\n        payable\n        ensure(deadline)\n    {\n        require(path[0] == whbar, 'UniswapV2Router: INVALID_PATH');\n        uint amountIn = msg.value;\n        IWHBAR(WHBAR).deposit{value: amountIn}(msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]));\n        uint balanceBefore = IERC20(path[path.length - 1]).balanceOf(to);\n        _swapSupportingFeeOnTransferTokens(path, to);\n        require(\n            IERC20(path[path.length - 1]).balanceOf(to).sub(balanceBefore) >= amountOutMin,\n            'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT'\n        );\n    }\n    function swapExactTokensForETHSupportingFeeOnTransferTokens(\n        uint amountIn,\n        uint amountOutMin,\n        address[] calldata path,\n        address to,\n        uint deadline\n    )\n        external\n        virtual\n        override\n        ensure(deadline)\n    {\n        require(path[path.length - 1] == whbar, 'UniswapV2Router: INVALID_PATH');\n        uint startAmount = IERC20(whbar).balanceOf(address(this));\n        safeTransferToken(\n            path[0], msg.sender, UniswapV2Library.pairFor(factory, path[0], path[1]), amountIn\n        );\n        _swapSupportingFeeOnTransferTokens(path, address(this));\n        uint endAmount = IERC20(whbar).balanceOf(address(this));\n        uint amountOut = endAmount.sub(startAmount);\n        require(amountOut >= amountOutMin, 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT');\n        safeApproveToken(whbar, WHBAR, amountOut);\n        IWHBAR(WHBAR).withdraw(address(this), to, amountOut);\n    }\n\n    // **** LIBRARY FUNCTIONS ****\n    function quote(uint amountA, uint reserveA, uint reserveB) public pure virtual override returns (uint amountB) {\n        return UniswapV2Library.quote(amountA, reserveA, reserveB);\n    }\n\n    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut)\n        public\n        pure\n        virtual\n        override\n        returns (uint amountOut)\n    {\n        return UniswapV2Library.getAmountOut(amountIn, reserveIn, reserveOut);\n    }\n\n    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut)\n        public\n        pure\n        virtual\n        override\n        returns (uint amountIn)\n    {\n        return UniswapV2Library.getAmountIn(amountOut, reserveIn, reserveOut);\n    }\n\n    function getAmountsOut(uint amountIn, address[] memory path)\n        public\n        view\n        virtual\n        override\n        returns (uint[] memory amounts)\n    {\n        return UniswapV2Library.getAmountsOut(factory, amountIn, path);\n    }\n\n    function getAmountsIn(uint amountOut, address[] memory path)\n        public\n        view\n        virtual\n        override\n        returns (uint[] memory amounts)\n    {\n        return UniswapV2Library.getAmountsIn(factory, amountOut, path);\n    }\n}\n"
        },
        "project:/contracts/interfaces/IERC20.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity >=0.5.0;\n\ninterface IERC20 {\n    event Approval(address indexed owner, address indexed spender, uint value);\n    event Transfer(address indexed from, address indexed to, uint value);\n\n    function name() external view returns (string memory);\n    function symbol() external view returns (string memory);\n    function decimals() external view returns (uint8);\n    function totalSupply() external view returns (uint);\n    function balanceOf(address owner) external view returns (uint);\n    function transfer(address to, uint value) external returns (bool);\n    function transferFrom(address from, address to, uint value) external returns (bool);\n    function approve(address spender, uint256 amount) external returns (bool);\n    function allowance(address owner, address spender) external view returns (uint256);\n\n}\n"
        },
        "project:/contracts/interfaces/IWHBAR.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity >=0.5.0;\n\ninterface IWHBAR {\n    function token() external returns (address);\n    function deposit() external payable;\n    function deposit(address src, address dst) external payable;\n    function withdraw(address src, address dst, uint wad) external;\n    function withdraw(uint wad) external;\n\n    event  Deposit(address indexed dst, uint wad);\n    event  Withdrawal(address indexed src, uint wad);   \n}\n"
        },
        "project:/contracts/libraries/SafeCast.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity =0.6.12;\n\nlibrary SafeCast {\n        \n    function toInt64(uint256 value) internal pure returns (int64) {\n        // Note: Unsafe cast below is okay because `type(int256).max` is guaranteed to be positive\n        require(value <= uint256(type(int64).max), \"SafeCast: value doesn't fit in an int64\");\n        return int64(value);\n    }\n\n    function toUint64(uint256 value) internal pure returns (uint64) {\n        require(value <= type(uint64).max, \"SafeCast: value doesn't fit in 64 bits\");\n        return uint64(value);\n    }\n}"
        },
        "project:/contracts/libraries/SafeMath.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity =0.6.12;\n\n// a library for performing overflow-safe math, courtesy of DappHub (https://github.com/dapphub/ds-math)\n\nlibrary SafeMath {\n    function add(uint x, uint y) internal pure returns (uint z) {\n        require((z = x + y) >= x, 'ds-math-add-overflow');\n    }\n\n    function sub(uint x, uint y) internal pure returns (uint z) {\n        require((z = x - y) <= x, 'ds-math-sub-underflow');\n    }\n\n    function mul(uint x, uint y) internal pure returns (uint z) {\n        require(y == 0 || (z = x * y) / y == x, 'ds-math-mul-overflow');\n    }\n}\n"
        },
        "project:/contracts/hedera/IExchangeRate.sol": {
            "content": "// SPDX-License-Identifier: Apache-2.0\npragma solidity >=0.4.9 <0.9.0;\n\ninterface IExchangeRate {\n    // Given a value in tinycents (1e-8 US cents or 1e-10 USD), returns the \n    // equivalent value in tinybars (1e-8 HBAR) at the current exchange rate \n    // stored in system file 0.0.112. \n    // \n    // This rate is a weighted median of the the recent\" HBAR-USD exchange \n    // rate on major exchanges, but should _not_ be treated as a live price \n    // oracle! It is important primarily because the network will use it to \n    // compute the tinybar fees for the active transaction. \n    // \n    // So a \"self-funding\" contract can use this rate to compute how much \n    // tinybar its users must send to cover the Hedera fees for the transaction.\n    function tinycentsToTinybars(uint256 tinycents) external returns (uint256);\n\n    // Given a value in tinybars (1e-8 HBAR), returns the equivalent value in \n    // tinycents (1e-8 US cents or 1e-10 USD) at the current exchange rate \n    // stored in system file 0.0.112. \n    // \n    // This rate tracks the the HBAR-USD rate on public exchanges, but \n    // should _not_ be treated as a live price oracle! This conversion is\n    // less likely to be needed than the above conversion from tinycent to\n    // tinybars, but we include it for completeness.\n    function tinybarsToTinycents(uint256 tinybars) external returns (uint256);\n}"
        },
        "project:/contracts/libraries/TransferHelper.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\n\npragma solidity >=0.6.0;\n\nlibrary TransferHelper {\n\n    function safeTransferETH(address to, uint value) internal {\n        (bool success,) = to.call{value:value}(new bytes(0));\n        require(success, 'TransferHelper: ETH_TRANSFER_FAILED');\n    }\n}"
        },
        "project:/contracts/hedera/HederaTokenService.sol": {
            "content": "// SPDX-License-Identifier: Apache-2.0\npragma solidity >=0.5.0 <0.9.0;\npragma experimental ABIEncoderV2;\n\nimport \"./HederaResponseCodes.sol\";\nimport \"./IHederaTokenService.sol\";\nimport \"./IExchangeRate.sol\";\n\nabstract contract HederaTokenService is HederaResponseCodes {\n\n    address internal constant precompileAddress = address(0x167);\n    address internal constant exchangeRatePrecompileAddress = address(0x168);\n\n    uint internal constant ADMIN_KEY_TYPE = 1;   \n    uint internal constant KYC_KEY_TYPE = 2;\n    uint internal constant FREEZE_KEY_TYPE = 4;\n    uint internal constant WIPE_KEY_TYPE = 8;\n    uint internal constant SUPPLY_KEY_TYPE = 16;\n    uint internal constant FEE_SCHEDULE_KEY_TYPE = 32;\n    uint internal constant PAUSE_KEY_TYPE = 64;\n    \n    uint256 internal constant TINY_PARTS_PER_WHOLE = 100_000_000;\n    uint32 internal constant DEFAULT_AUTO_RENEW_PERIOD = 7776000;\n\n    modifier nonEmptyExpiry(IHederaTokenService.HederaToken memory token)\n    {\n        if (token.expiry.second == 0 && token.expiry.autoRenewPeriod == 0) {\n            token.expiry.autoRenewPeriod = DEFAULT_AUTO_RENEW_PERIOD;\n        }\n        _;\n    }\n\n    function tinycentsToTinybars(uint256 tinycents) public returns (uint256 tinybars) {\n        (bool success, bytes memory result) = exchangeRatePrecompileAddress.call(\n            abi.encodeWithSelector(IExchangeRate.tinycentsToTinybars.selector, tinycents));\n        require(success, 'TinycentsToTinybars failed!');\n        tinybars = abi.decode(result, (uint256));\n    }\n\n    function tinybarsToTinycents(uint256 tinybars) internal returns (uint256 tinycents) {\n        (bool success, bytes memory result) = exchangeRatePrecompileAddress.call(\n            abi.encodeWithSelector(IExchangeRate.tinybarsToTinycents.selector, tinybars));\n        require(success, 'TinybarsToTinycents failed!');\n        tinycents = abi.decode(result, (uint256));\n    }\n\n    modifier costsTinycents(uint256 tinycents) {\n        uint256 requiredTinybars = tinycentsToTinybars(tinycents);\n        require(msg.value >= requiredTinybars, 'Did not send enough msg.value');\n        _;\n    }\n\n    function createFungibleToken(\n        IHederaTokenService.HederaToken memory token,\n        uint initialTotalSupply,\n        uint decimals) \n    internal nonEmptyExpiry(token) returns (int responseCode, address tokenAddress) {\n\n        (bool success, bytes memory result) = precompileAddress.call{value: msg.value}(\n            abi.encodeWithSelector(IHederaTokenService.createFungibleToken.selector,\n            token, initialTotalSupply, decimals));\n\n        (responseCode, tokenAddress) = success ? abi.decode(result, (int32, address)) : (HederaResponseCodes.UNKNOWN, address(0));\n    }\n\n    // /// Mints an amount of the token to the defined treasury account\n    // /// @param token The token for which to mint tokens. If token does not exist, transaction results in\n    // ///              INVALID_TOKEN_ID\n    // /// @param amount Applicable to tokens of type FUNGIBLE_COMMON. The amount to mint to the Treasury Account.\n    // ///               Amount must be a positive non-zero number represented in the lowest denomination of the\n    // ///               token. The new supply must be lower than 2^63.\n    // /// @param metadata Applicable to tokens of type NON_FUNGIBLE_UNIQUE. A list of metadata that are being created.\n    // ///                 Maximum allowed size of each metadata is 100 bytes\n    // /// @return responseCode The response code for the status of the request. SUCCESS is 22.\n    // /// @return newTotalSupply The new supply of tokens. For NFTs it is the total count of NFTs\n    // /// @return serialNumbers If the token is an NFT the newly generate serial numbers, otherwise empty.\n    function mintToken(address token, uint64 amount, bytes[] memory metadata) internal\n        returns (int responseCode, uint64 newTotalSupply, int64[] memory serialNumbers)\n    {\n        (bool success, bytes memory result) = precompileAddress.call(\n            abi.encodeWithSelector(IHederaTokenService.mintToken.selector,\n            token, amount, metadata));\n        (responseCode, newTotalSupply, serialNumbers) =\n            success\n                ? abi.decode(result, (int32, uint64, int64[]))\n                : (HederaResponseCodes.UNKNOWN, 0, new int64[](0));\n    }\n\n    /// Burns an amount of the token from the defined treasury account\n    /// @param token The token for which to burn tokens. If token does not exist, transaction results in\n    ///              INVALID_TOKEN_ID\n    /// @param amount  Applicable to tokens of type FUNGIBLE_COMMON. The amount to burn from the Treasury Account.\n    ///                Amount must be a positive non-zero number, not bigger than the token balance of the treasury\n    ///                account (0; balance], represented in the lowest denomination.\n    /// @param serialNumbers Applicable to tokens of type NON_FUNGIBLE_UNIQUE. The list of serial numbers to be burned.\n    /// @return responseCode The response code for the status of the request. SUCCESS is 22.\n    /// @return newTotalSupply The new supply of tokens. For NFTs it is the total count of NFTs\n    function burnToken(address token, uint64 amount, int64[] memory serialNumbers) internal\n        returns (int responseCode, uint64 newTotalSupply)\n    {\n        (bool success, bytes memory result) = precompileAddress.call(\n            abi.encodeWithSelector(IHederaTokenService.burnToken.selector,\n            token, amount, serialNumbers));\n        (responseCode, newTotalSupply) =\n            success\n                ? abi.decode(result, (int32, uint64))\n                : (HederaResponseCodes.UNKNOWN, 0);\n    }\n\n    ///  Associates the provided account with the provided tokens. Must be signed by the provided\n    ///  Account's key or called from the accounts contract key\n    ///  If the provided account is not found, the transaction will resolve to INVALID_ACCOUNT_ID.\n    ///  If the provided account has been deleted, the transaction will resolve to ACCOUNT_DELETED.\n    ///  If any of the provided tokens is not found, the transaction will resolve to INVALID_TOKEN_REF.\n    ///  If any of the provided tokens has been deleted, the transaction will resolve to TOKEN_WAS_DELETED.\n    ///  If an association between the provided account and any of the tokens already exists, the\n    ///  transaction will resolve to TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT.\n    ///  If the provided account's associations count exceed the constraint of maximum token associations\n    ///    per account, the transaction will resolve to TOKENS_PER_ACCOUNT_LIMIT_EXCEEDED.\n    ///  On success, associations between the provided account and tokens are made and the account is\n    ///    ready to interact with the tokens.\n    /// @param account The account to be associated with the provided tokens\n    /// @param tokens The tokens to be associated with the provided account. In the case of NON_FUNGIBLE_UNIQUE\n    ///               Type, once an account is associated, it can hold any number of NFTs (serial numbers) of that\n    ///               token type\n    /// @return responseCode The response code for the status of the request. SUCCESS is 22.\n    function associateTokens(address account, address[] memory tokens) internal returns (int responseCode) {\n        (bool success, bytes memory result) = precompileAddress.call(\n            abi.encodeWithSelector(IHederaTokenService.associateTokens.selector,\n            account, tokens));\n        responseCode = success ? abi.decode(result, (int32)) : HederaResponseCodes.UNKNOWN;\n    }\n\n    function associateToken(address account, address token) internal returns (int responseCode) {\n        (bool success, bytes memory result) = precompileAddress.call(\n            abi.encodeWithSelector(IHederaTokenService.associateToken.selector,\n            account, token));\n        responseCode = success ? abi.decode(result, (int32)) : HederaResponseCodes.UNKNOWN;\n    }\n\n    function dissociateToken(address account, address token) internal returns (int responseCode) {\n        (bool success, bytes memory result) = precompileAddress.call(\n            abi.encodeWithSelector(IHederaTokenService.dissociateToken.selector,\n            account, token));\n        responseCode = success ? abi.decode(result, (int32)) : HederaResponseCodes.UNKNOWN;\n    }\n\n    /**********************\n     * ABI v1 calls       *\n     **********************/\n\n    /// Transfers tokens where the calling account/contract is implicitly the first entry in the token transfer list,\n    /// where the amount is the value needed to zero balance the transfers. Regular signing rules apply for sending\n    /// (positive amount) or receiving (negative amount)\n    /// @param token The token to transfer to/from\n    /// @param sender The sender for the transaction\n    /// @param receiver The receiver of the transaction\n    /// @param amount Non-negative value to send. a negative value will result in a failure.\n    function transferToken(address token, address sender, address receiver, int64 amount) internal\n        returns (int responseCode)\n    {\n        (bool success, bytes memory result) = precompileAddress.call(\n            abi.encodeWithSelector(IHederaTokenService.transferToken.selector,\n            token, sender, receiver, amount));\n        responseCode = success ? abi.decode(result, (int32)) : HederaResponseCodes.UNKNOWN;\n    }\n\n    function approve(address token, address spender, int64 amount) internal returns (int responseCode)\n    {\n        (bool success, bytes memory result) = precompileAddress.call(\n            abi.encodeWithSelector(IHederaTokenService.approve.selector,\n            token, spender, amount));\n        responseCode = success ? abi.decode(result, (int32)) : HederaResponseCodes.UNKNOWN;\n    }\n}"
        },
        "project:/contracts/interfaces/IUniswapV2Pair.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity >=0.5.0;\n\ninterface IUniswapV2Pair {\n    event Mint(address indexed sender, uint amount0, uint amount1);\n    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);\n    event Swap(\n        address indexed sender,\n        uint amount0In,\n        uint amount1In,\n        uint amount0Out,\n        uint amount1Out,\n        address indexed to\n    );\n    event Sync(uint112 reserve0, uint112 reserve1);\n\n    function MINIMUM_LIQUIDITY() external pure returns (uint);\n    function factory() external view returns (address);\n    function token0() external view returns (address);\n    function token1() external view returns (address);\n    function lpToken() external view returns (address);\n    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);\n    function price0CumulativeLast() external view returns (uint);\n    function price1CumulativeLast() external view returns (uint);\n    function kLast() external view returns (uint);\n\n    function mint(address to) external returns (uint liquidity);\n    function burn(address to) external returns (uint amount0, uint amount1);\n    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;\n    function skim(address to) external;\n    function sync() external;\n\n    function initialize(address, address) external;\n    function createFungible() external payable returns (address);\n}\n"
        },
        "project:/contracts/hedera/HederaResponseCodes.sol": {
            "content": "// SPDX-License-Identifier: Apache-2.0\npragma solidity =0.6.12;\n\nabstract contract HederaResponseCodes {\n    \n    // response codes - check hedera hashgraph github repo for complete list\n    int32 internal constant UNKNOWN = 21; // The responding node has submitted the transaction to the network. Its final status is still unknown.\n    int32 internal constant SUCCESS = 22; // The transaction succeeded\n\n}"
        },
        "project:/contracts/hedera/IHederaTokenService.sol": {
            "content": "// SPDX-License-Identifier: Apache-2.0\npragma solidity >=0.4.9 <0.9.0;\npragma experimental ABIEncoderV2;\n\ninterface IHederaTokenService {\n\n/// Expiry properties of a Hedera token - second, autoRenewAccount, autoRenewPeriod\n    struct Expiry {\n        // The epoch second at which the token should expire; if an auto-renew account and period are\n        // specified, this is coerced to the current epoch second plus the autoRenewPeriod\n        uint32 second;\n\n        // ID of an account which will be automatically charged to renew the token's expiration, at\n        // autoRenewPeriod interval, expressed as a solidity address\n        address autoRenewAccount;\n\n        // The interval at which the auto-renew account will be charged to extend the token's expiry\n        uint32 autoRenewPeriod;\n    }\n\n    /// A Key can be a public key from either the Ed25519 or ECDSA(secp256k1) signature schemes, where\n    /// in the ECDSA(secp256k1) case we require the 33-byte compressed form of the public key. We call\n    /// these public keys <b>primitive keys</b>.\n    /// A Key can also be the ID of a smart contract instance, which is then authorized to perform any\n    /// precompiled contract action that requires this key to sign.\n    /// Note that when a Key is a smart contract ID, it <i>doesn't</i> mean the contract with that ID\n    /// will actually create a cryptographic signature. It only means that when the contract calls a\n    /// precompiled contract, the resulting \"child transaction\" will be authorized to perform any action\n    /// controlled by the Key.\n    /// Exactly one of the possible values should be populated in order for the Key to be valid.\n    struct KeyValue {\n\n        // if set to true, the key of the calling Hedera account will be inherited as the token key\n        bool inheritAccountKey;\n\n        // smart contract instance that is authorized as if it had signed with a key\n        address contractId;\n\n        // Ed25519 public key bytes\n        bytes ed25519;\n\n        // Compressed ECDSA(secp256k1) public key bytes\n        bytes ECDSA_secp256k1;\n\n        // A smart contract that, if the recipient of the active message frame, should be treated\n        // as having signed. (Note this does not mean the <i>code being executed in the frame</i>\n        // will belong to the given contract, since it could be running another contract's code via\n        // <tt>delegatecall</tt>. So setting this key is a more permissive version of setting the\n        // contractID key, which also requires the code in the active message frame belong to the\n        // the contract with the given id.)\n        address delegatableContractId;\n    }\n\n    /// A list of token key types the key should be applied to and the value of the key\n    struct TokenKey {\n\n        // bit field representing the key type. Keys of all types that have corresponding bits set to 1\n        // will be created for the token.\n        // 0th bit: adminKey\n        // 1st bit: kycKey\n        // 2nd bit: freezeKey\n        // 3rd bit: wipeKey\n        // 4th bit: supplyKey\n        // 5th bit: feeScheduleKey\n        // 6th bit: pauseKey\n        // 7th bit: ignored\n        uint keyType;\n\n        // the value that will be set to the key type\n        KeyValue key;\n    }\n\n    /// Basic properties of a Hedera Token - name, symbol, memo, tokenSupplyType, maxSupply,\n    /// treasury, freezeDefault. These properties are related both to Fungible and NFT token types.\n    struct HederaToken {\n        // The publicly visible name of the token. The token name is specified as a Unicode string.\n        // Its UTF-8 encoding cannot exceed 100 bytes, and cannot contain the 0 byte (NUL).\n        string name;\n\n        // The publicly visible token symbol. The token symbol is specified as a Unicode string.\n        // Its UTF-8 encoding cannot exceed 100 bytes, and cannot contain the 0 byte (NUL).\n        string symbol;\n\n        // The ID of the account which will act as a treasury for the token as a solidity address.\n        // This account will receive the specified initial supply or the newly minted NFTs in\n        // the case for NON_FUNGIBLE_UNIQUE Type\n        address treasury;\n\n        // The memo associated with the token (UTF-8 encoding max 100 bytes)\n        string memo;\n\n        // IWA compatibility. Specified the token supply type. Defaults to INFINITE\n        bool tokenSupplyType;\n\n        // IWA Compatibility. Depends on TokenSupplyType. For tokens of type FUNGIBLE_COMMON - the\n        // maximum number of tokens that can be in circulation. For tokens of type NON_FUNGIBLE_UNIQUE -\n        // the maximum number of NFTs (serial numbers) that can be minted. This field can never be changed!\n        uint32 maxSupply;\n\n        // The default Freeze status (frozen or unfrozen) of Hedera accounts relative to this token. If\n        // true, an account must be unfrozen before it can receive the token\n        bool freezeDefault;\n\n        // list of keys to set to the token\n        TokenKey[] tokenKeys;\n\n        // expiry properties of a Hedera token - second, autoRenewAccount, autoRenewPeriod\n        Expiry expiry;\n    }\n\n    /// Transfers cryptocurrency among two or more accounts by making the desired adjustments to their\n    /// balances. Each transfer list can specify up to 10 adjustments. Each negative amount is withdrawn\n    /// from the corresponding account (a sender), and each positive one is added to the corresponding\n    /// account (a receiver). The amounts list must sum to zero. Each amount is a number of tinybars\n    /// (there are 100,000,000 tinybars in one hbar).  If any sender account fails to have sufficient\n    /// hbars, then the entire transaction fails, and none of those transfers occur, though the\n    /// transaction fee is still charged. This transaction must be signed by the keys for all the sending\n    /// accounts, and for any receiving accounts that have receiverSigRequired == true. The signatures\n    /// are in the same order as the accounts, skipping those accounts that don't need a signature.\n    struct AccountAmount {\n        // The Account ID, as a solidity address, that sends/receives cryptocurrency or tokens\n        address accountID;\n\n        // The amount of  the lowest denomination of the given token that\n        // the account sends(negative) or receives(positive)\n        int64 amount;\n    }\n\n    /**********************\n     * Direct HTS Calls   *\n     **********************/\n\n    /// Creates a Fungible Token with the specified properties\n    /// @param token the basic properties of the token being created\n    /// @param initialTotalSupply Specifies the initial supply of tokens to be put in circulation. The\n    /// initial supply is sent to the Treasury Account. The supply is in the lowest denomination possible.\n    /// @param decimals the number of decimal places a token is divisible by\n    /// @return responseCode The response code for the status of the request. SUCCESS is 22.\n    /// @return tokenAddress the created token's address\n    function createFungibleToken(\n        HederaToken memory token,\n        uint initialTotalSupply,\n        uint decimals)\n    external payable returns (int responseCode, address tokenAddress);\n\n    /// Mints an amount of the token to the defined treasury account\n    /// @param token The token for which to mint tokens. If token does not exist, transaction results in\n    ///              INVALID_TOKEN_ID\n    /// @param amount Applicable to tokens of type FUNGIBLE_COMMON. The amount to mint to the Treasury Account.\n    ///               Amount must be a positive non-zero number represented in the lowest denomination of the\n    ///               token. The new supply must be lower than 2^63.\n    /// @param metadata Applicable to tokens of type NON_FUNGIBLE_UNIQUE. A list of metadata that are being created.\n    ///                 Maximum allowed size of each metadata is 100 bytes\n    /// @return responseCode The response code for the status of the request. SUCCESS is 22.\n    /// @return newTotalSupply The new supply of tokens. For NFTs it is the total count of NFTs\n    /// @return serialNumbers If the token is an NFT the newly generate serial numbers, othersise empty.\n    function mintToken(address token, uint64 amount, bytes[] calldata metadata) external\n        returns (int responseCode, uint64 newTotalSupply, int[] memory serialNumbers);\n\n    /// Burns an amount of the token from the defined treasury account\n    /// @param token The token for which to burn tokens. If token does not exist, transaction results in\n    ///              INVALID_TOKEN_ID\n    /// @param amount  Applicable to tokens of type FUNGIBLE_COMMON. The amount to burn from the Treasury Account.\n    ///                Amount must be a positive non-zero number, not bigger than the token balance of the treasury\n    ///                account (0; balance], represented in the lowest denomination.\n    /// @param serialNumbers Applicable to tokens of type NON_FUNGIBLE_UNIQUE. The list of serial numbers to be burned.\n    /// @return responseCode The response code for the status of the request. SUCCESS is 22.\n    /// @return newTotalSupply The new supply of tokens. For NFTs it is the total count of NFTs\n    function burnToken(address token, uint64 amount, int64[] calldata serialNumbers) external\n        returns (int responseCode, uint64 newTotalSupply);\n\n    ///  Associates the provided account with the provided tokens. Must be signed by the provided\n    ///  Account's key or called from the accounts contract key\n    ///  If the provided account is not found, the transaction will resolve to INVALID_ACCOUNT_ID.\n    ///  If the provided account has been deleted, the transaction will resolve to ACCOUNT_DELETED.\n    ///  If any of the provided tokens is not found, the transaction will resolve to INVALID_TOKEN_REF.\n    ///  If any of the provided tokens has been deleted, the transaction will resolve to TOKEN_WAS_DELETED.\n    ///  If an association between the provided account and any of the tokens already exists, the\n    ///  transaction will resolve to TOKEN_ALREADY_ASSOCIATED_TO_ACCOUNT.\n    ///  If the provided account's associations count exceed the constraint of maximum token associations\n    ///    per account, the transaction will resolve to TOKENS_PER_ACCOUNT_LIMIT_EXCEEDED.\n    ///  On success, associations between the provided account and tokens are made and the account is\n    ///    ready to interact with the tokens.\n    /// @param account The account to be associated with the provided tokens\n    /// @param tokens The tokens to be associated with the provided account. In the case of NON_FUNGIBLE_UNIQUE\n    ///               Type, once an account is associated, it can hold any number of NFTs (serial numbers) of that\n    ///               token type\n    /// @return responseCode The response code for the status of the request. SUCCESS is 22.\n    function associateTokens(address account, address[] calldata tokens) external returns (int responseCode);\n\n    /// Single-token variant of associateTokens. Will be mapped to a single entry array call of associateTokens\n    /// @param account The account to be associated with the provided token\n    /// @param token The token to be associated with the provided account\n    function associateToken(address account, address token) external returns (int responseCode);\n\n    /// Single-token variant of dissociateTokens. Will be mapped to a single entry array call of dissociateTokens\n    /// @param account The account to be associated with the provided token\n    /// @param token The token to be associated with the provided account\n    function dissociateToken(address account, address token)\n        external\n        returns (int64 responseCode);\n\n    /**********************\n     * ABIV1 calls        *\n     **********************/\n\n\n\n    /// Transfers tokens where the calling account/contract is implicitly the first entry in the token transfer list,\n    /// where the amount is the value needed to zero balance the transfers. Regular signing rules apply for sending\n    /// (positive amount) or receiving (negative amount)\n    /// @param token The token to transfer to/from\n    /// @param sender The sender for the transaction\n    /// @param recipient The receiver of the transaction\n    /// @param amount Non-negative value to send. a negative value will result in a failure.\n    function transferToken(address token, address sender, address recipient, int64 amount) external returns (int responseCode);\n\n    /// Allows spender to withdraw from your account multiple times, up to the value amount. If this function is called\n    /// again it overwrites the current allowance with value.\n    /// Only Applicable to Fungible Tokens\n    /// @param token The hedera token address to approve\n    /// @param spender the account address authorized to spend\n    /// @param amount the amount of tokens authorized to spend.\n    /// @return responseCode The response code for the status of the request. SUCCESS is 22.\n    function approve(\n        address token,\n        address spender,\n        uint256 amount\n    ) external returns (int64 responseCode);\n}"
        },
        "project:/contracts/libraries/UniswapV2Library.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity >=0.5.0;\n\nimport '../interfaces/IUniswapV2Pair.sol';\nimport \"./SafeMath.sol\";\n\nlibrary UniswapV2Library {\n    using SafeMath for uint;\n\n    // returns sorted token addresses, used to handle return values from pairs sorted in this order\n    function sortTokens(address tokenA, address tokenB) internal pure returns (address token0, address token1) {\n        require(tokenA != tokenB, 'UniswapV2Library: IDENTICAL_ADDRESSES');\n        (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);\n        require(token0 != address(0), 'UniswapV2Library: ZERO_ADDRESS');\n    }\n\n    // calculates the CREATE2 address for a pair without making any external calls\n    function pairFor(address factory, address tokenA, address tokenB) internal pure returns (address pair) {\n        (address token0, address token1) = sortTokens(tokenA, tokenB);\n        pair = address(uint(keccak256(abi.encodePacked(\n                hex'ff',\n                factory,\n                keccak256(abi.encodePacked(token0, token1)),\n                hex'407b3b02625070246aa1a1a346747a190d54149fc468122d6934af99b6ad0e6a'\n            ))));\n    }\n\n    // fetches and sorts the reserves for a pair\n    function getReserves(address factory, address tokenA, address tokenB) internal view returns (uint reserveA, uint reserveB) {\n        (address token0,) = sortTokens(tokenA, tokenB);\n        (uint reserve0, uint reserve1,) = IUniswapV2Pair(pairFor(factory, tokenA, tokenB)).getReserves();\n        (reserveA, reserveB) = tokenA == token0 ? (reserve0, reserve1) : (reserve1, reserve0);\n    }\n\n    // given some amount of an asset and pair reserves, returns an equivalent amount of the other asset\n    function quote(uint amountA, uint reserveA, uint reserveB) internal pure returns (uint amountB) {\n        require(amountA > 0, 'UniswapV2Library: INSUFFICIENT_AMOUNT');\n        require(reserveA > 0 && reserveB > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');\n        amountB = amountA.mul(reserveB) / reserveA;\n    }\n\n    // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset\n    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {\n        require(amountIn > 0, 'UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT');\n        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');\n        uint amountInWithFee = amountIn.mul(997);\n        uint numerator = amountInWithFee.mul(reserveOut);\n        uint denominator = reserveIn.mul(1000).add(amountInWithFee);\n        amountOut = numerator / denominator;\n    }\n\n    // given an output amount of an asset and pair reserves, returns a required input amount of the other asset\n    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn) {\n        require(amountOut > 0, 'UniswapV2Library: INSUFFICIENT_OUTPUT_AMOUNT');\n        require(reserveIn > 0 && reserveOut > 0, 'UniswapV2Library: INSUFFICIENT_LIQUIDITY');\n        uint numerator = reserveIn.mul(amountOut).mul(1000);\n        uint denominator = reserveOut.sub(amountOut).mul(997);\n        amountIn = (numerator / denominator).add(1);\n    }\n\n    // performs chained getAmountOut calculations on any number of pairs\n    function getAmountsOut(address factory, uint amountIn, address[] memory path) internal view returns (uint[] memory amounts) {\n        require(path.length >= 2, 'UniswapV2Library: INVALID_PATH');\n        amounts = new uint[](path.length);\n        amounts[0] = amountIn;\n        for (uint i; i < path.length - 1; i++) {\n            (uint reserveIn, uint reserveOut) = getReserves(factory, path[i], path[i + 1]);\n            amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);\n        }\n    }\n\n    // performs chained getAmountIn calculations on any number of pairs\n    function getAmountsIn(address factory, uint amountOut, address[] memory path) internal view returns (uint[] memory amounts) {\n        require(path.length >= 2, 'UniswapV2Library: INVALID_PATH');\n        amounts = new uint[](path.length);\n        amounts[amounts.length - 1] = amountOut;\n        for (uint i = path.length - 1; i > 0; i--) {\n            (uint reserveIn, uint reserveOut) = getReserves(factory, path[i - 1], path[i]);\n            amounts[i - 1] = getAmountIn(amounts[i], reserveIn, reserveOut);\n        }\n    }\n}\n"
        },
        "project:/contracts/interfaces/IUniswapV2Factory.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity >=0.5.0;\n\ninterface IUniswapV2Factory {\n    event PairCreated(address indexed token0, address indexed token1, address pair, uint);\n\n    function feeTo() external view returns (address);\n    function feeToSetter() external view returns (address);\n    function rentPayer() external view returns (address);\n    function pairCreateFee() external view returns (uint256);\n    function tokenCreateFee() external view returns (uint256);\n\n    function getPair(address tokenA, address tokenB) external view returns (address pair);\n    function allPairs(uint) external view returns (address pair);\n    function allPairsLength() external view returns (uint);\n\n    function createPair(address tokenA, address tokenB) external payable returns (address pair);\n\n    function setFeeTo(address) external;\n    function setFeeToSetter(address) external;\n    function setRentPayer(address) external;\n    function setPairCreateFee(uint256) external;\n    function setTokenCreateFee(uint256) external;\n}\n"
        },
        "project:/contracts/hedera/SafeHederaTokenService.sol": {
            "content": "// SPDX-License-Identifier: Apache-2.0\npragma solidity =0.6.12;\npragma experimental ABIEncoderV2;\n\nimport \"./HederaTokenService.sol\";\nimport '../libraries/SafeCast.sol';\nimport \"./IHederaTokenService.sol\";\n\ncontract SafeHederaTokenService is HederaTokenService {\n\n    using SafeCast for uint256;\n\n    event Transfer(address indexed from, address indexed to, uint64 value);\n    event Approve(address indexed spender, uint64 value);\n\n    function safeMintToken(address token, address to, uint256 amount, bytes[] memory metadata) internal\n    returns (uint64 newTotalSupply, int64[] memory serialNumbers) {\n        int responseCode;\n        (responseCode, newTotalSupply, serialNumbers) = HederaTokenService.mintToken(token, amount.toUint64(), metadata);\n        require(responseCode == HederaResponseCodes.SUCCESS, \"Safe mint failed!\");\n        emit Transfer(address(0), to, amount.toUint64());\n    }\n\n    function safeBurnToken(address token, address to, uint256 amount, int64[] memory serialNumbers) internal\n    returns (uint64 newTotalSupply)\n    {\n        int responseCode;\n        (responseCode, newTotalSupply) = HederaTokenService.burnToken(token, amount.toUint64(), serialNumbers);\n        require(responseCode == HederaResponseCodes.SUCCESS, \"Safe burn failed!\");\n        emit Transfer(to, address(0), amount.toUint64());\n    }\n\n    function safeAssociateTokens(address account, address[] memory tokens) internal {\n        int responseCode;\n        responseCode = HederaTokenService.associateTokens(account, tokens);\n        require(responseCode == HederaResponseCodes.SUCCESS, \"Safe multiple associations failed!\");\n    }\n\n    function safeAssociateToken(address account, address token) internal {\n        int responseCode;\n        responseCode = HederaTokenService.associateToken(account, token);\n        require(responseCode == HederaResponseCodes.SUCCESS, \"Safe single association failed!\");\n    }\n\n    function safeTransferToken(address token, address sender, address receiver, uint256 amount) internal {\n        int responseCode;\n        responseCode = HederaTokenService.transferToken(token, sender, receiver, amount.toInt64());\n        require(responseCode == HederaResponseCodes.SUCCESS, \"Safe token transfer failed!\");\n        emit Transfer(sender, receiver, uint64(amount));\n    }\n\n    function safeApproveToken(address token, address spender, uint256 amount) internal {\n        int responseCode;\n        responseCode = HederaTokenService.approve(token, spender, amount.toInt64());\n        require(responseCode == HederaResponseCodes.SUCCESS, \"Safe approve failed!\");\n        emit Approve(spender, uint64(amount));\n    }\n\n    function safeDissociateToken(address account, address token) internal {\n        int responseCode;\n        responseCode = HederaTokenService.dissociateToken(account, token);\n        require(responseCode == HederaResponseCodes.SUCCESS, \"Safe single association failed!\");\n    }\n}\n"
        },
        "project:/contracts/interfaces/IUniswapV2Router01.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity >=0.6.2;\n\ninterface IUniswapV2Router01 {\n    function factory() external pure returns (address);\n    function WHBAR() external pure returns (address);\n    function whbar() external pure returns (address);\n\n    function addLiquidity(\n        address tokenA,\n        address tokenB,\n        uint amountADesired,\n        uint amountBDesired,\n        uint amountAMin,\n        uint amountBMin,\n        address to,\n        uint deadline\n    ) external returns (uint amountA, uint amountB, uint liquidity);\n    function addLiquidityETH(\n        address token,\n        uint amountTokenDesired,\n        uint amountTokenMin,\n        uint amountETHMin,\n        address to,\n        uint deadline\n    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);\n\n    function addLiquidityNewPool(\n        address tokenA,\n        address tokenB,\n        uint amountADesired,\n        uint amountBDesired,\n        uint amountAMin,\n        uint amountBMin,\n        address to,\n        uint deadline\n    ) external payable returns (uint amountA, uint amountB, uint liquidity);\n    \n    function addLiquidityETHNewPool(\n        address token,\n        uint amountTokenDesired,\n        uint amountTokenMin,\n        uint amountETHMin,\n        address to,\n        uint deadline\n    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);\n\n    function removeLiquidity(\n        address tokenA,\n        address tokenB,\n        uint liquidity,\n        uint amountAMin,\n        uint amountBMin,\n        address to,\n        uint deadline\n    ) external returns (uint amountA, uint amountB);\n    function removeLiquidityETH(\n        address token,\n        uint liquidity,\n        uint amountTokenMin,\n        uint amountETHMin,\n        address to,\n        uint deadline\n    ) external returns (uint amountToken, uint amountETH);\n\n    function swapExactTokensForTokens(\n        uint amountIn,\n        uint amountOutMin,\n        address[] calldata path,\n        address to,\n        uint deadline\n    ) external returns (uint[] memory amounts);\n    function swapTokensForExactTokens(\n        uint amountOut,\n        uint amountInMax,\n        address[] calldata path,\n        address to,\n        uint deadline\n    ) external returns (uint[] memory amounts);\n    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)\n        external\n        payable\n        returns (uint[] memory amounts);\n    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)\n        external\n        returns (uint[] memory amounts);\n    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)\n        external\n        returns (uint[] memory amounts);\n    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)\n        external\n        payable\n        returns (uint[] memory amounts);\n\n    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);\n    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);\n    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);\n    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);\n    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);\n}\n"
        },
        "project:/contracts/interfaces/IUniswapV2Router02.sol": {
            "content": "// SPDX-License-Identifier: GPL-3.0\npragma solidity >=0.6.2;\npragma experimental ABIEncoderV2;\n\nimport './IUniswapV2Router01.sol';\n\ninterface IUniswapV2Router02 is IUniswapV2Router01 {\n    \n    function removeLiquidityETHSupportingFeeOnTransferTokens(\n        address token,\n        uint liquidity,\n        uint amountTokenMin,\n        uint amountETHMin,\n        address to,\n        uint deadline\n    ) external returns (uint amountETH);\n    \n    function swapExactTokensForTokensSupportingFeeOnTransferTokens(\n        uint amountIn,\n        uint amountOutMin,\n        address[] calldata path,\n        address to,\n        uint deadline\n    ) external;\n    function swapExactETHForTokensSupportingFeeOnTransferTokens(\n        uint amountOutMin,\n        address[] calldata path,\n        address to,\n        uint deadline\n    ) external payable;\n    function swapExactTokensForETHSupportingFeeOnTransferTokens(\n        uint amountIn,\n        uint amountOutMin,\n        address[] calldata path,\n        address to,\n        uint deadline\n    ) external;\n}\n"
        }
    },
    "matchId": "714",
    "creationMatch": null,
    "runtimeMatch": "match",
    "verifiedAt": "2024-08-08T10:05:03Z",
    "match": "match",
    "chainId": "295",
    "address": "0x00000000000000000000000000000000002E7A5D"
}


const CONTRACT_TRANSACTION_HTS = {
    "bytes": null,
    "charged_tx_fee": 470065,
    "consensus_timestamp": "1711559858.799271379",
    "entity_id": null,
    "high_volume": false,
    "max_fee": "100000000",
    "memo_base64": "",
    "name": "CONTRACTCALL",
    "nft_transfers": [],
    "node": "0.0.5",
    "nonce": 0,
    "parent_consensus_timestamp": null,
    "result": "SUCCESS",
    "scheduled": false,
    "staking_reward_transfers": [],
    "token_transfers": [],
    "transaction_hash": "oBKWEjLtfShCg26V9+nENW/f4t4IGZCRcBqWnB0f2TZx0weO6Dso+0YKiLTL2OzS",
    "transaction_id": "0.0.29624024-1646025139-152901498",
    "transfers": [
        {
            "account": "0.0.4",
            "amount": 22028
        },
        {
            "account": "0.0.98",
            "amount": 448037
        },
        {
            "account": "0.0.29624024",
            "amount": -470065
        }
    ],
    "valid_duration_seconds": "120",
    "valid_start_timestamp": "1646025139.152901498",
}


const CONTRACT_RESULT_HTS = {
    "address": "0x0000000000000000000000000000000000000167",
    "amount": 0,
    "bloom": "0x",
    "call_result": "0x0000000000000000000000000000000000000000000000000000000000000146",
    "contract_id": null,
    "created_contract_ids": [],
    "error_message": "INVALID_FULL_PREFIX_SIGNATURE_FOR_PRECOMPILE",
    "from": "0x0000000000000000000000000000000000000630",
    "function_parameters": "0x49146bde0000000000000000000000000000000000000000000000000000000000000513000000000000000000000000000000000000000000000000000000000036a144",
    "gas_consumed": null,
    "gas_limit": 1978620,
    "gas_used": 704414,
    "timestamp": "1711559858.799271379",
    "to": "0x0000000000000000000000000000000000000167",
    "hash": "0x4f0887dcc3c3f23ce2e80a2e3c3bfa246d488698d5e0cc17c76ef13262580d73",
    "block_hash": "0x1e1990286e3295ea971f58d5044deec04f0853fd528a1808846a32b0bd425434ef4d9a8a3fea17597045e4daf75e2311",
    "block_number": 2138651,
    "result": "INVALID_FULL_PREFIX_SIGNATURE_FOR_PRECOMPILE",
    "transaction_index": 3,
    "status": "0x0",
    "failed_initcode": null,
    "block_gas_used": 1600000,
    "chain_id": null,
    "gas_price": null,
    "max_fee_per_gas": null,
    "max_priority_fee_per_gas": null,
    "r": null,
    "s": null,
    "type": null,
    "v": null,
    "nonce": null
}

const CONTRACT_RESULT_DETAILS_HTS = {
    "address": "0x0000000000000000000000000000000000000167",
    "amount": 0,
    "bloom": "0x",
    "call_result": "0x0000000000000000000000000000000000000000000000000000000000000146",
    "contract_id": null,
    "created_contract_ids": [],
    "error_message": "INVALID_FULL_PREFIX_SIGNATURE_FOR_PRECOMPILE",
    "from": "0x0000000000000000000000000000000000000630",
    "function_parameters": "0x49146bde0000000000000000000000000000000000000000000000000000000000000513000000000000000000000000000000000000000000000000000000000036a144",
    "gas_consumed": null,
    "gas_limit": 1978620,
    "gas_used": 704414,
    "timestamp": "1711559858.799271379",
    "to": "0x0000000000000000000000000000000000000167",
    "hash": "0x4f0887dcc3c3f23ce2e80a2e3c3bfa246d488698d5e0cc17c76ef13262580d73",
    "block_hash": "0x1e1990286e3295ea971f58d5044deec04f0853fd528a1808846a32b0bd425434ef4d9a8a3fea17597045e4daf75e2311",
    "block_number": 2138651,
    "logs": [],
    "result": "INVALID_FULL_PREFIX_SIGNATURE_FOR_PRECOMPILE",
    "transaction_index": 3,
    "state_changes": [],
    "status": "0x0",
    "failed_initcode": null,
    "block_gas_used": 1600000,
    "chain_id": null,
    "gas_price": null,
    "max_fee_per_gas": null,
    "max_priority_fee_per_gas": null,
    "r": null,
    "s": null,
    "type": null,
    "v": null,
    "nonce": null
}

const BYTES4_RESPONSE = {
    "count": 1,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 951384,
            "created_at": "2023-03-09T19:31:27.895916Z",
            "text_signature": "associateToken(address,address)",
            "hex_signature": "0x49146bde",
            "bytes_signature": "I\u0014kÞ"
        }
    ]
}

