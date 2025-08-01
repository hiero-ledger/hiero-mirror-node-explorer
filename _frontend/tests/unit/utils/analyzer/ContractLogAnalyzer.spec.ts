// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {SAMPLE_CONTRACT} from "../../Mocks";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {ref, Ref} from "vue";
import {ContractLogAnalyzer} from "@/utils/analyzer/ContractLogAnalyzer";
import {ContractResultLog} from "@/schemas/MirrorNodeSchemas";
import {SourcifyResponse} from "@/utils/cache/SourcifyCache";
import {flushPromises} from "@vue/test-utils";
import {routeManager} from "@/utils/RouteManager.ts";

describe("ContractLogAnalyzer.spec.ts", () => {


    test("TestEvent.sol", async () => {

        const matcher1 = "api/v1/contracts/" + SAMPLE_CONTRACT.contract_id
        const mock = new MockAdapter(axios as any);
        mock.onGet(matcher1).reply(200, SAMPLE_CONTRACT)

        const networkEntry = routeManager.currentNetworkEntry.value
        const requestURL = networkEntry.sourcifySetup?.makeRequestURL(SAMPLE_CONTRACT.evm_address)
        // const contractURL = networkEntry.sourcifySetup?.makeContractLookupURL(SAMPLE_CONTRACT.evm_address)
        mock.onGet(requestURL).reply(200, SAMPLE_SOURCIFY_RESPONSE)

        // 1) new
        const contractLog: Ref<ContractResultLog | null> = ref(null)
        const logAnalyzer = new ContractLogAnalyzer(contractLog)
        expect(logAnalyzer.signature.value).toBeNull()
        expect(logAnalyzer.args.value).toStrictEqual([])

        // 2) mount log analyzer
        logAnalyzer.mount()
        expect(logAnalyzer.signature.value).toBeNull()
        expect(logAnalyzer.args.value).toStrictEqual([])

        // 3) setup log analyzer
        contractLog.value = SAMPLE_LOG_RESULT
        await flushPromises()
        // expect(logAnalyzer.signature.value).toBe("FlightEvent(string,int256,int256)")
        expect(logAnalyzer.args.value.length).toBe(4)
        expect(logAnalyzer.args.value[0].name).toBe("signature hash")
        expect(logAnalyzer.args.value[0].type).toBe("")
        expect(logAnalyzer.args.value[0].value).toBe("0x01f789d670afa3030578cc570ac4d43ace6f1575dd6c395a711e72a30051efd2")
        expect(logAnalyzer.args.value[1].name).toBe("phase")
        expect(logAnalyzer.args.value[1].type).toBe("string")
        expect(logAnalyzer.args.value[1].value).toBe("Holding point")
        expect(logAnalyzer.args.value[2].name).toBe("airspeed")
        expect(logAnalyzer.args.value[2].type).toBe("int256")
        expect(logAnalyzer.args.value[2].value).toStrictEqual(BigInt(0))
        expect(logAnalyzer.args.value[3].name).toBe("verticalSpeed")
        expect(logAnalyzer.args.value[3].type).toBe("int256")
        expect(logAnalyzer.args.value[3].value).toStrictEqual(BigInt(0))

        // 4) mount log analyzer
        logAnalyzer.unmount()
        expect(logAnalyzer.signature.value).toBeNull()
        expect(logAnalyzer.args.value).toStrictEqual([])

    })


})


export const SAMPLE_SOURCIFY_RESPONSE: SourcifyResponse = {
    "status": "full",
    "files": [
        {
            "name": "metadata.json",
            "path": "/home/data/repository/contracts/full_match/297/0x000000000000000000000000000000000000BE0D/metadata.json",
            "content": "{\"compiler\":{\"version\":\"0.8.17+commit.8df45f5f\"},\"language\":\"Solidity\",\"output\":{\"abi\":[{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"string\",\"name\":\"phase\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"int256\",\"name\":\"airspeed\",\"type\":\"int256\"},{\"indexed\":false,\"internalType\":\"int256\",\"name\":\"verticalSpeed\",\"type\":\"int256\"}],\"name\":\"FlightEvent\",\"type\":\"event\"},{\"inputs\":[],\"name\":\"flight\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}],\"devdoc\":{\"kind\":\"dev\",\"methods\":{},\"version\":1},\"userdoc\":{\"kind\":\"user\",\"methods\":{},\"version\":1}},\"settings\":{\"compilationTarget\":{\"TestEvent.sol\":\"TestEvent\"},\"evmVersion\":\"london\",\"libraries\":{},\"metadata\":{\"bytecodeHash\":\"ipfs\"},\"optimizer\":{\"enabled\":false,\"runs\":200},\"remappings\":[]},\"sources\":{\"TestEvent.sol\":{\"keccak256\":\"0x0b43f90058f0db1650b050d9bd9336160ac306c77794b2d3604076143cf232eb\",\"license\":\"UNLICENSED\",\"urls\":[\"bzz-raw://f2d727b9c673d82880530e8ffa055e5ac6b275d04e31f7c53235ca653fb380e7\",\"dweb:/ipfs/QmQTD72f5NNTjAZqJSBSbK8itwTkLTCA5v2yGcgV49yy4p\"]}},\"version\":1}"
        },
        {
            "name": "TestEvent.sol",
            "path": "/home/data/repository/contracts/full_match/297/0x000000000000000000000000000000000000BE0D/sources/TestEvent.sol",
            "content": "// SPDX-License-Identifier: UNLICENSED\npragma solidity ^0.8.4;\n\nerror SimpleError();\nerror ComplexError(string name, int256 temperature);\n\n// https://blog.soliditylang.org/2021/04/21/custom-errors/\n\ncontract TestEvent {\n\n    event FlightEvent(string phase, int airspeed, int verticalSpeed);\n\n    function flight() public {\n        emit FlightEvent(\"Holding point\", 0, 0);\n        emit FlightEvent(\"Taking Off\", 110, 0);\n        emit FlightEvent(\"Climbing\", 150, 500);\n        emit FlightEvent(\"Cruising\", 200, 0);\n        emit FlightEvent(\"Descending\", 200, -500);\n        emit FlightEvent(\"Landing\", 130, -250);\n        emit FlightEvent(\"Runway Cleared\", 10, 0);\n    }\n\n}\n"
        }
    ]
}

export const SAMPLE_LOG_RESULT = {
    "address": SAMPLE_CONTRACT.evm_address,
    "bloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000408000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000020000000000000000000000000000000000",
    "contract_id": SAMPLE_CONTRACT.contract_id,
    "data": "0x000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000d486f6c64696e6720706f696e7400000000000000000000000000000000000000",
    "index": 0,
    "topics": [
        "0x01f789d670afa3030578cc570ac4d43ace6f1575dd6c395a711e72a30051efd2"
    ]
}
