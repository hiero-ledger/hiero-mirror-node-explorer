// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test, vi} from 'vitest'
import {Ref, ref} from "vue";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {FunctionCallAnalyzer} from "@/utils/analyzer/FunctionCallAnalyzer";
import {NameTypeValue} from "@/utils/analyzer/call/FunctionCallDecoder.ts";
import {SignatureCache} from "@/utils/cache/SignatureCache";
import {fetchGetURLs} from "../../MockUtils.ts";
import {flushPromises} from "@vue/test-utils";
import {routeManager} from "@/utils/RouteManager.ts";

describe("FunctionCallAnalyzer.spec.ts", () => {

    test("Call to system contract", async () => {

        SignatureCache.instance.clear()

        const mock = new MockAdapter(axios as any);

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) input setup (valid encoding)
        input.value = "0x49146bde000000000000000000000000845b706151aed537b1fd81c1ea4ea03920097abd0000000000000000000000000000000000000000000000000000000002e6ae09"
        output.value = "0x0000000000000000000000000000000000000000000000000000000005a995c0"
        contractId.value = "0.0.359"
        await flushPromises()
        await vi.dynamicImportSettled()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x49146bde")
        expect(functionCallAnalyzer.signature.value).toBe("function associateToken(address account, address token) returns (int64 responseCode)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("account", "address", "0x845b706151aEd537b1FD81c1Ea4EA03920097ABD", null, null),
            new NameTypeValue("token", "address", "0x0000000000000000000000000000000002E6Ae09", null, null),
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([
            new NameTypeValue("responseCode", "int64", BigInt("0x05a995c0"), null, null),
        ])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000845b706151aed537b1fd81c1ea4ea03920097abd0000000000000000000000000000000000000000000000000000000002e6ae09")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 4) input setup (invalid input encoding)
        input.value = "0x618dc65e0000000000000000000000000000000000163b5a70a082310000000000000000000000005fe56763c7633efefe8c2272f19732521a48e300"
        output.value = "0x00000000000000000000000000000000000000000000000000003dc604b33217"
        contractId.value = "0.0.359"
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.1456986",
            "api/v1/tokens/0.0.1456986",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x618dc65e")
        expect(functionCallAnalyzer.signature.value).toBe("function redirectForToken(address token, bytes encodedFunctionSelector) returns (int64 responseCode, bytes response)")
        expect(functionCallAnalyzer.inputs.value).toEqual([
            new NameTypeValue(
                'token',
                'address',
                '0x0000000000000000000000000000000000163b5a',
                null,
                null
            ),
            new NameTypeValue(
                'encodedFunctionSelector',
                'bytes',
                '0x70a082310000000000000000000000005fe56763c7633efefe8c2272f19732521a48e300',
                null,
                null
            ),
        ])
        expect(functionCallAnalyzer.outputs.value).toEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBe(null)
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x0000000000000000000000000000000000163b5a70a082310000000000000000000000005fe56763c7633efefe8c2272f19732521a48e300")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 5) output setup (invalid output encoding)
        input.value = "0x49146bde000000000000000000000000845b706151aed537b1fd81c1ea4ea03920097abd0000000000000000000000000000000000000000000000000000000002e6ae09"
        output.value = "0x000000009999999999999999999999999"
        error.value = "0x"
        contractId.value = "0.0.359"
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.1456986",
            "api/v1/tokens/0.0.1456986",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x49146bde",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x49146bde")
        expect(functionCallAnalyzer.signature.value).toBe("function associateToken(address account, address token) returns (int64 responseCode)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("account", "address", "0x845b706151aEd537b1FD81c1Ea4EA03920097ABD", null, null),
            new NameTypeValue("token", "address", "0x0000000000000000000000000000000002E6Ae09", null, null),
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBe("Decoding Error (invalid BytesLike value)")
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull() // 0x is considered as no error
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000845b706151aed537b1fd81c1ea4ea03920097abd0000000000000000000000000000000000000000000000000000000002e6ae09")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)


        // 6) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.1456986",
            "api/v1/tokens/0.0.1456986",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x70a08231",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x49146bde",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x49146bde")
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000845b706151aed537b1fd81c1ea4ea03920097abd0000000000000000000000000000000000000000000000000000000002e6ae09")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        mock.restore()
    })

    test("Call to verified contract: new + mount + setup + unmount", async () => {

        SignatureCache.instance.clear()

        const sourcifyURL = routeManager.currentNetworkEntry.value.sourcifySetup?.repoURL

        const mock = new MockAdapter(axios as any);
        const matcher1 = sourcifyURL + "v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources"
        mock.onGet(matcher1).reply(200, SOURCIFY_RESPONSE)
        const matcher2 = "api/v1/contracts/" + CONTRACT_DETAILS.contract_id
        mock.onGet(matcher2).reply(200, CONTRACT_DETAILS)

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) setup
        input.value = "0xf305d719000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af"
        output.value = "0x"
        error.value = "0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000026556e69737761705632526f757465723a20494e53554646494349454e545f425f414d4f554e540000000000000000000000000000000000000000000000000000"
        contractId.value = "0.0.3045981"
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + CONTRACT_DETAILS.contract_id,
            "http://localhost:3000/v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0xf305d719")
        expect(functionCallAnalyzer.signature.value).toBe("function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("token", "address", "0x000000000000000000000000000000000022D6de", null, null),
            new NameTypeValue("amountTokenDesired", "uint256", 1445100000000n, null, null),
            new NameTypeValue("amountTokenMin", "uint256", 1437874500000n, null, null),
            new NameTypeValue("amountETHMin", "uint256", 65859917291n, null, null),
            new NameTypeValue("to", "address", "0x00000000000000000000000000000000000f45b3", null, null),
            new NameTypeValue("deadline", "uint256", 1704391514287n, null, null),
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBe("0x08c379a0")
        expect(functionCallAnalyzer.errorSignature.value).toBe("Error(string)")
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([
            new NameTypeValue("", "string", "UniswapV2Router: INSUFFICIENT_B_AMOUNT", null, null),
        ])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)


        // 4) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + CONTRACT_DETAILS.contract_id,
            "http://localhost:3000/v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0xf305d719")
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        SignatureCache.instance.clear()
        mock.restore()

    })

    test("Call to verified contract: new + setup + mount + unmount", async () => {

        SignatureCache.instance.clear()

        const sourcifyURL = routeManager.currentNetworkEntry.value.sourcifySetup?.repoURL

        const mock = new MockAdapter(axios as any);
        const matcher1 = sourcifyURL + "v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources"
        mock.onGet(matcher1).reply(200, SOURCIFY_RESPONSE)
        const matcher2 = "api/v1/contracts/" + CONTRACT_DETAILS.contract_id
        mock.onGet(matcher2).reply(200, CONTRACT_DETAILS)

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) setup
        input.value = "0xf305d719000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af"
        output.value = "0x"
        error.value = "0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000026556e69737761705632526f757465723a20494e53554646494349454e545f425f414d4f554e540000000000000000000000000000000000000000000000000000"
        contractId.value = "0.0.3045981"
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBe("0xf305d719")
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + CONTRACT_DETAILS.contract_id,
            "http://localhost:3000/v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0xf305d719")
        expect(functionCallAnalyzer.signature.value).toBe("function addLiquidityETH(address token, uint256 amountTokenDesired, uint256 amountTokenMin, uint256 amountETHMin, address to, uint256 deadline) payable returns (uint256 amountToken, uint256 amountETH, uint256 liquidity)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("token", "address", "0x000000000000000000000000000000000022D6de", null, null),
            new NameTypeValue("amountTokenDesired", "uint256", 1445100000000n, null, null),
            new NameTypeValue("amountTokenMin", "uint256", 1437874500000n, null, null),
            new NameTypeValue("amountETHMin", "uint256", 65859917291n, null, null),
            new NameTypeValue("to", "address", "0x00000000000000000000000000000000000f45b3", null, null),
            new NameTypeValue("deadline", "uint256", 1704391514287n, null, null),
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBe("0x08c379a0")
        expect(functionCallAnalyzer.errorSignature.value).toBe("Error(string)")
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([
            new NameTypeValue("", "string", "UniswapV2Router: INSUFFICIENT_B_AMOUNT", null, null),
        ])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)


        // 4) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + CONTRACT_DETAILS.contract_id,
            "http://localhost:3000/v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0xf305d719")
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        mock.restore()

    })

    test("Call to verified contract (constructor)", async () => {

        SignatureCache.instance.clear()

        const sourcifyURL = routeManager.currentNetworkEntry.value.sourcifySetup?.repoURL

        const mock = new MockAdapter(axios as any);
        const matcher1 = sourcifyURL + "v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources"
        mock.onGet(matcher1).reply(200, SOURCIFY_RESPONSE)
        const matcher2 = "api/v1/contracts/" + CONTRACT_DETAILS.contract_id
        mock.onGet(matcher2).reply(200, CONTRACT_DETAILS)

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const isContractCreate = ref(true)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId, isContractCreate)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) setup
        input.value = "0x000000000000000000000000000000000000000000000000000000000036a14300000000000000000000000070b7ba8a89cf329159d30f6c5273901979731661"
        output.value = "0x"
        error.value = "0x"
        contractId.value = "0.0.3045981"
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + CONTRACT_DETAILS.contract_id,
            "http://localhost:3000/v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBe("constructor(address _factory, address _WHBAR)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("_factory", "address", "0x000000000000000000000000000000000036A143", null, null),
            new NameTypeValue("_WHBAR", "address", "0x70b7bA8A89cf329159d30F6c5273901979731661", null, null),
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000036a14300000000000000000000000070b7ba8a89cf329159d30f6c5273901979731661")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)


        // 4) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" + CONTRACT_DETAILS.contract_id,
            "http://localhost:3000/v2/contract/295/" + CONTRACT_DETAILS.evm_address + "?fields=metadata,sources",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000036a14300000000000000000000000070b7ba8a89cf329159d30f6c5273901979731661")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        SignatureCache.instance.clear()
        mock.restore()

    })

    test("Call with signature declared on 4bytes.directory", async () => {

        SignatureCache.instance.clear()

        const functionHash = "0xf305d719"
        const mock = new MockAdapter(axios as any);
        const matcher1 = "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=" + functionHash
        mock.onGet(matcher1).reply(200, BYTES4_RESPONSE)

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) setup
        input.value = "0xf305d719000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af"
        output.value = "0x"
        error.value = "0x08c379a000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000026556e69737761705632526f757465723a20494e53554646494349454e545f425f414d4f554e540000000000000000000000000000000000000000000000000000"
        contractId.value = "0.0.3045981"
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.3045981",
            "api/v1/tokens/0.0.3045981",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0xf305d719",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0xf305d719")
        expect(functionCallAnalyzer.signature.value).toBe("function addLiquidityETH(address, uint256, uint256, uint256, address, uint256)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("", "address", "0x000000000000000000000000000000000022D6de", null, null),
            new NameTypeValue("", "uint256", 1445100000000n, null, null),
            new NameTypeValue("", "uint256", 1437874500000n, null, null),
            new NameTypeValue("", "uint256", 65859917291n, null, null),
            new NameTypeValue("", "address", "0x00000000000000000000000000000000000f45b3", null, null),
            new NameTypeValue("", "uint256", 1704391514287n, null, null),
        ])

        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(true)


        // 4) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.3045981",
            "api/v1/tokens/0.0.3045981",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0xf305d719",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0xf305d719")
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000000000000000000000000000000000000022d6de0000000000000000000000000000000000000000000000000000015076ac13000000000000000000000000000000000000000000000000000000014ec7ffb1a00000000000000000000000000000000000000000000000000000000f558e95eb00000000000000000000000000000000000000000000000000000000000f45b30000000000000000000000000000000000000000000000000000018cd5a698af")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        mock.restore()


    })

    test("Call with signature declared on 4bytes.directory (v2)", async () => {

        SignatureCache.instance.clear()

        const functionHash = "0x095ea7b3"
        const mock = new MockAdapter(axios as any);
        const matcher1 = "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=" + functionHash
        mock.onGet(matcher1).reply(200, BYTES4_RESPONSE_V2)

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) setup
        input.value = "0x095ea7b3000000000000000000000000113a5b705ffb98b333d6096d510fac6ba2192612000000000000000000000000000000000000000000000000000000000000000e"
        output.value = "0x"
        error.value = "0x7e273289000000000000000000000000000000000000000000000000000000000000000e"
        contractId.value = "0.0.7232275"
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.7232275",
            "api/v1/tokens/0.0.7232275",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x095ea7b3",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x095ea7b3")
        expect(functionCallAnalyzer.signature.value).toBe("function approve(address, uint256)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("", "address", "0x113a5b705FFb98b333D6096D510fAC6bA2192612", null, null),
            new NameTypeValue("", "uint256", 14n, null, null),
        ])

        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000113a5b705ffb98b333d6096d510fac6ba2192612000000000000000000000000000000000000000000000000000000000000000e")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(true)


        // 4) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.7232275",
            "api/v1/tokens/0.0.7232275",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x095ea7b3",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x095ea7b3")
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x000000000000000000000000113a5b705ffb98b333d6096d510fac6ba2192612000000000000000000000000000000000000000000000000000000000000000e")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        mock.restore()


    })

    test("Call with redirectForToken()", async () => {

        SignatureCache.instance.clear()

        const mock = new MockAdapter(axios as any)

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)
        expect(functionCallAnalyzer.isRedirect.value).toBe(false)

        // 2) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)
        expect(functionCallAnalyzer.isRedirect.value).toBe(false)

        // 3) setup
        // Inspired from https://hashscan.io/mainnet/transaction/1745842640.274210000
        input.value = "0x618dc65e0000000000000000000000000000000000163b5a095ea7b300000000000000000000000000000000000000000000000000000000003c437a0000000000000000000000000000000000000000000000008ac7230489e80000"
        output.value = null
        error.value = "0x494e56414c49445f4f5045524154494f4e"
        revertReason.value = "0x0000000000000000000000000000000000000000000000000000000000000124"
        contractId.value = "0.0.359"
        await flushPromises()
        await vi.dynamicImportSettled()
        // expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x618dc65e")
        expect(functionCallAnalyzer.signature.value).toBe("function redirectForToken(address token, bytes encodedFunctionSelector) returns (int64 responseCode, bytes response)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("token", "address", "0x0000000000000000000000000000000000163b5a", null, null),
            new NameTypeValue("encodedFunctionSelector", "bytes", "0x095ea7b300000000000000000000000000000000000000000000000000000000003c437a0000000000000000000000000000000000000000000000008ac7230489e80000", null, null),
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([
            new NameTypeValue("revertReason", "int64", 292n, null, "SPENDER_DOES_NOT_HAVE_ALLOWANCE")
        ])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x0000000000000000000000000000000000163b5a095ea7b300000000000000000000000000000000000000000000000000000000003c437a0000000000000000000000000000000000000000000000008ac7230489e80000")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)
        expect(functionCallAnalyzer.isRedirect.value).toBe(true)


        // 4) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        // expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x618dc65e")
        expect(functionCallAnalyzer.signature.value).toBe("function redirectForToken(address token, bytes encodedFunctionSelector) returns (int64 responseCode, bytes response)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("token", "address", "0x0000000000000000000000000000000000163b5a", null, null),
            new NameTypeValue("encodedFunctionSelector", "bytes", "0x095ea7b300000000000000000000000000000000000000000000000000000000003c437a0000000000000000000000000000000000000000000000008ac7230489e80000", null, null)
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([
            new NameTypeValue("revertReason", "int64", 292n, null, "SPENDER_DOES_NOT_HAVE_ALLOWANCE")
        ])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x0000000000000000000000000000000000163b5a095ea7b300000000000000000000000000000000000000000000000000000000003c437a0000000000000000000000000000000000000000000000008ac7230489e80000")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)
        expect(functionCallAnalyzer.isRedirect.value).toBe(true)

        mock.restore()

    })

    test("Call with redirectForToken() with revert reason", async () => {

        const mock = new MockAdapter(axios as any)

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) setup
        // Inspired from https://testnet.mirrornode.hedera.com/api/v1/contracts/results/0x81f6b1d9452dfd4876c535530d247487cebc5af40614183d2b5519550b9e1d0d/actions?limit=100
        input.value = "0x618dc65e00000000000000000000000000000000005cea6223b872dd000000000000000000000000208b15dab9903be8d34336d0b7f930e5f0a76ec5000000000000000000000000d717723692444f3d0f18d8ec2ccae7b25fc1d696000000000000000000000000000000000000000000000000000000000000000a"
        output.value = null
        error.value = "0x0000000000000000000000000000000000000000000000000000000000000124"
        revertReason.value = null
        contractId.value = "0.0.359"
        await flushPromises()
        await vi.dynamicImportSettled()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.6089314",
            "api/v1/tokens/0.0.6089314",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x23b872dd",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x618dc65e")
        expect(functionCallAnalyzer.signature.value).toBe("function redirectForToken(address token, bytes encodedFunctionSelector) returns (int64 responseCode, bytes response)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("token", "address", "0x00000000000000000000000000000000005cea62", null, null),
            new NameTypeValue("encodedFunctionSelector", "bytes", "0x23b872dd000000000000000000000000208b15dab9903be8d34336d0b7f930e5f0a76ec5000000000000000000000000d717723692444f3d0f18d8ec2ccae7b25fc1d696000000000000000000000000000000000000000000000000000000000000000a", null, null)
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x00000000000000000000000000000000005cea6223b872dd000000000000000000000000208b15dab9903be8d34336d0b7f930e5f0a76ec5000000000000000000000000d717723692444f3d0f18d8ec2ccae7b25fc1d696000000000000000000000000000000000000000000000000000000000000000a")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)


        // 4) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/0.0.6089314",
            "api/v1/tokens/0.0.6089314",
            "https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=0x23b872dd",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x618dc65e")
        expect(functionCallAnalyzer.signature.value).toBe("function redirectForToken(address token, bytes encodedFunctionSelector) returns (int64 responseCode, bytes response)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("token", "address", "0x00000000000000000000000000000000005cea62", null, null),
            new NameTypeValue("encodedFunctionSelector", "bytes", "0x23b872dd000000000000000000000000208b15dab9903be8d34336d0b7f930e5f0a76ec5000000000000000000000000d717723692444f3d0f18d8ec2ccae7b25fc1d696000000000000000000000000000000000000000000000000000000000000000a", null, null)
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x00000000000000000000000000000000005cea6223b872dd000000000000000000000000208b15dab9903be8d34336d0b7f930e5f0a76ec5000000000000000000000000d717723692444f3d0f18d8ec2ccae7b25fc1d696000000000000000000000000000000000000000000000000000000000000000a")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        mock.restore()

    })

    test("Call with revert reason", async () => {

        SignatureCache.instance.clear()

        const sourcifyURL = routeManager.currentNetworkEntry.value.sourcifySetup?.repoURL

        const mock = new MockAdapter(axios as any);
        const matcher1 = sourcifyURL + "v2/contract/295/" + CONTRACT_DETAILS_V2.evm_address + "?fields=metadata,sources"
        mock.onGet(matcher1).reply(200, SOURCIFY_RESPONSE_V2)
        const matcher2 = "api/v1/contracts/" + CONTRACT_DETAILS_V2.contract_id
        mock.onGet(matcher2).reply(200, CONTRACT_DETAILS_V2)

        // 1) new
        const input: Ref<string | null> = ref(null)
        const output: Ref<string | null> = ref(null)
        const error: Ref<string | null> = ref(null)
        const revertReason: Ref<string | null> = ref(null)
        const contractId: Ref<string | null> = ref(null)
        const functionCallAnalyzer = new FunctionCallAnalyzer(input, output, error, revertReason, contractId)
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 2) mount
        functionCallAnalyzer.mount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([])
        expect(functionCallAnalyzer.functionHash.value).toBeNull()
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBeNull()
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        // 3) setup
        input.value = "0x860882550000000000000000000000004431a822e59e12cea7fa614791ae39fe8b931d0f000000000000000000000000c159b19c5bd0e4a0709ec13c1303ff2bb67f7145000000000000000000000000d7d4d91d64a6061fa00a94e2b3a2d2a5fb67784900000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000291951fc024968e6a99dffccaee0b25cfbde402b"
        output.value = "0x"
        revertReason.value = "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a536166654d6174683a206469766973696f6e206279207a65726f000000000000"
        contractId.value = "0.0.10230659"
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" +  contractId.value,
            "http://localhost:3000/v2/contract/295/" + CONTRACT_DETAILS_V2.evm_address + "?fields=metadata,sources",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x86088255")
        expect(functionCallAnalyzer.signature.value).toBe("function depositToICHIVaultAndTryWrapToHTS(address vault, address vaultDeployer, address token, uint256 erc20Amount, uint256 minimumProceeds, address to) returns (uint256 vaultTokens)")
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([
            new NameTypeValue("vault", "address", "0x4431A822E59e12CeA7FA614791aE39Fe8b931D0f", null, null),
            new NameTypeValue("vaultDeployer", "address", "0xC159b19C5bd0E4a0709eC13C1303Ff2Bb67F7145", null, null),
            new NameTypeValue("token", "address", "0xD7D4d91d64a6061fA00a94E2b3A2D2A5FB677849", null, null),
            new NameTypeValue("erc20Amount", "uint256", 2500n, null, null),
            new NameTypeValue("minimumProceeds", "uint256", 0n, null, null),
            new NameTypeValue("to", "address", "0x291951fC024968E6a99DffCCAeE0B25CFBde402B", null, null),
        ])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([
            new NameTypeValue("", "string", "SafeMath: division by zero", null, null),
        ])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x0000000000000000000000004431a822e59e12cea7fa614791ae39fe8b931d0f000000000000000000000000c159b19c5bd0e4a0709ec13c1303ff2bb67f7145000000000000000000000000d7d4d91d64a6061fa00a94e2b3a2d2a5fb67784900000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000291951fc024968e6a99dffccaee0b25cfbde402b")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)


        // 4) unmount
        functionCallAnalyzer.unmount()
        await flushPromises()
        expect(fetchGetURLs(mock)).toStrictEqual([
            "api/v1/contracts/" +  contractId.value,
            "http://localhost:3000/v2/contract/295/" + CONTRACT_DETAILS_V2.evm_address + "?fields=metadata,sources",
        ])
        expect(functionCallAnalyzer.functionHash.value).toBe("0x86088255")
        expect(functionCallAnalyzer.signature.value).toBeNull()
        expect(functionCallAnalyzer.inputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.outputs.value).toStrictEqual([])
        expect(functionCallAnalyzer.errorHash.value).toBeNull()
        expect(functionCallAnalyzer.errorSignature.value).toBeNull()
        expect(functionCallAnalyzer.errorInputs.value).toStrictEqual([
            new NameTypeValue("revertReason", "byte", "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a536166654d6174683a206469766973696f6e206279207a65726f000000000000", null, null),
        ])
        expect(functionCallAnalyzer.inputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.outputDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.errorDecodingStatus.value).toBeNull()
        expect(functionCallAnalyzer.inputArgsOnly.value).toBe("0x0000000000000000000000004431a822e59e12cea7fa614791ae39fe8b931d0f000000000000000000000000c159b19c5bd0e4a0709ec13c1303ff2bb67f7145000000000000000000000000d7d4d91d64a6061fa00a94e2b3a2d2a5fb67784900000000000000000000000000000000000000000000000000000000000009c40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000291951fc024968e6a99dffccaee0b25cfbde402b")
        expect(functionCallAnalyzer.is4byteSignature.value).toBe(false)

        SignatureCache.instance.clear()
        mock.restore()

    })
})


const CONTRACT_DETAILS = {
    "admin_key": null,
    "auto_renew_account": "0.0.1058134",
    "auto_renew_period": 7776000,
    "contract_id": "0.0.3045981",
    "created_timestamp": "1687833512.379071003",
    "deleted": false,
    "evm_address": "0x00000000000000000000000000000000002e7a5d",
    "expiration_timestamp": "1695609512.379071003",
    "file_id": "0.0.3045977",
    "max_automatic_token_associations": 0,
    "memo": "",
    "nonce": null,
    "obtainer_id": null,
    "permanent_removal": null,
    "proxy_account_id": null,
    "timestamp": {
        "from": "1687833512.379071003",
        "to": null
    },
    "bytecode": "0x60e06040523480156200001157600080fd5b506040516200528d3803806200528d833981810160405260408110156200003757600080fd5b5080516020918201516001600160601b0319606083811b821660805282901b1660a05260408051637e062a3560e11b81529051929391926000926001600160a01b0385169263fc0c546a926004808301939282900301818787803b1580156200009f57600080fd5b505af1158015620000b4573d6000803e3d6000fd5b505050506040513d6020811015620000cb57600080fd5b50519050620000db3082620000f4565b60601b6001600160601b03191660c05250620002919050565b60006200010d83836200016a60201b6200362b1760201c565b90506016811462000165576040805162461bcd60e51b815260206004820152601f60248201527f536166652073696e676c65206173736f63696174696f6e206661696c65642100604482015290519081900360640190fd5b505050565b604080516001600160a01b038481166024830152831660448083019190915282518083039091018152606490910182526020810180516001600160e01b031663248a35ef60e11b17815291518151600093849360609361016793919290918291908083835b60208310620001f05780518252601f199092019160209182019101620001cf565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d806000811462000254576040519150601f19603f3d011682016040523d82523d6000602084013e62000259565b606091505b5091509150816200026c57601562000285565b8080602001905160208110156200028257600080fd5b50515b60030b95945050505050565b60805160601c60a05160601c60c05160601c614e95620003f860003980610ecc5280610f0b528061106c528061128d52806116d65280611add5280611b6a5280611c9b5280611d865280611ec0528061224f52806122d452806123c9528061250b5280612bf75280612c5b5280612ee752806130e0528061318152806131da5280613392525080610f2c5280610f5352806112ae52806112ec5280611da75280611dce528061200652806123ea528061241152806125a45280612a3c5280612d48528061320e52806134d5525080610c525280610d0d52806110fa52806111d152806113b3528061157b5280611764528061187c5280611c275280611f53528061204e528061219f52806125d052806127fc52806129eb5280612a145280612aab5280612c2b5280612f145280612fd252806130af52806131b85280613425528061351d52806137565280613ded5280613e30528061410a52806142805250614e956000f3fe6080604052600436106101555760003560e01c80638803dbee116100c1578063c45a01551161007a578063c45a01551461098b578063d06ca61f146109a0578063d07e5b2814610a55578063e8e3370014610a6a578063f305d71914610acc578063f803710d14610b12578063fb3bdb4114610b5857610155565b80638803dbee1461075a578063a74d5086146107f0578063ad615dec14610821578063af2979eb14610857578063b6f9de95146108aa578063baa2abde1461092e57610155565b806338ed17391161011357806338ed1739146104465780634a25d94a146104dc5780635c11d79514610572578063791ac9471461060a5780637ff36ab5146106a057806385f8c2591461072457610155565b80629e421a1461015a57806302751cec146101cd578063054d50d41461023957806318cbafe5146102815780631f00ca74146103675780632e3cff6a1461041c575b600080fd5b6101af600480360361010081101561017157600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359160808201359160a08101359160c0820135169060e00135610bdc565b60408051938452602084019290925282820152519081900360600190f35b3480156101d957600080fd5b50610220600480360360c08110156101f057600080fd5b506001600160a01b0381358116916020810135916040820135916060810135916080820135169060a00135610e75565b6040805192835260208301919091528051918290030190f35b34801561024557600080fd5b5061026f6004803603606081101561025c57600080fd5b5080359060208101359060400135611007565b60408051918252519081900360200190f35b34801561028d57600080fd5b50610317600480360360a08110156102a457600080fd5b813591602081013591810190606081016040820135600160201b8111156102ca57600080fd5b8201836020820111156102dc57600080fd5b803590602001918460208302840111600160201b831117156102fd57600080fd5b91935091506001600160a01b03813516906020013561101c565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561035357818101518382015260200161033b565b505050509050019250505060405180910390f35b34801561037357600080fd5b506103176004803603604081101561038a57600080fd5b81359190810190604081016020820135600160201b8111156103ab57600080fd5b8201836020820111156103bd57600080fd5b803590602001918460208302840111600160201b831117156103de57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295506113ac945050505050565b34801561042857600080fd5b5061026f6004803603602081101561043f57600080fd5b50356113e2565b34801561045257600080fd5b50610317600480360360a081101561046957600080fd5b813591602081013591810190606081016040820135600160201b81111561048f57600080fd5b8201836020820111156104a157600080fd5b803590602001918460208302840111600160201b831117156104c257600080fd5b91935091506001600160a01b038135169060200135611530565b3480156104e857600080fd5b50610317600480360360a08110156104ff57600080fd5b813591602081013591810190606081016040820135600160201b81111561052557600080fd5b82018360208201111561053757600080fd5b803590602001918460208302840111600160201b8311171561055857600080fd5b91935091506001600160a01b038135169060200135611686565b34801561057e57600080fd5b50610608600480360360a081101561059557600080fd5b813591602081013591810190606081016040820135600160201b8111156105bb57600080fd5b8201836020820111156105cd57600080fd5b803590602001918460208302840111600160201b831117156105ee57600080fd5b91935091506001600160a01b038135169060200135611812565b005b34801561061657600080fd5b50610608600480360360a081101561062d57600080fd5b813591602081013591810190606081016040820135600160201b81111561065357600080fd5b82018360208201111561066557600080fd5b803590602001918460208302840111600160201b8311171561068657600080fd5b91935091506001600160a01b038135169060200135611a8f565b610317600480360360808110156106b657600080fd5b81359190810190604081016020820135600160201b8111156106d757600080fd5b8201836020820111156106e957600080fd5b803590602001918460208302840111600160201b8311171561070a57600080fd5b91935091506001600160a01b038135169060200135611e78565b34801561073057600080fd5b5061026f6004803603606081101561074757600080fd5b5080359060208101359060400135612147565b34801561076657600080fd5b50610317600480360360a081101561077d57600080fd5b813591602081013591810190606081016040820135600160201b8111156107a357600080fd5b8201836020820111156107b557600080fd5b803590602001918460208302840111600160201b831117156107d657600080fd5b91935091506001600160a01b038135169060200135612154565b3480156107fc57600080fd5b5061080561224d565b604080516001600160a01b039092168252519081900360200190f35b34801561082d57600080fd5b5061026f6004803603606081101561084457600080fd5b5080359060208101359060400135612271565b34801561086357600080fd5b5061026f600480360360c081101561087a57600080fd5b506001600160a01b0381358116916020810135916040820135916060810135916080820135169060a0013561227e565b610608600480360360808110156108c057600080fd5b81359190810190604081016020820135600160201b8111156108e157600080fd5b8201836020820111156108f357600080fd5b803590602001918460208302840111600160201b8311171561091457600080fd5b91935091506001600160a01b0381351690602001356124c5565b34801561093a57600080fd5b50610220600480360360e081101561095157600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359160808201359160a08101359091169060c001356127ae565b34801561099757600080fd5b506108056129e9565b3480156109ac57600080fd5b50610317600480360360408110156109c357600080fd5b81359190810190604081016020820135600160201b8111156109e457600080fd5b8201836020820111156109f657600080fd5b803590602001918460208302840111600160201b83111715610a1757600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550612a0d945050505050565b348015610a6157600080fd5b50610805612a3a565b348015610a7657600080fd5b506101af6004803603610100811015610a8e57600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359160808201359160a08101359160c0820135169060e00135612a5e565b6101af600480360360c0811015610ae257600080fd5b506001600160a01b0381358116916020810135916040820135916060810135916080820135169060a00135612ba8565b6101af600480360360c0811015610b2857600080fd5b506001600160a01b0381358116916020810135916040820135916060810135916080820135169060a00135612e7e565b61031760048036036080811015610b6e57600080fd5b81359190810190604081016020820135600160201b811115610b8f57600080fd5b820183602082011115610ba157600080fd5b803590602001918460208302840111600160201b83111715610bc257600080fd5b91935091506001600160a01b03813516906020013561334a565b60008060008342811015610c25576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6040805163e6a4390560e01b81526001600160a01b038e811660048301528d8116602483015291516000927f0000000000000000000000000000000000000000000000000000000000000000169163e6a43905916044808301926020929190829003018186803b158015610c9857600080fd5b505afa158015610cac573d6000803e3d6000fd5b505050506040513d6020811015610cc257600080fd5b50516001600160a01b031614610d095760405162461bcd60e51b8152600401808060200182810382526024815260200180614c9b6024913960400191505060405180910390fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663c9c65396348f8f6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506020604051808303818588803b158015610d8b57600080fd5b505af1158015610d9f573d6000803e3d6000fd5b50505050506040513d6020811015610db657600080fd5b50519050610dc88d8d8d8d8d8d61374b565b9095509350610dd98d33838861386b565b610de58c33838761386b565b806001600160a01b0316636a627842886040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050602060405180830381600087803b158015610e3457600080fd5b505af1158015610e48573d6000803e3d6000fd5b505050506040513d6020811015610e5e57600080fd5b5051949d939c50939a509198505050505050505050565b6000808242811015610ebc576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b610ec6308a613934565b610ef5897f00000000000000000000000000000000000000000000000000000000000000008a8a8a308a6127ae565b9093509150610f068930878661386b565b610f517f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000008461399c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d9caed123087856040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018281526020019350505050600060405180830381600087803b158015610fd957600080fd5b505af1158015610fed573d6000803e3d6000fd5b50505050610ffb308a613a4e565b50965096945050505050565b6000611014848484613a5a565b949350505050565b60608142811015611062576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168686600019810181811061109c57fe5b905060200201356001600160a01b03166001600160a01b0316146110f5576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b6111537f000000000000000000000000000000000000000000000000000000000000000089888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613b3292505050565b9150868260018451038151811061116657fe5b602002602001015110156111ab5760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b611249868660008181106111bb57fe5b905060200201356001600160a01b03163361122f7f00000000000000000000000000000000000000000000000000000000000000008a8a60008181106111fd57fe5b905060200201356001600160a01b03168b8b600181811061121a57fe5b905060200201356001600160a01b0316613c7e565b8560008151811061123c57fe5b602002602001015161386b565b61128882878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250309250613d3e915050565b6112ea7f00000000000000000000000000000000000000000000000000000000000000007f0000000000000000000000000000000000000000000000000000000000000000846001865103815181106112dd57fe5b602002602001015161399c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d9caed1230868560018751038151811061132b57fe5b60200260200101516040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018281526020019350505050600060405180830381600087803b15801561138957600080fd5b505af115801561139d573d6000803e3d6000fd5b50505050509695505050505050565b60606113d97f00000000000000000000000000000000000000000000000000000000000000008484613f7b565b90505b92915050565b60408051602480820184905282518083039091018152604490910182526020810180516001600160e01b031663171e7fb560e11b17815291518151600093849360609361016893919290918291908083835b602083106114535780518252601f199092019160209182019101611434565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146114b5576040519150601f19603f3d011682016040523d82523d6000602084013e6114ba565b606091505b509150915081611511576040805162461bcd60e51b815260206004820152601b60248201527f54696e7963656e7473546f54696e7962617273206661696c6564210000000000604482015290519081900360640190fd5b80806020019051602081101561152657600080fd5b5051949350505050565b60608142811015611576576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6115d47f000000000000000000000000000000000000000000000000000000000000000089888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613b3292505050565b915086826001845103815181106115e757fe5b6020026020010151101561162c5760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b61163c868660008181106111bb57fe5b61167b82878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250899250613d3e915050565b509695505050505050565b606081428110156116cc576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000168686600019810181811061170657fe5b905060200201356001600160a01b03166001600160a01b03161461175f576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b6117bd7f000000000000000000000000000000000000000000000000000000000000000089888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613f7b92505050565b915086826000815181106117cd57fe5b602002602001015111156111ab5760405162461bcd60e51b8152600401808060200182810382526027815260200180614d5a6027913960400191505060405180910390fd5b8042811015611856576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6118cb8585600081811061186657fe5b905060200201356001600160a01b0316336118c57f0000000000000000000000000000000000000000000000000000000000000000898960008181106118a857fe5b905060200201356001600160a01b03168a8a600181811061121a57fe5b8a61386b565b6000858560001981018181106118dd57fe5b905060200201356001600160a01b03166001600160a01b03166370a08231856040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561193957600080fd5b505afa15801561194d573d6000803e3d6000fd5b505050506040513d602081101561196357600080fd5b505160408051602088810282810182019093528882529293506119a59290918991899182918501908490808284376000920191909152508892506140b3915050565b86611a4882888860001981018181106119ba57fe5b905060200201356001600160a01b03166001600160a01b03166370a08231886040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611a1657600080fd5b505afa158015611a2a573d6000803e3d6000fd5b505050506040513d6020811015611a4057600080fd5b5051906143b5565b1015611a855760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b5050505050505050565b8042811015611ad3576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001685856000198101818110611b0d57fe5b905060200201356001600160a01b03166001600160a01b031614611b66576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611bd557600080fd5b505afa158015611be9573d6000803e3d6000fd5b505050506040513d6020811015611bff57600080fd5b50519050611c598686600081611c1157fe5b905060200201356001600160a01b031633611c537f00000000000000000000000000000000000000000000000000000000000000008a8a60008181106111fd57fe5b8b61386b565b611c978686808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152503092506140b3915050565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611d0657600080fd5b505afa158015611d1a573d6000803e3d6000fd5b505050506040513d6020811015611d3057600080fd5b505190506000611d4082846143b5565b905088811015611d815760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b611dcc7f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000008361399c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d9caed123088846040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018281526020019350505050600060405180830381600087803b158015611e5457600080fd5b505af1158015611e68573d6000803e3d6000fd5b5050505050505050505050505050565b60608142811015611ebe576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031686866000818110611ef557fe5b905060200201356001600160a01b03166001600160a01b031614611f4e576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b611fac7f000000000000000000000000000000000000000000000000000000000000000034888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613b3292505050565b91508682600184510381518110611fbf57fe5b602002602001015110156120045760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663f9609f088360008151811061204057fe5b6020026020010151336120977f00000000000000000000000000000000000000000000000000000000000000008b8b600081811061207a57fe5b905060200201356001600160a01b03168c8c600181811061121a57fe5b6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b1580156120e557600080fd5b505af11580156120f9573d6000803e3d6000fd5b505050505061213d82878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250899250613d3e915050565b5095945050505050565b6000611014848484614405565b6060814281101561219a576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6121f87f000000000000000000000000000000000000000000000000000000000000000089888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613f7b92505050565b9150868260008151811061220857fe5b6020026020010151111561162c5760405162461bcd60e51b8152600401808060200182810382526027815260200180614d5a6027913960400191505060405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000081565b60006110148484846144dd565b600081428110156122c4576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6122ce3089613934565b6122fd887f000000000000000000000000000000000000000000000000000000000000000089898930896127ae565b604080516370a0823160e01b81523060048201529051919450600092506001600160a01b038b16916370a0823191602480820192602092909190829003018186803b15801561234b57600080fd5b505afa15801561235f573d6000803e3d6000fd5b505050506040513d602081101561237557600080fd5b50519050868110156123b85760405162461bcd60e51b815260040180806020018281038252602a815260200180614cbf602a913960400191505060405180910390fd5b6123c48930878461386b565b61240f7f00000000000000000000000000000000000000000000000000000000000000007f00000000000000000000000000000000000000000000000000000000000000008561399c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663d9caed123087866040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018281526020019350505050600060405180830381600087803b15801561249757600080fd5b505af11580156124ab573d6000803e3d6000fd5b505050506124b9308a613a4e565b50509695505050505050565b8042811015612509576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03168585600081811061254057fe5b905060200201356001600160a01b03166001600160a01b031614612599576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b346001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001663f9609f0882336125fa7f00000000000000000000000000000000000000000000000000000000000000008b8b60008161207a57fe5b6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b15801561264857600080fd5b505af115801561265c573d6000803e3d6000fd5b5050505050600086866001898990500381811061267557fe5b905060200201356001600160a01b03166001600160a01b03166370a08231866040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156126d157600080fd5b505afa1580156126e5573d6000803e3d6000fd5b505050506040513d60208110156126fb57600080fd5b5051604080516020898102828101820190935289825292935061273d9290918a918a9182918501908490808284376000920191909152508992506140b3915050565b87611a48828989600019810181811061275257fe5b905060200201356001600160a01b03166001600160a01b03166370a08231896040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611a1657600080fd5b60008082428110156127f5576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b60006128227f00000000000000000000000000000000000000000000000000000000000000008c8c613c7e565b90506000816001600160a01b0316635fcbd2856040518163ffffffff1660e01b815260040160206040518083038186803b15801561285f57600080fd5b505afa158015612873573d6000803e3d6000fd5b505050506040513d602081101561288957600080fd5b505190506128998133848d61386b565b600080836001600160a01b03166389afcb448a6040518263ffffffff1660e01b815260040180826001600160a01b031681526020019150506040805180830381600087803b1580156128ea57600080fd5b505af11580156128fe573d6000803e3d6000fd5b505050506040513d604081101561291457600080fd5b5080516020909101519092509050600061292e8f8f614583565b509050806001600160a01b03168f6001600160a01b031614612951578183612954565b82825b90985096508b8810156129985760405162461bcd60e51b8152600401808060200182810382526026815260200180614da16026913960400191505060405180910390fd5b8a8710156129d75760405162461bcd60e51b8152600401808060200182810382526026815260200180614c756026913960400191505060405180910390fd5b50505050505097509795505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60606113d97f00000000000000000000000000000000000000000000000000000000000000008484613b32565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008060008342811015612aa7576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e6a439058e8e6040518363ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b031681526020019250505060206040518083038186803b158015612b2757600080fd5b505afa158015612b3b573d6000803e3d6000fd5b505050506040513d6020811015612b5157600080fd5b505190506001600160a01b038116612b9a5760405162461bcd60e51b8152600401808060200182810382526024815260200180614d116024913960400191505060405180910390fd5b610dc88d8d8d8d8d8d61374b565b60008060008342811015612bf1576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b612c1f8a7f00000000000000000000000000000000000000000000000000000000000000008b348c8c61374b565b809450819550505060007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663e6a439058c7f00000000000000000000000000000000000000000000000000000000000000006040518363ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b031681526020019250505060206040518083038186803b158015612cc757600080fd5b505afa158015612cdb573d6000803e3d6000fd5b505050506040513d6020811015612cf157600080fd5b505190506001600160a01b038116612d3a5760405162461bcd60e51b8152600401808060200182810382526024815260200180614d116024913960400191505060405180910390fd5b612d468b33838861386b565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663f9609f088533846040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b158015612dc657600080fd5b505af1158015612dda573d6000803e3d6000fd5b5050505050806001600160a01b0316636a627842886040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050602060405180830381600087803b158015612e2e57600080fd5b505af1158015612e42573d6000803e3d6000fd5b505050506040513d6020811015612e5857600080fd5b5051925034841015612e7057612e7033853403614661565b505096509650969350505050565b60008060008342811015612ec7576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6040805163e6a4390560e01b81526001600160a01b038c811660048301527f00000000000000000000000000000000000000000000000000000000000000008116602483015291516000927f0000000000000000000000000000000000000000000000000000000000000000169163e6a43905916044808301926020929190829003018186803b158015612f5a57600080fd5b505afa158015612f6e573d6000803e3d6000fd5b505050506040513d6020811015612f8457600080fd5b50516001600160a01b031614612fcb5760405162461bcd60e51b8152600401808060200182810382526024815260200180614c9b6024913960400191505060405180910390fd5b600061305a7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663881a075a6040518163ffffffff1660e01b815260040160206040518083038186803b15801561302957600080fd5b505afa15801561303d573d6000803e3d6000fd5b505050506040513d602081101561305357600080fd5b50516113e2565b90508034116130ad576040805162461bcd60e51b815260206004820152601a602482015279556e69737761705632526f757465723a204d53472e56414c554560301b604482015290519081900360640190fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663c9c65396828d7f00000000000000000000000000000000000000000000000000000000000000006040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506020604051808303818588803b15801561314d57600080fd5b505af1158015613161573d6000803e3d6000fd5b50505050506040513d602081101561317857600080fd5b506131ac90508b7f00000000000000000000000000000000000000000000000000000000000000008c348590038d8d61374b565b909550935060006131fe7f00000000000000000000000000000000000000000000000000000000000000008d7f0000000000000000000000000000000000000000000000000000000000000000613c7e565b905061320c8c33838961386b565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663f9609f088633846040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b15801561328c57600080fd5b505af11580156132a0573d6000803e3d6000fd5b5050505050806001600160a01b0316636a627842896040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050602060405180830381600087803b1580156132f457600080fd5b505af1158015613308573d6000803e3d6000fd5b505050506040513d602081101561331e57600080fd5b505193503482900385101561333b5761333b338684340303614661565b50505096509650969350505050565b60608142811015613390576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316868660008181106133c757fe5b905060200201356001600160a01b03166001600160a01b031614613420576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b61347e7f000000000000000000000000000000000000000000000000000000000000000088888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613f7b92505050565b9150348260008151811061348e57fe5b602002602001015111156134d35760405162461bcd60e51b8152600401808060200182810382526027815260200180614d5a6027913960400191505060405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663f9609f088360008151811061350f57fe5b6020026020010151336135497f00000000000000000000000000000000000000000000000000000000000000008b8b600081811061207a57fe5b6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b15801561359757600080fd5b505af11580156135ab573d6000803e3d6000fd5b50505050506135ef82878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250899250613d3e915050565b816000815181106135fc57fe5b602002602001015134111561213d5761213d338360008151811061361c57fe5b60200260200101513403614661565b604080516001600160a01b038481166024830152831660448083019190915282518083039091018152606490910182526020810180516001600160e01b031663248a35ef60e11b17815291518151600093849360609361016793919290918291908083835b602083106136af5780518252601f199092019160209182019101613690565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114613711576040519150601f19603f3d011682016040523d82523d6000602084013e613716565b606091505b50915091508161372757601561373f565b80806020019051602081101561373c57600080fd5b50515b60030b95945050505050565b60008060008061377c7f00000000000000000000000000000000000000000000000000000000000000008b8b614754565b9150915081600014801561378e575080155b1561379e5787935086925061385e565b60006137ab8984846144dd565b90508781116137fe57858110156137f35760405162461bcd60e51b8152600401808060200182810382526026815260200180614c756026913960400191505060405180910390fd5b88945092508261385c565b600061380b8984866144dd565b90508981111561381757fe5b878110156138565760405162461bcd60e51b8152600401808060200182810382526026815260200180614da16026913960400191505060405180910390fd5b94508793505b505b5050965096945050505050565b600061388185858561387c8661481b565b614868565b9050601681146138d8576040805162461bcd60e51b815260206004820152601b60248201527f5361666520746f6b656e207472616e73666572206661696c6564210000000000604482015290519081900360640190fd5b826001600160a01b0316846001600160a01b03167f831ac82b07fb396dafef0077cea6e002235d88e63f35cbd5df2c065107f1e74a84604051808267ffffffffffffffff16815260200191505060405180910390a35050505050565b6000613940838361362b565b905060168114613997576040805162461bcd60e51b815260206004820152601f60248201527f536166652073696e676c65206173736f63696174696f6e206661696c65642100604482015290519081900360640190fd5b505050565b60006139b184846139ac8561481b565b61499c565b9050601681146139ff576040805162461bcd60e51b81526020600482015260146024820152735361666520617070726f7665206661696c65642160601b604482015290519081900360640190fd5b6040805167ffffffffffffffff8416815290516001600160a01b038516917fdece45634c9b2787e4a3beb04937674cb331abb1e6ce01b6febe8f4d69717280919081900360200190a250505050565b60006139408383614ac7565b6000808411613a9a5760405162461bcd60e51b815260040180806020018281038252602b815260200180614e15602b913960400191505060405180910390fd5b600083118015613aaa5750600082115b613ae55760405162461bcd60e51b8152600401808060200182810382526028815260200180614ce96028913960400191505060405180910390fd5b6000613af3856103e5614b4a565b90506000613b018285614b4a565b90506000613b1b83613b15886103e8614b4a565b90614bad565b9050808281613b2657fe5b04979650505050505050565b6060600282511015613b8b576040805162461bcd60e51b815260206004820152601e60248201527f556e697377617056324c6962726172793a20494e56414c49445f504154480000604482015290519081900360640190fd5b815167ffffffffffffffff81118015613ba357600080fd5b50604051908082528060200260200182016040528015613bcd578160200160208202803683370190505b5090508281600081518110613bde57fe5b60200260200101818152505060005b6001835103811015613c7657600080613c3087868581518110613c0c57fe5b6020026020010151878660010181518110613c2357fe5b6020026020010151614754565b91509150613c52848481518110613c4357fe5b60200260200101518383613a5a565b848460010181518110613c6157fe5b60209081029190910101525050600101613bed565b509392505050565b6000806000613c8d8585614583565b604080516bffffffffffffffffffffffff19606094851b811660208084019190915293851b81166034830152825160288184030181526048830184528051908501206001600160f81b031960688401529a90941b9093166069840152607d8301989098527f407b3b02625070246aa1a1a346747a190d54149fc468122d6934af99b6ad0e6a609d808401919091528851808403909101815260bd909201909752805196019590952095945050505050565b60005b6001835103811015613f7557600080848381518110613d5c57fe5b6020026020010151858460010181518110613d7357fe5b6020026020010151915091506000613d8b8383614583565b5090506000878560010181518110613d9f57fe5b60200260200101519050600080836001600160a01b0316866001600160a01b031614613dcd57826000613dd1565b6000835b91509150600060028a51038810613de85788613e29565b613e297f0000000000000000000000000000000000000000000000000000000000000000878c8b60020181518110613e1c57fe5b6020026020010151613c7e565b9050613e567f00000000000000000000000000000000000000000000000000000000000000008888613c7e565b6001600160a01b031663022c0d9f84848460006040519080825280601f01601f191660200182016040528015613e93576020820181803683370190505b506040518563ffffffff1660e01b815260040180858152602001848152602001836001600160a01b0316815260200180602001828103825283818151815260200191508051906020019080838360005b83811015613efb578181015183820152602001613ee3565b50505050905090810190601f168015613f285780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b158015613f4a57600080fd5b505af1158015613f5e573d6000803e3d6000fd5b505060019099019850613d41975050505050505050565b50505050565b6060600282511015613fd4576040805162461bcd60e51b815260206004820152601e60248201527f556e697377617056324c6962726172793a20494e56414c49445f504154480000604482015290519081900360640190fd5b815167ffffffffffffffff81118015613fec57600080fd5b50604051908082528060200260200182016040528015614016578160200160208202803683370190505b509050828160018351038151811061402a57fe5b60209081029190910101528151600019015b8015613c765760008061406c8786600186038151811061405857fe5b6020026020010151878681518110613c2357fe5b9150915061408e84848151811061407f57fe5b60200260200101518383614405565b84600185038151811061409d57fe5b602090810291909101015250506000190161403c565b60005b6001835103811015613997576000808483815181106140d157fe5b60200260200101518584600101815181106140e857fe5b60200260200101519150915060006141008383614583565b50905060006141307f00000000000000000000000000000000000000000000000000000000000000008585613c7e565b9050600080600080846001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b15801561417157600080fd5b505afa158015614185573d6000803e3d6000fd5b505050506040513d606081101561419b57600080fd5b5080516020909101516001600160701b0391821693501690506000806001600160a01b038a8116908916146141d15782846141d4565b83835b91509150614229828b6001600160a01b03166370a082318a6040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611a1657600080fd5b9550614236868383613a5a565b945050505050600080856001600160a01b0316886001600160a01b03161461426057826000614264565b6000835b91509150600060028c51038a1061427b578a6142af565b6142af7f0000000000000000000000000000000000000000000000000000000000000000898e8d60020181518110613e1c57fe5b604080516000808252602082019283905263022c0d9f60e01b835260248201878152604483018790526001600160a01b038086166064850152608060848501908152845160a48601819052969750908c169563022c0d9f958a958a958a9591949193919260c486019290918190849084905b83811015614339578181015183820152602001614321565b50505050905090810190601f1680156143665780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b15801561438857600080fd5b505af115801561439c573d6000803e3d6000fd5b50506001909b019a506140b69950505050505050505050565b808203828111156113dc576040805162461bcd60e51b815260206004820152601560248201527464732d6d6174682d7375622d756e646572666c6f7760581b604482015290519081900360640190fd5b60008084116144455760405162461bcd60e51b815260040180806020018281038252602c815260200180614c24602c913960400191505060405180910390fd5b6000831180156144555750600082115b6144905760405162461bcd60e51b8152600401808060200182810382526028815260200180614ce96028913960400191505060405180910390fd5b60006144a86103e86144a28688614b4a565b90614b4a565b905060006144bc6103e56144a286896143b5565b90506144d360018284816144cc57fe5b0490614bad565b9695505050505050565b600080841161451d5760405162461bcd60e51b8152600401808060200182810382526025815260200180614d356025913960400191505060405180910390fd5b60008311801561452d5750600082115b6145685760405162461bcd60e51b8152600401808060200182810382526028815260200180614ce96028913960400191505060405180910390fd5b826145738584614b4a565b8161457a57fe5b04949350505050565b600080826001600160a01b0316846001600160a01b031614156145d75760405162461bcd60e51b8152600401808060200182810382526025815260200180614c506025913960400191505060405180910390fd5b826001600160a01b0316846001600160a01b0316106145f75782846145fa565b83835b90925090506001600160a01b03821661465a576040805162461bcd60e51b815260206004820152601e60248201527f556e697377617056324c6962726172793a205a45524f5f414444524553530000604482015290519081900360640190fd5b9250929050565b604080516000808252602082019092526001600160a01b0384169083906040518082805190602001908083835b602083106146ad5780518252601f19909201916020918201910161468e565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d806000811461470f576040519150601f19603f3d011682016040523d82523d6000602084013e614714565b606091505b50509050806139975760405162461bcd60e51b8152600401808060200182810382526023815260200180614dc76023913960400191505060405180910390fd5b60008060006147638585614583565b509050600080614774888888613c7e565b6001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b1580156147ac57600080fd5b505afa1580156147c0573d6000803e3d6000fd5b505050506040513d60608110156147d657600080fd5b5080516020909101516001600160701b0391821693501690506001600160a01b038781169084161461480957808261480c565b81815b90999098509650505050505050565b6000677fffffffffffffff8211156148645760405162461bcd60e51b8152600401808060200182810382526027815260200180614bfd6027913960400191505060405180910390fd5b5090565b604080516001600160a01b038681166024830152858116604483015284166064820152600783900b6084808301919091528251808303909101815260a490910182526020810180516001600160e01b031663eca3691760e01b17815291518151600093849360609361016793919290918291908083835b602083106148fe5780518252601f1990920191602091820191016148df565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114614960576040519150601f19603f3d011682016040523d82523d6000602084013e614965565b606091505b50915091508161497657601561498e565b80806020019051602081101561498b57600080fd5b50515b60030b979650505050505050565b604080516001600160a01b03858116602483015284166044820152600783900b60648083019190915282518083039091018152608490910182526020810180516001600160e01b031663e1f21c6760e01b17815291518151600093849360609361016793919290918291908083835b60208310614a2a5780518252601f199092019160209182019101614a0b565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114614a8c576040519150601f19603f3d011682016040523d82523d6000602084013e614a91565b606091505b509150915081614aa2576015614aba565b808060200190516020811015614ab757600080fd5b50515b60030b9695505050505050565b604080516001600160a01b038481166024830152831660448083019190915282518083039091018152606490910182526020810180516001600160e01b0316630132f29d60e31b1781529151815160009384936060936101679391929091829190808383602083106136af5780518252601f199092019160209182019101613690565b6000811580614b6557505080820282828281614b6257fe5b04145b6113dc576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6d756c2d6f766572666c6f7760601b604482015290519081900360640190fd5b808201828110156113dc576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6164642d6f766572666c6f7760601b604482015290519081900360640190fdfe53616665436173743a2076616c756520646f65736e27742066697420696e20616e20696e743634556e697377617056324c6962726172793a20494e53554646494349454e545f4f55545055545f414d4f554e54556e697377617056324c6962726172793a204944454e544943414c5f414444524553534553556e69737761705632526f757465723a20494e53554646494349454e545f425f414d4f554e54556e69737761705632526f757465723a20504f4f4c20414c524541445920455849535453556e69737761705632526f757465723a20494e53554646494349454e545f415f414d4f554e545f464f54556e697377617056324c6962726172793a20494e53554646494349454e545f4c4951554944495459556e69737761705632526f757465723a205041495220444f4553204e4f54204558495354556e697377617056324c6962726172793a20494e53554646494349454e545f414d4f554e54556e69737761705632526f757465723a204558434553534956455f494e5055545f414d4f554e54556e69737761705632526f757465723a20494e56414c49445f50415448000000556e69737761705632526f757465723a20494e53554646494349454e545f415f414d4f554e545472616e7366657248656c7065723a204554485f5452414e534645525f4641494c4544556e69737761705632526f757465723a20494e53554646494349454e545f4f55545055545f414d4f554e54556e697377617056324c6962726172793a20494e53554646494349454e545f494e5055545f414d4f554e54556e69737761705632526f757465723a20455850495245440000000000000000a26469706673582212205dd71bf7036e8e401a228b3eb7382b2e9c2a4320e6c1accc6ef06a3f5bc0b4d564736f6c634300060c0033",
    "runtime_bytecode": "0x6080604052600436106101555760003560e01c80638803dbee116100c1578063c45a01551161007a578063c45a01551461098b578063d06ca61f146109a0578063d07e5b2814610a55578063e8e3370014610a6a578063f305d71914610acc578063f803710d14610b12578063fb3bdb4114610b5857610155565b80638803dbee1461075a578063a74d5086146107f0578063ad615dec14610821578063af2979eb14610857578063b6f9de95146108aa578063baa2abde1461092e57610155565b806338ed17391161011357806338ed1739146104465780634a25d94a146104dc5780635c11d79514610572578063791ac9471461060a5780637ff36ab5146106a057806385f8c2591461072457610155565b80629e421a1461015a57806302751cec146101cd578063054d50d41461023957806318cbafe5146102815780631f00ca74146103675780632e3cff6a1461041c575b600080fd5b6101af600480360361010081101561017157600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359160808201359160a08101359160c0820135169060e00135610bdc565b60408051938452602084019290925282820152519081900360600190f35b3480156101d957600080fd5b50610220600480360360c08110156101f057600080fd5b506001600160a01b0381358116916020810135916040820135916060810135916080820135169060a00135610e75565b6040805192835260208301919091528051918290030190f35b34801561024557600080fd5b5061026f6004803603606081101561025c57600080fd5b5080359060208101359060400135611007565b60408051918252519081900360200190f35b34801561028d57600080fd5b50610317600480360360a08110156102a457600080fd5b813591602081013591810190606081016040820135600160201b8111156102ca57600080fd5b8201836020820111156102dc57600080fd5b803590602001918460208302840111600160201b831117156102fd57600080fd5b91935091506001600160a01b03813516906020013561101c565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561035357818101518382015260200161033b565b505050509050019250505060405180910390f35b34801561037357600080fd5b506103176004803603604081101561038a57600080fd5b81359190810190604081016020820135600160201b8111156103ab57600080fd5b8201836020820111156103bd57600080fd5b803590602001918460208302840111600160201b831117156103de57600080fd5b9190808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152509295506113ac945050505050565b34801561042857600080fd5b5061026f6004803603602081101561043f57600080fd5b50356113e2565b34801561045257600080fd5b50610317600480360360a081101561046957600080fd5b813591602081013591810190606081016040820135600160201b81111561048f57600080fd5b8201836020820111156104a157600080fd5b803590602001918460208302840111600160201b831117156104c257600080fd5b91935091506001600160a01b038135169060200135611530565b3480156104e857600080fd5b50610317600480360360a08110156104ff57600080fd5b813591602081013591810190606081016040820135600160201b81111561052557600080fd5b82018360208201111561053757600080fd5b803590602001918460208302840111600160201b8311171561055857600080fd5b91935091506001600160a01b038135169060200135611686565b34801561057e57600080fd5b50610608600480360360a081101561059557600080fd5b813591602081013591810190606081016040820135600160201b8111156105bb57600080fd5b8201836020820111156105cd57600080fd5b803590602001918460208302840111600160201b831117156105ee57600080fd5b91935091506001600160a01b038135169060200135611812565b005b34801561061657600080fd5b50610608600480360360a081101561062d57600080fd5b813591602081013591810190606081016040820135600160201b81111561065357600080fd5b82018360208201111561066557600080fd5b803590602001918460208302840111600160201b8311171561068657600080fd5b91935091506001600160a01b038135169060200135611a8f565b610317600480360360808110156106b657600080fd5b81359190810190604081016020820135600160201b8111156106d757600080fd5b8201836020820111156106e957600080fd5b803590602001918460208302840111600160201b8311171561070a57600080fd5b91935091506001600160a01b038135169060200135611e78565b34801561073057600080fd5b5061026f6004803603606081101561074757600080fd5b5080359060208101359060400135612147565b34801561076657600080fd5b50610317600480360360a081101561077d57600080fd5b813591602081013591810190606081016040820135600160201b8111156107a357600080fd5b8201836020820111156107b557600080fd5b803590602001918460208302840111600160201b831117156107d657600080fd5b91935091506001600160a01b038135169060200135612154565b3480156107fc57600080fd5b5061080561224d565b604080516001600160a01b039092168252519081900360200190f35b34801561082d57600080fd5b5061026f6004803603606081101561084457600080fd5b5080359060208101359060400135612271565b34801561086357600080fd5b5061026f600480360360c081101561087a57600080fd5b506001600160a01b0381358116916020810135916040820135916060810135916080820135169060a0013561227e565b610608600480360360808110156108c057600080fd5b81359190810190604081016020820135600160201b8111156108e157600080fd5b8201836020820111156108f357600080fd5b803590602001918460208302840111600160201b8311171561091457600080fd5b91935091506001600160a01b0381351690602001356124c5565b34801561093a57600080fd5b50610220600480360360e081101561095157600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359160808201359160a08101359091169060c001356127ae565b34801561099757600080fd5b506108056129e9565b3480156109ac57600080fd5b50610317600480360360408110156109c357600080fd5b81359190810190604081016020820135600160201b8111156109e457600080fd5b8201836020820111156109f657600080fd5b803590602001918460208302840111600160201b83111715610a1757600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550612a0d945050505050565b348015610a6157600080fd5b50610805612a3a565b348015610a7657600080fd5b506101af6004803603610100811015610a8e57600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359160808201359160a08101359160c0820135169060e00135612a5e565b6101af600480360360c0811015610ae257600080fd5b506001600160a01b0381358116916020810135916040820135916060810135916080820135169060a00135612ba8565b6101af600480360360c0811015610b2857600080fd5b506001600160a01b0381358116916020810135916040820135916060810135916080820135169060a00135612e7e565b61031760048036036080811015610b6e57600080fd5b81359190810190604081016020820135600160201b811115610b8f57600080fd5b820183602082011115610ba157600080fd5b803590602001918460208302840111600160201b83111715610bc257600080fd5b91935091506001600160a01b03813516906020013561334a565b60008060008342811015610c25576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6040805163e6a4390560e01b81526001600160a01b038e811660048301528d8116602483015291516000927f0000000000000000000000000000000000000000000000000000000000103780169163e6a43905916044808301926020929190829003018186803b158015610c9857600080fd5b505afa158015610cac573d6000803e3d6000fd5b505050506040513d6020811015610cc257600080fd5b50516001600160a01b031614610d095760405162461bcd60e51b8152600401808060200182810382526024815260200180614c9b6024913960400191505060405180910390fd5b60007f00000000000000000000000000000000000000000000000000000000001037806001600160a01b031663c9c65396348f8f6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506020604051808303818588803b158015610d8b57600080fd5b505af1158015610d9f573d6000803e3d6000fd5b50505050506040513d6020811015610db657600080fd5b50519050610dc88d8d8d8d8d8d61374b565b9095509350610dd98d33838861386b565b610de58c33838761386b565b806001600160a01b0316636a627842886040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050602060405180830381600087803b158015610e3457600080fd5b505af1158015610e48573d6000803e3d6000fd5b505050506040513d6020811015610e5e57600080fd5b5051949d939c50939a509198505050505050505050565b6000808242811015610ebc576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b610ec6308a613934565b610ef5897f0000000000000000000000000000000000000000000000000000000000163b5a8a8a8a308a6127ae565b9093509150610f068930878661386b565b610f517f0000000000000000000000000000000000000000000000000000000000163b5a7f0000000000000000000000000000000000000000000000000000000000163b598461399c565b7f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663d9caed123087856040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018281526020019350505050600060405180830381600087803b158015610fd957600080fd5b505af1158015610fed573d6000803e3d6000fd5b50505050610ffb308a613a4e565b50965096945050505050565b6000611014848484613a5a565b949350505050565b60608142811015611062576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000163b5a168686600019810181811061109c57fe5b905060200201356001600160a01b03166001600160a01b0316146110f5576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b6111537f000000000000000000000000000000000000000000000000000000000010378089888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613b3292505050565b9150868260018451038151811061116657fe5b602002602001015110156111ab5760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b611249868660008181106111bb57fe5b905060200201356001600160a01b03163361122f7f00000000000000000000000000000000000000000000000000000000001037808a8a60008181106111fd57fe5b905060200201356001600160a01b03168b8b600181811061121a57fe5b905060200201356001600160a01b0316613c7e565b8560008151811061123c57fe5b602002602001015161386b565b61128882878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250309250613d3e915050565b6112ea7f0000000000000000000000000000000000000000000000000000000000163b5a7f0000000000000000000000000000000000000000000000000000000000163b59846001865103815181106112dd57fe5b602002602001015161399c565b7f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663d9caed1230868560018751038151811061132b57fe5b60200260200101516040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018281526020019350505050600060405180830381600087803b15801561138957600080fd5b505af115801561139d573d6000803e3d6000fd5b50505050509695505050505050565b60606113d97f00000000000000000000000000000000000000000000000000000000001037808484613f7b565b90505b92915050565b60408051602480820184905282518083039091018152604490910182526020810180516001600160e01b031663171e7fb560e11b17815291518151600093849360609361016893919290918291908083835b602083106114535780518252601f199092019160209182019101611434565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d80600081146114b5576040519150601f19603f3d011682016040523d82523d6000602084013e6114ba565b606091505b509150915081611511576040805162461bcd60e51b815260206004820152601b60248201527f54696e7963656e7473546f54696e7962617273206661696c6564210000000000604482015290519081900360640190fd5b80806020019051602081101561152657600080fd5b5051949350505050565b60608142811015611576576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6115d47f000000000000000000000000000000000000000000000000000000000010378089888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613b3292505050565b915086826001845103815181106115e757fe5b6020026020010151101561162c5760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b61163c868660008181106111bb57fe5b61167b82878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250899250613d3e915050565b509695505050505050565b606081428110156116cc576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000163b5a168686600019810181811061170657fe5b905060200201356001600160a01b03166001600160a01b03161461175f576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b6117bd7f000000000000000000000000000000000000000000000000000000000010378089888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613f7b92505050565b915086826000815181106117cd57fe5b602002602001015111156111ab5760405162461bcd60e51b8152600401808060200182810382526027815260200180614d5a6027913960400191505060405180910390fd5b8042811015611856576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6118cb8585600081811061186657fe5b905060200201356001600160a01b0316336118c57f0000000000000000000000000000000000000000000000000000000000103780898960008181106118a857fe5b905060200201356001600160a01b03168a8a600181811061121a57fe5b8a61386b565b6000858560001981018181106118dd57fe5b905060200201356001600160a01b03166001600160a01b03166370a08231856040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b15801561193957600080fd5b505afa15801561194d573d6000803e3d6000fd5b505050506040513d602081101561196357600080fd5b505160408051602088810282810182019093528882529293506119a59290918991899182918501908490808284376000920191909152508892506140b3915050565b86611a4882888860001981018181106119ba57fe5b905060200201356001600160a01b03166001600160a01b03166370a08231886040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611a1657600080fd5b505afa158015611a2a573d6000803e3d6000fd5b505050506040513d6020811015611a4057600080fd5b5051906143b5565b1015611a855760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b5050505050505050565b8042811015611ad3576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6001600160a01b037f0000000000000000000000000000000000000000000000000000000000163b5a1685856000198101818110611b0d57fe5b905060200201356001600160a01b03166001600160a01b031614611b66576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b60007f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611bd557600080fd5b505afa158015611be9573d6000803e3d6000fd5b505050506040513d6020811015611bff57600080fd5b50519050611c598686600081611c1157fe5b905060200201356001600160a01b031633611c537f00000000000000000000000000000000000000000000000000000000001037808a8a60008181106111fd57fe5b8b61386b565b611c978686808060200260200160405190810160405280939291908181526020018383602002808284376000920191909152503092506140b3915050565b60007f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b03166370a08231306040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611d0657600080fd5b505afa158015611d1a573d6000803e3d6000fd5b505050506040513d6020811015611d3057600080fd5b505190506000611d4082846143b5565b905088811015611d815760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b611dcc7f0000000000000000000000000000000000000000000000000000000000163b5a7f0000000000000000000000000000000000000000000000000000000000163b598361399c565b7f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663d9caed123088846040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018281526020019350505050600060405180830381600087803b158015611e5457600080fd5b505af1158015611e68573d6000803e3d6000fd5b5050505050505050505050505050565b60608142811015611ebe576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b7f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b031686866000818110611ef557fe5b905060200201356001600160a01b03166001600160a01b031614611f4e576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b611fac7f000000000000000000000000000000000000000000000000000000000010378034888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613b3292505050565b91508682600184510381518110611fbf57fe5b602002602001015110156120045760405162461bcd60e51b815260040180806020018281038252602b815260200180614dea602b913960400191505060405180910390fd5b7f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663f9609f088360008151811061204057fe5b6020026020010151336120977f00000000000000000000000000000000000000000000000000000000001037808b8b600081811061207a57fe5b905060200201356001600160a01b03168c8c600181811061121a57fe5b6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b1580156120e557600080fd5b505af11580156120f9573d6000803e3d6000fd5b505050505061213d82878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250899250613d3e915050565b5095945050505050565b6000611014848484614405565b6060814281101561219a576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6121f87f000000000000000000000000000000000000000000000000000000000010378089888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613f7b92505050565b9150868260008151811061220857fe5b6020026020010151111561162c5760405162461bcd60e51b8152600401808060200182810382526027815260200180614d5a6027913960400191505060405180910390fd5b7f0000000000000000000000000000000000000000000000000000000000163b5a81565b60006110148484846144dd565b600081428110156122c4576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6122ce3089613934565b6122fd887f0000000000000000000000000000000000000000000000000000000000163b5a89898930896127ae565b604080516370a0823160e01b81523060048201529051919450600092506001600160a01b038b16916370a0823191602480820192602092909190829003018186803b15801561234b57600080fd5b505afa15801561235f573d6000803e3d6000fd5b505050506040513d602081101561237557600080fd5b50519050868110156123b85760405162461bcd60e51b815260040180806020018281038252602a815260200180614cbf602a913960400191505060405180910390fd5b6123c48930878461386b565b61240f7f0000000000000000000000000000000000000000000000000000000000163b5a7f0000000000000000000000000000000000000000000000000000000000163b598561399c565b7f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663d9caed123087866040518463ffffffff1660e01b815260040180846001600160a01b03168152602001836001600160a01b031681526020018281526020019350505050600060405180830381600087803b15801561249757600080fd5b505af11580156124ab573d6000803e3d6000fd5b505050506124b9308a613a4e565b50509695505050505050565b8042811015612509576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b7f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b03168585600081811061254057fe5b905060200201356001600160a01b03166001600160a01b031614612599576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b346001600160a01b037f0000000000000000000000000000000000000000000000000000000000163b591663f9609f0882336125fa7f00000000000000000000000000000000000000000000000000000000001037808b8b60008161207a57fe5b6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b15801561264857600080fd5b505af115801561265c573d6000803e3d6000fd5b5050505050600086866001898990500381811061267557fe5b905060200201356001600160a01b03166001600160a01b03166370a08231866040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156126d157600080fd5b505afa1580156126e5573d6000803e3d6000fd5b505050506040513d60208110156126fb57600080fd5b5051604080516020898102828101820190935289825292935061273d9290918a918a9182918501908490808284376000920191909152508992506140b3915050565b87611a48828989600019810181811061275257fe5b905060200201356001600160a01b03166001600160a01b03166370a08231896040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611a1657600080fd5b60008082428110156127f5576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b60006128227f00000000000000000000000000000000000000000000000000000000001037808c8c613c7e565b90506000816001600160a01b0316635fcbd2856040518163ffffffff1660e01b815260040160206040518083038186803b15801561285f57600080fd5b505afa158015612873573d6000803e3d6000fd5b505050506040513d602081101561288957600080fd5b505190506128998133848d61386b565b600080836001600160a01b03166389afcb448a6040518263ffffffff1660e01b815260040180826001600160a01b031681526020019150506040805180830381600087803b1580156128ea57600080fd5b505af11580156128fe573d6000803e3d6000fd5b505050506040513d604081101561291457600080fd5b5080516020909101519092509050600061292e8f8f614583565b509050806001600160a01b03168f6001600160a01b031614612951578183612954565b82825b90985096508b8810156129985760405162461bcd60e51b8152600401808060200182810382526026815260200180614da16026913960400191505060405180910390fd5b8a8710156129d75760405162461bcd60e51b8152600401808060200182810382526026815260200180614c756026913960400191505060405180910390fd5b50505050505097509795505050505050565b7f000000000000000000000000000000000000000000000000000000000010378081565b60606113d97f00000000000000000000000000000000000000000000000000000000001037808484613b32565b7f0000000000000000000000000000000000000000000000000000000000163b5981565b60008060008342811015612aa7576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b60007f00000000000000000000000000000000000000000000000000000000001037806001600160a01b031663e6a439058e8e6040518363ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b031681526020019250505060206040518083038186803b158015612b2757600080fd5b505afa158015612b3b573d6000803e3d6000fd5b505050506040513d6020811015612b5157600080fd5b505190506001600160a01b038116612b9a5760405162461bcd60e51b8152600401808060200182810382526024815260200180614d116024913960400191505060405180910390fd5b610dc88d8d8d8d8d8d61374b565b60008060008342811015612bf1576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b612c1f8a7f0000000000000000000000000000000000000000000000000000000000163b5a8b348c8c61374b565b809450819550505060007f00000000000000000000000000000000000000000000000000000000001037806001600160a01b031663e6a439058c7f0000000000000000000000000000000000000000000000000000000000163b5a6040518363ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b031681526020019250505060206040518083038186803b158015612cc757600080fd5b505afa158015612cdb573d6000803e3d6000fd5b505050506040513d6020811015612cf157600080fd5b505190506001600160a01b038116612d3a5760405162461bcd60e51b8152600401808060200182810382526024815260200180614d116024913960400191505060405180910390fd5b612d468b33838861386b565b7f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663f9609f088533846040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b158015612dc657600080fd5b505af1158015612dda573d6000803e3d6000fd5b5050505050806001600160a01b0316636a627842886040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050602060405180830381600087803b158015612e2e57600080fd5b505af1158015612e42573d6000803e3d6000fd5b505050506040513d6020811015612e5857600080fd5b5051925034841015612e7057612e7033853403614661565b505096509650969350505050565b60008060008342811015612ec7576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b6040805163e6a4390560e01b81526001600160a01b038c811660048301527f0000000000000000000000000000000000000000000000000000000000163b5a8116602483015291516000927f0000000000000000000000000000000000000000000000000000000000103780169163e6a43905916044808301926020929190829003018186803b158015612f5a57600080fd5b505afa158015612f6e573d6000803e3d6000fd5b505050506040513d6020811015612f8457600080fd5b50516001600160a01b031614612fcb5760405162461bcd60e51b8152600401808060200182810382526024815260200180614c9b6024913960400191505060405180910390fd5b600061305a7f00000000000000000000000000000000000000000000000000000000001037806001600160a01b031663881a075a6040518163ffffffff1660e01b815260040160206040518083038186803b15801561302957600080fd5b505afa15801561303d573d6000803e3d6000fd5b505050506040513d602081101561305357600080fd5b50516113e2565b90508034116130ad576040805162461bcd60e51b815260206004820152601a602482015279556e69737761705632526f757465723a204d53472e56414c554560301b604482015290519081900360640190fd5b7f00000000000000000000000000000000000000000000000000000000001037806001600160a01b031663c9c65396828d7f0000000000000000000000000000000000000000000000000000000000163b5a6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506020604051808303818588803b15801561314d57600080fd5b505af1158015613161573d6000803e3d6000fd5b50505050506040513d602081101561317857600080fd5b506131ac90508b7f0000000000000000000000000000000000000000000000000000000000163b5a8c348590038d8d61374b565b909550935060006131fe7f00000000000000000000000000000000000000000000000000000000001037808d7f0000000000000000000000000000000000000000000000000000000000163b5a613c7e565b905061320c8c33838961386b565b7f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663f9609f088633846040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b15801561328c57600080fd5b505af11580156132a0573d6000803e3d6000fd5b5050505050806001600160a01b0316636a627842896040518263ffffffff1660e01b815260040180826001600160a01b03168152602001915050602060405180830381600087803b1580156132f457600080fd5b505af1158015613308573d6000803e3d6000fd5b505050506040513d602081101561331e57600080fd5b505193503482900385101561333b5761333b338684340303614661565b50505096509650969350505050565b60608142811015613390576040805162461bcd60e51b81526020600482015260186024820152600080516020614e40833981519152604482015290519081900360640190fd5b7f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b0316868660008181106133c757fe5b905060200201356001600160a01b03166001600160a01b031614613420576040805162461bcd60e51b815260206004820152601d6024820152600080516020614d81833981519152604482015290519081900360640190fd5b61347e7f000000000000000000000000000000000000000000000000000000000010378088888880806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250613f7b92505050565b9150348260008151811061348e57fe5b602002602001015111156134d35760405162461bcd60e51b8152600401808060200182810382526027815260200180614d5a6027913960400191505060405180910390fd5b7f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663f9609f088360008151811061350f57fe5b6020026020010151336135497f00000000000000000000000000000000000000000000000000000000001037808b8b600081811061207a57fe5b6040518463ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b03168152602001925050506000604051808303818588803b15801561359757600080fd5b505af11580156135ab573d6000803e3d6000fd5b50505050506135ef82878780806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250899250613d3e915050565b816000815181106135fc57fe5b602002602001015134111561213d5761213d338360008151811061361c57fe5b60200260200101513403614661565b604080516001600160a01b038481166024830152831660448083019190915282518083039091018152606490910182526020810180516001600160e01b031663248a35ef60e11b17815291518151600093849360609361016793919290918291908083835b602083106136af5780518252601f199092019160209182019101613690565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114613711576040519150601f19603f3d011682016040523d82523d6000602084013e613716565b606091505b50915091508161372757601561373f565b80806020019051602081101561373c57600080fd5b50515b60030b95945050505050565b60008060008061377c7f00000000000000000000000000000000000000000000000000000000001037808b8b614754565b9150915081600014801561378e575080155b1561379e5787935086925061385e565b60006137ab8984846144dd565b90508781116137fe57858110156137f35760405162461bcd60e51b8152600401808060200182810382526026815260200180614c756026913960400191505060405180910390fd5b88945092508261385c565b600061380b8984866144dd565b90508981111561381757fe5b878110156138565760405162461bcd60e51b8152600401808060200182810382526026815260200180614da16026913960400191505060405180910390fd5b94508793505b505b5050965096945050505050565b600061388185858561387c8661481b565b614868565b9050601681146138d8576040805162461bcd60e51b815260206004820152601b60248201527f5361666520746f6b656e207472616e73666572206661696c6564210000000000604482015290519081900360640190fd5b826001600160a01b0316846001600160a01b03167f831ac82b07fb396dafef0077cea6e002235d88e63f35cbd5df2c065107f1e74a84604051808267ffffffffffffffff16815260200191505060405180910390a35050505050565b6000613940838361362b565b905060168114613997576040805162461bcd60e51b815260206004820152601f60248201527f536166652073696e676c65206173736f63696174696f6e206661696c65642100604482015290519081900360640190fd5b505050565b60006139b184846139ac8561481b565b61499c565b9050601681146139ff576040805162461bcd60e51b81526020600482015260146024820152735361666520617070726f7665206661696c65642160601b604482015290519081900360640190fd5b6040805167ffffffffffffffff8416815290516001600160a01b038516917fdece45634c9b2787e4a3beb04937674cb331abb1e6ce01b6febe8f4d69717280919081900360200190a250505050565b60006139408383614ac7565b6000808411613a9a5760405162461bcd60e51b815260040180806020018281038252602b815260200180614e15602b913960400191505060405180910390fd5b600083118015613aaa5750600082115b613ae55760405162461bcd60e51b8152600401808060200182810382526028815260200180614ce96028913960400191505060405180910390fd5b6000613af3856103e5614b4a565b90506000613b018285614b4a565b90506000613b1b83613b15886103e8614b4a565b90614bad565b9050808281613b2657fe5b04979650505050505050565b6060600282511015613b8b576040805162461bcd60e51b815260206004820152601e60248201527f556e697377617056324c6962726172793a20494e56414c49445f504154480000604482015290519081900360640190fd5b815167ffffffffffffffff81118015613ba357600080fd5b50604051908082528060200260200182016040528015613bcd578160200160208202803683370190505b5090508281600081518110613bde57fe5b60200260200101818152505060005b6001835103811015613c7657600080613c3087868581518110613c0c57fe5b6020026020010151878660010181518110613c2357fe5b6020026020010151614754565b91509150613c52848481518110613c4357fe5b60200260200101518383613a5a565b848460010181518110613c6157fe5b60209081029190910101525050600101613bed565b509392505050565b6000806000613c8d8585614583565b604080516bffffffffffffffffffffffff19606094851b811660208084019190915293851b81166034830152825160288184030181526048830184528051908501206001600160f81b031960688401529a90941b9093166069840152607d8301989098527f407b3b02625070246aa1a1a346747a190d54149fc468122d6934af99b6ad0e6a609d808401919091528851808403909101815260bd909201909752805196019590952095945050505050565b60005b6001835103811015613f7557600080848381518110613d5c57fe5b6020026020010151858460010181518110613d7357fe5b6020026020010151915091506000613d8b8383614583565b5090506000878560010181518110613d9f57fe5b60200260200101519050600080836001600160a01b0316866001600160a01b031614613dcd57826000613dd1565b6000835b91509150600060028a51038810613de85788613e29565b613e297f0000000000000000000000000000000000000000000000000000000000103780878c8b60020181518110613e1c57fe5b6020026020010151613c7e565b9050613e567f00000000000000000000000000000000000000000000000000000000001037808888613c7e565b6001600160a01b031663022c0d9f84848460006040519080825280601f01601f191660200182016040528015613e93576020820181803683370190505b506040518563ffffffff1660e01b815260040180858152602001848152602001836001600160a01b0316815260200180602001828103825283818151815260200191508051906020019080838360005b83811015613efb578181015183820152602001613ee3565b50505050905090810190601f168015613f285780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b158015613f4a57600080fd5b505af1158015613f5e573d6000803e3d6000fd5b505060019099019850613d41975050505050505050565b50505050565b6060600282511015613fd4576040805162461bcd60e51b815260206004820152601e60248201527f556e697377617056324c6962726172793a20494e56414c49445f504154480000604482015290519081900360640190fd5b815167ffffffffffffffff81118015613fec57600080fd5b50604051908082528060200260200182016040528015614016578160200160208202803683370190505b509050828160018351038151811061402a57fe5b60209081029190910101528151600019015b8015613c765760008061406c8786600186038151811061405857fe5b6020026020010151878681518110613c2357fe5b9150915061408e84848151811061407f57fe5b60200260200101518383614405565b84600185038151811061409d57fe5b602090810291909101015250506000190161403c565b60005b6001835103811015613997576000808483815181106140d157fe5b60200260200101518584600101815181106140e857fe5b60200260200101519150915060006141008383614583565b50905060006141307f00000000000000000000000000000000000000000000000000000000001037808585613c7e565b9050600080600080846001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b15801561417157600080fd5b505afa158015614185573d6000803e3d6000fd5b505050506040513d606081101561419b57600080fd5b5080516020909101516001600160701b0391821693501690506000806001600160a01b038a8116908916146141d15782846141d4565b83835b91509150614229828b6001600160a01b03166370a082318a6040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611a1657600080fd5b9550614236868383613a5a565b945050505050600080856001600160a01b0316886001600160a01b03161461426057826000614264565b6000835b91509150600060028c51038a1061427b578a6142af565b6142af7f0000000000000000000000000000000000000000000000000000000000103780898e8d60020181518110613e1c57fe5b604080516000808252602082019283905263022c0d9f60e01b835260248201878152604483018790526001600160a01b038086166064850152608060848501908152845160a48601819052969750908c169563022c0d9f958a958a958a9591949193919260c486019290918190849084905b83811015614339578181015183820152602001614321565b50505050905090810190601f1680156143665780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b15801561438857600080fd5b505af115801561439c573d6000803e3d6000fd5b50506001909b019a506140b69950505050505050505050565b808203828111156113dc576040805162461bcd60e51b815260206004820152601560248201527464732d6d6174682d7375622d756e646572666c6f7760581b604482015290519081900360640190fd5b60008084116144455760405162461bcd60e51b815260040180806020018281038252602c815260200180614c24602c913960400191505060405180910390fd5b6000831180156144555750600082115b6144905760405162461bcd60e51b8152600401808060200182810382526028815260200180614ce96028913960400191505060405180910390fd5b60006144a86103e86144a28688614b4a565b90614b4a565b905060006144bc6103e56144a286896143b5565b90506144d360018284816144cc57fe5b0490614bad565b9695505050505050565b600080841161451d5760405162461bcd60e51b8152600401808060200182810382526025815260200180614d356025913960400191505060405180910390fd5b60008311801561452d5750600082115b6145685760405162461bcd60e51b8152600401808060200182810382526028815260200180614ce96028913960400191505060405180910390fd5b826145738584614b4a565b8161457a57fe5b04949350505050565b600080826001600160a01b0316846001600160a01b031614156145d75760405162461bcd60e51b8152600401808060200182810382526025815260200180614c506025913960400191505060405180910390fd5b826001600160a01b0316846001600160a01b0316106145f75782846145fa565b83835b90925090506001600160a01b03821661465a576040805162461bcd60e51b815260206004820152601e60248201527f556e697377617056324c6962726172793a205a45524f5f414444524553530000604482015290519081900360640190fd5b9250929050565b604080516000808252602082019092526001600160a01b0384169083906040518082805190602001908083835b602083106146ad5780518252601f19909201916020918201910161468e565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d806000811461470f576040519150601f19603f3d011682016040523d82523d6000602084013e614714565b606091505b50509050806139975760405162461bcd60e51b8152600401808060200182810382526023815260200180614dc76023913960400191505060405180910390fd5b60008060006147638585614583565b509050600080614774888888613c7e565b6001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b1580156147ac57600080fd5b505afa1580156147c0573d6000803e3d6000fd5b505050506040513d60608110156147d657600080fd5b5080516020909101516001600160701b0391821693501690506001600160a01b038781169084161461480957808261480c565b81815b90999098509650505050505050565b6000677fffffffffffffff8211156148645760405162461bcd60e51b8152600401808060200182810382526027815260200180614bfd6027913960400191505060405180910390fd5b5090565b604080516001600160a01b038681166024830152858116604483015284166064820152600783900b6084808301919091528251808303909101815260a490910182526020810180516001600160e01b031663eca3691760e01b17815291518151600093849360609361016793919290918291908083835b602083106148fe5780518252601f1990920191602091820191016148df565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114614960576040519150601f19603f3d011682016040523d82523d6000602084013e614965565b606091505b50915091508161497657601561498e565b80806020019051602081101561498b57600080fd5b50515b60030b979650505050505050565b604080516001600160a01b03858116602483015284166044820152600783900b60648083019190915282518083039091018152608490910182526020810180516001600160e01b031663e1f21c6760e01b17815291518151600093849360609361016793919290918291908083835b60208310614a2a5780518252601f199092019160209182019101614a0b565b6001836020036101000a0380198251168184511680821785525050505050509050019150506000604051808303816000865af19150503d8060008114614a8c576040519150601f19603f3d011682016040523d82523d6000602084013e614a91565b606091505b509150915081614aa2576015614aba565b808060200190516020811015614ab757600080fd5b50515b60030b9695505050505050565b604080516001600160a01b038481166024830152831660448083019190915282518083039091018152606490910182526020810180516001600160e01b0316630132f29d60e31b1781529151815160009384936060936101679391929091829190808383602083106136af5780518252601f199092019160209182019101613690565b6000811580614b6557505080820282828281614b6257fe5b04145b6113dc576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6d756c2d6f766572666c6f7760601b604482015290519081900360640190fd5b808201828110156113dc576040805162461bcd60e51b815260206004820152601460248201527364732d6d6174682d6164642d6f766572666c6f7760601b604482015290519081900360640190fdfe53616665436173743a2076616c756520646f65736e27742066697420696e20616e20696e743634556e697377617056324c6962726172793a20494e53554646494349454e545f4f55545055545f414d4f554e54556e697377617056324c6962726172793a204944454e544943414c5f414444524553534553556e69737761705632526f757465723a20494e53554646494349454e545f425f414d4f554e54556e69737761705632526f757465723a20504f4f4c20414c524541445920455849535453556e69737761705632526f757465723a20494e53554646494349454e545f415f414d4f554e545f464f54556e697377617056324c6962726172793a20494e53554646494349454e545f4c4951554944495459556e69737761705632526f757465723a205041495220444f4553204e4f54204558495354556e697377617056324c6962726172793a20494e53554646494349454e545f414d4f554e54556e69737761705632526f757465723a204558434553534956455f494e5055545f414d4f554e54556e69737761705632526f757465723a20494e56414c49445f50415448000000556e69737761705632526f757465723a20494e53554646494349454e545f415f414d4f554e545472616e7366657248656c7065723a204554485f5452414e534645525f4641494c4544556e69737761705632526f757465723a20494e53554646494349454e545f4f55545055545f414d4f554e54556e697377617056324c6962726172793a20494e53554646494349454e545f494e5055545f414d4f554e54556e69737761705632526f757465723a20455850495245440000000000000000a26469706673582212205dd71bf7036e8e401a228b3eb7382b2e9c2a4320e6c1accc6ef06a3f5bc0b4d564736f6c634300060c0033"
}

const CONTRACT_DETAILS_V2 = {
    "admin_key": {
        "_type": "ProtobufEncoded",
        "key": "0a051883b7f004"
    },
    "auto_renew_account": null,
    "auto_renew_period": 7776000,
    "contract_id": "0.0.10230659",
    "created_timestamp": "1768508160.982334120",
    "deleted": false,
    "evm_address": "0xcec8716cdd60856eacaa74d499abd14ae34b7da8",
    "expiration_timestamp": "1776284160.982334120",
    "file_id": null,
    "max_automatic_token_associations": 0,
    "memo": "lazy-created account",
    "nonce": 1,
    "obtainer_id": null,
    "permanent_removal": null,
    "proxy_account_id": null,
    "timestamp": {
        "from": "1768508160.982334120",
        "to": null
    },
    "bytecode": "0x",
    "runtime_bytecode": "0x6080604052600436106100f75760003560e01c80638f44f0ee1161008a578063cc5a088611610059578063cc5a08861461049a578063d999984d146104af578063db4d9523146104c4578063f2fde38b146104d957610130565b80638f44f0ee146103755780639b6470e3146103cc578063a8704b3614610408578063bf40cba91461045f57610130565b8063715018a6116100c6578063715018a614610296578063828239ab146102ab57806386088255146103095780638da5cb5b1461036057610130565b80631a0e8cdf14610135578063360562d7146101a557806356e6004b146101fc5780635d123e3f1461022d57610130565b3661013057336001600160a01b037f0000000000000000000000000000000000000000000000000000000000163b59161461012e57fe5b005b600080fd5b34801561014157600080fd5b5061018c600480360360c081101561015857600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359091169060808101359060a0013561050c565b6040805192835260208301919091528051918290030190f35b3480156101b157600080fd5b5061018c600480360360c08110156101c857600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359091169060808101359060a00135610581565b34801561020857600080fd5b5061021161074a565b604080516001600160a01b039092168252519081900360200190f35b34801561023957600080fd5b50610284600480360360c081101561025057600080fd5b506001600160a01b0381358116916020810135821691604082013581169160608101359160808201359160a001351661076e565b60408051918252519081900360200190f35b3480156102a257600080fd5b5061012e6107e0565b3480156102b757600080fd5b50610284600480360360c08110156102ce57600080fd5b506001600160a01b03813581169160208101358216916040820135169062ffffff60608201351690608081013515159060a00135151561089e565b34801561031557600080fd5b50610284600480360360c081101561032c57600080fd5b506001600160a01b0381358116916020810135821691604082013581169160608101359160808201359160a001351661096b565b34801561036c57600080fd5b50610211610ae3565b34801561038157600080fd5b5061018c600480360360c081101561039857600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359091169060808101359060a00135610af2565b610284600480360360808110156103e257600080fd5b506001600160a01b03813581169160208101358216916040820135916060013516610b50565b34801561041457600080fd5b5061018c600480360360c081101561042b57600080fd5b506001600160a01b038135811691602081013582169160408201359160608101359091169060808101359060a00135610c5a565b34801561046b57600080fd5b5061012e6004803603604081101561048257600080fd5b506001600160a01b0381358116916020013516610db5565b3480156104a657600080fd5b50610211610e40565b3480156104bb57600080fd5b50610211610e47565b3480156104d057600080fd5b50610211610e6b565b3480156104e557600080fd5b5061012e600480360360208110156104fc57600080fd5b50356001600160a01b0316610e8f565b60008060026000541415610555576040805162461bcd60e51b815260206004820152601f6024820152600080516020612e8c833981519152604482015290519081900360640190fd5b600260008190555061056d8888888888886000610fa4565b600160005590999098509650505050505050565b600080600260005414156105ca576040805162461bcd60e51b815260206004820152601f6024820152600080516020612e8c833981519152604482015290519081900360640190fd5b60026000908155806105e18a8a8a30858080610fa4565b9150915060008a6001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561062057600080fd5b505afa158015610634573d6000803e3d6000fd5b505050506040513d602081101561064a57600080fd5b50516040805163d21220a760e01b815290519192506000916001600160a01b038e169163d21220a7916004808301926020929190829003018186803b15801561069257600080fd5b505afa1580156106a6573d6000803e3d6000fd5b505050506040513d60208110156106bc57600080fd5b5051905060006106cd83868c611586565b905060006106dc83868d611586565b90508982101580156106ee5750888110155b610732576040805162461bcd60e51b815260206004820152601060248201526f125b9cdd59999a58da595b9d081bdd5d60821b604482015290519081900360640190fd5b6001600055909d909c509a5050505050505050505050565b7f000000000000000000000000822b0be4958ab5b4a48da3c5f68fc5484609361881565b6000600260005414156107b6576040805162461bcd60e51b815260206004820152601f6024820152600080516020612e8c833981519152604482015290519081900360640190fd5b60026000819055506107d0878787878787600060016117c8565b6001600055979650505050505050565b6107e8611bcc565b6001600160a01b03166107f9610ae3565b6001600160a01b031614610854576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001546040516000916001600160a01b0316907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0908390a3600180546001600160a01b0319169055565b6040805163210fa9a160e21b81526001600160a01b0388811660048301528781166024830152868116604483015262ffffff86166064830152841515608483015283151560a483015291516000927f000000000000000000000000822b0be4958ab5b4a48da3c5f68fc54846093618169163843ea6849160c4808301926020929190829003018186803b15801561093457600080fd5b505afa158015610948573d6000803e3d6000fd5b505050506040513d602081101561095e57600080fd5b5051979650505050505050565b6000600260005414156109b3576040805162461bcd60e51b815260206004820152601f6024820152600080516020612e8c833981519152604482015290519081900360640190fd5b60026000819055506000876001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b1580156109f657600080fd5b505afa158015610a0a573d6000803e3d6000fd5b505050506040513d6020811015610a2057600080fd5b50516040805163d21220a760e01b815290519192506000916001600160a01b038b169163d21220a7916004808301926020929190829003018186803b158015610a6857600080fd5b505afa158015610a7c573d6000803e3d6000fd5b505050506040513d6020811015610a9257600080fd5b50519050610aab6001600160a01b038816333089611bd0565b600080610aba89898686611c30565b91509150610acf8b8b84848b8b6000806117c8565b60016000559b9a5050505050505050505050565b6001546001600160a01b031690565b60008060026000541415610b3b576040805162461bcd60e51b815260206004820152601f6024820152600080516020612e8c833981519152604482015290519081900360640190fd5b600260005561056d8888888888886001610fa4565b600060026000541415610b98576040805162461bcd60e51b815260206004820152601f6024820152600080516020612e8c833981519152604482015290519081900360640190fd5b600260008190555060003490507f0000000000000000000000000000000000000000000000000000000000163b596001600160a01b031663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b158015610c0057600080fd5b505af1158015610c14573d6000803e3d6000fd5b5050505050610c4b86867f0000000000000000000000000000000000000000000000000000000000163b5a848888600160006117c8565b60016000559695505050505050565b60008060026000541415610ca3576040805162461bcd60e51b815260206004820152601f6024820152600080516020612e8c833981519152604482015290519081900360640190fd5b6002600090815580610cba8a8a8a30858080610fa4565b9150915060008a6001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b158015610cf957600080fd5b505afa158015610d0d573d6000803e3d6000fd5b505050506040513d6020811015610d2357600080fd5b50516040805163d21220a760e01b815290519192506000916001600160a01b038e169163d21220a7916004808301926020929190829003018186803b158015610d6b57600080fd5b505afa158015610d7f573d6000803e3d6000fd5b505050506040513d6020811015610d9557600080fd5b505190506000610da683868c611db8565b905060006106dc83868d611db8565b610dbd611bcc565b6001600160a01b0316610dce610ae3565b6001600160a01b031614610e29576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b610e338282611fd7565b610e3c82612315565b5050565b6293a3a881565b7f0000000000000000000000000000000000000000000000000000000000163b5981565b7f0000000000000000000000000000000000000000000000000000000000163b5a81565b610e97611bcc565b6001600160a01b0316610ea8610ae3565b6001600160a01b031614610f03576040805162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015290519081900360640190fd5b6001600160a01b038116610f485760405162461bcd60e51b8152600401808060200182810382526026815260200180612eac6026913960400191505060405180910390fd5b6001546040516001600160a01b038084169216907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a3600180546001600160a01b0319166001600160a01b0392909216919091179055565b600080610fb08661237d565b6000806000610fc08c8c886123c5565b91945092509050610fdc6001600160a01b038d1633308d611bd0565b851561149e5760408051627b8a6760e11b8152600481018c905230602482015281516001600160a01b0386169262f714ce92604480820193918290030181600087803b15801561102b57600080fd5b505af115801561103f573d6000803e3d6000fd5b505050506040513d604081101561105557600080fd5b50805160209091015190955093507f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b03908116908316141561129b578415611282577f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b031663095ea7b37f0000000000000000000000000000000000000000000000000000000000163b59876040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561113557600080fd5b505af1158015611149573d6000803e3d6000fd5b505050506040513d602081101561115f57600080fd5b505060408051632e1a7d4d60e01b81526004810187905290516001600160a01b037f0000000000000000000000000000000000000000000000000000000000163b591691632e1a7d4d91602480830192600092919082900301818387803b1580156111c957600080fd5b505af11580156111dd573d6000803e3d6000fd5b5050604051600092506001600160a01b038c16915087908381818185875af1925050503d806000811461122c576040519150601f19603f3d011682016040523d82523d6000602084013e611231565b606091505b5050905080611280576040805162461bcd60e51b815260206004820152601660248201527513985d1a5d99481d1c985b9cd9995c8819985a5b195960521b604482015290519081900360640190fd5b505b6112966001600160a01b0382168a86612795565b611499565b8315611485577f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b031663095ea7b37f0000000000000000000000000000000000000000000000000000000000163b59866040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561133857600080fd5b505af115801561134c573d6000803e3d6000fd5b505050506040513d602081101561136257600080fd5b505060408051632e1a7d4d60e01b81526004810186905290516001600160a01b037f0000000000000000000000000000000000000000000000000000000000163b591691632e1a7d4d91602480830192600092919082900301818387803b1580156113cc57600080fd5b505af11580156113e0573d6000803e3d6000fd5b5050604051600092506001600160a01b038c16915086908381818185875af1925050503d806000811461142f576040519150601f19603f3d011682016040523d82523d6000602084013e611434565b606091505b5050905080611483576040805162461bcd60e51b815260206004820152601660248201527513985d1a5d99481d1c985b9cd9995c8819985a5b195960521b604482015290519081900360640190fd5b505b6114996001600160a01b0383168a87612795565b611523565b60408051627b8a6760e11b8152600481018c90526001600160a01b038b8116602483015282519086169262f714ce92604480820193918290030181600087803b1580156114ea57600080fd5b505af11580156114fe573d6000803e3d6000fd5b505050506040513d604081101561151457600080fd5b50805160209091015190955093505b8785101580156115335750868410155b611577576040805162461bcd60e51b815260206004820152601060248201526f125b9cdd59999a58da595b9d081bdd5d60821b604482015290519081900360640190fd5b50505097509795505050505050565b60007f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b0316846001600160a01b031614156117b35782156117ac577f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b031663095ea7b37f0000000000000000000000000000000000000000000000000000000000163b59856040518363ffffffff1660e01b815260040180836001600160a01b0316815260200182815260200192505050602060405180830381600087803b15801561165f57600080fd5b505af1158015611673573d6000803e3d6000fd5b505050506040513d602081101561168957600080fd5b505060408051632e1a7d4d60e01b81526004810185905290516001600160a01b037f0000000000000000000000000000000000000000000000000000000000163b591691632e1a7d4d91602480830192600092919082900301818387803b1580156116f357600080fd5b505af1158015611707573d6000803e3d6000fd5b5050604051600092506001600160a01b038516915085908381818185875af1925050503d8060008114611756576040519150601f19603f3d011682016040523d82523d6000602084013e61175b565b606091505b50509050806117aa576040805162461bcd60e51b815260206004820152601660248201527513985d1a5d99481d1c985b9cd9995c8819985a5b195960521b604482015290519081900360640190fd5b505b50816117c1565b6117be848484611db8565b90505b9392505050565b60006117d38461237d565b60008060006117e38c8c886123c5565b925092509250816001600160a01b03168a6001600160a01b0316148061181a5750806001600160a01b03168a6001600160a01b0316145b61185b576040805162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b2103a37b5b2b760991b604482015290519081900360640190fd5b816001600160a01b03168a6001600160a01b0316141561193057826001600160a01b0316637f7a1eec6040518163ffffffff1660e01b815260040160206040518083038186803b1580156118ae57600080fd5b505afa1580156118c2573d6000803e3d6000fd5b505050506040513d60208110156118d857600080fd5b505161192b576040805162461bcd60e51b815260206004820152601b60248201527f546f6b656e30206465706f73697473206e6f7420616c6c6f7765640000000000604482015290519081900360640190fd5b6119e6565b826001600160a01b03166337e41b406040518163ffffffff1660e01b815260040160206040518083038186803b15801561196957600080fd5b505afa15801561197d573d6000803e3d6000fd5b505050506040513d602081101561199357600080fd5b50516119e6576040805162461bcd60e51b815260206004820152601b60248201527f546f6b656e31206465706f73697473206e6f7420616c6c6f7765640000000000604482015290519081900360640190fd5b851580156119f15750845b15611a0b57611a0b6001600160a01b038b1633308c611bd0565b611a1f6001600160a01b038b168d8b6127ec565b6000826001600160a01b03168b6001600160a01b031614611a41576000611a43565b895b90506000826001600160a01b03168c6001600160a01b031614611a67576000611a69565b8a5b9050846001600160a01b0316638dbdbe6d83838c6040518463ffffffff1660e01b815260040180848152602001838152602001826001600160a01b031681526020019350505050602060405180830381600087803b158015611aca57600080fd5b505af1158015611ade573d6000803e3d6000fd5b505050506040513d6020811015611af457600080fd5b5051955089861015611b4d576040805162461bcd60e51b815260206004820152601e60248201527f536c69707061676520746f6f2067726561742e2054727920616761696e2e0000604482015290519081900360640190fd5b8b6001600160a01b03168e6001600160a01b0316336001600160a01b03167f425e9f077f9db249ef795bd139f30608e86b0b6c06f049e167ddee551b8c891d8e8a8e60405180848152602001838152602001826001600160a01b03168152602001935050505060405180910390a4505050505098975050505050505050565b3390565b604080516001600160a01b0380861660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b179052611c2a9085906128d3565b50505050565b60008060006293a3a86001600160a01b0316634257e011886040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611c8557600080fd5b505afa158015611c99573d6000803e3d6000fd5b505050506040513d6020811015611caf57600080fd5b5051905060006001600160a01b03821615801590611cf95750856001600160a01b0316826001600160a01b03161480611cf95750846001600160a01b0316826001600160a01b0316145b90508015611d2157819350816001600160a01b0316886001600160a01b031614159050611d97565b856001600160a01b0316886001600160a01b03161480611d525750846001600160a01b0316886001600160a01b0316145b611d93576040805162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b2103a37b5b2b760991b604482015290519081900360640190fd5b8793505b8692508015611dad57611daa8888612984565b92505b505094509492505050565b600082611dc7575060006117c1565b60006293a3a86001600160a01b03166345856fdd866040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611e1957600080fd5b505afa158015611e2d573d6000803e3d6000fd5b505050506040513d6020811015611e4357600080fd5b505190506001600160a01b03811615611fb75760006293a3a86001600160a01b031663a8734f0b836040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b158015611ea857600080fd5b505afa158015611ebc573d6000803e3d6000fd5b505050506040513d6020811015611ed257600080fd5b5051905080611f17576040805162461bcd60e51b815260206004820152600c60248201526b496e76616c6964207261746560a01b604482015290519081900360640190fd5b6000611f238683612b54565b9050611f3c6001600160a01b0388166293a3a8886127ec565b60408051638cc7104f60e01b81526001600160a01b038581166004830152871660248201526044810183905290516293a3a891638cc7104f91606480830192600092919082900301818387803b158015611f9557600080fd5b505af1158015611fa9573d6000803e3d6000fd5b505050508093505050611fcf565b611fcb6001600160a01b0386168486612795565b8391505b509392505050565b600081905060007f000000000000000000000000822b0be4958ab5b4a48da3c5f68fc548460936186001600160a01b0316635b5491826040518163ffffffff1660e01b815260040160206040518083038186803b15801561203757600080fd5b505afa15801561204b573d6000803e3d6000fd5b505050506040513d602081101561206157600080fd5b505160408051630dfe168160e01b815290519192506000916001600160a01b03851691630dfe1681916004808301926020929190829003018186803b1580156120a957600080fd5b505afa1580156120bd573d6000803e3d6000fd5b505050506040513d60208110156120d357600080fd5b50516040805163d21220a760e01b815290519192506000916001600160a01b0386169163d21220a7916004808301926020929190829003018186803b15801561211b57600080fd5b505afa15801561212f573d6000803e3d6000fd5b505050506040513d602081101561214557600080fd5b50516040805163ddca3f4360e01b815290519192506000916001600160a01b0387169163ddca3f43916004808301926020929190829003018186803b15801561218d57600080fd5b505afa1580156121a1573d6000803e3d6000fd5b505050506040513d60208110156121b757600080fd5b505160408051630b4c774160e11b81526001600160a01b038681166004830152858116602483015262ffffff84166044830152915192935060009291871691631698ee8291606480820192602092909190829003018186803b15801561221c57600080fd5b505afa158015612230573d6000803e3d6000fd5b505050506040513d602081101561224657600080fd5b505190506001600160a01b0380821690881614612299576040805162461bcd60e51b815260206004820152600c60248201526b125b9d985b1a59081c1bdbdb60a21b604482015290519081900360640190fd5b836001600160a01b0316886001600160a01b031614806122ca5750826001600160a01b0316886001600160a01b0316145b61230b576040805162461bcd60e51b815260206004820152600d60248201526c24b73b30b634b2103a37b5b2b760991b604482015290519081900360640190fd5b5050505050505050565b806001600160a01b0316630a754de66040518163ffffffff1660e01b8152600401602060405180830381600087803b15801561235057600080fd5b505af192505050801561237557506040513d602081101561237057600080fd5b505160015b610e3c575b50565b6001600160a01b03811661237a576040805162461bcd60e51b815260206004820152600a602482015269496e76616c696420746f60b01b604482015290519081900360640190fd5b6000806000859250826001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561240657600080fd5b505afa15801561241a573d6000803e3d6000fd5b505050506040513d602081101561243057600080fd5b50516040805163d21220a760e01b815290519193506001600160a01b0385169163d21220a791600480820192602092909190829003018186803b15801561247657600080fd5b505afa15801561248a573d6000803e3d6000fd5b505050506040513d60208110156124a057600080fd5b50519050831561255b577f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b0316826001600160a01b0316148061251b57507f0000000000000000000000000000000000000000000000000000000000163b5a6001600160a01b0316816001600160a01b0316145b61255b576040805162461bcd60e51b815260206004820152600c60248201526b13985d1a5d99481d985d5b1d60a21b604482015290519081900360640190fd5b60006126a4868484876001600160a01b031663ddca3f436040518163ffffffff1660e01b815260040160206040518083038186803b15801561259c57600080fd5b505afa1580156125b0573d6000803e3d6000fd5b505050506040513d60208110156125c657600080fd5b505160408051631fde87bb60e21b815290516001600160a01b038b1691637f7a1eec916004808301926020929190829003018186803b15801561260857600080fd5b505afa15801561261c573d6000803e3d6000fd5b505050506040513d602081101561263257600080fd5b50516040805162df906d60e61b815290516001600160a01b038c16916337e41b40916004808301926020929190829003018186803b15801561267357600080fd5b505afa158015612687573d6000803e3d6000fd5b505050506040513d602081101561269d57600080fd5b505161089e565b9050866001600160a01b03167f000000000000000000000000822b0be4958ab5b4a48da3c5f68fc548460936186001600160a01b03166350309615836040518263ffffffff1660e01b81526004018082815260200191505060206040518083038186803b15801561271457600080fd5b505afa158015612728573d6000803e3d6000fd5b505050506040513d602081101561273e57600080fd5b50516001600160a01b03161461278b576040805162461bcd60e51b815260206004820152600d60248201526c125b9d985b1a59081d985d5b1d609a1b604482015290519081900360640190fd5b5093509350939050565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663a9059cbb60e01b1790526127e79084906128d3565b505050565b600061288282856001600160a01b031663dd62ed3e30876040518363ffffffff1660e01b815260040180836001600160a01b03168152602001826001600160a01b031681526020019250505060206040518083038186803b15801561285057600080fd5b505afa158015612864573d6000803e3d6000fd5b505050506040513d602081101561287a57600080fd5b505190612bb6565b604080516001600160a01b038616602482015260448082018490528251808303909101815260649091019091526020810180516001600160e01b031663095ea7b360e01b179052909150611c2a9085905b6000612928826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b0316612c109092919063ffffffff16565b8051909150156127e75780806020019051602081101561294757600080fd5b50516127e75760405162461bcd60e51b815260040180806020018281038252602a815260200180612f19602a913960400191505060405180910390fd5b6000806293a3a86001600160a01b031663a8734f0b856040518263ffffffff1660e01b815260040180826001600160a01b0316815260200191505060206040518083038186803b1580156129d757600080fd5b505afa1580156129eb573d6000803e3d6000fd5b505050506040513d6020811015612a0157600080fd5b5051905080612a46576040805162461bcd60e51b815260206004820152600c60248201526b496e76616c6964207261746560a01b604482015290519081900360640190fd5b612a508382612c1f565b915060008211612a9a576040805162461bcd60e51b815260206004820152601060248201526f5772617020616d6f756e74207a65726f60801b604482015290519081900360640190fd5b6000612aa68383612b54565b9050612abf6001600160a01b0386166293a3a8836127ec565b60408051630c46aac760e31b81526001600160a01b03871660048201523060248201526044810183905290516293a3a891636235563891606480830192600092919082900301818387803b158015612b1657600080fd5b505af1158015612b2a573d6000803e3d6000fd5b5050505080841115612b4c57612b4c6001600160a01b03861633838703612795565b505092915050565b600082612b6357506000612bb0565b82820282848281612b7057fe5b0414612bad5760405162461bcd60e51b8152600401808060200182810382526021815260200180612ef86021913960400191505060405180910390fd5b90505b92915050565b600082820183811015612bad576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b60606117be8484600085612c86565b6000808211612c75576040805162461bcd60e51b815260206004820152601a60248201527f536166654d6174683a206469766973696f6e206279207a65726f000000000000604482015290519081900360640190fd5b818381612c7e57fe5b049392505050565b606082471015612cc75760405162461bcd60e51b8152600401808060200182810382526026815260200180612ed26026913960400191505060405180910390fd5b612cd085612de1565b612d21576040805162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015290519081900360640190fd5b600080866001600160a01b031685876040518082805190602001908083835b60208310612d5f5780518252601f199092019160209182019101612d40565b6001836020036101000a03801982511681845116808217855250505050505090500191505060006040518083038185875af1925050503d8060008114612dc1576040519150601f19603f3d011682016040523d82523d6000602084013e612dc6565b606091505b5091509150612dd6828286612de7565b979650505050505050565b3b151590565b60608315612df65750816117c1565b825115612e065782518084602001fd5b8160405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015612e50578181015183820152602001612e38565b50505050905090810190601f168015612e7d5780820380516001836020036101000a031916815260200191505b509250505060405180910390fdfe5265656e7472616e637947756172643a207265656e7472616e742063616c6c004f776e61626c653a206e6577206f776e657220697320746865207a65726f2061646472657373416464726573733a20696e73756666696369656e742062616c616e636520666f722063616c6c536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f775361666545524332303a204552433230206f7065726174696f6e20646964206e6f742073756363656564a2646970667358221220b174b7928075a4d2af2cd4c7aa9ae2f366fed0c510bde868cbbd8325b4767bc464736f6c63430007060033"
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

const SOURCIFY_RESPONSE_V2 = {
    "metadata": {
        "compiler": {
            "version": "0.7.6+commit.7338295f"
        },
        "language": "Solidity",
        "output": {
            "abi": [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_ICHIVaultFactory",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_WRAPPED_NATIVE",
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
                            "indexed": false,
                            "internalType": "address",
                            "name": "_ICHIVaultFactory",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "_WETH",
                            "type": "address"
                        }
                    ],
                    "name": "Deployed",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "vault",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "shares",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        }
                    ],
                    "name": "DepositForwarded",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "previousOwner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "OwnershipTransferred",
                    "type": "event"
                },
                {
                    "inputs": [],
                    "name": "HTS_ADDRESS",
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
                    "inputs": [],
                    "name": "HTS_WRAPPER",
                    "outputs": [
                        {
                            "internalType": "address payable",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "ICHIVaultFactory",
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
                    "inputs": [],
                    "name": "WRAPPED_NATIVE",
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
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "pool",
                            "type": "address"
                        }
                    ],
                    "name": "associate",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "vault",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "vaultDeployer",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "erc20Amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minimumProceeds",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        }
                    ],
                    "name": "depositToICHIVaultAndTryWrapToHTS",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "vaultTokens",
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
                            "name": "vault",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "vaultDeployer",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "token",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minimumProceeds",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        }
                    ],
                    "name": "forwardDepositToICHIVault",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "vaultTokens",
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
                            "name": "vault",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "vaultDeployer",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minimumProceeds",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        }
                    ],
                    "name": "forwardNativeDepositToICHIVault",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "vaultTokens",
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
                            "name": "vault",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "vaultDeployer",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "shares",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minAmount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minAmount1",
                            "type": "uint256"
                        }
                    ],
                    "name": "forwardNativeWithdrawFromICHIVault",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount1",
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
                            "name": "vault",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "vaultDeployer",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "shares",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minAmount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minAmount1",
                            "type": "uint256"
                        }
                    ],
                    "name": "forwardWithdrawFromICHIVault",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount1",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "owner",
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
                    "inputs": [],
                    "name": "renounceOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "newOwner",
                            "type": "address"
                        }
                    ],
                    "name": "transferOwnership",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "vaultDeployer",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "token0",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "token1",
                            "type": "address"
                        },
                        {
                            "internalType": "uint24",
                            "name": "fee",
                            "type": "uint24"
                        },
                        {
                            "internalType": "bool",
                            "name": "allowToken0",
                            "type": "bool"
                        },
                        {
                            "internalType": "bool",
                            "name": "allowToken1",
                            "type": "bool"
                        }
                    ],
                    "name": "vaultKey",
                    "outputs": [
                        {
                            "internalType": "bytes32",
                            "name": "key",
                            "type": "bytes32"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "vault",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "vaultDeployer",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "shares",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minAmount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minAmount1",
                            "type": "uint256"
                        }
                    ],
                    "name": "withdrawFromICHIVaultAndTryUnwrapToERC20",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount1",
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
                            "name": "vault",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "vaultDeployer",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "shares",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minAmount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minAmount1",
                            "type": "uint256"
                        }
                    ],
                    "name": "withdrawFromICHIVaultAndTryUnwrapToERC20AndForwardNative",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "amount0",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "amount1",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "stateMutability": "payable",
                    "type": "receive"
                }
            ],
            "devdoc": {
                "kind": "dev",
                "methods": {
                    "associate(address,address)": {
                        "details": "Associates the contract with a given token. It leverages the `tryAssociate` function from the `HTSInteractable` contract.",
                        "params": {
                            "token": "The address of the token to be associated with this contract. This can be an address of an IHRC compliant token or any other token. If the token is IHRC compliant, the association is attempted. If the token is not IHRC compliant or if the `associate` function call reverts for any reason, the call will fail gracefully without reverting the entire transaction"
                        }
                    },
                    "constructor": {
                        "params": {
                            "_ICHIVaultFactory": "The address of the ICHIVaultFactory."
                        }
                    },
                    "depositToICHIVaultAndTryWrapToHTS(address,address,address,uint256,uint256,address)": {
                        "params": {
                            "amount": "The amount of the token being deposited.",
                            "minimumProceeds": "The minimum amount of vault tokens to be received.",
                            "to": "The address to receive the vault tokens.",
                            "token": "The ERC20 token being deposited; will be wrapped to HTS if the vault holds that counterpart.",
                            "vault": "The address of the ICHIVault to deposit into.",
                            "vaultDeployer": "The address of the vault deployer."
                        },
                        "returns": {
                            "vaultTokens": "The number of vault tokens received."
                        }
                    },
                    "forwardDepositToICHIVault(address,address,address,uint256,uint256,address)": {
                        "details": "Emits a DepositForwarded event upon success.",
                        "params": {
                            "amount": "The amount of the token being deposited.",
                            "minimumProceeds": "The minimum amount of vault tokens to be received.",
                            "to": "The address to receive the vault tokens.",
                            "token": "The address of the token being deposited.",
                            "vault": "The address of the ICHIVault to deposit into.",
                            "vaultDeployer": "The address of the vault deployer."
                        },
                        "returns": {
                            "vaultTokens": "The number of vault tokens received."
                        }
                    },
                    "forwardNativeDepositToICHIVault(address,address,uint256,address)": {
                        "details": "Converts the native currency to Wrapped Native Token before deposit.",
                        "params": {
                            "minimumProceeds": "The minimum amount of vault tokens to be received.",
                            "to": "The address to receive the vault tokens.",
                            "vault": "The address of the ICHIVault to deposit into.",
                            "vaultDeployer": "The address of the vault deployer."
                        },
                        "returns": {
                            "vaultTokens": "The number of vault tokens received."
                        }
                    },
                    "forwardNativeWithdrawFromICHIVault(address,address,uint256,address,uint256,uint256)": {
                        "details": "Converts the Wrapped Native Tokens back to native currency on withdrawal.",
                        "params": {
                            "minAmount0": "The minimum amount of token0 expected to receive.",
                            "minAmount1": "The minimum amount of token1 expected to receive.",
                            "shares": "The amount of shares to withdraw.",
                            "to": "The address to receive the withdrawn native currency.",
                            "vault": "The address of the ICHIVault to withdraw from.",
                            "vaultDeployer": "The address of the vault deployer."
                        },
                        "returns": {
                            "amount0": "The amount of token0 received.",
                            "amount1": "The amount of token1 received."
                        }
                    },
                    "forwardWithdrawFromICHIVault(address,address,uint256,address,uint256,uint256)": {
                        "params": {
                            "minAmount0": "The minimum amount of token0 expected to receive.",
                            "minAmount1": "The minimum amount of token1 expected to receive.",
                            "shares": "The amount of shares to withdraw.",
                            "to": "The address to receive the withdrawn tokens.",
                            "vault": "The address of the ICHIVault to withdraw from.",
                            "vaultDeployer": "The address of the vault deployer."
                        },
                        "returns": {
                            "amount0": "The amount of token0 received.",
                            "amount1": "The amount of token1 received."
                        }
                    },
                    "owner()": {
                        "details": "Returns the address of the current owner."
                    },
                    "renounceOwnership()": {
                        "details": "Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner."
                    },
                    "transferOwnership(address)": {
                        "details": "Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner."
                    },
                    "vaultKey(address,address,address,uint24,bool,bool)": {
                        "params": {
                            "allowToken0": "Boolean indicating if token0 is allowed in the vault.",
                            "allowToken1": "Boolean indicating if token1 is allowed in the vault.",
                            "fee": "The fee associated with the vault.",
                            "token0": "The address of the first token in the vault.",
                            "token1": "The address of the second token in the vault.",
                            "vaultDeployer": "The address of the vault deployer."
                        },
                        "returns": {
                            "key": "The computed unique key for the vault."
                        }
                    },
                    "withdrawFromICHIVaultAndTryUnwrapToERC20(address,address,uint256,address,uint256,uint256)": {
                        "params": {
                            "minAmount0": "The minimum amount of token0 expected to receive.",
                            "minAmount1": "The minimum amount of token1 expected to receive.",
                            "shares": "The amount of shares to withdraw.",
                            "to": "The address to receive the withdrawn tokens (as ERC20 if unwrapped).",
                            "vault": "The address of the ICHIVault to withdraw from.",
                            "vaultDeployer": "The address of the vault deployer."
                        },
                        "returns": {
                            "amount0": "The amount of token0 (post-unwrap if applicable) delivered.",
                            "amount1": "The amount of token1 (post-unwrap if applicable) delivered."
                        }
                    },
                    "withdrawFromICHIVaultAndTryUnwrapToERC20AndForwardNative(address,address,uint256,address,uint256,uint256)": {
                        "params": {
                            "minAmount0": "The minimum amount of token0 expected to receive.",
                            "minAmount1": "The minimum amount of token1 expected to receive.",
                            "shares": "The amount of shares to withdraw.",
                            "to": "The address to receive the withdrawn assets.",
                            "vault": "The address of the ICHIVault to withdraw from.",
                            "vaultDeployer": "The address of the vault deployer."
                        },
                        "returns": {
                            "amount0": "The amount of token0 (post-unwrap if applicable) delivered.",
                            "amount1": "The amount of token1 (post-unwrap if applicable) delivered."
                        }
                    }
                },
                "stateVariables": {
                    "ICHIVaultFactory": {
                        "return": "Address of the ICHIVaultFactory."
                    },
                    "WRAPPED_NATIVE": {
                        "return": "Address of the Wrapped Native Token."
                    }
                },
                "version": 1
            },
            "userdoc": {
                "events": {
                    "Deployed(address,address)": {
                        "notice": "Emitted when the contract is deployed."
                    },
                    "DepositForwarded(address,address,address,uint256,uint256,address)": {
                        "notice": "Emitted when a deposit is forwarded to an ICHIVault."
                    }
                },
                "kind": "user",
                "methods": {
                    "HTS_ADDRESS()": {
                        "notice": "when interacting with standard IERC20 methods we want to interact with HTS_ADDRESS when interacting with the wrapper contract methods(e.g. deposit/withdraw) we use WRAPPED_NATIVE"
                    },
                    "ICHIVaultFactory()": {
                        "notice": "Retrieves the address of the ICHIVaultFactory."
                    },
                    "WRAPPED_NATIVE()": {
                        "notice": "Retrieves the address of the Wrapped Native Token (e.g., WETH)."
                    },
                    "constructor": {
                        "notice": "Constructs the IICHIVaultDepositGuard contract."
                    },
                    "depositToICHIVaultAndTryWrapToHTS(address,address,address,uint256,uint256,address)": {
                        "notice": "Attempts to wrap the provided ERC20 into its HTS counterpart (if present in the vault) before depositing."
                    },
                    "forwardDepositToICHIVault(address,address,address,uint256,uint256,address)": {
                        "notice": "Forwards a deposit to the specified ICHIVault after input validation."
                    },
                    "forwardNativeDepositToICHIVault(address,address,uint256,address)": {
                        "notice": "Forwards a native currency (e.g., ETH) deposit to an ICHIVault."
                    },
                    "forwardNativeWithdrawFromICHIVault(address,address,uint256,address,uint256,uint256)": {
                        "notice": "Forwards a request to withdraw native currency from an ICHIVault."
                    },
                    "forwardWithdrawFromICHIVault(address,address,uint256,address,uint256,uint256)": {
                        "notice": "Forwards a request to withdraw from an ICHIVault."
                    },
                    "vaultKey(address,address,address,uint24,bool,bool)": {
                        "notice": "Computes the unique key for a vault based on given parameters."
                    },
                    "withdrawFromICHIVaultAndTryUnwrapToERC20(address,address,uint256,address,uint256,uint256)": {
                        "notice": "Withdraws from the vault, attempting to unwrap HTS tokens to their ERC20 counterparts before sending out."
                    },
                    "withdrawFromICHIVaultAndTryUnwrapToERC20AndForwardNative(address,address,uint256,address,uint256,uint256)": {
                        "notice": "Withdraws from the vault, unwrapping HTS tokens to ERC20 when possible and forwarding native when needed."
                    }
                },
                "version": 1
            }
        },
        "settings": {
            "compilationTarget": {
                "contracts/ICHIVaultDepositGuard.sol": "ICHIVaultDepositGuard"
            },
            "evmVersion": "istanbul",
            "libraries": {},
            "metadata": {
                "bytecodeHash": "ipfs",
                "useLiteralContent": true
            },
            "optimizer": {
                "enabled": true,
                "runs": 200
            },
            "remappings": []
        },
        "sources": {
            "@openzeppelin/contracts/access/Ownable.sol": {
                "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\nimport \"../utils/Context.sol\";\n/**\n * @dev Contract module which provides a basic access control mechanism, where\n * there is an account (an owner) that can be granted exclusive access to\n * specific functions.\n *\n * By default, the owner account will be the one that deploys the contract. This\n * can later be changed with {transferOwnership}.\n *\n * This module is used through inheritance. It will make available the modifier\n * `onlyOwner`, which can be applied to your functions to restrict their use to\n * the owner.\n */\nabstract contract Ownable is Context {\n    address private _owner;\n\n    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);\n\n    /**\n     * @dev Initializes the contract setting the deployer as the initial owner.\n     */\n    constructor () {\n        address msgSender = _msgSender();\n        _owner = msgSender;\n        emit OwnershipTransferred(address(0), msgSender);\n    }\n\n    /**\n     * @dev Returns the address of the current owner.\n     */\n    function owner() public view virtual returns (address) {\n        return _owner;\n    }\n\n    /**\n     * @dev Throws if called by any account other than the owner.\n     */\n    modifier onlyOwner() {\n        require(owner() == _msgSender(), \"Ownable: caller is not the owner\");\n        _;\n    }\n\n    /**\n     * @dev Leaves the contract without owner. It will not be possible to call\n     * `onlyOwner` functions anymore. Can only be called by the current owner.\n     *\n     * NOTE: Renouncing ownership will leave the contract without an owner,\n     * thereby removing any functionality that is only available to the owner.\n     */\n    function renounceOwnership() public virtual onlyOwner {\n        emit OwnershipTransferred(_owner, address(0));\n        _owner = address(0);\n    }\n\n    /**\n     * @dev Transfers ownership of the contract to a new account (`newOwner`).\n     * Can only be called by the current owner.\n     */\n    function transferOwnership(address newOwner) public virtual onlyOwner {\n        require(newOwner != address(0), \"Ownable: new owner is the zero address\");\n        emit OwnershipTransferred(_owner, newOwner);\n        _owner = newOwner;\n    }\n}\n",
                "keccak256": "0x549c5343ad9f7e3f38aa4c4761854403502574bbc15b822db2ce892ff9b79da7",
                "license": "MIT"
            },
            "@openzeppelin/contracts/math/SafeMath.sol": {
                "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\n/**\n * @dev Wrappers over Solidity's arithmetic operations with added overflow\n * checks.\n *\n * Arithmetic operations in Solidity wrap on overflow. This can easily result\n * in bugs, because programmers usually assume that an overflow raises an\n * error, which is the standard behavior in high level programming languages.\n * `SafeMath` restores this intuition by reverting the transaction when an\n * operation overflows.\n *\n * Using this library instead of the unchecked operations eliminates an entire\n * class of bugs, so it's recommended to use it always.\n */\nlibrary SafeMath {\n    /**\n     * @dev Returns the addition of two unsigned integers, with an overflow flag.\n     *\n     * _Available since v3.4._\n     */\n    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        uint256 c = a + b;\n        if (c < a) return (false, 0);\n        return (true, c);\n    }\n\n    /**\n     * @dev Returns the substraction of two unsigned integers, with an overflow flag.\n     *\n     * _Available since v3.4._\n     */\n    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        if (b > a) return (false, 0);\n        return (true, a - b);\n    }\n\n    /**\n     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.\n     *\n     * _Available since v3.4._\n     */\n    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the\n        // benefit is lost if 'b' is also tested.\n        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522\n        if (a == 0) return (true, 0);\n        uint256 c = a * b;\n        if (c / a != b) return (false, 0);\n        return (true, c);\n    }\n\n    /**\n     * @dev Returns the division of two unsigned integers, with a division by zero flag.\n     *\n     * _Available since v3.4._\n     */\n    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        if (b == 0) return (false, 0);\n        return (true, a / b);\n    }\n\n    /**\n     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.\n     *\n     * _Available since v3.4._\n     */\n    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        if (b == 0) return (false, 0);\n        return (true, a % b);\n    }\n\n    /**\n     * @dev Returns the addition of two unsigned integers, reverting on\n     * overflow.\n     *\n     * Counterpart to Solidity's `+` operator.\n     *\n     * Requirements:\n     *\n     * - Addition cannot overflow.\n     */\n    function add(uint256 a, uint256 b) internal pure returns (uint256) {\n        uint256 c = a + b;\n        require(c >= a, \"SafeMath: addition overflow\");\n        return c;\n    }\n\n    /**\n     * @dev Returns the subtraction of two unsigned integers, reverting on\n     * overflow (when the result is negative).\n     *\n     * Counterpart to Solidity's `-` operator.\n     *\n     * Requirements:\n     *\n     * - Subtraction cannot overflow.\n     */\n    function sub(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b <= a, \"SafeMath: subtraction overflow\");\n        return a - b;\n    }\n\n    /**\n     * @dev Returns the multiplication of two unsigned integers, reverting on\n     * overflow.\n     *\n     * Counterpart to Solidity's `*` operator.\n     *\n     * Requirements:\n     *\n     * - Multiplication cannot overflow.\n     */\n    function mul(uint256 a, uint256 b) internal pure returns (uint256) {\n        if (a == 0) return 0;\n        uint256 c = a * b;\n        require(c / a == b, \"SafeMath: multiplication overflow\");\n        return c;\n    }\n\n    /**\n     * @dev Returns the integer division of two unsigned integers, reverting on\n     * division by zero. The result is rounded towards zero.\n     *\n     * Counterpart to Solidity's `/` operator. Note: this function uses a\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\n     * uses an invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     *\n     * - The divisor cannot be zero.\n     */\n    function div(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b > 0, \"SafeMath: division by zero\");\n        return a / b;\n    }\n\n    /**\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\n     * reverting when dividing by zero.\n     *\n     * Counterpart to Solidity's `%` operator. This function uses a `revert`\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\n     * invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     *\n     * - The divisor cannot be zero.\n     */\n    function mod(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b > 0, \"SafeMath: modulo by zero\");\n        return a % b;\n    }\n\n    /**\n     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on\n     * overflow (when the result is negative).\n     *\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\n     * message unnecessarily. For custom revert reasons use {trySub}.\n     *\n     * Counterpart to Solidity's `-` operator.\n     *\n     * Requirements:\n     *\n     * - Subtraction cannot overflow.\n     */\n    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\n        require(b <= a, errorMessage);\n        return a - b;\n    }\n\n    /**\n     * @dev Returns the integer division of two unsigned integers, reverting with custom message on\n     * division by zero. The result is rounded towards zero.\n     *\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\n     * message unnecessarily. For custom revert reasons use {tryDiv}.\n     *\n     * Counterpart to Solidity's `/` operator. Note: this function uses a\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\n     * uses an invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     *\n     * - The divisor cannot be zero.\n     */\n    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\n        require(b > 0, errorMessage);\n        return a / b;\n    }\n\n    /**\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\n     * reverting with custom message when dividing by zero.\n     *\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\n     * message unnecessarily. For custom revert reasons use {tryMod}.\n     *\n     * Counterpart to Solidity's `%` operator. This function uses a `revert`\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\n     * invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     *\n     * - The divisor cannot be zero.\n     */\n    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\n        require(b > 0, errorMessage);\n        return a % b;\n    }\n}\n",
                "keccak256": "0xe22a1fc7400ae196eba2ad1562d0386462b00a6363b742d55a2fd2021a58586f",
                "license": "MIT"
            },
            "@openzeppelin/contracts/token/ERC20/IERC20.sol": {
                "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\n/**\n * @dev Interface of the ERC20 standard as defined in the EIP.\n */\ninterface IERC20 {\n    /**\n     * @dev Returns the amount of tokens in existence.\n     */\n    function totalSupply() external view returns (uint256);\n\n    /**\n     * @dev Returns the amount of tokens owned by `account`.\n     */\n    function balanceOf(address account) external view returns (uint256);\n\n    /**\n     * @dev Moves `amount` tokens from the caller's account to `recipient`.\n     *\n     * Returns a boolean value indicating whether the operation succeeded.\n     *\n     * Emits a {Transfer} event.\n     */\n    function transfer(address recipient, uint256 amount) external returns (bool);\n\n    /**\n     * @dev Returns the remaining number of tokens that `spender` will be\n     * allowed to spend on behalf of `owner` through {transferFrom}. This is\n     * zero by default.\n     *\n     * This value changes when {approve} or {transferFrom} are called.\n     */\n    function allowance(address owner, address spender) external view returns (uint256);\n\n    /**\n     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.\n     *\n     * Returns a boolean value indicating whether the operation succeeded.\n     *\n     * IMPORTANT: Beware that changing an allowance with this method brings the risk\n     * that someone may use both the old and the new allowance by unfortunate\n     * transaction ordering. One possible solution to mitigate this race\n     * condition is to first reduce the spender's allowance to 0 and set the\n     * desired value afterwards:\n     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729\n     *\n     * Emits an {Approval} event.\n     */\n    function approve(address spender, uint256 amount) external returns (bool);\n\n    /**\n     * @dev Moves `amount` tokens from `sender` to `recipient` using the\n     * allowance mechanism. `amount` is then deducted from the caller's\n     * allowance.\n     *\n     * Returns a boolean value indicating whether the operation succeeded.\n     *\n     * Emits a {Transfer} event.\n     */\n    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);\n\n    /**\n     * @dev Emitted when `value` tokens are moved from one account (`from`) to\n     * another (`to`).\n     *\n     * Note that `value` may be zero.\n     */\n    event Transfer(address indexed from, address indexed to, uint256 value);\n\n    /**\n     * @dev Emitted when the allowance of a `spender` for an `owner` is set by\n     * a call to {approve}. `value` is the new allowance.\n     */\n    event Approval(address indexed owner, address indexed spender, uint256 value);\n}\n",
                "keccak256": "0xbd74f587ab9b9711801baf667db1426e4a03fd2d7f15af33e0e0d0394e7cef76",
                "license": "MIT"
            },
            "@openzeppelin/contracts/token/ERC20/SafeERC20.sol": {
                "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\nimport \"./IERC20.sol\";\nimport \"../../math/SafeMath.sol\";\nimport \"../../utils/Address.sol\";\n\n/**\n * @title SafeERC20\n * @dev Wrappers around ERC20 operations that throw on failure (when the token\n * contract returns false). Tokens that return no value (and instead revert or\n * throw on failure) are also supported, non-reverting calls are assumed to be\n * successful.\n * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,\n * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.\n */\nlibrary SafeERC20 {\n    using SafeMath for uint256;\n    using Address for address;\n\n    function safeTransfer(IERC20 token, address to, uint256 value) internal {\n        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));\n    }\n\n    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {\n        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));\n    }\n\n    /**\n     * @dev Deprecated. This function has issues similar to the ones found in\n     * {IERC20-approve}, and its usage is discouraged.\n     *\n     * Whenever possible, use {safeIncreaseAllowance} and\n     * {safeDecreaseAllowance} instead.\n     */\n    function safeApprove(IERC20 token, address spender, uint256 value) internal {\n        // safeApprove should only be called when setting an initial allowance,\n        // or when resetting it to zero. To increase and decrease it, use\n        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'\n        // solhint-disable-next-line max-line-length\n        require((value == 0) || (token.allowance(address(this), spender) == 0),\n            \"SafeERC20: approve from non-zero to non-zero allowance\"\n        );\n        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));\n    }\n\n    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {\n        uint256 newAllowance = token.allowance(address(this), spender).add(value);\n        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));\n    }\n\n    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {\n        uint256 newAllowance = token.allowance(address(this), spender).sub(value, \"SafeERC20: decreased allowance below zero\");\n        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));\n    }\n\n    /**\n     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement\n     * on the return value: the return value is optional (but if data is returned, it must not be false).\n     * @param token The token targeted by the call.\n     * @param data The call data (encoded using abi.encode or one of its variants).\n     */\n    function _callOptionalReturn(IERC20 token, bytes memory data) private {\n        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since\n        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that\n        // the target address contains contract code and also asserts for success in the low-level call.\n\n        bytes memory returndata = address(token).functionCall(data, \"SafeERC20: low-level call failed\");\n        if (returndata.length > 0) { // Return data is optional\n            // solhint-disable-next-line max-line-length\n            require(abi.decode(returndata, (bool)), \"SafeERC20: ERC20 operation did not succeed\");\n        }\n    }\n}\n",
                "keccak256": "0xc77dd6233a82c7c6e3dc49da8f3456baa00ecd3ea4dfa9222002a9aebf155dcd",
                "license": "MIT"
            },
            "@openzeppelin/contracts/utils/Address.sol": {
                "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\n/**\n * @dev Collection of functions related to the address type\n */\nlibrary Address {\n    /**\n     * @dev Returns true if `account` is a contract.\n     *\n     * [IMPORTANT]\n     * ====\n     * It is unsafe to assume that an address for which this function returns\n     * false is an externally-owned account (EOA) and not a contract.\n     *\n     * Among others, `isContract` will return false for the following\n     * types of addresses:\n     *\n     *  - an externally-owned account\n     *  - a contract in construction\n     *  - an address where a contract will be created\n     *  - an address where a contract lived, but was destroyed\n     * ====\n     */\n    function isContract(address account) internal view returns (bool) {\n        // This method relies on extcodesize, which returns 0 for contracts in\n        // construction, since the code is only stored at the end of the\n        // constructor execution.\n\n        uint256 size;\n        // solhint-disable-next-line no-inline-assembly\n        assembly { size := extcodesize(account) }\n        return size > 0;\n    }\n\n    /**\n     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to\n     * `recipient`, forwarding all available gas and reverting on errors.\n     *\n     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost\n     * of certain opcodes, possibly making contracts go over the 2300 gas limit\n     * imposed by `transfer`, making them unable to receive funds via\n     * `transfer`. {sendValue} removes this limitation.\n     *\n     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].\n     *\n     * IMPORTANT: because control is transferred to `recipient`, care must be\n     * taken to not create reentrancy vulnerabilities. Consider using\n     * {ReentrancyGuard} or the\n     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].\n     */\n    function sendValue(address payable recipient, uint256 amount) internal {\n        require(address(this).balance >= amount, \"Address: insufficient balance\");\n\n        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value\n        (bool success, ) = recipient.call{ value: amount }(\"\");\n        require(success, \"Address: unable to send value, recipient may have reverted\");\n    }\n\n    /**\n     * @dev Performs a Solidity function call using a low level `call`. A\n     * plain`call` is an unsafe replacement for a function call: use this\n     * function instead.\n     *\n     * If `target` reverts with a revert reason, it is bubbled up by this\n     * function (like regular Solidity function calls).\n     *\n     * Returns the raw returned data. To convert to the expected return value,\n     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].\n     *\n     * Requirements:\n     *\n     * - `target` must be a contract.\n     * - calling `target` with `data` must not revert.\n     *\n     * _Available since v3.1._\n     */\n    function functionCall(address target, bytes memory data) internal returns (bytes memory) {\n      return functionCall(target, data, \"Address: low-level call failed\");\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with\n     * `errorMessage` as a fallback revert reason when `target` reverts.\n     *\n     * _Available since v3.1._\n     */\n    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {\n        return functionCallWithValue(target, data, 0, errorMessage);\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\n     * but also transferring `value` wei to `target`.\n     *\n     * Requirements:\n     *\n     * - the calling contract must have an ETH balance of at least `value`.\n     * - the called Solidity function must be `payable`.\n     *\n     * _Available since v3.1._\n     */\n    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {\n        return functionCallWithValue(target, data, value, \"Address: low-level call with value failed\");\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but\n     * with `errorMessage` as a fallback revert reason when `target` reverts.\n     *\n     * _Available since v3.1._\n     */\n    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {\n        require(address(this).balance >= value, \"Address: insufficient balance for call\");\n        require(isContract(target), \"Address: call to non-contract\");\n\n        // solhint-disable-next-line avoid-low-level-calls\n        (bool success, bytes memory returndata) = target.call{ value: value }(data);\n        return _verifyCallResult(success, returndata, errorMessage);\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\n     * but performing a static call.\n     *\n     * _Available since v3.3._\n     */\n    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {\n        return functionStaticCall(target, data, \"Address: low-level static call failed\");\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],\n     * but performing a static call.\n     *\n     * _Available since v3.3._\n     */\n    function functionStaticCall(address target, bytes memory data, string memory errorMessage) internal view returns (bytes memory) {\n        require(isContract(target), \"Address: static call to non-contract\");\n\n        // solhint-disable-next-line avoid-low-level-calls\n        (bool success, bytes memory returndata) = target.staticcall(data);\n        return _verifyCallResult(success, returndata, errorMessage);\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\n     * but performing a delegate call.\n     *\n     * _Available since v3.4._\n     */\n    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {\n        return functionDelegateCall(target, data, \"Address: low-level delegate call failed\");\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],\n     * but performing a delegate call.\n     *\n     * _Available since v3.4._\n     */\n    function functionDelegateCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {\n        require(isContract(target), \"Address: delegate call to non-contract\");\n\n        // solhint-disable-next-line avoid-low-level-calls\n        (bool success, bytes memory returndata) = target.delegatecall(data);\n        return _verifyCallResult(success, returndata, errorMessage);\n    }\n\n    function _verifyCallResult(bool success, bytes memory returndata, string memory errorMessage) private pure returns(bytes memory) {\n        if (success) {\n            return returndata;\n        } else {\n            // Look for revert reason and bubble it up if present\n            if (returndata.length > 0) {\n                // The easiest way to bubble the revert reason is using memory via assembly\n\n                // solhint-disable-next-line no-inline-assembly\n                assembly {\n                    let returndata_size := mload(returndata)\n                    revert(add(32, returndata), returndata_size)\n                }\n            } else {\n                revert(errorMessage);\n            }\n        }\n    }\n}\n",
                "keccak256": "0xf89f005a3d98f7768cdee2583707db0ac725cf567d455751af32ee68132f3db3",
                "license": "MIT"
            },
            "@openzeppelin/contracts/utils/Context.sol": {
                "content": "// SPDX-License-Identifier: MIT\n\npragma solidity >=0.6.0 <0.8.0;\n\n/*\n * @dev Provides information about the current execution context, including the\n * sender of the transaction and its data. While these are generally available\n * via msg.sender and msg.data, they should not be accessed in such a direct\n * manner, since when dealing with GSN meta-transactions the account sending and\n * paying for execution may not be the actual sender (as far as an application\n * is concerned).\n *\n * This contract is only required for intermediate, library-like contracts.\n */\nabstract contract Context {\n    function _msgSender() internal view virtual returns (address payable) {\n        return msg.sender;\n    }\n\n    function _msgData() internal view virtual returns (bytes memory) {\n        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691\n        return msg.data;\n    }\n}\n",
                "keccak256": "0x8d3cb350f04ff49cfb10aef08d87f19dcbaecc8027b0bed12f3275cd12f38cf0",
                "license": "MIT"
            },
            "@openzeppelin/contracts/utils/ReentrancyGuard.sol": {
                "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\n/**\n * @dev Contract module that helps prevent reentrant calls to a function.\n *\n * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier\n * available, which can be applied to functions to make sure there are no nested\n * (reentrant) calls to them.\n *\n * Note that because there is a single `nonReentrant` guard, functions marked as\n * `nonReentrant` may not call one another. This can be worked around by making\n * those functions `private`, and then adding `external` `nonReentrant` entry\n * points to them.\n *\n * TIP: If you would like to learn more about reentrancy and alternative ways\n * to protect against it, check out our blog post\n * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].\n */\nabstract contract ReentrancyGuard {\n    // Booleans are more expensive than uint256 or any type that takes up a full\n    // word because each write operation emits an extra SLOAD to first read the\n    // slot's contents, replace the bits taken up by the boolean, and then write\n    // back. This is the compiler's defense against contract upgrades and\n    // pointer aliasing, and it cannot be disabled.\n\n    // The values being non-zero value makes deployment a bit more expensive,\n    // but in exchange the refund on every call to nonReentrant will be lower in\n    // amount. Since refunds are capped to a percentage of the total\n    // transaction's gas, it is best to keep them low in cases like this one, to\n    // increase the likelihood of the full refund coming into effect.\n    uint256 private constant _NOT_ENTERED = 1;\n    uint256 private constant _ENTERED = 2;\n\n    uint256 private _status;\n\n    constructor () {\n        _status = _NOT_ENTERED;\n    }\n\n    /**\n     * @dev Prevents a contract from calling itself, directly or indirectly.\n     * Calling a `nonReentrant` function from another `nonReentrant`\n     * function is not supported. It is possible to prevent this from happening\n     * by making the `nonReentrant` function external, and make it call a\n     * `private` function that does the actual work.\n     */\n    modifier nonReentrant() {\n        // On the first call to nonReentrant, _notEntered will be true\n        require(_status != _ENTERED, \"ReentrancyGuard: reentrant call\");\n\n        // Any calls to nonReentrant after this point will fail\n        _status = _ENTERED;\n\n        _;\n\n        // By storing the original value once again, a refund is triggered (see\n        // https://eips.ethereum.org/EIPS/eip-2200)\n        _status = _NOT_ENTERED;\n    }\n}\n",
                "keccak256": "0x1153f6dd334c01566417b8c551122450542a2b75a2bbb379d59a8c320ed6da28",
                "license": "MIT"
            },
            "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title The interface for the Uniswap V3 Factory\n/// @notice The Uniswap V3 Factory facilitates creation of Uniswap V3 pools and control over the protocol fees\ninterface IUniswapV3Factory {\n    /// @notice Emitted when the owner of the factory is changed\n    /// @param oldOwner The owner before the owner was changed\n    /// @param newOwner The owner after the owner was changed\n    event OwnerChanged(address indexed oldOwner, address indexed newOwner);\n\n    /// @notice Emitted when a pool is created\n    /// @param token0 The first token of the pool by address sort order\n    /// @param token1 The second token of the pool by address sort order\n    /// @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip\n    /// @param tickSpacing The minimum number of ticks between initialized ticks\n    /// @param pool The address of the created pool\n    event PoolCreated(\n        address indexed token0,\n        address indexed token1,\n        uint24 indexed fee,\n        int24 tickSpacing,\n        address pool\n    );\n\n    /// @notice Emitted when a new fee amount is enabled for pool creation via the factory\n    /// @param fee The enabled fee, denominated in hundredths of a bip\n    /// @param tickSpacing The minimum number of ticks between initialized ticks for pools created with the given fee\n    event FeeAmountEnabled(uint24 indexed fee, int24 indexed tickSpacing);\n\n    /// @notice Returns the current owner of the factory\n    /// @dev Can be changed by the current owner via setOwner\n    /// @return The address of the factory owner\n    function owner() external view returns (address);\n\n    /// @notice Returns the tick spacing for a given fee amount, if enabled, or 0 if not enabled\n    /// @dev A fee amount can never be removed, so this value should be hard coded or cached in the calling context\n    /// @param fee The enabled fee, denominated in hundredths of a bip. Returns 0 in case of unenabled fee\n    /// @return The tick spacing\n    function feeAmountTickSpacing(uint24 fee) external view returns (int24);\n\n    /// @notice Returns the pool address for a given pair of tokens and a fee, or address 0 if it does not exist\n    /// @dev tokenA and tokenB may be passed in either token0/token1 or token1/token0 order\n    /// @param tokenA The contract address of either token0 or token1\n    /// @param tokenB The contract address of the other token\n    /// @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip\n    /// @return pool The pool address\n    function getPool(\n        address tokenA,\n        address tokenB,\n        uint24 fee\n    ) external view returns (address pool);\n\n    /// @notice Creates a pool for the given two tokens and fee\n    /// @param tokenA One of the two tokens in the desired pool\n    /// @param tokenB The other of the two tokens in the desired pool\n    /// @param fee The desired fee for the pool\n    /// @dev tokenA and tokenB may be passed in either order: token0/token1 or token1/token0. tickSpacing is retrieved\n    /// from the fee. The call will revert if the pool already exists, the fee is invalid, or the token arguments\n    /// are invalid.\n    /// @return pool The address of the newly created pool\n    function createPool(\n        address tokenA,\n        address tokenB,\n        uint24 fee\n    ) external returns (address pool);\n\n    /// @notice Updates the owner of the factory\n    /// @dev Must be called by the current owner\n    /// @param _owner The new owner of the factory\n    function setOwner(address _owner) external;\n\n    /// @notice Enables a fee amount with the given tickSpacing\n    /// @dev Fee amounts may never be removed once enabled\n    /// @param fee The fee amount to enable, denominated in hundredths of a bip (i.e. 1e-6)\n    /// @param tickSpacing The spacing between ticks to be enforced for all pools created with the given fee amount\n    function enableFeeAmount(uint24 fee, int24 tickSpacing) external;\n}\n",
                "keccak256": "0xcc3d0c93fc9ac0febbe09f941b465b57f750bcf3b48432da0b97dc289cfdc489",
                "license": "GPL-2.0-or-later"
            },
            "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\nimport './pool/IUniswapV3PoolImmutables.sol';\nimport './pool/IUniswapV3PoolState.sol';\nimport './pool/IUniswapV3PoolDerivedState.sol';\nimport './pool/IUniswapV3PoolActions.sol';\nimport './pool/IUniswapV3PoolOwnerActions.sol';\nimport './pool/IUniswapV3PoolEvents.sol';\n\n/// @title The interface for a Uniswap V3 Pool\n/// @notice A Uniswap pool facilitates swapping and automated market making between any two assets that strictly conform\n/// to the ERC20 specification\n/// @dev The pool interface is broken up into many smaller pieces\ninterface IUniswapV3Pool is\n    IUniswapV3PoolImmutables,\n    IUniswapV3PoolState,\n    IUniswapV3PoolDerivedState,\n    IUniswapV3PoolActions,\n    IUniswapV3PoolOwnerActions,\n    IUniswapV3PoolEvents\n{\n\n}\n",
                "keccak256": "0xfe6113d518466cd6652c85b111e01f33eb62157f49ae5ed7d5a3947a2044adb1",
                "license": "GPL-2.0-or-later"
            },
            "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolActions.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Permissionless pool actions\n/// @notice Contains pool methods that can be called by anyone\ninterface IUniswapV3PoolActions {\n    /// @notice Sets the initial price for the pool\n    /// @dev Price is represented as a sqrt(amountToken1/amountToken0) Q64.96 value\n    /// @param sqrtPriceX96 the initial sqrt price of the pool as a Q64.96\n    function initialize(uint160 sqrtPriceX96) external;\n\n    /// @notice Adds liquidity for the given recipient/tickLower/tickUpper position\n    /// @dev The caller of this method receives a callback in the form of IUniswapV3MintCallback#uniswapV3MintCallback\n    /// in which they must pay any token0 or token1 owed for the liquidity. The amount of token0/token1 due depends\n    /// on tickLower, tickUpper, the amount of liquidity, and the current price.\n    /// @param recipient The address for which the liquidity will be created\n    /// @param tickLower The lower tick of the position in which to add liquidity\n    /// @param tickUpper The upper tick of the position in which to add liquidity\n    /// @param amount The amount of liquidity to mint\n    /// @param data Any data that should be passed through to the callback\n    /// @return amount0 The amount of token0 that was paid to mint the given amount of liquidity. Matches the value in the callback\n    /// @return amount1 The amount of token1 that was paid to mint the given amount of liquidity. Matches the value in the callback\n    function mint(\n        address recipient,\n        int24 tickLower,\n        int24 tickUpper,\n        uint128 amount,\n        bytes calldata data\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Collects tokens owed to a position\n    /// @dev Does not recompute fees earned, which must be done either via mint or burn of any amount of liquidity.\n    /// Collect must be called by the position owner. To withdraw only token0 or only token1, amount0Requested or\n    /// amount1Requested may be set to zero. To withdraw all tokens owed, caller may pass any value greater than the\n    /// actual tokens owed, e.g. type(uint128).max. Tokens owed may be from accumulated swap fees or burned liquidity.\n    /// @param recipient The address which should receive the fees collected\n    /// @param tickLower The lower tick of the position for which to collect fees\n    /// @param tickUpper The upper tick of the position for which to collect fees\n    /// @param amount0Requested How much token0 should be withdrawn from the fees owed\n    /// @param amount1Requested How much token1 should be withdrawn from the fees owed\n    /// @return amount0 The amount of fees collected in token0\n    /// @return amount1 The amount of fees collected in token1\n    function collect(\n        address recipient,\n        int24 tickLower,\n        int24 tickUpper,\n        uint128 amount0Requested,\n        uint128 amount1Requested\n    ) external returns (uint128 amount0, uint128 amount1);\n\n    /// @notice Burn liquidity from the sender and account tokens owed for the liquidity to the position\n    /// @dev Can be used to trigger a recalculation of fees owed to a position by calling with an amount of 0\n    /// @dev Fees must be collected separately via a call to #collect\n    /// @param tickLower The lower tick of the position for which to burn liquidity\n    /// @param tickUpper The upper tick of the position for which to burn liquidity\n    /// @param amount How much liquidity to burn\n    /// @return amount0 The amount of token0 sent to the recipient\n    /// @return amount1 The amount of token1 sent to the recipient\n    function burn(\n        int24 tickLower,\n        int24 tickUpper,\n        uint128 amount\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Swap token0 for token1, or token1 for token0\n    /// @dev The caller of this method receives a callback in the form of IUniswapV3SwapCallback#uniswapV3SwapCallback\n    /// @param recipient The address to receive the output of the swap\n    /// @param zeroForOne The direction of the swap, true for token0 to token1, false for token1 to token0\n    /// @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)\n    /// @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this\n    /// value after the swap. If one for zero, the price cannot be greater than this value after the swap\n    /// @param data Any data to be passed through to the callback\n    /// @return amount0 The delta of the balance of token0 of the pool, exact when negative, minimum when positive\n    /// @return amount1 The delta of the balance of token1 of the pool, exact when negative, minimum when positive\n    function swap(\n        address recipient,\n        bool zeroForOne,\n        int256 amountSpecified,\n        uint160 sqrtPriceLimitX96,\n        bytes calldata data\n    ) external returns (int256 amount0, int256 amount1);\n\n    /// @notice Receive token0 and/or token1 and pay it back, plus a fee, in the callback\n    /// @dev The caller of this method receives a callback in the form of IUniswapV3FlashCallback#uniswapV3FlashCallback\n    /// @dev Can be used to donate underlying tokens pro-rata to currently in-range liquidity providers by calling\n    /// with 0 amount{0,1} and sending the donation amount(s) from the callback\n    /// @param recipient The address which will receive the token0 and token1 amounts\n    /// @param amount0 The amount of token0 to send\n    /// @param amount1 The amount of token1 to send\n    /// @param data Any data to be passed through to the callback\n    function flash(\n        address recipient,\n        uint256 amount0,\n        uint256 amount1,\n        bytes calldata data\n    ) external;\n\n    /// @notice Increase the maximum number of price and liquidity observations that this pool will store\n    /// @dev This method is no-op if the pool already has an observationCardinalityNext greater than or equal to\n    /// the input observationCardinalityNext.\n    /// @param observationCardinalityNext The desired minimum number of observations for the pool to store\n    function increaseObservationCardinalityNext(uint16 observationCardinalityNext) external;\n}\n",
                "keccak256": "0x9453dd0e7442188667d01d9b65de3f1e14e9511ff3e303179a15f6fc267f7634",
                "license": "GPL-2.0-or-later"
            },
            "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolDerivedState.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Pool state that is not stored\n/// @notice Contains view functions to provide information about the pool that is computed rather than stored on the\n/// blockchain. The functions here may have variable gas costs.\ninterface IUniswapV3PoolDerivedState {\n    /// @notice Returns the cumulative tick and liquidity as of each timestamp `secondsAgo` from the current block timestamp\n    /// @dev To get a time weighted average tick or liquidity-in-range, you must call this with two values, one representing\n    /// the beginning of the period and another for the end of the period. E.g., to get the last hour time-weighted average tick,\n    /// you must call it with secondsAgos = [3600, 0].\n    /// @dev The time weighted average tick represents the geometric time weighted average price of the pool, in\n    /// log base sqrt(1.0001) of token1 / token0. The TickMath library can be used to go from a tick value to a ratio.\n    /// @param secondsAgos From how long ago each cumulative tick and liquidity value should be returned\n    /// @return tickCumulatives Cumulative tick values as of each `secondsAgos` from the current block timestamp\n    /// @return secondsPerLiquidityCumulativeX128s Cumulative seconds per liquidity-in-range value as of each `secondsAgos` from the current block\n    /// timestamp\n    function observe(uint32[] calldata secondsAgos)\n        external\n        view\n        returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s);\n\n    /// @notice Returns a snapshot of the tick cumulative, seconds per liquidity and seconds inside a tick range\n    /// @dev Snapshots must only be compared to other snapshots, taken over a period for which a position existed.\n    /// I.e., snapshots cannot be compared if a position is not held for the entire period between when the first\n    /// snapshot is taken and the second snapshot is taken.\n    /// @param tickLower The lower tick of the range\n    /// @param tickUpper The upper tick of the range\n    /// @return tickCumulativeInside The snapshot of the tick accumulator for the range\n    /// @return secondsPerLiquidityInsideX128 The snapshot of seconds per liquidity for the range\n    /// @return secondsInside The snapshot of seconds per liquidity for the range\n    function snapshotCumulativesInside(int24 tickLower, int24 tickUpper)\n        external\n        view\n        returns (\n            int56 tickCumulativeInside,\n            uint160 secondsPerLiquidityInsideX128,\n            uint32 secondsInside\n        );\n}\n",
                "keccak256": "0xe603ac5b17ecdee73ba2b27efdf386c257a19c14206e87eee77e2017b742d9e5",
                "license": "GPL-2.0-or-later"
            },
            "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolEvents.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Events emitted by a pool\n/// @notice Contains all events emitted by the pool\ninterface IUniswapV3PoolEvents {\n    /// @notice Emitted exactly once by a pool when #initialize is first called on the pool\n    /// @dev Mint/Burn/Swap cannot be emitted by the pool before Initialize\n    /// @param sqrtPriceX96 The initial sqrt price of the pool, as a Q64.96\n    /// @param tick The initial tick of the pool, i.e. log base 1.0001 of the starting price of the pool\n    event Initialize(uint160 sqrtPriceX96, int24 tick);\n\n    /// @notice Emitted when liquidity is minted for a given position\n    /// @param sender The address that minted the liquidity\n    /// @param owner The owner of the position and recipient of any minted liquidity\n    /// @param tickLower The lower tick of the position\n    /// @param tickUpper The upper tick of the position\n    /// @param amount The amount of liquidity minted to the position range\n    /// @param amount0 How much token0 was required for the minted liquidity\n    /// @param amount1 How much token1 was required for the minted liquidity\n    event Mint(\n        address sender,\n        address indexed owner,\n        int24 indexed tickLower,\n        int24 indexed tickUpper,\n        uint128 amount,\n        uint256 amount0,\n        uint256 amount1\n    );\n\n    /// @notice Emitted when fees are collected by the owner of a position\n    /// @dev Collect events may be emitted with zero amount0 and amount1 when the caller chooses not to collect fees\n    /// @param owner The owner of the position for which fees are collected\n    /// @param tickLower The lower tick of the position\n    /// @param tickUpper The upper tick of the position\n    /// @param amount0 The amount of token0 fees collected\n    /// @param amount1 The amount of token1 fees collected\n    event Collect(\n        address indexed owner,\n        address recipient,\n        int24 indexed tickLower,\n        int24 indexed tickUpper,\n        uint128 amount0,\n        uint128 amount1\n    );\n\n    /// @notice Emitted when a position's liquidity is removed\n    /// @dev Does not withdraw any fees earned by the liquidity position, which must be withdrawn via #collect\n    /// @param owner The owner of the position for which liquidity is removed\n    /// @param tickLower The lower tick of the position\n    /// @param tickUpper The upper tick of the position\n    /// @param amount The amount of liquidity to remove\n    /// @param amount0 The amount of token0 withdrawn\n    /// @param amount1 The amount of token1 withdrawn\n    event Burn(\n        address indexed owner,\n        int24 indexed tickLower,\n        int24 indexed tickUpper,\n        uint128 amount,\n        uint256 amount0,\n        uint256 amount1\n    );\n\n    /// @notice Emitted by the pool for any swaps between token0 and token1\n    /// @param sender The address that initiated the swap call, and that received the callback\n    /// @param recipient The address that received the output of the swap\n    /// @param amount0 The delta of the token0 balance of the pool\n    /// @param amount1 The delta of the token1 balance of the pool\n    /// @param sqrtPriceX96 The sqrt(price) of the pool after the swap, as a Q64.96\n    /// @param liquidity The liquidity of the pool after the swap\n    /// @param tick The log base 1.0001 of price of the pool after the swap\n    event Swap(\n        address indexed sender,\n        address indexed recipient,\n        int256 amount0,\n        int256 amount1,\n        uint160 sqrtPriceX96,\n        uint128 liquidity,\n        int24 tick\n    );\n\n    /// @notice Emitted by the pool for any flashes of token0/token1\n    /// @param sender The address that initiated the swap call, and that received the callback\n    /// @param recipient The address that received the tokens from flash\n    /// @param amount0 The amount of token0 that was flashed\n    /// @param amount1 The amount of token1 that was flashed\n    /// @param paid0 The amount of token0 paid for the flash, which can exceed the amount0 plus the fee\n    /// @param paid1 The amount of token1 paid for the flash, which can exceed the amount1 plus the fee\n    event Flash(\n        address indexed sender,\n        address indexed recipient,\n        uint256 amount0,\n        uint256 amount1,\n        uint256 paid0,\n        uint256 paid1\n    );\n\n    /// @notice Emitted by the pool for increases to the number of observations that can be stored\n    /// @dev observationCardinalityNext is not the observation cardinality until an observation is written at the index\n    /// just before a mint/swap/burn.\n    /// @param observationCardinalityNextOld The previous value of the next observation cardinality\n    /// @param observationCardinalityNextNew The updated value of the next observation cardinality\n    event IncreaseObservationCardinalityNext(\n        uint16 observationCardinalityNextOld,\n        uint16 observationCardinalityNextNew\n    );\n\n    /// @notice Emitted when the protocol fee is changed by the pool\n    /// @param feeProtocol0Old The previous value of the token0 protocol fee\n    /// @param feeProtocol1Old The previous value of the token1 protocol fee\n    /// @param feeProtocol0New The updated value of the token0 protocol fee\n    /// @param feeProtocol1New The updated value of the token1 protocol fee\n    event SetFeeProtocol(uint8 feeProtocol0Old, uint8 feeProtocol1Old, uint8 feeProtocol0New, uint8 feeProtocol1New);\n\n    /// @notice Emitted when the collected protocol fees are withdrawn by the factory owner\n    /// @param sender The address that collects the protocol fees\n    /// @param recipient The address that receives the collected protocol fees\n    /// @param amount0 The amount of token0 protocol fees that is withdrawn\n    /// @param amount0 The amount of token1 protocol fees that is withdrawn\n    event CollectProtocol(address indexed sender, address indexed recipient, uint128 amount0, uint128 amount1);\n}\n",
                "keccak256": "0x8071514d0fe5d17d6fbd31c191cdfb703031c24e0ece3621d88ab10e871375cd",
                "license": "GPL-2.0-or-later"
            },
            "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolImmutables.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Pool state that never changes\n/// @notice These parameters are fixed for a pool forever, i.e., the methods will always return the same values\ninterface IUniswapV3PoolImmutables {\n    /// @notice The contract that deployed the pool, which must adhere to the IUniswapV3Factory interface\n    /// @return The contract address\n    function factory() external view returns (address);\n\n    /// @notice The first of the two tokens of the pool, sorted by address\n    /// @return The token contract address\n    function token0() external view returns (address);\n\n    /// @notice The second of the two tokens of the pool, sorted by address\n    /// @return The token contract address\n    function token1() external view returns (address);\n\n    /// @notice The pool's fee in hundredths of a bip, i.e. 1e-6\n    /// @return The fee\n    function fee() external view returns (uint24);\n\n    /// @notice The pool tick spacing\n    /// @dev Ticks can only be used at multiples of this value, minimum of 1 and always positive\n    /// e.g.: a tickSpacing of 3 means ticks can be initialized every 3rd tick, i.e., ..., -6, -3, 0, 3, 6, ...\n    /// This value is an int24 to avoid casting even though it is always positive.\n    /// @return The tick spacing\n    function tickSpacing() external view returns (int24);\n\n    /// @notice The maximum amount of position liquidity that can use any tick in the range\n    /// @dev This parameter is enforced per tick to prevent liquidity from overflowing a uint128 at any point, and\n    /// also prevents out-of-range liquidity from being used to prevent adding in-range liquidity to a pool\n    /// @return The max amount of liquidity per tick\n    function maxLiquidityPerTick() external view returns (uint128);\n}\n",
                "keccak256": "0xf6e5d2cd1139c4c276bdbc8e1d2b256e456c866a91f1b868da265c6d2685c3f7",
                "license": "GPL-2.0-or-later"
            },
            "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolOwnerActions.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Permissioned pool actions\n/// @notice Contains pool methods that may only be called by the factory owner\ninterface IUniswapV3PoolOwnerActions {\n    /// @notice Set the denominator of the protocol's % share of the fees\n    /// @param feeProtocol0 new protocol fee for token0 of the pool\n    /// @param feeProtocol1 new protocol fee for token1 of the pool\n    function setFeeProtocol(uint8 feeProtocol0, uint8 feeProtocol1) external;\n\n    /// @notice Collect the protocol fee accrued to the pool\n    /// @param recipient The address to which collected protocol fees should be sent\n    /// @param amount0Requested The maximum amount of token0 to send, can be 0 to collect fees in only token1\n    /// @param amount1Requested The maximum amount of token1 to send, can be 0 to collect fees in only token0\n    /// @return amount0 The protocol fee collected in token0\n    /// @return amount1 The protocol fee collected in token1\n    function collectProtocol(\n        address recipient,\n        uint128 amount0Requested,\n        uint128 amount1Requested\n    ) external returns (uint128 amount0, uint128 amount1);\n}\n",
                "keccak256": "0x759b78a2918af9e99e246dc3af084f654e48ef32bb4e4cb8a966aa3dcaece235",
                "license": "GPL-2.0-or-later"
            },
            "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolState.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Pool state that can change\n/// @notice These methods compose the pool's state, and can change with any frequency including multiple times\n/// per transaction\ninterface IUniswapV3PoolState {\n    /// @notice The 0th storage slot in the pool stores many values, and is exposed as a single method to save gas\n    /// when accessed externally.\n    /// @return sqrtPriceX96 The current price of the pool as a sqrt(token1/token0) Q64.96 value\n    /// tick The current tick of the pool, i.e. according to the last tick transition that was run.\n    /// This value may not always be equal to SqrtTickMath.getTickAtSqrtRatio(sqrtPriceX96) if the price is on a tick\n    /// boundary.\n    /// observationIndex The index of the last oracle observation that was written,\n    /// observationCardinality The current maximum number of observations stored in the pool,\n    /// observationCardinalityNext The next maximum number of observations, to be updated when the observation.\n    /// feeProtocol The protocol fee for both tokens of the pool.\n    /// Encoded as two 4 bit values, where the protocol fee of token1 is shifted 4 bits and the protocol fee of token0\n    /// is the lower 4 bits. Used as the denominator of a fraction of the swap fee, e.g. 4 means 1/4th of the swap fee.\n    /// unlocked Whether the pool is currently locked to reentrancy\n    function slot0()\n        external\n        view\n        returns (\n            uint160 sqrtPriceX96,\n            int24 tick,\n            uint16 observationIndex,\n            uint16 observationCardinality,\n            uint16 observationCardinalityNext,\n            uint8 feeProtocol,\n            bool unlocked\n        );\n\n    /// @notice The fee growth as a Q128.128 fees of token0 collected per unit of liquidity for the entire life of the pool\n    /// @dev This value can overflow the uint256\n    function feeGrowthGlobal0X128() external view returns (uint256);\n\n    /// @notice The fee growth as a Q128.128 fees of token1 collected per unit of liquidity for the entire life of the pool\n    /// @dev This value can overflow the uint256\n    function feeGrowthGlobal1X128() external view returns (uint256);\n\n    /// @notice The amounts of token0 and token1 that are owed to the protocol\n    /// @dev Protocol fees will never exceed uint128 max in either token\n    function protocolFees() external view returns (uint128 token0, uint128 token1);\n\n    /// @notice The currently in range liquidity available to the pool\n    /// @dev This value has no relationship to the total liquidity across all ticks\n    function liquidity() external view returns (uint128);\n\n    /// @notice Look up information about a specific tick in the pool\n    /// @param tick The tick to look up\n    /// @return liquidityGross the total amount of position liquidity that uses the pool either as tick lower or\n    /// tick upper,\n    /// liquidityNet how much liquidity changes when the pool price crosses the tick,\n    /// feeGrowthOutside0X128 the fee growth on the other side of the tick from the current tick in token0,\n    /// feeGrowthOutside1X128 the fee growth on the other side of the tick from the current tick in token1,\n    /// tickCumulativeOutside the cumulative tick value on the other side of the tick from the current tick\n    /// secondsPerLiquidityOutsideX128 the seconds spent per liquidity on the other side of the tick from the current tick,\n    /// secondsOutside the seconds spent on the other side of the tick from the current tick,\n    /// initialized Set to true if the tick is initialized, i.e. liquidityGross is greater than 0, otherwise equal to false.\n    /// Outside values can only be used if the tick is initialized, i.e. if liquidityGross is greater than 0.\n    /// In addition, these values are only relative and must be used only in comparison to previous snapshots for\n    /// a specific position.\n    function ticks(int24 tick)\n        external\n        view\n        returns (\n            uint128 liquidityGross,\n            int128 liquidityNet,\n            uint256 feeGrowthOutside0X128,\n            uint256 feeGrowthOutside1X128,\n            int56 tickCumulativeOutside,\n            uint160 secondsPerLiquidityOutsideX128,\n            uint32 secondsOutside,\n            bool initialized\n        );\n\n    /// @notice Returns 256 packed tick initialized boolean values. See TickBitmap for more information\n    function tickBitmap(int16 wordPosition) external view returns (uint256);\n\n    /// @notice Returns the information about a position by the position's key\n    /// @param key The position's key is a hash of a preimage composed by the owner, tickLower and tickUpper\n    /// @return _liquidity The amount of liquidity in the position,\n    /// Returns feeGrowthInside0LastX128 fee growth of token0 inside the tick range as of the last mint/burn/poke,\n    /// Returns feeGrowthInside1LastX128 fee growth of token1 inside the tick range as of the last mint/burn/poke,\n    /// Returns tokensOwed0 the computed amount of token0 owed to the position as of the last mint/burn/poke,\n    /// Returns tokensOwed1 the computed amount of token1 owed to the position as of the last mint/burn/poke\n    function positions(bytes32 key)\n        external\n        view\n        returns (\n            uint128 _liquidity,\n            uint256 feeGrowthInside0LastX128,\n            uint256 feeGrowthInside1LastX128,\n            uint128 tokensOwed0,\n            uint128 tokensOwed1\n        );\n\n    /// @notice Returns data about a specific observation index\n    /// @param index The element of the observations array to fetch\n    /// @dev You most likely want to use #observe() instead of this method to get an observation as of some amount of time\n    /// ago, rather than at a specific index in the array.\n    /// @return blockTimestamp The timestamp of the observation,\n    /// Returns tickCumulative the tick multiplied by seconds elapsed for the life of the pool as of the observation timestamp,\n    /// Returns secondsPerLiquidityCumulativeX128 the seconds per in range liquidity for the life of the pool as of the observation timestamp,\n    /// Returns initialized whether the observation has been initialized and the values are safe to use\n    function observations(uint256 index)\n        external\n        view\n        returns (\n            uint32 blockTimestamp,\n            int56 tickCumulative,\n            uint160 secondsPerLiquidityCumulativeX128,\n            bool initialized\n        );\n}\n",
                "keccak256": "0x852dc1f5df7dcf7f11e7bb3eed79f0cea72ad4b25f6a9d2c35aafb48925fd49f",
                "license": "GPL-2.0-or-later"
            },
            "contracts/ICHIVaultDepositGuard.sol": {
                "content": "// SPDX-License-Identifier: Unlicense\npragma solidity 0.7.6;\n\nimport { IICHIVaultDepositGuard } from \"./interfaces/IICHIVaultDepositGuard.sol\";\nimport { IICHIVaultFactory } from \"./interfaces/IICHIVaultFactory.sol\";\nimport { IICHIVault } from \"./interfaces/IICHIVault.sol\";\nimport { IWHBAR } from \"./interfaces/IWHBAR.sol\";\nimport { IHTS } from \"./interfaces/IHTS.sol\";\nimport { IERC20Wrapper } from \"./interfaces/IERC20Wrapper.sol\";\n\nimport { IUniswapV3Pool } from \"@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol\";\nimport { IUniswapV3Factory } from \"@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol\";\n\nimport { IERC20 } from \"@openzeppelin/contracts/token/ERC20/IERC20.sol\";\nimport { SafeERC20 } from \"@openzeppelin/contracts/token/ERC20/SafeERC20.sol\";\nimport { SafeMath } from \"@openzeppelin/contracts/math/SafeMath.sol\";\nimport { ReentrancyGuard } from \"@openzeppelin/contracts/utils/ReentrancyGuard.sol\";\nimport { Ownable } from \"@openzeppelin/contracts/access/Ownable.sol\";\n\nimport { HTSInteractable } from \"./base/HTSInteractable.sol\";\n\ncontract ICHIVaultDepositGuard is IICHIVaultDepositGuard, ReentrancyGuard, HTSInteractable, Ownable {\n    using SafeERC20 for IERC20;\n    using SafeMath for uint256;\n\n    address public immutable override ICHIVaultFactory;\n    address public immutable override WRAPPED_NATIVE;\n\n    /// @dev the SaucerSwap WHBAR contract creates the WHBAR HTS token in its constructor\n    // and hence HTS_ADDRESS(i.e. tokenId) = WRAPPED_NATIVE(i.e. contractId) + 1\n    /// when interacting with standard IERC20 methods we want to interact with HTS_ADDRESS\n    /// when interacting with the wrapper contract methods(e.g. deposit/withdraw) we use WRAPPED_NATIVE\n    address public immutable override HTS_ADDRESS;\n    address payable public constant HTS_WRAPPER = payable(0x000000000000000000000000000000000093A3A8);\n\n    address private constant NULL_ADDRESS = address(0);\n\n    /// @notice Constructs the IICHIVaultDepositGuard contract.\n    /// @param _ICHIVaultFactory The address of the ICHIVaultFactory.\n    constructor(address _ICHIVaultFactory, address _WRAPPED_NATIVE) {\n        require(_ICHIVaultFactory != NULL_ADDRESS, \"DG.constructor: zero address\");\n        ICHIVaultFactory = _ICHIVaultFactory;\n        WRAPPED_NATIVE = _WRAPPED_NATIVE;\n\n        address _HTS_ADDRESS;\n\n        if (_WRAPPED_NATIVE != NULL_ADDRESS) {\n            _HTS_ADDRESS = IWHBAR(_WRAPPED_NATIVE).token();\n            tryAssociate(_HTS_ADDRESS);\n        }\n\n        HTS_ADDRESS = _HTS_ADDRESS;\n\n        emit Deployed(_ICHIVaultFactory, _WRAPPED_NATIVE);\n    }\n\n    receive() external payable {\n        assert(msg.sender == WRAPPED_NATIVE); // only accept ETH via fallback from the WRAPPED_NATIVE contract\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function associate(address token, address pool) external override onlyOwner {\n        _validateTokenAndPool(token, pool);\n        tryAssociate(token);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function forwardDepositToICHIVault(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 amount,\n        uint256 minimumProceeds,\n        address to\n    ) external override nonReentrant returns (uint256 vaultTokens) {\n        vaultTokens = _forwardDeposit(vault, vaultDeployer, token, amount, minimumProceeds, to, false, true);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function forwardNativeDepositToICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 minimumProceeds,\n        address to\n    ) external payable override nonReentrant returns (uint256 vaultTokens) {\n        uint256 nativeAmount = msg.value;\n        IWHBAR(WRAPPED_NATIVE).deposit{ value: nativeAmount }();\n\n        vaultTokens = _forwardDeposit(vault, vaultDeployer, HTS_ADDRESS, nativeAmount, minimumProceeds, to, true, false);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function forwardWithdrawFromICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external override nonReentrant returns (uint256 amount0, uint256 amount1) {\n        (amount0, amount1) = _forwardWithdraw(vault, vaultDeployer, shares, to, minAmount0, minAmount1, false);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function forwardNativeWithdrawFromICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external override nonReentrant returns (uint256 amount0, uint256 amount1) {\n        (amount0, amount1) = _forwardWithdraw(vault, vaultDeployer, shares, to, minAmount0, minAmount1, true);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function depositToICHIVaultAndTryWrapToHTS(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 erc20Amount,\n        uint256 minimumProceeds,\n        address to\n    ) external override nonReentrant returns (uint256 vaultTokens) {\n        address token0 = IICHIVault(vault).token0();\n        address token1 = IICHIVault(vault).token1();\n\n        IERC20(token).safeTransferFrom(msg.sender, address(this), erc20Amount);\n\n        (address depositToken, uint256 depositAmount) = _prepareDepositToken(token, erc20Amount, token0, token1);\n\n        vaultTokens = _forwardDeposit(\n            vault,\n            vaultDeployer,\n            depositToken,\n            depositAmount,\n            minimumProceeds,\n            to,\n            false,\n            false\n        );\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function withdrawFromICHIVaultAndTryUnwrapToERC20(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external override nonReentrant returns (uint256 amount0, uint256 amount1) {\n        (uint256 rawAmount0, uint256 rawAmount1) = _forwardWithdraw(\n            vault,\n            vaultDeployer,\n            shares,\n            address(this),\n            0,\n            0,\n            false\n        );\n\n        address token0 = IICHIVault(vault).token0();\n        address token1 = IICHIVault(vault).token1();\n\n        uint256 outAmount0 = _tryUnwrapToERC20(token0, rawAmount0, to);\n        uint256 outAmount1 = _tryUnwrapToERC20(token1, rawAmount1, to);\n\n        require(outAmount0 >= minAmount0 && outAmount1 >= minAmount1, \"Insufficient out\");\n\n        amount0 = outAmount0;\n        amount1 = outAmount1;\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function withdrawFromICHIVaultAndTryUnwrapToERC20AndForwardNative(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external override nonReentrant returns (uint256 amount0, uint256 amount1) {\n        (uint256 rawAmount0, uint256 rawAmount1) = _forwardWithdraw(\n            vault,\n            vaultDeployer,\n            shares,\n            address(this),\n            0,\n            0,\n            false\n        );\n\n        address token0 = IICHIVault(vault).token0();\n        address token1 = IICHIVault(vault).token1();\n\n        uint256 outAmount0 = _tryUnwrapOrForwardNative(token0, rawAmount0, to);\n        uint256 outAmount1 = _tryUnwrapOrForwardNative(token1, rawAmount1, to);\n\n        require(outAmount0 >= minAmount0 && outAmount1 >= minAmount1, \"Insufficient out\");\n\n        amount0 = outAmount0;\n        amount1 = outAmount1;\n    }\n\n    function _tryUnwrapOrForwardNative(address token, uint256 htsAmount, address to) private returns (uint256) {\n        if (token == HTS_ADDRESS) {\n            if (htsAmount > 0) {\n                IERC20(HTS_ADDRESS).approve(WRAPPED_NATIVE, htsAmount);\n                IWHBAR(WRAPPED_NATIVE).withdraw(htsAmount);\n                (bool ok, ) = to.call{ value: htsAmount }(\"\");\n                require(ok, \"Native transfer failed\");\n            }\n            return htsAmount;\n        }\n\n        return _tryUnwrapToERC20(token, htsAmount, to);\n    }\n\n    function _tryUnwrapToERC20(address token, uint256 htsAmount, address to) private returns (uint256 outAmount) {\n        if (htsAmount == 0) {\n            return 0;\n        }\n\n        address erc20Token = address(IERC20Wrapper(HTS_WRAPPER).erc20Counterpart(IHTS(token)));\n        if (erc20Token != NULL_ADDRESS) {\n            uint256 rate = IERC20Wrapper(HTS_WRAPPER).rates(IERC20(erc20Token));\n            require(rate > 0, \"Invalid rate\");\n\n            uint256 erc20Amount = htsAmount.mul(rate);\n            IERC20(token).safeIncreaseAllowance(HTS_WRAPPER, htsAmount);\n            IERC20Wrapper(HTS_WRAPPER).unwrap(IERC20(erc20Token), to, erc20Amount);\n            outAmount = erc20Amount;\n        } else {\n            IERC20(token).safeTransfer(to, htsAmount);\n            outAmount = htsAmount;\n        }\n    }\n\n    function _wrapToHTS(address erc20Token, uint256 amount) private returns (uint256 htsAmount) {\n        uint256 rate = IERC20Wrapper(HTS_WRAPPER).rates(IERC20(erc20Token));\n        require(rate > 0, \"Invalid rate\");\n\n        htsAmount = amount.div(rate);\n        require(htsAmount > 0, \"Wrap amount zero\");\n\n        uint256 spendAmount = htsAmount.mul(rate);\n\n        IERC20(erc20Token).safeIncreaseAllowance(HTS_WRAPPER, spendAmount);\n        IERC20Wrapper(HTS_WRAPPER).wrap(IERC20(erc20Token), address(this), spendAmount);\n\n        // refund any leftover ERC20 (flooring in wrap may leave dust)\n        if (amount > spendAmount) {\n            IERC20(erc20Token).safeTransfer(msg.sender, amount - spendAmount);\n        }\n    }\n\n    function _prepareDepositToken(\n        address token,\n        uint256 amount,\n        address token0,\n        address token1\n    ) private returns (address depositToken, uint256 depositAmount) {\n        // Prefer the HTS counterpart whenever the vault uses it\n        address htsToken = address(IERC20Wrapper(HTS_WRAPPER).htsCounterpart(IERC20(token)));\n        bool wrapToHTS = htsToken != NULL_ADDRESS && (htsToken == token0 || htsToken == token1);\n\n        if (wrapToHTS) {\n            depositToken = htsToken;\n            // Only wrap when the provided token is the ERC20 side; if the caller already supplies HTS, skip wrapping.\n            wrapToHTS = token != htsToken;\n        } else {\n            // No HTS counterpart in this vault; require the provided token to be part of the pair.\n            require(token == token0 || token == token1, \"Invalid token\");\n            depositToken = token;\n        }\n\n        depositAmount = amount;\n        if (wrapToHTS) {\n            depositAmount = _wrapToHTS(token, amount);\n        }\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function vaultKey(\n        address vaultDeployer,\n        address token0,\n        address token1,\n        uint24 fee,\n        bool allowToken0,\n        bool allowToken1\n    ) public view override returns (bytes32 key) {\n        key = IICHIVaultFactory(ICHIVaultFactory).genKey(vaultDeployer, token0, token1, fee, allowToken0, allowToken1);\n    }\n\n    function _forwardDeposit(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 amount,\n        uint256 minimumProceeds,\n        address to,\n        bool depositNative,\n        bool pullFromCaller\n    ) private returns (uint256 vaultTokens) {\n        _validateRecipient(to);\n        (IICHIVault ichiVault, address token0, address token1) = _validateVault(vault, vaultDeployer, depositNative);\n\n        require(token == token0 || token == token1, \"Invalid token\");\n\n        if (token == token0) {\n            require(ichiVault.allowToken0(), \"Token0 deposits not allowed\");\n        } else {\n            require(ichiVault.allowToken1(), \"Token1 deposits not allowed\");\n        }\n\n        // if deposit is a native deposit then we don't need to transfer WRAPPED_NATIVE\n        // since this contract receives WRAPPED_NATIVE amount on successful WRAPPED_NATIVE#deposit\n        if (!depositNative && pullFromCaller) {\n            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);\n        }\n\n        IERC20(token).safeIncreaseAllowance(vault, amount);\n\n        uint256 token0Amount = token == token0 ? amount : 0;\n        uint256 token1Amount = token == token1 ? amount : 0;\n\n        vaultTokens = ichiVault.deposit(token0Amount, token1Amount, to);\n        require(vaultTokens >= minimumProceeds, \"Slippage too great. Try again.\");\n\n        emit DepositForwarded(msg.sender, vault, token, amount, vaultTokens, to);\n    }\n\n    function _forwardWithdraw(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1,\n        bool withdrawNative\n    ) private returns (uint256 amount0, uint256 amount1) {\n        _validateRecipient(to);\n        (IICHIVault ichiVault, address token0, address token1) = _validateVault(vault, vaultDeployer, withdrawNative);\n\n        // - sender must grant the guard an allowance for the vault share token\n        // - the guard can then transfer those share tokens to itself\n        // - the guard then approves the vault an allowance in order to burn shares and withdraw from the vault\n        IERC20(vault).safeTransferFrom(msg.sender, address(this), shares);\n\n        if (withdrawNative) {\n            // the vault temporarily custodies the withdrawn amounts\n            (amount0, amount1) = ichiVault.withdraw(shares, address(this));\n            if (token0 == HTS_ADDRESS) {\n                /// @dev the Saucerswap WHBAR contract(i.e. WRAPPED_NATIVE) requires an allowance for the HTS_ADDRESS\n                /// in order to transfer the token to itself on withdraw() which it then burns\n                /// @dev since the Saucerswap WHBAR contract reverts(which is not standard for native wrapper contracts) if we attempt to withdraw(0) we add this positive non-zero check\n                if (amount0 > 0) {\n                    IERC20(HTS_ADDRESS).approve(WRAPPED_NATIVE, amount0);\n                    IWHBAR(WRAPPED_NATIVE).withdraw(amount0);\n                    (bool ok, ) = to.call{ value: amount0 }(\"\");\n                    require(ok, \"Native transfer failed\");\n                }\n                IERC20(token1).safeTransfer(to, amount1);\n            } else {\n                if (amount1 > 0) {\n                    IERC20(HTS_ADDRESS).approve(WRAPPED_NATIVE, amount1);\n                    IWHBAR(WRAPPED_NATIVE).withdraw(amount1);\n                    (bool ok, ) = to.call{ value: amount1 }(\"\");\n                    require(ok, \"Native transfer failed\");\n                }\n                IERC20(token0).safeTransfer(to, amount0);\n            }\n        } else {\n            (amount0, amount1) = ichiVault.withdraw(shares, to);\n        }\n\n        require(amount0 >= minAmount0 && amount1 >= minAmount1, \"Insufficient out\");\n    }\n\n    function _validateRecipient(address to) private {\n        require(to != NULL_ADDRESS, \"Invalid to\");\n    }\n\n    function _validateVault(\n        address vault,\n        address vaultDeployer,\n        bool validateNative\n    ) private returns (IICHIVault ichiVault, address token0, address token1) {\n        ichiVault = IICHIVault(vault);\n\n        token0 = ichiVault.token0();\n        token1 = ichiVault.token1();\n\n        if (validateNative) {\n            require(token0 == HTS_ADDRESS || token1 == HTS_ADDRESS, \"Native vault\");\n        }\n\n        bytes32 factoryVaultKey = vaultKey(\n            vaultDeployer,\n            token0,\n            token1,\n            ichiVault.fee(),\n            ichiVault.allowToken0(),\n            ichiVault.allowToken1()\n        );\n\n        require(IICHIVaultFactory(ICHIVaultFactory).getICHIVault(factoryVaultKey) == vault, \"Invalid vault\");\n    }\n\n    /// @notice Validates a Uniswap V3 pool and checks if a specified token is part of the pool's pair.\n    /// @param token The address of the token to validate as part of the pool's pair.\n    /// @param pool The address of the Uniswap V3 pool to validate.\n    /// @dev Validates that 'pool' is registered with the UniswapV3Factory associated with ICHIVaultFactory,\n    ///      and checks if 'token' is one of the pool's tokens.\n    ///      Reverts with \"Invalid pool\" if the pool is not registered.\n    ///      Reverts with \"Invalid token\" if the token is not part of the pool.\n    function _validateTokenAndPool(address token, address pool) private {\n        IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(pool);\n        IUniswapV3Factory uniswapV3Factory = IUniswapV3Factory(IICHIVaultFactory(ICHIVaultFactory).uniswapV3Factory());\n\n        address token0 = uniswapV3Pool.token0();\n        address token1 = uniswapV3Pool.token1();\n        uint24 fee = uniswapV3Pool.fee();\n\n        address actualPool = uniswapV3Factory.getPool(token0, token1, fee);\n\n        require(actualPool == pool, \"Invalid pool\");\n        require(token == token0 || token == token1, \"Invalid token\");\n    }\n}\n",
                "keccak256": "0x177cdf48619baceb5ae26d8e443e2e229a8e6a5a452d5a153d99bf3a398f269f",
                "license": "Unlicense"
            },
            "contracts/base/HTSInteractable.sol": {
                "content": "// SPDX-License-Identifier: Unlicense\npragma solidity >=0.5.0 <0.9.0;\n\nimport { IHRC } from \"../interfaces/external/hedera/IHRC.sol\";\n\nabstract contract HTSInteractable {\n    /**\n     * @dev Tries to associate a token with the contract if it's IHRC compliant.\n     * @param token The address of the token to associate.\n     * This function attempts to call the `associate` method on the token.\n     * If the token does not implement `associate`(e.g. it's a normal ERC20 token), or if the `associate` method reverts\n     * (possibly due to already being associated, or insufficient gas, etc.), the call will fail and catch the error.\n     */\n    function tryAssociate(address token) internal {\n        try IHRC(address(token)).associate() {\n            // If the token is IHRC compliant, it will successfully associate.\n        } catch {\n            // If the token doesn't have the `associate()` function or the call reverts,\n            // the execution will end up here.\n            // TODO: Handle specific failure cases,\n            // e.g., revert the transaction if the association fails due to reasons other than non-compliance,\n            // like already being associated or insufficient gas.\n        }\n    }\n}\n",
                "keccak256": "0xef3472e8232f01b85c0ebf9eaeeb961071d4f7bb65b7a02c39a2cc97bfe6e0d3",
                "license": "Unlicense"
            },
            "contracts/interfaces/IERC20Wrapper.sol": {
                "content": "// SPDX-License-Identifier: MIT\npragma solidity >=0.7.6 <0.9.0;\n\nimport { IERC20 } from \"@openzeppelin/contracts/token/ERC20/IERC20.sol\";\nimport { IHTS } from \"./IHTS.sol\";\n\n/**\n * @title IERC20Wrapper\n * @notice Complete interface for the ERC20Wrapper contract\n * @dev The ERC20Wrapper enables seamless interoperability between ERC20 tokens and\n *      Hedera Token Service (HTS) tokens through a 1:1 conversion rate.\n *\n * @dev Limitations:\n * - HTS tokens use int64 for their supply, this makes it impossible to accommodate ERC20 tokens\n *   with high supplies. Decimal clamping to 8 decimals is used to be able to support a greater\n *   number of tokens.\n * - Due to clamping there needs to be a conversion rate between the ERC20 and HTS tokens. This\n *   conversion leads to precision loss. To prevent any loss to users, the wrap and unwrap\n *   function ignore the extra amount that would be lost due to precision loss. This leads to a\n *   discrepancy between the user input and the actual amount used, but prevents losses. It is\n *   expected that exactly divisible amounts are used to not encounter this discrepancy.\n * - Tokens MUST implement IERC20Metadata interface.\n *\n * @dev Security Considerations:\n * - Fee-on-transfer tokens are NOT SUPPORTED.\n * - Rebasing tokens are NOT SUPPORTED.\n *\n * @dev Integration Guide:\n * 1. Create token pairs using create()\n * 2. Users associate with HTS tokens before depositing\n * 3. Use wrap to wrap ERC20 to HTS\n * 4. Use unwrap to unwrap HTS to ERC20\n * Note: Ensure the wrap and unwrap amounts are divisible with the conversion rate. Failure to do\n *       so will result in discrepancy between the input amount and the actual amount used.\n */\ninterface IERC20Wrapper {\n    /**\n     * @notice Emitted when ERC20 tokens are deposited into the wrapper to mint HTS tokens\n     * @param token The ERC20 token that was deposited into the wrapper\n     * @param from The caller address that ERC20 tokens are transferred from\n     * @param to The address that received the newly minted HTS tokens\n     * @param amount The amount of ERC20 tokens that were deposited\n     */\n    event Wrap(IERC20 indexed token, address indexed from, address indexed to, uint256 amount);\n\n    /**\n     * @notice Emitted when HTS tokens are burned to withdraw ERC20 tokens from the wrapper\n     * @param token The ERC20 token that was withdrawn from the wrapper\n     * @param from The caller address that HTS tokens are burned from\n     * @param to The address that received the withdrawn ERC20 tokens\n     * @param amount The amount of ERC20 tokens that were withdrawn\n     */\n    event Unwrap(IERC20 indexed token, address indexed from, address indexed to, uint256 amount);\n\n    /**\n     * @notice Emitted when a new HTS token is created as a counterpart to an ERC20 token\n     * @dev This event allows tracking of all ERC20-HTS token pairs created by the wrapper.\n     *      Clients should listen to this event to maintain a registry of available pairs.\n     * @param erc20Token The ERC20 token added to be wrapped\n     * @param htsToken The newly created HTS token address\n     * @param htsDecimals The number of decimals the HTS token was created with (capped at MAX_DECIMALS)\n     */\n    event Create(IERC20 indexed erc20Token, IHTS indexed htsToken, uint256 htsDecimals);\n\n    /// @notice Allows the contract to receive ETH\n    /// @dev Required for Hedera rent payment\n    receive() external payable;\n\n    /**\n     * @notice Returns the HTS token counterpart for a given ERC20 token\n     * @dev This mapping tracks all ERC20 → HTS token pairs created by the wrapper.\n     *      Returns address(0) if no HTS counterpart exists for the given ERC20 token.\n     * @param erc20Token The ERC20 token to query\n     * @return htsToken The corresponding HTS token, or address(0) if none exists\n     */\n    function htsCounterpart(IERC20 erc20Token) external view returns (IHTS htsToken);\n\n    /**\n     * @notice Returns the ERC20 token counterpart for a given HTS token\n     * @dev This mapping tracks all HTS → ERC20 token pairs created by the wrapper.\n     *      Returns address(0) if the HTS token was not created by this wrapper.\n     * @param htsToken The HTS token to query\n     * @return erc20Token The corresponding ERC20 token, or address(0) if none exists\n     */\n    function erc20Counterpart(IHTS htsToken) external view returns (IERC20 erc20Token);\n\n    /**\n     * @notice Returns the conversion rate between ERC20 and HTS counterparts\n     * @dev `htsAmount` is derived as `erc20Amount / rate`\n     *      `erc20Amount` is derived as `htsAmount * rate`\n     * @param erc20Token The ERC20 token to check the rate for\n     * @return rate The conversion rate\n     */\n    function rates(IERC20 erc20Token) external view returns (uint256 rate);\n\n    /**\n     * @notice Creates a new HTS token that corresponds to an ERC20 token\n     * @dev This function creates an HTS token with the same name/symbol as the ERC20 token,\n     *      prefixed with \"HTS \" and \"HTS-\" respectively. The decimal precision is capped at MAX_DECIMALS.\n     *\n     *      If an HTS counterpart already exists, this function returns the existing token\n     *      instead of creating a duplicate.\n     *\n     *      The function requires payment of HBAR (sent as msg.value) to cover the HTS token\n     *      creation fee on the Hedera network.\n     *\n     * @param erc20Token The ERC20 token to create an HTS counterpart for\n     * @return htsToken The newly created (or existing) HTS token\n     * @return htsDecimals The number of decimals for the HTS token (capped at MAX_DECIMALS)\n     *\n     * @dev Requirements:\n     * - erc20Token must be a contract (not an EOA)\n     * - erc20Token must not already have an HTS counterpart\n     * - msg.value must be sufficient to pay HTS creation fees\n     * - erc20Token must implement IERC20Metadata for name/symbol/decimals\n     *\n     * @dev Side Effects:\n     * - Creates a new HTS token with wrapper contract as admin\n     * - Establishes bidirectional mapping between ERC20 and HTS tokens\n     * - Emits Create event\n     *\n     * @dev Limitations:\n     * - ERC20 tokens with very high supplies may cause issues due to HTS int64 supply limit\n     * - Tokens with > MAX_DECIMALS precision will have precision truncated\n     */\n    function create(IERC20 erc20Token) external payable returns (IHTS htsToken, uint256 htsDecimals);\n\n    /**\n     * @notice Deposits ERC20 tokens and mints corresponding HTS tokens\n     * @dev Fee-on-transfer tokens are NOT supported.\n     *      The user input amount is adjusted to prevent tokens lost due to precision.\n     *\n     * @param erc20Token The ERC20 token to deposit\n     * @param to The address to receive the minted HTS tokens\n     * @param erc20Amount The amount of ERC20 tokens to deposit from caller's balance\n     *\n     * @dev Requirements:\n     * - erc20Token must have an existing HTS counterpart (use create() first)\n     * - Caller must have sufficient ERC20 token balance\n     * - Caller must have approved this contract to spend assets amount\n     * - Receiver must be associated with the HTS token\n     *\n     * @dev Important Notes:\n     * - The user input amount is reduced to ensure rate conversion without token loss.\n     */\n    function wrap(IERC20 erc20Token, address to, uint256 erc20Amount) external;\n\n    /**\n     * @notice Withdraws a specific amount of ERC20 tokens by burning HTS tokens\n     * @dev The user input amount is adjusted to prevent tokens lost due to precision.\n     *\n     * @param erc20Token The ERC20 token to withdraw from the wrapper\n     * @param to The address to receive the withdrawn ERC20 tokens\n     * @param erc20Amount The amount of ERC20 tokens to withdraw\n     *\n     * @dev Requirements:\n     * - erc20Token must have an existing HTS counterpart\n     * - Caller must have sufficient HTS token balance\n     *\n     * @dev Important Notes:\n     * - The user input amount is reduced to ensure rate conversion without token loss.\n     * - Unwrap can fail for fee-on-transfer or rebasing tokens. Such tokens are not supported.\n     */\n    function unwrap(IERC20 erc20Token, address to, uint256 erc20Amount) external;\n}\n",
                "keccak256": "0x700e9ca1d3d0c9f39f9d3cd251750334fc8c010f1eef927abacdc8879b5189a0",
                "license": "MIT"
            },
            "contracts/interfaces/IHTS.sol": {
                "content": "// SPDX-License-Identifier: MIT\npragma solidity >=0.7.0;\n\n// NOTE: this empty interface is meant to enable function overloading with IERC20\ninterface IHTS {}",
                "keccak256": "0x5cd56ddc15116581c3d568535edadf20e8712d9e6d54e3dd119c67f50286d109",
                "license": "MIT"
            },
            "contracts/interfaces/IICHIVault.sol": {
                "content": "// SPDX-License-Identifier: Unlicense\npragma solidity >=0.5.0;\n\nimport { IERC20 } from \"@openzeppelin/contracts/token/ERC20/IERC20.sol\";\n\ninterface IICHIVault is IERC20 {\n    function ichiVaultFactory() external view returns (address);\n\n    function pool() external view returns (address);\n\n    function token0() external view returns (address);\n\n    function allowToken0() external view returns (bool);\n\n    function token1() external view returns (address);\n\n    function allowToken1() external view returns (bool);\n\n    function fee() external view returns (uint24);\n\n    function tickSpacing() external view returns (int24);\n\n    function affiliate() external view returns (address);\n\n    function baseLower() external view returns (int24);\n\n    function baseUpper() external view returns (int24);\n\n    function limitLower() external view returns (int24);\n\n    function limitUpper() external view returns (int24);\n\n    function deposit0Max() external view returns (uint256);\n\n    function deposit1Max() external view returns (uint256);\n\n    function maxTotalSupply() external view returns (uint256);\n\n    function hysteresis() external view returns (uint256);\n\n    function getTotalAmounts() external view returns (uint256, uint256);\n\n    function deposit(uint256, uint256, address) external returns (uint256);\n\n    function withdraw(uint256, address) external returns (uint256, uint256);\n\n    function rebalance(\n        int24 _baseLower,\n        int24 _baseUpper,\n        int24 _limitLower,\n        int24 _limitUpper,\n        int256 swapQuantity\n    ) external;\n\n    function setDepositMax(uint256 _deposit0Max, uint256 _deposit1Max) external;\n\n    function setAffiliate(address _affiliate) external;\n\n    event DeployICHIVault(\n        address indexed sender,\n        address indexed pool,\n        bool allowToken0,\n        bool allowToken1,\n        address owner,\n        uint256 twapPeriod\n    );\n\n    event SetTwapPeriod(address sender, uint32 newTwapPeriod);\n\n    event Deposit(address indexed sender, address indexed to, uint256 shares, uint256 amount0, uint256 amount1);\n\n    event Withdraw(address indexed sender, address indexed to, uint256 shares, uint256 amount0, uint256 amount1);\n\n    event Rebalance(\n        int24 tick,\n        uint256 totalAmount0,\n        uint256 totalAmount1,\n        uint256 feeAmount0,\n        uint256 feeAmount1,\n        uint256 totalSupply\n    );\n\n    event MaxTotalSupply(address indexed sender, uint256 maxTotalSupply);\n\n    event Hysteresis(address indexed sender, uint256 hysteresis);\n\n    event DepositMax(address indexed sender, uint256 deposit0Max, uint256 deposit1Max);\n\n    event Affiliate(address indexed sender, address affiliate);\n}\n",
                "keccak256": "0x2d3161a95704582fc72360648ae65c5e5ce94aba264ce6fd079d049030a5a91d",
                "license": "Unlicense"
            },
            "contracts/interfaces/IICHIVaultDepositGuard.sol": {
                "content": "// SPDX-License-Identifier: BUSL-1.1\npragma solidity >=0.5.0;\n\ninterface IICHIVaultDepositGuard {\n    /// @notice Emitted when the contract is deployed.\n    /// @param _ICHIVaultFactory Address of the ICHIVaultFactory.\n    /// @param _WETH Address of the Wrapped ETH token.\n    event Deployed(address _ICHIVaultFactory, address _WETH);\n\n    /// @notice Emitted when a deposit is forwarded to an ICHIVault.\n    /// @param sender The address initiating the deposit.\n    /// @param vault The ICHIVault receiving the deposit.\n    /// @param token The token being deposited.\n    /// @param amount The amount of the token being deposited.\n    /// @param shares The amount of shares issued in the vault as a result of the deposit.\n    /// @param to The address receiving the vault shares.\n    event DepositForwarded(\n        address indexed sender,\n        address indexed vault,\n        address indexed token,\n        uint256 amount,\n        uint256 shares,\n        address to\n    );\n\n    // view functions:\n\n    /// @notice Retrieves the address of the ICHIVaultFactory.\n    /// @return Address of the ICHIVaultFactory.\n    function ICHIVaultFactory() external view returns (address);\n\n    /// @notice Retrieves the address of the Wrapped Native Token (e.g., WETH).\n    /// @return Address of the Wrapped Native Token.\n    function WRAPPED_NATIVE() external view returns (address);\n\n    function HTS_ADDRESS() external view returns (address);\n\n    /// @notice Computes the unique key for a vault based on given parameters.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param token0 The address of the first token in the vault.\n    /// @param token1 The address of the second token in the vault.\n    /// @param fee The fee associated with the vault.\n    /// @param allowToken0 Boolean indicating if token0 is allowed in the vault.\n    /// @param allowToken1 Boolean indicating if token1 is allowed in the vault.\n    /// @return key The computed unique key for the vault.\n    function vaultKey(\n        address vaultDeployer,\n        address token0,\n        address token1,\n        uint24 fee,\n        bool allowToken0,\n        bool allowToken1\n    ) external view returns (bytes32 key);\n\n    // stateful functions:\n\n    /**\n     * @dev Associates the contract with a given token.\n     * It leverages the `tryAssociate` function from the `HTSInteractable` contract.\n     *\n     * @param token The address of the token to be associated with this contract.\n     * This can be an address of an IHRC compliant token or any other token.\n     * If the token is IHRC compliant, the association is attempted.\n     * If the token is not IHRC compliant or if the `associate` function call reverts for any reason,\n     * the call will fail gracefully without reverting the entire transaction\n     */\n    function associate(address token, address pool) external;\n\n    /// @notice Forwards a deposit to the specified ICHIVault after input validation.\n    /// @dev Emits a DepositForwarded event upon success.\n    /// @param vault The address of the ICHIVault to deposit into.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param token The address of the token being deposited.\n    /// @param amount The amount of the token being deposited.\n    /// @param minimumProceeds The minimum amount of vault tokens to be received.\n    /// @param to The address to receive the vault tokens.\n    /// @return vaultTokens The number of vault tokens received.\n    function forwardDepositToICHIVault(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 amount,\n        uint256 minimumProceeds,\n        address to\n    ) external returns (uint256 vaultTokens);\n\n    /// @notice Forwards a native currency (e.g., ETH) deposit to an ICHIVault.\n    /// @dev Converts the native currency to Wrapped Native Token before deposit.\n    /// @param vault The address of the ICHIVault to deposit into.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param minimumProceeds The minimum amount of vault tokens to be received.\n    /// @param to The address to receive the vault tokens.\n    /// @return vaultTokens The number of vault tokens received.\n    function forwardNativeDepositToICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 minimumProceeds,\n        address to\n    ) external payable returns (uint256 vaultTokens);\n\n    /// @notice Forwards a request to withdraw from an ICHIVault.\n    /// @param vault The address of the ICHIVault to withdraw from.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param shares The amount of shares to withdraw.\n    /// @param to The address to receive the withdrawn tokens.\n    /// @param minAmount0 The minimum amount of token0 expected to receive.\n    /// @param minAmount1 The minimum amount of token1 expected to receive.\n    /// @return amount0 The amount of token0 received.\n    /// @return amount1 The amount of token1 received.\n    function forwardWithdrawFromICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Forwards a request to withdraw native currency from an ICHIVault.\n    /// @dev Converts the Wrapped Native Tokens back to native currency on withdrawal.\n    /// @param vault The address of the ICHIVault to withdraw from.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param shares The amount of shares to withdraw.\n    /// @param to The address to receive the withdrawn native currency.\n    /// @param minAmount0 The minimum amount of token0 expected to receive.\n    /// @param minAmount1 The minimum amount of token1 expected to receive.\n    /// @return amount0 The amount of token0 received.\n    /// @return amount1 The amount of token1 received.\n    function forwardNativeWithdrawFromICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Attempts to wrap the provided ERC20 into its HTS counterpart (if present in the vault) before depositing.\n    /// @param vault The address of the ICHIVault to deposit into.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param token The ERC20 token being deposited; will be wrapped to HTS if the vault holds that counterpart.\n    /// @param amount The amount of the token being deposited.\n    /// @param minimumProceeds The minimum amount of vault tokens to be received.\n    /// @param to The address to receive the vault tokens.\n    /// @return vaultTokens The number of vault tokens received.\n    function depositToICHIVaultAndTryWrapToHTS(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 amount,\n        uint256 minimumProceeds,\n        address to\n    ) external returns (uint256 vaultTokens);\n\n    /// @notice Withdraws from the vault, attempting to unwrap HTS tokens to their ERC20 counterparts before sending out.\n    /// @param vault The address of the ICHIVault to withdraw from.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param shares The amount of shares to withdraw.\n    /// @param to The address to receive the withdrawn tokens (as ERC20 if unwrapped).\n    /// @param minAmount0 The minimum amount of token0 expected to receive.\n    /// @param minAmount1 The minimum amount of token1 expected to receive.\n    /// @return amount0 The amount of token0 (post-unwrap if applicable) delivered.\n    /// @return amount1 The amount of token1 (post-unwrap if applicable) delivered.\n    function withdrawFromICHIVaultAndTryUnwrapToERC20(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Withdraws from the vault, unwrapping HTS tokens to ERC20 when possible and forwarding native when needed.\n    /// @param vault The address of the ICHIVault to withdraw from.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param shares The amount of shares to withdraw.\n    /// @param to The address to receive the withdrawn assets.\n    /// @param minAmount0 The minimum amount of token0 expected to receive.\n    /// @param minAmount1 The minimum amount of token1 expected to receive.\n    /// @return amount0 The amount of token0 (post-unwrap if applicable) delivered.\n    /// @return amount1 The amount of token1 (post-unwrap if applicable) delivered.\n    function withdrawFromICHIVaultAndTryUnwrapToERC20AndForwardNative(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external returns (uint256 amount0, uint256 amount1);\n}\n",
                "keccak256": "0xd803f58928b2aa4f61bbec28ceae0b6a6d73cbdc52477844f12d92a240a9497a",
                "license": "BUSL-1.1"
            },
            "contracts/interfaces/IICHIVaultFactory.sol": {
                "content": "// SPDX-License-Identifier: BUSL-1.1\npragma solidity >=0.5.0;\n\ninterface IICHIVaultFactory {\n    event FeeRecipient(address indexed sender, address feeRecipient);\n\n    event BaseFee(address indexed sender, uint256 baseFee);\n\n    event BaseFeeSplit(address indexed sender, uint256 baseFeeSplit);\n\n    event DeployICHIVaultFactory(address indexed sender, address uniswapV3Factory);\n\n    event ICHIVaultCreated(\n        address indexed sender,\n        address ichiVault,\n        address tokenA,\n        bool allowTokenA,\n        address tokenB,\n        bool allowTokenB,\n        uint24 fee,\n        uint256 count\n    );\n\n    function getICHIVault(bytes32 vaultKey) external view returns (address);\n\n    function uniswapV3Factory() external view returns (address);\n\n    function feeRecipient() external view returns (address);\n\n    function baseFee() external view returns (uint256);\n\n    function baseFeeSplit() external view returns (uint256);\n\n    function setFeeRecipient(address _feeRecipient) external;\n\n    function setBaseFee(uint256 _baseFee) external;\n\n    function setBaseFeeSplit(uint256 _baseFeeSplit) external;\n\n    function createICHIVault(\n        address tokenA,\n        bool allowTokenA,\n        address tokenB,\n        bool allowTokenB,\n        uint24 fee\n    ) external returns (address ichiVault);\n\n    function genKey(\n        address deployer,\n        address token0,\n        address token1,\n        uint24 fee,\n        bool allowToken0,\n        bool allowToken1\n    ) external pure returns (bytes32 key);\n}\n",
                "keccak256": "0xa3e2a7ad5b46cb89696715a879dcb786a4aa7e90e664e08401b8413f788c4038",
                "license": "BUSL-1.1"
            },
            "contracts/interfaces/IWHBAR.sol": {
                "content": "// SPDX-License-Identifier: Unlicense\npragma solidity >=0.5.0;\n\ninterface IWHBAR {\n    function deposit() external payable;\n\n    function withdraw(uint) external;\n\n    // returns the HTS token created by the WHBAR contract\n    function token() external view returns (address);\n}\n",
                "keccak256": "0xbcb215dd80d2abd008b38896ad1cb181ca8a88519c70db7925a08ff3897677ef",
                "license": "Unlicense"
            },
            "contracts/interfaces/external/hedera/IHRC.sol": {
                "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n// added this interface explicitly instead of importing from hedera-smart-contracts\n// in order to avoid issue with solidity compiler versions\n// i.e. this codebase uses 0.7.6 and hedera-smart-contracts uses 0.8+\ninterface IHRC {\n    function associate() external returns (uint256 responseCode);\n\n    function dissociate() external returns (uint256 responseCode);\n}\n",
                "keccak256": "0xc3b49e3e504289aadea5bb0eabbfbc18e1e95ccc5dd01a9cc9cb8e348fc2fe02",
                "license": "GPL-2.0-or-later"
            }
        },
        "version": 1
    },
    "sources": {
        "@openzeppelin/contracts/access/Ownable.sol": {
            "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\nimport \"../utils/Context.sol\";\n/**\n * @dev Contract module which provides a basic access control mechanism, where\n * there is an account (an owner) that can be granted exclusive access to\n * specific functions.\n *\n * By default, the owner account will be the one that deploys the contract. This\n * can later be changed with {transferOwnership}.\n *\n * This module is used through inheritance. It will make available the modifier\n * `onlyOwner`, which can be applied to your functions to restrict their use to\n * the owner.\n */\nabstract contract Ownable is Context {\n    address private _owner;\n\n    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);\n\n    /**\n     * @dev Initializes the contract setting the deployer as the initial owner.\n     */\n    constructor () {\n        address msgSender = _msgSender();\n        _owner = msgSender;\n        emit OwnershipTransferred(address(0), msgSender);\n    }\n\n    /**\n     * @dev Returns the address of the current owner.\n     */\n    function owner() public view virtual returns (address) {\n        return _owner;\n    }\n\n    /**\n     * @dev Throws if called by any account other than the owner.\n     */\n    modifier onlyOwner() {\n        require(owner() == _msgSender(), \"Ownable: caller is not the owner\");\n        _;\n    }\n\n    /**\n     * @dev Leaves the contract without owner. It will not be possible to call\n     * `onlyOwner` functions anymore. Can only be called by the current owner.\n     *\n     * NOTE: Renouncing ownership will leave the contract without an owner,\n     * thereby removing any functionality that is only available to the owner.\n     */\n    function renounceOwnership() public virtual onlyOwner {\n        emit OwnershipTransferred(_owner, address(0));\n        _owner = address(0);\n    }\n\n    /**\n     * @dev Transfers ownership of the contract to a new account (`newOwner`).\n     * Can only be called by the current owner.\n     */\n    function transferOwnership(address newOwner) public virtual onlyOwner {\n        require(newOwner != address(0), \"Ownable: new owner is the zero address\");\n        emit OwnershipTransferred(_owner, newOwner);\n        _owner = newOwner;\n    }\n}\n"
        },
        "@openzeppelin/contracts/math/SafeMath.sol": {
            "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\n/**\n * @dev Wrappers over Solidity's arithmetic operations with added overflow\n * checks.\n *\n * Arithmetic operations in Solidity wrap on overflow. This can easily result\n * in bugs, because programmers usually assume that an overflow raises an\n * error, which is the standard behavior in high level programming languages.\n * `SafeMath` restores this intuition by reverting the transaction when an\n * operation overflows.\n *\n * Using this library instead of the unchecked operations eliminates an entire\n * class of bugs, so it's recommended to use it always.\n */\nlibrary SafeMath {\n    /**\n     * @dev Returns the addition of two unsigned integers, with an overflow flag.\n     *\n     * _Available since v3.4._\n     */\n    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        uint256 c = a + b;\n        if (c < a) return (false, 0);\n        return (true, c);\n    }\n\n    /**\n     * @dev Returns the substraction of two unsigned integers, with an overflow flag.\n     *\n     * _Available since v3.4._\n     */\n    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        if (b > a) return (false, 0);\n        return (true, a - b);\n    }\n\n    /**\n     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.\n     *\n     * _Available since v3.4._\n     */\n    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the\n        // benefit is lost if 'b' is also tested.\n        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522\n        if (a == 0) return (true, 0);\n        uint256 c = a * b;\n        if (c / a != b) return (false, 0);\n        return (true, c);\n    }\n\n    /**\n     * @dev Returns the division of two unsigned integers, with a division by zero flag.\n     *\n     * _Available since v3.4._\n     */\n    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        if (b == 0) return (false, 0);\n        return (true, a / b);\n    }\n\n    /**\n     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.\n     *\n     * _Available since v3.4._\n     */\n    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {\n        if (b == 0) return (false, 0);\n        return (true, a % b);\n    }\n\n    /**\n     * @dev Returns the addition of two unsigned integers, reverting on\n     * overflow.\n     *\n     * Counterpart to Solidity's `+` operator.\n     *\n     * Requirements:\n     *\n     * - Addition cannot overflow.\n     */\n    function add(uint256 a, uint256 b) internal pure returns (uint256) {\n        uint256 c = a + b;\n        require(c >= a, \"SafeMath: addition overflow\");\n        return c;\n    }\n\n    /**\n     * @dev Returns the subtraction of two unsigned integers, reverting on\n     * overflow (when the result is negative).\n     *\n     * Counterpart to Solidity's `-` operator.\n     *\n     * Requirements:\n     *\n     * - Subtraction cannot overflow.\n     */\n    function sub(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b <= a, \"SafeMath: subtraction overflow\");\n        return a - b;\n    }\n\n    /**\n     * @dev Returns the multiplication of two unsigned integers, reverting on\n     * overflow.\n     *\n     * Counterpart to Solidity's `*` operator.\n     *\n     * Requirements:\n     *\n     * - Multiplication cannot overflow.\n     */\n    function mul(uint256 a, uint256 b) internal pure returns (uint256) {\n        if (a == 0) return 0;\n        uint256 c = a * b;\n        require(c / a == b, \"SafeMath: multiplication overflow\");\n        return c;\n    }\n\n    /**\n     * @dev Returns the integer division of two unsigned integers, reverting on\n     * division by zero. The result is rounded towards zero.\n     *\n     * Counterpart to Solidity's `/` operator. Note: this function uses a\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\n     * uses an invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     *\n     * - The divisor cannot be zero.\n     */\n    function div(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b > 0, \"SafeMath: division by zero\");\n        return a / b;\n    }\n\n    /**\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\n     * reverting when dividing by zero.\n     *\n     * Counterpart to Solidity's `%` operator. This function uses a `revert`\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\n     * invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     *\n     * - The divisor cannot be zero.\n     */\n    function mod(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b > 0, \"SafeMath: modulo by zero\");\n        return a % b;\n    }\n\n    /**\n     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on\n     * overflow (when the result is negative).\n     *\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\n     * message unnecessarily. For custom revert reasons use {trySub}.\n     *\n     * Counterpart to Solidity's `-` operator.\n     *\n     * Requirements:\n     *\n     * - Subtraction cannot overflow.\n     */\n    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\n        require(b <= a, errorMessage);\n        return a - b;\n    }\n\n    /**\n     * @dev Returns the integer division of two unsigned integers, reverting with custom message on\n     * division by zero. The result is rounded towards zero.\n     *\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\n     * message unnecessarily. For custom revert reasons use {tryDiv}.\n     *\n     * Counterpart to Solidity's `/` operator. Note: this function uses a\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\n     * uses an invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     *\n     * - The divisor cannot be zero.\n     */\n    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\n        require(b > 0, errorMessage);\n        return a / b;\n    }\n\n    /**\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\n     * reverting with custom message when dividing by zero.\n     *\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\n     * message unnecessarily. For custom revert reasons use {tryMod}.\n     *\n     * Counterpart to Solidity's `%` operator. This function uses a `revert`\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\n     * invalid opcode to revert (consuming all remaining gas).\n     *\n     * Requirements:\n     *\n     * - The divisor cannot be zero.\n     */\n    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\n        require(b > 0, errorMessage);\n        return a % b;\n    }\n}\n"
        },
        "@openzeppelin/contracts/token/ERC20/IERC20.sol": {
            "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\n/**\n * @dev Interface of the ERC20 standard as defined in the EIP.\n */\ninterface IERC20 {\n    /**\n     * @dev Returns the amount of tokens in existence.\n     */\n    function totalSupply() external view returns (uint256);\n\n    /**\n     * @dev Returns the amount of tokens owned by `account`.\n     */\n    function balanceOf(address account) external view returns (uint256);\n\n    /**\n     * @dev Moves `amount` tokens from the caller's account to `recipient`.\n     *\n     * Returns a boolean value indicating whether the operation succeeded.\n     *\n     * Emits a {Transfer} event.\n     */\n    function transfer(address recipient, uint256 amount) external returns (bool);\n\n    /**\n     * @dev Returns the remaining number of tokens that `spender` will be\n     * allowed to spend on behalf of `owner` through {transferFrom}. This is\n     * zero by default.\n     *\n     * This value changes when {approve} or {transferFrom} are called.\n     */\n    function allowance(address owner, address spender) external view returns (uint256);\n\n    /**\n     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.\n     *\n     * Returns a boolean value indicating whether the operation succeeded.\n     *\n     * IMPORTANT: Beware that changing an allowance with this method brings the risk\n     * that someone may use both the old and the new allowance by unfortunate\n     * transaction ordering. One possible solution to mitigate this race\n     * condition is to first reduce the spender's allowance to 0 and set the\n     * desired value afterwards:\n     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729\n     *\n     * Emits an {Approval} event.\n     */\n    function approve(address spender, uint256 amount) external returns (bool);\n\n    /**\n     * @dev Moves `amount` tokens from `sender` to `recipient` using the\n     * allowance mechanism. `amount` is then deducted from the caller's\n     * allowance.\n     *\n     * Returns a boolean value indicating whether the operation succeeded.\n     *\n     * Emits a {Transfer} event.\n     */\n    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);\n\n    /**\n     * @dev Emitted when `value` tokens are moved from one account (`from`) to\n     * another (`to`).\n     *\n     * Note that `value` may be zero.\n     */\n    event Transfer(address indexed from, address indexed to, uint256 value);\n\n    /**\n     * @dev Emitted when the allowance of a `spender` for an `owner` is set by\n     * a call to {approve}. `value` is the new allowance.\n     */\n    event Approval(address indexed owner, address indexed spender, uint256 value);\n}\n"
        },
        "@openzeppelin/contracts/token/ERC20/SafeERC20.sol": {
            "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\nimport \"./IERC20.sol\";\nimport \"../../math/SafeMath.sol\";\nimport \"../../utils/Address.sol\";\n\n/**\n * @title SafeERC20\n * @dev Wrappers around ERC20 operations that throw on failure (when the token\n * contract returns false). Tokens that return no value (and instead revert or\n * throw on failure) are also supported, non-reverting calls are assumed to be\n * successful.\n * To use this library you can add a `using SafeERC20 for IERC20;` statement to your contract,\n * which allows you to call the safe operations as `token.safeTransfer(...)`, etc.\n */\nlibrary SafeERC20 {\n    using SafeMath for uint256;\n    using Address for address;\n\n    function safeTransfer(IERC20 token, address to, uint256 value) internal {\n        _callOptionalReturn(token, abi.encodeWithSelector(token.transfer.selector, to, value));\n    }\n\n    function safeTransferFrom(IERC20 token, address from, address to, uint256 value) internal {\n        _callOptionalReturn(token, abi.encodeWithSelector(token.transferFrom.selector, from, to, value));\n    }\n\n    /**\n     * @dev Deprecated. This function has issues similar to the ones found in\n     * {IERC20-approve}, and its usage is discouraged.\n     *\n     * Whenever possible, use {safeIncreaseAllowance} and\n     * {safeDecreaseAllowance} instead.\n     */\n    function safeApprove(IERC20 token, address spender, uint256 value) internal {\n        // safeApprove should only be called when setting an initial allowance,\n        // or when resetting it to zero. To increase and decrease it, use\n        // 'safeIncreaseAllowance' and 'safeDecreaseAllowance'\n        // solhint-disable-next-line max-line-length\n        require((value == 0) || (token.allowance(address(this), spender) == 0),\n            \"SafeERC20: approve from non-zero to non-zero allowance\"\n        );\n        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, value));\n    }\n\n    function safeIncreaseAllowance(IERC20 token, address spender, uint256 value) internal {\n        uint256 newAllowance = token.allowance(address(this), spender).add(value);\n        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));\n    }\n\n    function safeDecreaseAllowance(IERC20 token, address spender, uint256 value) internal {\n        uint256 newAllowance = token.allowance(address(this), spender).sub(value, \"SafeERC20: decreased allowance below zero\");\n        _callOptionalReturn(token, abi.encodeWithSelector(token.approve.selector, spender, newAllowance));\n    }\n\n    /**\n     * @dev Imitates a Solidity high-level call (i.e. a regular function call to a contract), relaxing the requirement\n     * on the return value: the return value is optional (but if data is returned, it must not be false).\n     * @param token The token targeted by the call.\n     * @param data The call data (encoded using abi.encode or one of its variants).\n     */\n    function _callOptionalReturn(IERC20 token, bytes memory data) private {\n        // We need to perform a low level call here, to bypass Solidity's return data size checking mechanism, since\n        // we're implementing it ourselves. We use {Address.functionCall} to perform this call, which verifies that\n        // the target address contains contract code and also asserts for success in the low-level call.\n\n        bytes memory returndata = address(token).functionCall(data, \"SafeERC20: low-level call failed\");\n        if (returndata.length > 0) { // Return data is optional\n            // solhint-disable-next-line max-line-length\n            require(abi.decode(returndata, (bool)), \"SafeERC20: ERC20 operation did not succeed\");\n        }\n    }\n}\n"
        },
        "@openzeppelin/contracts/utils/Address.sol": {
            "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\n/**\n * @dev Collection of functions related to the address type\n */\nlibrary Address {\n    /**\n     * @dev Returns true if `account` is a contract.\n     *\n     * [IMPORTANT]\n     * ====\n     * It is unsafe to assume that an address for which this function returns\n     * false is an externally-owned account (EOA) and not a contract.\n     *\n     * Among others, `isContract` will return false for the following\n     * types of addresses:\n     *\n     *  - an externally-owned account\n     *  - a contract in construction\n     *  - an address where a contract will be created\n     *  - an address where a contract lived, but was destroyed\n     * ====\n     */\n    function isContract(address account) internal view returns (bool) {\n        // This method relies on extcodesize, which returns 0 for contracts in\n        // construction, since the code is only stored at the end of the\n        // constructor execution.\n\n        uint256 size;\n        // solhint-disable-next-line no-inline-assembly\n        assembly { size := extcodesize(account) }\n        return size > 0;\n    }\n\n    /**\n     * @dev Replacement for Solidity's `transfer`: sends `amount` wei to\n     * `recipient`, forwarding all available gas and reverting on errors.\n     *\n     * https://eips.ethereum.org/EIPS/eip-1884[EIP1884] increases the gas cost\n     * of certain opcodes, possibly making contracts go over the 2300 gas limit\n     * imposed by `transfer`, making them unable to receive funds via\n     * `transfer`. {sendValue} removes this limitation.\n     *\n     * https://diligence.consensys.net/posts/2019/09/stop-using-soliditys-transfer-now/[Learn more].\n     *\n     * IMPORTANT: because control is transferred to `recipient`, care must be\n     * taken to not create reentrancy vulnerabilities. Consider using\n     * {ReentrancyGuard} or the\n     * https://solidity.readthedocs.io/en/v0.5.11/security-considerations.html#use-the-checks-effects-interactions-pattern[checks-effects-interactions pattern].\n     */\n    function sendValue(address payable recipient, uint256 amount) internal {\n        require(address(this).balance >= amount, \"Address: insufficient balance\");\n\n        // solhint-disable-next-line avoid-low-level-calls, avoid-call-value\n        (bool success, ) = recipient.call{ value: amount }(\"\");\n        require(success, \"Address: unable to send value, recipient may have reverted\");\n    }\n\n    /**\n     * @dev Performs a Solidity function call using a low level `call`. A\n     * plain`call` is an unsafe replacement for a function call: use this\n     * function instead.\n     *\n     * If `target` reverts with a revert reason, it is bubbled up by this\n     * function (like regular Solidity function calls).\n     *\n     * Returns the raw returned data. To convert to the expected return value,\n     * use https://solidity.readthedocs.io/en/latest/units-and-global-variables.html?highlight=abi.decode#abi-encoding-and-decoding-functions[`abi.decode`].\n     *\n     * Requirements:\n     *\n     * - `target` must be a contract.\n     * - calling `target` with `data` must not revert.\n     *\n     * _Available since v3.1._\n     */\n    function functionCall(address target, bytes memory data) internal returns (bytes memory) {\n      return functionCall(target, data, \"Address: low-level call failed\");\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`], but with\n     * `errorMessage` as a fallback revert reason when `target` reverts.\n     *\n     * _Available since v3.1._\n     */\n    function functionCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {\n        return functionCallWithValue(target, data, 0, errorMessage);\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\n     * but also transferring `value` wei to `target`.\n     *\n     * Requirements:\n     *\n     * - the calling contract must have an ETH balance of at least `value`.\n     * - the called Solidity function must be `payable`.\n     *\n     * _Available since v3.1._\n     */\n    function functionCallWithValue(address target, bytes memory data, uint256 value) internal returns (bytes memory) {\n        return functionCallWithValue(target, data, value, \"Address: low-level call with value failed\");\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCallWithValue-address-bytes-uint256-}[`functionCallWithValue`], but\n     * with `errorMessage` as a fallback revert reason when `target` reverts.\n     *\n     * _Available since v3.1._\n     */\n    function functionCallWithValue(address target, bytes memory data, uint256 value, string memory errorMessage) internal returns (bytes memory) {\n        require(address(this).balance >= value, \"Address: insufficient balance for call\");\n        require(isContract(target), \"Address: call to non-contract\");\n\n        // solhint-disable-next-line avoid-low-level-calls\n        (bool success, bytes memory returndata) = target.call{ value: value }(data);\n        return _verifyCallResult(success, returndata, errorMessage);\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\n     * but performing a static call.\n     *\n     * _Available since v3.3._\n     */\n    function functionStaticCall(address target, bytes memory data) internal view returns (bytes memory) {\n        return functionStaticCall(target, data, \"Address: low-level static call failed\");\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],\n     * but performing a static call.\n     *\n     * _Available since v3.3._\n     */\n    function functionStaticCall(address target, bytes memory data, string memory errorMessage) internal view returns (bytes memory) {\n        require(isContract(target), \"Address: static call to non-contract\");\n\n        // solhint-disable-next-line avoid-low-level-calls\n        (bool success, bytes memory returndata) = target.staticcall(data);\n        return _verifyCallResult(success, returndata, errorMessage);\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-}[`functionCall`],\n     * but performing a delegate call.\n     *\n     * _Available since v3.4._\n     */\n    function functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {\n        return functionDelegateCall(target, data, \"Address: low-level delegate call failed\");\n    }\n\n    /**\n     * @dev Same as {xref-Address-functionCall-address-bytes-string-}[`functionCall`],\n     * but performing a delegate call.\n     *\n     * _Available since v3.4._\n     */\n    function functionDelegateCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {\n        require(isContract(target), \"Address: delegate call to non-contract\");\n\n        // solhint-disable-next-line avoid-low-level-calls\n        (bool success, bytes memory returndata) = target.delegatecall(data);\n        return _verifyCallResult(success, returndata, errorMessage);\n    }\n\n    function _verifyCallResult(bool success, bytes memory returndata, string memory errorMessage) private pure returns(bytes memory) {\n        if (success) {\n            return returndata;\n        } else {\n            // Look for revert reason and bubble it up if present\n            if (returndata.length > 0) {\n                // The easiest way to bubble the revert reason is using memory via assembly\n\n                // solhint-disable-next-line no-inline-assembly\n                assembly {\n                    let returndata_size := mload(returndata)\n                    revert(add(32, returndata), returndata_size)\n                }\n            } else {\n                revert(errorMessage);\n            }\n        }\n    }\n}\n"
        },
        "@openzeppelin/contracts/utils/Context.sol": {
            "content": "// SPDX-License-Identifier: MIT\n\npragma solidity >=0.6.0 <0.8.0;\n\n/*\n * @dev Provides information about the current execution context, including the\n * sender of the transaction and its data. While these are generally available\n * via msg.sender and msg.data, they should not be accessed in such a direct\n * manner, since when dealing with GSN meta-transactions the account sending and\n * paying for execution may not be the actual sender (as far as an application\n * is concerned).\n *\n * This contract is only required for intermediate, library-like contracts.\n */\nabstract contract Context {\n    function _msgSender() internal view virtual returns (address payable) {\n        return msg.sender;\n    }\n\n    function _msgData() internal view virtual returns (bytes memory) {\n        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691\n        return msg.data;\n    }\n}\n"
        },
        "@openzeppelin/contracts/utils/ReentrancyGuard.sol": {
            "content": "// SPDX-License-Identifier: MIT\n\npragma solidity ^0.7.0;\n\n/**\n * @dev Contract module that helps prevent reentrant calls to a function.\n *\n * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier\n * available, which can be applied to functions to make sure there are no nested\n * (reentrant) calls to them.\n *\n * Note that because there is a single `nonReentrant` guard, functions marked as\n * `nonReentrant` may not call one another. This can be worked around by making\n * those functions `private`, and then adding `external` `nonReentrant` entry\n * points to them.\n *\n * TIP: If you would like to learn more about reentrancy and alternative ways\n * to protect against it, check out our blog post\n * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].\n */\nabstract contract ReentrancyGuard {\n    // Booleans are more expensive than uint256 or any type that takes up a full\n    // word because each write operation emits an extra SLOAD to first read the\n    // slot's contents, replace the bits taken up by the boolean, and then write\n    // back. This is the compiler's defense against contract upgrades and\n    // pointer aliasing, and it cannot be disabled.\n\n    // The values being non-zero value makes deployment a bit more expensive,\n    // but in exchange the refund on every call to nonReentrant will be lower in\n    // amount. Since refunds are capped to a percentage of the total\n    // transaction's gas, it is best to keep them low in cases like this one, to\n    // increase the likelihood of the full refund coming into effect.\n    uint256 private constant _NOT_ENTERED = 1;\n    uint256 private constant _ENTERED = 2;\n\n    uint256 private _status;\n\n    constructor () {\n        _status = _NOT_ENTERED;\n    }\n\n    /**\n     * @dev Prevents a contract from calling itself, directly or indirectly.\n     * Calling a `nonReentrant` function from another `nonReentrant`\n     * function is not supported. It is possible to prevent this from happening\n     * by making the `nonReentrant` function external, and make it call a\n     * `private` function that does the actual work.\n     */\n    modifier nonReentrant() {\n        // On the first call to nonReentrant, _notEntered will be true\n        require(_status != _ENTERED, \"ReentrancyGuard: reentrant call\");\n\n        // Any calls to nonReentrant after this point will fail\n        _status = _ENTERED;\n\n        _;\n\n        // By storing the original value once again, a refund is triggered (see\n        // https://eips.ethereum.org/EIPS/eip-2200)\n        _status = _NOT_ENTERED;\n    }\n}\n"
        },
        "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title The interface for the Uniswap V3 Factory\n/// @notice The Uniswap V3 Factory facilitates creation of Uniswap V3 pools and control over the protocol fees\ninterface IUniswapV3Factory {\n    /// @notice Emitted when the owner of the factory is changed\n    /// @param oldOwner The owner before the owner was changed\n    /// @param newOwner The owner after the owner was changed\n    event OwnerChanged(address indexed oldOwner, address indexed newOwner);\n\n    /// @notice Emitted when a pool is created\n    /// @param token0 The first token of the pool by address sort order\n    /// @param token1 The second token of the pool by address sort order\n    /// @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip\n    /// @param tickSpacing The minimum number of ticks between initialized ticks\n    /// @param pool The address of the created pool\n    event PoolCreated(\n        address indexed token0,\n        address indexed token1,\n        uint24 indexed fee,\n        int24 tickSpacing,\n        address pool\n    );\n\n    /// @notice Emitted when a new fee amount is enabled for pool creation via the factory\n    /// @param fee The enabled fee, denominated in hundredths of a bip\n    /// @param tickSpacing The minimum number of ticks between initialized ticks for pools created with the given fee\n    event FeeAmountEnabled(uint24 indexed fee, int24 indexed tickSpacing);\n\n    /// @notice Returns the current owner of the factory\n    /// @dev Can be changed by the current owner via setOwner\n    /// @return The address of the factory owner\n    function owner() external view returns (address);\n\n    /// @notice Returns the tick spacing for a given fee amount, if enabled, or 0 if not enabled\n    /// @dev A fee amount can never be removed, so this value should be hard coded or cached in the calling context\n    /// @param fee The enabled fee, denominated in hundredths of a bip. Returns 0 in case of unenabled fee\n    /// @return The tick spacing\n    function feeAmountTickSpacing(uint24 fee) external view returns (int24);\n\n    /// @notice Returns the pool address for a given pair of tokens and a fee, or address 0 if it does not exist\n    /// @dev tokenA and tokenB may be passed in either token0/token1 or token1/token0 order\n    /// @param tokenA The contract address of either token0 or token1\n    /// @param tokenB The contract address of the other token\n    /// @param fee The fee collected upon every swap in the pool, denominated in hundredths of a bip\n    /// @return pool The pool address\n    function getPool(\n        address tokenA,\n        address tokenB,\n        uint24 fee\n    ) external view returns (address pool);\n\n    /// @notice Creates a pool for the given two tokens and fee\n    /// @param tokenA One of the two tokens in the desired pool\n    /// @param tokenB The other of the two tokens in the desired pool\n    /// @param fee The desired fee for the pool\n    /// @dev tokenA and tokenB may be passed in either order: token0/token1 or token1/token0. tickSpacing is retrieved\n    /// from the fee. The call will revert if the pool already exists, the fee is invalid, or the token arguments\n    /// are invalid.\n    /// @return pool The address of the newly created pool\n    function createPool(\n        address tokenA,\n        address tokenB,\n        uint24 fee\n    ) external returns (address pool);\n\n    /// @notice Updates the owner of the factory\n    /// @dev Must be called by the current owner\n    /// @param _owner The new owner of the factory\n    function setOwner(address _owner) external;\n\n    /// @notice Enables a fee amount with the given tickSpacing\n    /// @dev Fee amounts may never be removed once enabled\n    /// @param fee The fee amount to enable, denominated in hundredths of a bip (i.e. 1e-6)\n    /// @param tickSpacing The spacing between ticks to be enforced for all pools created with the given fee amount\n    function enableFeeAmount(uint24 fee, int24 tickSpacing) external;\n}\n"
        },
        "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\nimport './pool/IUniswapV3PoolImmutables.sol';\nimport './pool/IUniswapV3PoolState.sol';\nimport './pool/IUniswapV3PoolDerivedState.sol';\nimport './pool/IUniswapV3PoolActions.sol';\nimport './pool/IUniswapV3PoolOwnerActions.sol';\nimport './pool/IUniswapV3PoolEvents.sol';\n\n/// @title The interface for a Uniswap V3 Pool\n/// @notice A Uniswap pool facilitates swapping and automated market making between any two assets that strictly conform\n/// to the ERC20 specification\n/// @dev The pool interface is broken up into many smaller pieces\ninterface IUniswapV3Pool is\n    IUniswapV3PoolImmutables,\n    IUniswapV3PoolState,\n    IUniswapV3PoolDerivedState,\n    IUniswapV3PoolActions,\n    IUniswapV3PoolOwnerActions,\n    IUniswapV3PoolEvents\n{\n\n}\n"
        },
        "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolActions.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Permissionless pool actions\n/// @notice Contains pool methods that can be called by anyone\ninterface IUniswapV3PoolActions {\n    /// @notice Sets the initial price for the pool\n    /// @dev Price is represented as a sqrt(amountToken1/amountToken0) Q64.96 value\n    /// @param sqrtPriceX96 the initial sqrt price of the pool as a Q64.96\n    function initialize(uint160 sqrtPriceX96) external;\n\n    /// @notice Adds liquidity for the given recipient/tickLower/tickUpper position\n    /// @dev The caller of this method receives a callback in the form of IUniswapV3MintCallback#uniswapV3MintCallback\n    /// in which they must pay any token0 or token1 owed for the liquidity. The amount of token0/token1 due depends\n    /// on tickLower, tickUpper, the amount of liquidity, and the current price.\n    /// @param recipient The address for which the liquidity will be created\n    /// @param tickLower The lower tick of the position in which to add liquidity\n    /// @param tickUpper The upper tick of the position in which to add liquidity\n    /// @param amount The amount of liquidity to mint\n    /// @param data Any data that should be passed through to the callback\n    /// @return amount0 The amount of token0 that was paid to mint the given amount of liquidity. Matches the value in the callback\n    /// @return amount1 The amount of token1 that was paid to mint the given amount of liquidity. Matches the value in the callback\n    function mint(\n        address recipient,\n        int24 tickLower,\n        int24 tickUpper,\n        uint128 amount,\n        bytes calldata data\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Collects tokens owed to a position\n    /// @dev Does not recompute fees earned, which must be done either via mint or burn of any amount of liquidity.\n    /// Collect must be called by the position owner. To withdraw only token0 or only token1, amount0Requested or\n    /// amount1Requested may be set to zero. To withdraw all tokens owed, caller may pass any value greater than the\n    /// actual tokens owed, e.g. type(uint128).max. Tokens owed may be from accumulated swap fees or burned liquidity.\n    /// @param recipient The address which should receive the fees collected\n    /// @param tickLower The lower tick of the position for which to collect fees\n    /// @param tickUpper The upper tick of the position for which to collect fees\n    /// @param amount0Requested How much token0 should be withdrawn from the fees owed\n    /// @param amount1Requested How much token1 should be withdrawn from the fees owed\n    /// @return amount0 The amount of fees collected in token0\n    /// @return amount1 The amount of fees collected in token1\n    function collect(\n        address recipient,\n        int24 tickLower,\n        int24 tickUpper,\n        uint128 amount0Requested,\n        uint128 amount1Requested\n    ) external returns (uint128 amount0, uint128 amount1);\n\n    /// @notice Burn liquidity from the sender and account tokens owed for the liquidity to the position\n    /// @dev Can be used to trigger a recalculation of fees owed to a position by calling with an amount of 0\n    /// @dev Fees must be collected separately via a call to #collect\n    /// @param tickLower The lower tick of the position for which to burn liquidity\n    /// @param tickUpper The upper tick of the position for which to burn liquidity\n    /// @param amount How much liquidity to burn\n    /// @return amount0 The amount of token0 sent to the recipient\n    /// @return amount1 The amount of token1 sent to the recipient\n    function burn(\n        int24 tickLower,\n        int24 tickUpper,\n        uint128 amount\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Swap token0 for token1, or token1 for token0\n    /// @dev The caller of this method receives a callback in the form of IUniswapV3SwapCallback#uniswapV3SwapCallback\n    /// @param recipient The address to receive the output of the swap\n    /// @param zeroForOne The direction of the swap, true for token0 to token1, false for token1 to token0\n    /// @param amountSpecified The amount of the swap, which implicitly configures the swap as exact input (positive), or exact output (negative)\n    /// @param sqrtPriceLimitX96 The Q64.96 sqrt price limit. If zero for one, the price cannot be less than this\n    /// value after the swap. If one for zero, the price cannot be greater than this value after the swap\n    /// @param data Any data to be passed through to the callback\n    /// @return amount0 The delta of the balance of token0 of the pool, exact when negative, minimum when positive\n    /// @return amount1 The delta of the balance of token1 of the pool, exact when negative, minimum when positive\n    function swap(\n        address recipient,\n        bool zeroForOne,\n        int256 amountSpecified,\n        uint160 sqrtPriceLimitX96,\n        bytes calldata data\n    ) external returns (int256 amount0, int256 amount1);\n\n    /// @notice Receive token0 and/or token1 and pay it back, plus a fee, in the callback\n    /// @dev The caller of this method receives a callback in the form of IUniswapV3FlashCallback#uniswapV3FlashCallback\n    /// @dev Can be used to donate underlying tokens pro-rata to currently in-range liquidity providers by calling\n    /// with 0 amount{0,1} and sending the donation amount(s) from the callback\n    /// @param recipient The address which will receive the token0 and token1 amounts\n    /// @param amount0 The amount of token0 to send\n    /// @param amount1 The amount of token1 to send\n    /// @param data Any data to be passed through to the callback\n    function flash(\n        address recipient,\n        uint256 amount0,\n        uint256 amount1,\n        bytes calldata data\n    ) external;\n\n    /// @notice Increase the maximum number of price and liquidity observations that this pool will store\n    /// @dev This method is no-op if the pool already has an observationCardinalityNext greater than or equal to\n    /// the input observationCardinalityNext.\n    /// @param observationCardinalityNext The desired minimum number of observations for the pool to store\n    function increaseObservationCardinalityNext(uint16 observationCardinalityNext) external;\n}\n"
        },
        "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolDerivedState.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Pool state that is not stored\n/// @notice Contains view functions to provide information about the pool that is computed rather than stored on the\n/// blockchain. The functions here may have variable gas costs.\ninterface IUniswapV3PoolDerivedState {\n    /// @notice Returns the cumulative tick and liquidity as of each timestamp `secondsAgo` from the current block timestamp\n    /// @dev To get a time weighted average tick or liquidity-in-range, you must call this with two values, one representing\n    /// the beginning of the period and another for the end of the period. E.g., to get the last hour time-weighted average tick,\n    /// you must call it with secondsAgos = [3600, 0].\n    /// @dev The time weighted average tick represents the geometric time weighted average price of the pool, in\n    /// log base sqrt(1.0001) of token1 / token0. The TickMath library can be used to go from a tick value to a ratio.\n    /// @param secondsAgos From how long ago each cumulative tick and liquidity value should be returned\n    /// @return tickCumulatives Cumulative tick values as of each `secondsAgos` from the current block timestamp\n    /// @return secondsPerLiquidityCumulativeX128s Cumulative seconds per liquidity-in-range value as of each `secondsAgos` from the current block\n    /// timestamp\n    function observe(uint32[] calldata secondsAgos)\n        external\n        view\n        returns (int56[] memory tickCumulatives, uint160[] memory secondsPerLiquidityCumulativeX128s);\n\n    /// @notice Returns a snapshot of the tick cumulative, seconds per liquidity and seconds inside a tick range\n    /// @dev Snapshots must only be compared to other snapshots, taken over a period for which a position existed.\n    /// I.e., snapshots cannot be compared if a position is not held for the entire period between when the first\n    /// snapshot is taken and the second snapshot is taken.\n    /// @param tickLower The lower tick of the range\n    /// @param tickUpper The upper tick of the range\n    /// @return tickCumulativeInside The snapshot of the tick accumulator for the range\n    /// @return secondsPerLiquidityInsideX128 The snapshot of seconds per liquidity for the range\n    /// @return secondsInside The snapshot of seconds per liquidity for the range\n    function snapshotCumulativesInside(int24 tickLower, int24 tickUpper)\n        external\n        view\n        returns (\n            int56 tickCumulativeInside,\n            uint160 secondsPerLiquidityInsideX128,\n            uint32 secondsInside\n        );\n}\n"
        },
        "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolEvents.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Events emitted by a pool\n/// @notice Contains all events emitted by the pool\ninterface IUniswapV3PoolEvents {\n    /// @notice Emitted exactly once by a pool when #initialize is first called on the pool\n    /// @dev Mint/Burn/Swap cannot be emitted by the pool before Initialize\n    /// @param sqrtPriceX96 The initial sqrt price of the pool, as a Q64.96\n    /// @param tick The initial tick of the pool, i.e. log base 1.0001 of the starting price of the pool\n    event Initialize(uint160 sqrtPriceX96, int24 tick);\n\n    /// @notice Emitted when liquidity is minted for a given position\n    /// @param sender The address that minted the liquidity\n    /// @param owner The owner of the position and recipient of any minted liquidity\n    /// @param tickLower The lower tick of the position\n    /// @param tickUpper The upper tick of the position\n    /// @param amount The amount of liquidity minted to the position range\n    /// @param amount0 How much token0 was required for the minted liquidity\n    /// @param amount1 How much token1 was required for the minted liquidity\n    event Mint(\n        address sender,\n        address indexed owner,\n        int24 indexed tickLower,\n        int24 indexed tickUpper,\n        uint128 amount,\n        uint256 amount0,\n        uint256 amount1\n    );\n\n    /// @notice Emitted when fees are collected by the owner of a position\n    /// @dev Collect events may be emitted with zero amount0 and amount1 when the caller chooses not to collect fees\n    /// @param owner The owner of the position for which fees are collected\n    /// @param tickLower The lower tick of the position\n    /// @param tickUpper The upper tick of the position\n    /// @param amount0 The amount of token0 fees collected\n    /// @param amount1 The amount of token1 fees collected\n    event Collect(\n        address indexed owner,\n        address recipient,\n        int24 indexed tickLower,\n        int24 indexed tickUpper,\n        uint128 amount0,\n        uint128 amount1\n    );\n\n    /// @notice Emitted when a position's liquidity is removed\n    /// @dev Does not withdraw any fees earned by the liquidity position, which must be withdrawn via #collect\n    /// @param owner The owner of the position for which liquidity is removed\n    /// @param tickLower The lower tick of the position\n    /// @param tickUpper The upper tick of the position\n    /// @param amount The amount of liquidity to remove\n    /// @param amount0 The amount of token0 withdrawn\n    /// @param amount1 The amount of token1 withdrawn\n    event Burn(\n        address indexed owner,\n        int24 indexed tickLower,\n        int24 indexed tickUpper,\n        uint128 amount,\n        uint256 amount0,\n        uint256 amount1\n    );\n\n    /// @notice Emitted by the pool for any swaps between token0 and token1\n    /// @param sender The address that initiated the swap call, and that received the callback\n    /// @param recipient The address that received the output of the swap\n    /// @param amount0 The delta of the token0 balance of the pool\n    /// @param amount1 The delta of the token1 balance of the pool\n    /// @param sqrtPriceX96 The sqrt(price) of the pool after the swap, as a Q64.96\n    /// @param liquidity The liquidity of the pool after the swap\n    /// @param tick The log base 1.0001 of price of the pool after the swap\n    event Swap(\n        address indexed sender,\n        address indexed recipient,\n        int256 amount0,\n        int256 amount1,\n        uint160 sqrtPriceX96,\n        uint128 liquidity,\n        int24 tick\n    );\n\n    /// @notice Emitted by the pool for any flashes of token0/token1\n    /// @param sender The address that initiated the swap call, and that received the callback\n    /// @param recipient The address that received the tokens from flash\n    /// @param amount0 The amount of token0 that was flashed\n    /// @param amount1 The amount of token1 that was flashed\n    /// @param paid0 The amount of token0 paid for the flash, which can exceed the amount0 plus the fee\n    /// @param paid1 The amount of token1 paid for the flash, which can exceed the amount1 plus the fee\n    event Flash(\n        address indexed sender,\n        address indexed recipient,\n        uint256 amount0,\n        uint256 amount1,\n        uint256 paid0,\n        uint256 paid1\n    );\n\n    /// @notice Emitted by the pool for increases to the number of observations that can be stored\n    /// @dev observationCardinalityNext is not the observation cardinality until an observation is written at the index\n    /// just before a mint/swap/burn.\n    /// @param observationCardinalityNextOld The previous value of the next observation cardinality\n    /// @param observationCardinalityNextNew The updated value of the next observation cardinality\n    event IncreaseObservationCardinalityNext(\n        uint16 observationCardinalityNextOld,\n        uint16 observationCardinalityNextNew\n    );\n\n    /// @notice Emitted when the protocol fee is changed by the pool\n    /// @param feeProtocol0Old The previous value of the token0 protocol fee\n    /// @param feeProtocol1Old The previous value of the token1 protocol fee\n    /// @param feeProtocol0New The updated value of the token0 protocol fee\n    /// @param feeProtocol1New The updated value of the token1 protocol fee\n    event SetFeeProtocol(uint8 feeProtocol0Old, uint8 feeProtocol1Old, uint8 feeProtocol0New, uint8 feeProtocol1New);\n\n    /// @notice Emitted when the collected protocol fees are withdrawn by the factory owner\n    /// @param sender The address that collects the protocol fees\n    /// @param recipient The address that receives the collected protocol fees\n    /// @param amount0 The amount of token0 protocol fees that is withdrawn\n    /// @param amount0 The amount of token1 protocol fees that is withdrawn\n    event CollectProtocol(address indexed sender, address indexed recipient, uint128 amount0, uint128 amount1);\n}\n"
        },
        "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolImmutables.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Pool state that never changes\n/// @notice These parameters are fixed for a pool forever, i.e., the methods will always return the same values\ninterface IUniswapV3PoolImmutables {\n    /// @notice The contract that deployed the pool, which must adhere to the IUniswapV3Factory interface\n    /// @return The contract address\n    function factory() external view returns (address);\n\n    /// @notice The first of the two tokens of the pool, sorted by address\n    /// @return The token contract address\n    function token0() external view returns (address);\n\n    /// @notice The second of the two tokens of the pool, sorted by address\n    /// @return The token contract address\n    function token1() external view returns (address);\n\n    /// @notice The pool's fee in hundredths of a bip, i.e. 1e-6\n    /// @return The fee\n    function fee() external view returns (uint24);\n\n    /// @notice The pool tick spacing\n    /// @dev Ticks can only be used at multiples of this value, minimum of 1 and always positive\n    /// e.g.: a tickSpacing of 3 means ticks can be initialized every 3rd tick, i.e., ..., -6, -3, 0, 3, 6, ...\n    /// This value is an int24 to avoid casting even though it is always positive.\n    /// @return The tick spacing\n    function tickSpacing() external view returns (int24);\n\n    /// @notice The maximum amount of position liquidity that can use any tick in the range\n    /// @dev This parameter is enforced per tick to prevent liquidity from overflowing a uint128 at any point, and\n    /// also prevents out-of-range liquidity from being used to prevent adding in-range liquidity to a pool\n    /// @return The max amount of liquidity per tick\n    function maxLiquidityPerTick() external view returns (uint128);\n}\n"
        },
        "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolOwnerActions.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Permissioned pool actions\n/// @notice Contains pool methods that may only be called by the factory owner\ninterface IUniswapV3PoolOwnerActions {\n    /// @notice Set the denominator of the protocol's % share of the fees\n    /// @param feeProtocol0 new protocol fee for token0 of the pool\n    /// @param feeProtocol1 new protocol fee for token1 of the pool\n    function setFeeProtocol(uint8 feeProtocol0, uint8 feeProtocol1) external;\n\n    /// @notice Collect the protocol fee accrued to the pool\n    /// @param recipient The address to which collected protocol fees should be sent\n    /// @param amount0Requested The maximum amount of token0 to send, can be 0 to collect fees in only token1\n    /// @param amount1Requested The maximum amount of token1 to send, can be 0 to collect fees in only token0\n    /// @return amount0 The protocol fee collected in token0\n    /// @return amount1 The protocol fee collected in token1\n    function collectProtocol(\n        address recipient,\n        uint128 amount0Requested,\n        uint128 amount1Requested\n    ) external returns (uint128 amount0, uint128 amount1);\n}\n"
        },
        "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolState.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n/// @title Pool state that can change\n/// @notice These methods compose the pool's state, and can change with any frequency including multiple times\n/// per transaction\ninterface IUniswapV3PoolState {\n    /// @notice The 0th storage slot in the pool stores many values, and is exposed as a single method to save gas\n    /// when accessed externally.\n    /// @return sqrtPriceX96 The current price of the pool as a sqrt(token1/token0) Q64.96 value\n    /// tick The current tick of the pool, i.e. according to the last tick transition that was run.\n    /// This value may not always be equal to SqrtTickMath.getTickAtSqrtRatio(sqrtPriceX96) if the price is on a tick\n    /// boundary.\n    /// observationIndex The index of the last oracle observation that was written,\n    /// observationCardinality The current maximum number of observations stored in the pool,\n    /// observationCardinalityNext The next maximum number of observations, to be updated when the observation.\n    /// feeProtocol The protocol fee for both tokens of the pool.\n    /// Encoded as two 4 bit values, where the protocol fee of token1 is shifted 4 bits and the protocol fee of token0\n    /// is the lower 4 bits. Used as the denominator of a fraction of the swap fee, e.g. 4 means 1/4th of the swap fee.\n    /// unlocked Whether the pool is currently locked to reentrancy\n    function slot0()\n        external\n        view\n        returns (\n            uint160 sqrtPriceX96,\n            int24 tick,\n            uint16 observationIndex,\n            uint16 observationCardinality,\n            uint16 observationCardinalityNext,\n            uint8 feeProtocol,\n            bool unlocked\n        );\n\n    /// @notice The fee growth as a Q128.128 fees of token0 collected per unit of liquidity for the entire life of the pool\n    /// @dev This value can overflow the uint256\n    function feeGrowthGlobal0X128() external view returns (uint256);\n\n    /// @notice The fee growth as a Q128.128 fees of token1 collected per unit of liquidity for the entire life of the pool\n    /// @dev This value can overflow the uint256\n    function feeGrowthGlobal1X128() external view returns (uint256);\n\n    /// @notice The amounts of token0 and token1 that are owed to the protocol\n    /// @dev Protocol fees will never exceed uint128 max in either token\n    function protocolFees() external view returns (uint128 token0, uint128 token1);\n\n    /// @notice The currently in range liquidity available to the pool\n    /// @dev This value has no relationship to the total liquidity across all ticks\n    function liquidity() external view returns (uint128);\n\n    /// @notice Look up information about a specific tick in the pool\n    /// @param tick The tick to look up\n    /// @return liquidityGross the total amount of position liquidity that uses the pool either as tick lower or\n    /// tick upper,\n    /// liquidityNet how much liquidity changes when the pool price crosses the tick,\n    /// feeGrowthOutside0X128 the fee growth on the other side of the tick from the current tick in token0,\n    /// feeGrowthOutside1X128 the fee growth on the other side of the tick from the current tick in token1,\n    /// tickCumulativeOutside the cumulative tick value on the other side of the tick from the current tick\n    /// secondsPerLiquidityOutsideX128 the seconds spent per liquidity on the other side of the tick from the current tick,\n    /// secondsOutside the seconds spent on the other side of the tick from the current tick,\n    /// initialized Set to true if the tick is initialized, i.e. liquidityGross is greater than 0, otherwise equal to false.\n    /// Outside values can only be used if the tick is initialized, i.e. if liquidityGross is greater than 0.\n    /// In addition, these values are only relative and must be used only in comparison to previous snapshots for\n    /// a specific position.\n    function ticks(int24 tick)\n        external\n        view\n        returns (\n            uint128 liquidityGross,\n            int128 liquidityNet,\n            uint256 feeGrowthOutside0X128,\n            uint256 feeGrowthOutside1X128,\n            int56 tickCumulativeOutside,\n            uint160 secondsPerLiquidityOutsideX128,\n            uint32 secondsOutside,\n            bool initialized\n        );\n\n    /// @notice Returns 256 packed tick initialized boolean values. See TickBitmap for more information\n    function tickBitmap(int16 wordPosition) external view returns (uint256);\n\n    /// @notice Returns the information about a position by the position's key\n    /// @param key The position's key is a hash of a preimage composed by the owner, tickLower and tickUpper\n    /// @return _liquidity The amount of liquidity in the position,\n    /// Returns feeGrowthInside0LastX128 fee growth of token0 inside the tick range as of the last mint/burn/poke,\n    /// Returns feeGrowthInside1LastX128 fee growth of token1 inside the tick range as of the last mint/burn/poke,\n    /// Returns tokensOwed0 the computed amount of token0 owed to the position as of the last mint/burn/poke,\n    /// Returns tokensOwed1 the computed amount of token1 owed to the position as of the last mint/burn/poke\n    function positions(bytes32 key)\n        external\n        view\n        returns (\n            uint128 _liquidity,\n            uint256 feeGrowthInside0LastX128,\n            uint256 feeGrowthInside1LastX128,\n            uint128 tokensOwed0,\n            uint128 tokensOwed1\n        );\n\n    /// @notice Returns data about a specific observation index\n    /// @param index The element of the observations array to fetch\n    /// @dev You most likely want to use #observe() instead of this method to get an observation as of some amount of time\n    /// ago, rather than at a specific index in the array.\n    /// @return blockTimestamp The timestamp of the observation,\n    /// Returns tickCumulative the tick multiplied by seconds elapsed for the life of the pool as of the observation timestamp,\n    /// Returns secondsPerLiquidityCumulativeX128 the seconds per in range liquidity for the life of the pool as of the observation timestamp,\n    /// Returns initialized whether the observation has been initialized and the values are safe to use\n    function observations(uint256 index)\n        external\n        view\n        returns (\n            uint32 blockTimestamp,\n            int56 tickCumulative,\n            uint160 secondsPerLiquidityCumulativeX128,\n            bool initialized\n        );\n}\n"
        },
        "contracts/ICHIVaultDepositGuard.sol": {
            "content": "// SPDX-License-Identifier: Unlicense\npragma solidity 0.7.6;\n\nimport { IICHIVaultDepositGuard } from \"./interfaces/IICHIVaultDepositGuard.sol\";\nimport { IICHIVaultFactory } from \"./interfaces/IICHIVaultFactory.sol\";\nimport { IICHIVault } from \"./interfaces/IICHIVault.sol\";\nimport { IWHBAR } from \"./interfaces/IWHBAR.sol\";\nimport { IHTS } from \"./interfaces/IHTS.sol\";\nimport { IERC20Wrapper } from \"./interfaces/IERC20Wrapper.sol\";\n\nimport { IUniswapV3Pool } from \"@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol\";\nimport { IUniswapV3Factory } from \"@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol\";\n\nimport { IERC20 } from \"@openzeppelin/contracts/token/ERC20/IERC20.sol\";\nimport { SafeERC20 } from \"@openzeppelin/contracts/token/ERC20/SafeERC20.sol\";\nimport { SafeMath } from \"@openzeppelin/contracts/math/SafeMath.sol\";\nimport { ReentrancyGuard } from \"@openzeppelin/contracts/utils/ReentrancyGuard.sol\";\nimport { Ownable } from \"@openzeppelin/contracts/access/Ownable.sol\";\n\nimport { HTSInteractable } from \"./base/HTSInteractable.sol\";\n\ncontract ICHIVaultDepositGuard is IICHIVaultDepositGuard, ReentrancyGuard, HTSInteractable, Ownable {\n    using SafeERC20 for IERC20;\n    using SafeMath for uint256;\n\n    address public immutable override ICHIVaultFactory;\n    address public immutable override WRAPPED_NATIVE;\n\n    /// @dev the SaucerSwap WHBAR contract creates the WHBAR HTS token in its constructor\n    // and hence HTS_ADDRESS(i.e. tokenId) = WRAPPED_NATIVE(i.e. contractId) + 1\n    /// when interacting with standard IERC20 methods we want to interact with HTS_ADDRESS\n    /// when interacting with the wrapper contract methods(e.g. deposit/withdraw) we use WRAPPED_NATIVE\n    address public immutable override HTS_ADDRESS;\n    address payable public constant HTS_WRAPPER = payable(0x000000000000000000000000000000000093A3A8);\n\n    address private constant NULL_ADDRESS = address(0);\n\n    /// @notice Constructs the IICHIVaultDepositGuard contract.\n    /// @param _ICHIVaultFactory The address of the ICHIVaultFactory.\n    constructor(address _ICHIVaultFactory, address _WRAPPED_NATIVE) {\n        require(_ICHIVaultFactory != NULL_ADDRESS, \"DG.constructor: zero address\");\n        ICHIVaultFactory = _ICHIVaultFactory;\n        WRAPPED_NATIVE = _WRAPPED_NATIVE;\n\n        address _HTS_ADDRESS;\n\n        if (_WRAPPED_NATIVE != NULL_ADDRESS) {\n            _HTS_ADDRESS = IWHBAR(_WRAPPED_NATIVE).token();\n            tryAssociate(_HTS_ADDRESS);\n        }\n\n        HTS_ADDRESS = _HTS_ADDRESS;\n\n        emit Deployed(_ICHIVaultFactory, _WRAPPED_NATIVE);\n    }\n\n    receive() external payable {\n        assert(msg.sender == WRAPPED_NATIVE); // only accept ETH via fallback from the WRAPPED_NATIVE contract\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function associate(address token, address pool) external override onlyOwner {\n        _validateTokenAndPool(token, pool);\n        tryAssociate(token);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function forwardDepositToICHIVault(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 amount,\n        uint256 minimumProceeds,\n        address to\n    ) external override nonReentrant returns (uint256 vaultTokens) {\n        vaultTokens = _forwardDeposit(vault, vaultDeployer, token, amount, minimumProceeds, to, false, true);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function forwardNativeDepositToICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 minimumProceeds,\n        address to\n    ) external payable override nonReentrant returns (uint256 vaultTokens) {\n        uint256 nativeAmount = msg.value;\n        IWHBAR(WRAPPED_NATIVE).deposit{ value: nativeAmount }();\n\n        vaultTokens = _forwardDeposit(vault, vaultDeployer, HTS_ADDRESS, nativeAmount, minimumProceeds, to, true, false);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function forwardWithdrawFromICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external override nonReentrant returns (uint256 amount0, uint256 amount1) {\n        (amount0, amount1) = _forwardWithdraw(vault, vaultDeployer, shares, to, minAmount0, minAmount1, false);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function forwardNativeWithdrawFromICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external override nonReentrant returns (uint256 amount0, uint256 amount1) {\n        (amount0, amount1) = _forwardWithdraw(vault, vaultDeployer, shares, to, minAmount0, minAmount1, true);\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function depositToICHIVaultAndTryWrapToHTS(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 erc20Amount,\n        uint256 minimumProceeds,\n        address to\n    ) external override nonReentrant returns (uint256 vaultTokens) {\n        address token0 = IICHIVault(vault).token0();\n        address token1 = IICHIVault(vault).token1();\n\n        IERC20(token).safeTransferFrom(msg.sender, address(this), erc20Amount);\n\n        (address depositToken, uint256 depositAmount) = _prepareDepositToken(token, erc20Amount, token0, token1);\n\n        vaultTokens = _forwardDeposit(\n            vault,\n            vaultDeployer,\n            depositToken,\n            depositAmount,\n            minimumProceeds,\n            to,\n            false,\n            false\n        );\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function withdrawFromICHIVaultAndTryUnwrapToERC20(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external override nonReentrant returns (uint256 amount0, uint256 amount1) {\n        (uint256 rawAmount0, uint256 rawAmount1) = _forwardWithdraw(\n            vault,\n            vaultDeployer,\n            shares,\n            address(this),\n            0,\n            0,\n            false\n        );\n\n        address token0 = IICHIVault(vault).token0();\n        address token1 = IICHIVault(vault).token1();\n\n        uint256 outAmount0 = _tryUnwrapToERC20(token0, rawAmount0, to);\n        uint256 outAmount1 = _tryUnwrapToERC20(token1, rawAmount1, to);\n\n        require(outAmount0 >= minAmount0 && outAmount1 >= minAmount1, \"Insufficient out\");\n\n        amount0 = outAmount0;\n        amount1 = outAmount1;\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function withdrawFromICHIVaultAndTryUnwrapToERC20AndForwardNative(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external override nonReentrant returns (uint256 amount0, uint256 amount1) {\n        (uint256 rawAmount0, uint256 rawAmount1) = _forwardWithdraw(\n            vault,\n            vaultDeployer,\n            shares,\n            address(this),\n            0,\n            0,\n            false\n        );\n\n        address token0 = IICHIVault(vault).token0();\n        address token1 = IICHIVault(vault).token1();\n\n        uint256 outAmount0 = _tryUnwrapOrForwardNative(token0, rawAmount0, to);\n        uint256 outAmount1 = _tryUnwrapOrForwardNative(token1, rawAmount1, to);\n\n        require(outAmount0 >= minAmount0 && outAmount1 >= minAmount1, \"Insufficient out\");\n\n        amount0 = outAmount0;\n        amount1 = outAmount1;\n    }\n\n    function _tryUnwrapOrForwardNative(address token, uint256 htsAmount, address to) private returns (uint256) {\n        if (token == HTS_ADDRESS) {\n            if (htsAmount > 0) {\n                IERC20(HTS_ADDRESS).approve(WRAPPED_NATIVE, htsAmount);\n                IWHBAR(WRAPPED_NATIVE).withdraw(htsAmount);\n                (bool ok, ) = to.call{ value: htsAmount }(\"\");\n                require(ok, \"Native transfer failed\");\n            }\n            return htsAmount;\n        }\n\n        return _tryUnwrapToERC20(token, htsAmount, to);\n    }\n\n    function _tryUnwrapToERC20(address token, uint256 htsAmount, address to) private returns (uint256 outAmount) {\n        if (htsAmount == 0) {\n            return 0;\n        }\n\n        address erc20Token = address(IERC20Wrapper(HTS_WRAPPER).erc20Counterpart(IHTS(token)));\n        if (erc20Token != NULL_ADDRESS) {\n            uint256 rate = IERC20Wrapper(HTS_WRAPPER).rates(IERC20(erc20Token));\n            require(rate > 0, \"Invalid rate\");\n\n            uint256 erc20Amount = htsAmount.mul(rate);\n            IERC20(token).safeIncreaseAllowance(HTS_WRAPPER, htsAmount);\n            IERC20Wrapper(HTS_WRAPPER).unwrap(IERC20(erc20Token), to, erc20Amount);\n            outAmount = erc20Amount;\n        } else {\n            IERC20(token).safeTransfer(to, htsAmount);\n            outAmount = htsAmount;\n        }\n    }\n\n    function _wrapToHTS(address erc20Token, uint256 amount) private returns (uint256 htsAmount) {\n        uint256 rate = IERC20Wrapper(HTS_WRAPPER).rates(IERC20(erc20Token));\n        require(rate > 0, \"Invalid rate\");\n\n        htsAmount = amount.div(rate);\n        require(htsAmount > 0, \"Wrap amount zero\");\n\n        uint256 spendAmount = htsAmount.mul(rate);\n\n        IERC20(erc20Token).safeIncreaseAllowance(HTS_WRAPPER, spendAmount);\n        IERC20Wrapper(HTS_WRAPPER).wrap(IERC20(erc20Token), address(this), spendAmount);\n\n        // refund any leftover ERC20 (flooring in wrap may leave dust)\n        if (amount > spendAmount) {\n            IERC20(erc20Token).safeTransfer(msg.sender, amount - spendAmount);\n        }\n    }\n\n    function _prepareDepositToken(\n        address token,\n        uint256 amount,\n        address token0,\n        address token1\n    ) private returns (address depositToken, uint256 depositAmount) {\n        // Prefer the HTS counterpart whenever the vault uses it\n        address htsToken = address(IERC20Wrapper(HTS_WRAPPER).htsCounterpart(IERC20(token)));\n        bool wrapToHTS = htsToken != NULL_ADDRESS && (htsToken == token0 || htsToken == token1);\n\n        if (wrapToHTS) {\n            depositToken = htsToken;\n            // Only wrap when the provided token is the ERC20 side; if the caller already supplies HTS, skip wrapping.\n            wrapToHTS = token != htsToken;\n        } else {\n            // No HTS counterpart in this vault; require the provided token to be part of the pair.\n            require(token == token0 || token == token1, \"Invalid token\");\n            depositToken = token;\n        }\n\n        depositAmount = amount;\n        if (wrapToHTS) {\n            depositAmount = _wrapToHTS(token, amount);\n        }\n    }\n\n    /// @inheritdoc IICHIVaultDepositGuard\n    function vaultKey(\n        address vaultDeployer,\n        address token0,\n        address token1,\n        uint24 fee,\n        bool allowToken0,\n        bool allowToken1\n    ) public view override returns (bytes32 key) {\n        key = IICHIVaultFactory(ICHIVaultFactory).genKey(vaultDeployer, token0, token1, fee, allowToken0, allowToken1);\n    }\n\n    function _forwardDeposit(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 amount,\n        uint256 minimumProceeds,\n        address to,\n        bool depositNative,\n        bool pullFromCaller\n    ) private returns (uint256 vaultTokens) {\n        _validateRecipient(to);\n        (IICHIVault ichiVault, address token0, address token1) = _validateVault(vault, vaultDeployer, depositNative);\n\n        require(token == token0 || token == token1, \"Invalid token\");\n\n        if (token == token0) {\n            require(ichiVault.allowToken0(), \"Token0 deposits not allowed\");\n        } else {\n            require(ichiVault.allowToken1(), \"Token1 deposits not allowed\");\n        }\n\n        // if deposit is a native deposit then we don't need to transfer WRAPPED_NATIVE\n        // since this contract receives WRAPPED_NATIVE amount on successful WRAPPED_NATIVE#deposit\n        if (!depositNative && pullFromCaller) {\n            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);\n        }\n\n        IERC20(token).safeIncreaseAllowance(vault, amount);\n\n        uint256 token0Amount = token == token0 ? amount : 0;\n        uint256 token1Amount = token == token1 ? amount : 0;\n\n        vaultTokens = ichiVault.deposit(token0Amount, token1Amount, to);\n        require(vaultTokens >= minimumProceeds, \"Slippage too great. Try again.\");\n\n        emit DepositForwarded(msg.sender, vault, token, amount, vaultTokens, to);\n    }\n\n    function _forwardWithdraw(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1,\n        bool withdrawNative\n    ) private returns (uint256 amount0, uint256 amount1) {\n        _validateRecipient(to);\n        (IICHIVault ichiVault, address token0, address token1) = _validateVault(vault, vaultDeployer, withdrawNative);\n\n        // - sender must grant the guard an allowance for the vault share token\n        // - the guard can then transfer those share tokens to itself\n        // - the guard then approves the vault an allowance in order to burn shares and withdraw from the vault\n        IERC20(vault).safeTransferFrom(msg.sender, address(this), shares);\n\n        if (withdrawNative) {\n            // the vault temporarily custodies the withdrawn amounts\n            (amount0, amount1) = ichiVault.withdraw(shares, address(this));\n            if (token0 == HTS_ADDRESS) {\n                /// @dev the Saucerswap WHBAR contract(i.e. WRAPPED_NATIVE) requires an allowance for the HTS_ADDRESS\n                /// in order to transfer the token to itself on withdraw() which it then burns\n                /// @dev since the Saucerswap WHBAR contract reverts(which is not standard for native wrapper contracts) if we attempt to withdraw(0) we add this positive non-zero check\n                if (amount0 > 0) {\n                    IERC20(HTS_ADDRESS).approve(WRAPPED_NATIVE, amount0);\n                    IWHBAR(WRAPPED_NATIVE).withdraw(amount0);\n                    (bool ok, ) = to.call{ value: amount0 }(\"\");\n                    require(ok, \"Native transfer failed\");\n                }\n                IERC20(token1).safeTransfer(to, amount1);\n            } else {\n                if (amount1 > 0) {\n                    IERC20(HTS_ADDRESS).approve(WRAPPED_NATIVE, amount1);\n                    IWHBAR(WRAPPED_NATIVE).withdraw(amount1);\n                    (bool ok, ) = to.call{ value: amount1 }(\"\");\n                    require(ok, \"Native transfer failed\");\n                }\n                IERC20(token0).safeTransfer(to, amount0);\n            }\n        } else {\n            (amount0, amount1) = ichiVault.withdraw(shares, to);\n        }\n\n        require(amount0 >= minAmount0 && amount1 >= minAmount1, \"Insufficient out\");\n    }\n\n    function _validateRecipient(address to) private {\n        require(to != NULL_ADDRESS, \"Invalid to\");\n    }\n\n    function _validateVault(\n        address vault,\n        address vaultDeployer,\n        bool validateNative\n    ) private returns (IICHIVault ichiVault, address token0, address token1) {\n        ichiVault = IICHIVault(vault);\n\n        token0 = ichiVault.token0();\n        token1 = ichiVault.token1();\n\n        if (validateNative) {\n            require(token0 == HTS_ADDRESS || token1 == HTS_ADDRESS, \"Native vault\");\n        }\n\n        bytes32 factoryVaultKey = vaultKey(\n            vaultDeployer,\n            token0,\n            token1,\n            ichiVault.fee(),\n            ichiVault.allowToken0(),\n            ichiVault.allowToken1()\n        );\n\n        require(IICHIVaultFactory(ICHIVaultFactory).getICHIVault(factoryVaultKey) == vault, \"Invalid vault\");\n    }\n\n    /// @notice Validates a Uniswap V3 pool and checks if a specified token is part of the pool's pair.\n    /// @param token The address of the token to validate as part of the pool's pair.\n    /// @param pool The address of the Uniswap V3 pool to validate.\n    /// @dev Validates that 'pool' is registered with the UniswapV3Factory associated with ICHIVaultFactory,\n    ///      and checks if 'token' is one of the pool's tokens.\n    ///      Reverts with \"Invalid pool\" if the pool is not registered.\n    ///      Reverts with \"Invalid token\" if the token is not part of the pool.\n    function _validateTokenAndPool(address token, address pool) private {\n        IUniswapV3Pool uniswapV3Pool = IUniswapV3Pool(pool);\n        IUniswapV3Factory uniswapV3Factory = IUniswapV3Factory(IICHIVaultFactory(ICHIVaultFactory).uniswapV3Factory());\n\n        address token0 = uniswapV3Pool.token0();\n        address token1 = uniswapV3Pool.token1();\n        uint24 fee = uniswapV3Pool.fee();\n\n        address actualPool = uniswapV3Factory.getPool(token0, token1, fee);\n\n        require(actualPool == pool, \"Invalid pool\");\n        require(token == token0 || token == token1, \"Invalid token\");\n    }\n}\n"
        },
        "contracts/base/HTSInteractable.sol": {
            "content": "// SPDX-License-Identifier: Unlicense\npragma solidity >=0.5.0 <0.9.0;\n\nimport { IHRC } from \"../interfaces/external/hedera/IHRC.sol\";\n\nabstract contract HTSInteractable {\n    /**\n     * @dev Tries to associate a token with the contract if it's IHRC compliant.\n     * @param token The address of the token to associate.\n     * This function attempts to call the `associate` method on the token.\n     * If the token does not implement `associate`(e.g. it's a normal ERC20 token), or if the `associate` method reverts\n     * (possibly due to already being associated, or insufficient gas, etc.), the call will fail and catch the error.\n     */\n    function tryAssociate(address token) internal {\n        try IHRC(address(token)).associate() {\n            // If the token is IHRC compliant, it will successfully associate.\n        } catch {\n            // If the token doesn't have the `associate()` function or the call reverts,\n            // the execution will end up here.\n            // TODO: Handle specific failure cases,\n            // e.g., revert the transaction if the association fails due to reasons other than non-compliance,\n            // like already being associated or insufficient gas.\n        }\n    }\n}\n"
        },
        "contracts/interfaces/IERC20Wrapper.sol": {
            "content": "// SPDX-License-Identifier: MIT\npragma solidity >=0.7.6 <0.9.0;\n\nimport { IERC20 } from \"@openzeppelin/contracts/token/ERC20/IERC20.sol\";\nimport { IHTS } from \"./IHTS.sol\";\n\n/**\n * @title IERC20Wrapper\n * @notice Complete interface for the ERC20Wrapper contract\n * @dev The ERC20Wrapper enables seamless interoperability between ERC20 tokens and\n *      Hedera Token Service (HTS) tokens through a 1:1 conversion rate.\n *\n * @dev Limitations:\n * - HTS tokens use int64 for their supply, this makes it impossible to accommodate ERC20 tokens\n *   with high supplies. Decimal clamping to 8 decimals is used to be able to support a greater\n *   number of tokens.\n * - Due to clamping there needs to be a conversion rate between the ERC20 and HTS tokens. This\n *   conversion leads to precision loss. To prevent any loss to users, the wrap and unwrap\n *   function ignore the extra amount that would be lost due to precision loss. This leads to a\n *   discrepancy between the user input and the actual amount used, but prevents losses. It is\n *   expected that exactly divisible amounts are used to not encounter this discrepancy.\n * - Tokens MUST implement IERC20Metadata interface.\n *\n * @dev Security Considerations:\n * - Fee-on-transfer tokens are NOT SUPPORTED.\n * - Rebasing tokens are NOT SUPPORTED.\n *\n * @dev Integration Guide:\n * 1. Create token pairs using create()\n * 2. Users associate with HTS tokens before depositing\n * 3. Use wrap to wrap ERC20 to HTS\n * 4. Use unwrap to unwrap HTS to ERC20\n * Note: Ensure the wrap and unwrap amounts are divisible with the conversion rate. Failure to do\n *       so will result in discrepancy between the input amount and the actual amount used.\n */\ninterface IERC20Wrapper {\n    /**\n     * @notice Emitted when ERC20 tokens are deposited into the wrapper to mint HTS tokens\n     * @param token The ERC20 token that was deposited into the wrapper\n     * @param from The caller address that ERC20 tokens are transferred from\n     * @param to The address that received the newly minted HTS tokens\n     * @param amount The amount of ERC20 tokens that were deposited\n     */\n    event Wrap(IERC20 indexed token, address indexed from, address indexed to, uint256 amount);\n\n    /**\n     * @notice Emitted when HTS tokens are burned to withdraw ERC20 tokens from the wrapper\n     * @param token The ERC20 token that was withdrawn from the wrapper\n     * @param from The caller address that HTS tokens are burned from\n     * @param to The address that received the withdrawn ERC20 tokens\n     * @param amount The amount of ERC20 tokens that were withdrawn\n     */\n    event Unwrap(IERC20 indexed token, address indexed from, address indexed to, uint256 amount);\n\n    /**\n     * @notice Emitted when a new HTS token is created as a counterpart to an ERC20 token\n     * @dev This event allows tracking of all ERC20-HTS token pairs created by the wrapper.\n     *      Clients should listen to this event to maintain a registry of available pairs.\n     * @param erc20Token The ERC20 token added to be wrapped\n     * @param htsToken The newly created HTS token address\n     * @param htsDecimals The number of decimals the HTS token was created with (capped at MAX_DECIMALS)\n     */\n    event Create(IERC20 indexed erc20Token, IHTS indexed htsToken, uint256 htsDecimals);\n\n    /// @notice Allows the contract to receive ETH\n    /// @dev Required for Hedera rent payment\n    receive() external payable;\n\n    /**\n     * @notice Returns the HTS token counterpart for a given ERC20 token\n     * @dev This mapping tracks all ERC20 → HTS token pairs created by the wrapper.\n     *      Returns address(0) if no HTS counterpart exists for the given ERC20 token.\n     * @param erc20Token The ERC20 token to query\n     * @return htsToken The corresponding HTS token, or address(0) if none exists\n     */\n    function htsCounterpart(IERC20 erc20Token) external view returns (IHTS htsToken);\n\n    /**\n     * @notice Returns the ERC20 token counterpart for a given HTS token\n     * @dev This mapping tracks all HTS → ERC20 token pairs created by the wrapper.\n     *      Returns address(0) if the HTS token was not created by this wrapper.\n     * @param htsToken The HTS token to query\n     * @return erc20Token The corresponding ERC20 token, or address(0) if none exists\n     */\n    function erc20Counterpart(IHTS htsToken) external view returns (IERC20 erc20Token);\n\n    /**\n     * @notice Returns the conversion rate between ERC20 and HTS counterparts\n     * @dev `htsAmount` is derived as `erc20Amount / rate`\n     *      `erc20Amount` is derived as `htsAmount * rate`\n     * @param erc20Token The ERC20 token to check the rate for\n     * @return rate The conversion rate\n     */\n    function rates(IERC20 erc20Token) external view returns (uint256 rate);\n\n    /**\n     * @notice Creates a new HTS token that corresponds to an ERC20 token\n     * @dev This function creates an HTS token with the same name/symbol as the ERC20 token,\n     *      prefixed with \"HTS \" and \"HTS-\" respectively. The decimal precision is capped at MAX_DECIMALS.\n     *\n     *      If an HTS counterpart already exists, this function returns the existing token\n     *      instead of creating a duplicate.\n     *\n     *      The function requires payment of HBAR (sent as msg.value) to cover the HTS token\n     *      creation fee on the Hedera network.\n     *\n     * @param erc20Token The ERC20 token to create an HTS counterpart for\n     * @return htsToken The newly created (or existing) HTS token\n     * @return htsDecimals The number of decimals for the HTS token (capped at MAX_DECIMALS)\n     *\n     * @dev Requirements:\n     * - erc20Token must be a contract (not an EOA)\n     * - erc20Token must not already have an HTS counterpart\n     * - msg.value must be sufficient to pay HTS creation fees\n     * - erc20Token must implement IERC20Metadata for name/symbol/decimals\n     *\n     * @dev Side Effects:\n     * - Creates a new HTS token with wrapper contract as admin\n     * - Establishes bidirectional mapping between ERC20 and HTS tokens\n     * - Emits Create event\n     *\n     * @dev Limitations:\n     * - ERC20 tokens with very high supplies may cause issues due to HTS int64 supply limit\n     * - Tokens with > MAX_DECIMALS precision will have precision truncated\n     */\n    function create(IERC20 erc20Token) external payable returns (IHTS htsToken, uint256 htsDecimals);\n\n    /**\n     * @notice Deposits ERC20 tokens and mints corresponding HTS tokens\n     * @dev Fee-on-transfer tokens are NOT supported.\n     *      The user input amount is adjusted to prevent tokens lost due to precision.\n     *\n     * @param erc20Token The ERC20 token to deposit\n     * @param to The address to receive the minted HTS tokens\n     * @param erc20Amount The amount of ERC20 tokens to deposit from caller's balance\n     *\n     * @dev Requirements:\n     * - erc20Token must have an existing HTS counterpart (use create() first)\n     * - Caller must have sufficient ERC20 token balance\n     * - Caller must have approved this contract to spend assets amount\n     * - Receiver must be associated with the HTS token\n     *\n     * @dev Important Notes:\n     * - The user input amount is reduced to ensure rate conversion without token loss.\n     */\n    function wrap(IERC20 erc20Token, address to, uint256 erc20Amount) external;\n\n    /**\n     * @notice Withdraws a specific amount of ERC20 tokens by burning HTS tokens\n     * @dev The user input amount is adjusted to prevent tokens lost due to precision.\n     *\n     * @param erc20Token The ERC20 token to withdraw from the wrapper\n     * @param to The address to receive the withdrawn ERC20 tokens\n     * @param erc20Amount The amount of ERC20 tokens to withdraw\n     *\n     * @dev Requirements:\n     * - erc20Token must have an existing HTS counterpart\n     * - Caller must have sufficient HTS token balance\n     *\n     * @dev Important Notes:\n     * - The user input amount is reduced to ensure rate conversion without token loss.\n     * - Unwrap can fail for fee-on-transfer or rebasing tokens. Such tokens are not supported.\n     */\n    function unwrap(IERC20 erc20Token, address to, uint256 erc20Amount) external;\n}\n"
        },
        "contracts/interfaces/IHTS.sol": {
            "content": "// SPDX-License-Identifier: MIT\npragma solidity >=0.7.0;\n\n// NOTE: this empty interface is meant to enable function overloading with IERC20\ninterface IHTS {}"
        },
        "contracts/interfaces/IICHIVault.sol": {
            "content": "// SPDX-License-Identifier: Unlicense\npragma solidity >=0.5.0;\n\nimport { IERC20 } from \"@openzeppelin/contracts/token/ERC20/IERC20.sol\";\n\ninterface IICHIVault is IERC20 {\n    function ichiVaultFactory() external view returns (address);\n\n    function pool() external view returns (address);\n\n    function token0() external view returns (address);\n\n    function allowToken0() external view returns (bool);\n\n    function token1() external view returns (address);\n\n    function allowToken1() external view returns (bool);\n\n    function fee() external view returns (uint24);\n\n    function tickSpacing() external view returns (int24);\n\n    function affiliate() external view returns (address);\n\n    function baseLower() external view returns (int24);\n\n    function baseUpper() external view returns (int24);\n\n    function limitLower() external view returns (int24);\n\n    function limitUpper() external view returns (int24);\n\n    function deposit0Max() external view returns (uint256);\n\n    function deposit1Max() external view returns (uint256);\n\n    function maxTotalSupply() external view returns (uint256);\n\n    function hysteresis() external view returns (uint256);\n\n    function getTotalAmounts() external view returns (uint256, uint256);\n\n    function deposit(uint256, uint256, address) external returns (uint256);\n\n    function withdraw(uint256, address) external returns (uint256, uint256);\n\n    function rebalance(\n        int24 _baseLower,\n        int24 _baseUpper,\n        int24 _limitLower,\n        int24 _limitUpper,\n        int256 swapQuantity\n    ) external;\n\n    function setDepositMax(uint256 _deposit0Max, uint256 _deposit1Max) external;\n\n    function setAffiliate(address _affiliate) external;\n\n    event DeployICHIVault(\n        address indexed sender,\n        address indexed pool,\n        bool allowToken0,\n        bool allowToken1,\n        address owner,\n        uint256 twapPeriod\n    );\n\n    event SetTwapPeriod(address sender, uint32 newTwapPeriod);\n\n    event Deposit(address indexed sender, address indexed to, uint256 shares, uint256 amount0, uint256 amount1);\n\n    event Withdraw(address indexed sender, address indexed to, uint256 shares, uint256 amount0, uint256 amount1);\n\n    event Rebalance(\n        int24 tick,\n        uint256 totalAmount0,\n        uint256 totalAmount1,\n        uint256 feeAmount0,\n        uint256 feeAmount1,\n        uint256 totalSupply\n    );\n\n    event MaxTotalSupply(address indexed sender, uint256 maxTotalSupply);\n\n    event Hysteresis(address indexed sender, uint256 hysteresis);\n\n    event DepositMax(address indexed sender, uint256 deposit0Max, uint256 deposit1Max);\n\n    event Affiliate(address indexed sender, address affiliate);\n}\n"
        },
        "contracts/interfaces/IICHIVaultDepositGuard.sol": {
            "content": "// SPDX-License-Identifier: BUSL-1.1\npragma solidity >=0.5.0;\n\ninterface IICHIVaultDepositGuard {\n    /// @notice Emitted when the contract is deployed.\n    /// @param _ICHIVaultFactory Address of the ICHIVaultFactory.\n    /// @param _WETH Address of the Wrapped ETH token.\n    event Deployed(address _ICHIVaultFactory, address _WETH);\n\n    /// @notice Emitted when a deposit is forwarded to an ICHIVault.\n    /// @param sender The address initiating the deposit.\n    /// @param vault The ICHIVault receiving the deposit.\n    /// @param token The token being deposited.\n    /// @param amount The amount of the token being deposited.\n    /// @param shares The amount of shares issued in the vault as a result of the deposit.\n    /// @param to The address receiving the vault shares.\n    event DepositForwarded(\n        address indexed sender,\n        address indexed vault,\n        address indexed token,\n        uint256 amount,\n        uint256 shares,\n        address to\n    );\n\n    // view functions:\n\n    /// @notice Retrieves the address of the ICHIVaultFactory.\n    /// @return Address of the ICHIVaultFactory.\n    function ICHIVaultFactory() external view returns (address);\n\n    /// @notice Retrieves the address of the Wrapped Native Token (e.g., WETH).\n    /// @return Address of the Wrapped Native Token.\n    function WRAPPED_NATIVE() external view returns (address);\n\n    function HTS_ADDRESS() external view returns (address);\n\n    /// @notice Computes the unique key for a vault based on given parameters.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param token0 The address of the first token in the vault.\n    /// @param token1 The address of the second token in the vault.\n    /// @param fee The fee associated with the vault.\n    /// @param allowToken0 Boolean indicating if token0 is allowed in the vault.\n    /// @param allowToken1 Boolean indicating if token1 is allowed in the vault.\n    /// @return key The computed unique key for the vault.\n    function vaultKey(\n        address vaultDeployer,\n        address token0,\n        address token1,\n        uint24 fee,\n        bool allowToken0,\n        bool allowToken1\n    ) external view returns (bytes32 key);\n\n    // stateful functions:\n\n    /**\n     * @dev Associates the contract with a given token.\n     * It leverages the `tryAssociate` function from the `HTSInteractable` contract.\n     *\n     * @param token The address of the token to be associated with this contract.\n     * This can be an address of an IHRC compliant token or any other token.\n     * If the token is IHRC compliant, the association is attempted.\n     * If the token is not IHRC compliant or if the `associate` function call reverts for any reason,\n     * the call will fail gracefully without reverting the entire transaction\n     */\n    function associate(address token, address pool) external;\n\n    /// @notice Forwards a deposit to the specified ICHIVault after input validation.\n    /// @dev Emits a DepositForwarded event upon success.\n    /// @param vault The address of the ICHIVault to deposit into.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param token The address of the token being deposited.\n    /// @param amount The amount of the token being deposited.\n    /// @param minimumProceeds The minimum amount of vault tokens to be received.\n    /// @param to The address to receive the vault tokens.\n    /// @return vaultTokens The number of vault tokens received.\n    function forwardDepositToICHIVault(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 amount,\n        uint256 minimumProceeds,\n        address to\n    ) external returns (uint256 vaultTokens);\n\n    /// @notice Forwards a native currency (e.g., ETH) deposit to an ICHIVault.\n    /// @dev Converts the native currency to Wrapped Native Token before deposit.\n    /// @param vault The address of the ICHIVault to deposit into.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param minimumProceeds The minimum amount of vault tokens to be received.\n    /// @param to The address to receive the vault tokens.\n    /// @return vaultTokens The number of vault tokens received.\n    function forwardNativeDepositToICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 minimumProceeds,\n        address to\n    ) external payable returns (uint256 vaultTokens);\n\n    /// @notice Forwards a request to withdraw from an ICHIVault.\n    /// @param vault The address of the ICHIVault to withdraw from.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param shares The amount of shares to withdraw.\n    /// @param to The address to receive the withdrawn tokens.\n    /// @param minAmount0 The minimum amount of token0 expected to receive.\n    /// @param minAmount1 The minimum amount of token1 expected to receive.\n    /// @return amount0 The amount of token0 received.\n    /// @return amount1 The amount of token1 received.\n    function forwardWithdrawFromICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Forwards a request to withdraw native currency from an ICHIVault.\n    /// @dev Converts the Wrapped Native Tokens back to native currency on withdrawal.\n    /// @param vault The address of the ICHIVault to withdraw from.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param shares The amount of shares to withdraw.\n    /// @param to The address to receive the withdrawn native currency.\n    /// @param minAmount0 The minimum amount of token0 expected to receive.\n    /// @param minAmount1 The minimum amount of token1 expected to receive.\n    /// @return amount0 The amount of token0 received.\n    /// @return amount1 The amount of token1 received.\n    function forwardNativeWithdrawFromICHIVault(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Attempts to wrap the provided ERC20 into its HTS counterpart (if present in the vault) before depositing.\n    /// @param vault The address of the ICHIVault to deposit into.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param token The ERC20 token being deposited; will be wrapped to HTS if the vault holds that counterpart.\n    /// @param amount The amount of the token being deposited.\n    /// @param minimumProceeds The minimum amount of vault tokens to be received.\n    /// @param to The address to receive the vault tokens.\n    /// @return vaultTokens The number of vault tokens received.\n    function depositToICHIVaultAndTryWrapToHTS(\n        address vault,\n        address vaultDeployer,\n        address token,\n        uint256 amount,\n        uint256 minimumProceeds,\n        address to\n    ) external returns (uint256 vaultTokens);\n\n    /// @notice Withdraws from the vault, attempting to unwrap HTS tokens to their ERC20 counterparts before sending out.\n    /// @param vault The address of the ICHIVault to withdraw from.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param shares The amount of shares to withdraw.\n    /// @param to The address to receive the withdrawn tokens (as ERC20 if unwrapped).\n    /// @param minAmount0 The minimum amount of token0 expected to receive.\n    /// @param minAmount1 The minimum amount of token1 expected to receive.\n    /// @return amount0 The amount of token0 (post-unwrap if applicable) delivered.\n    /// @return amount1 The amount of token1 (post-unwrap if applicable) delivered.\n    function withdrawFromICHIVaultAndTryUnwrapToERC20(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external returns (uint256 amount0, uint256 amount1);\n\n    /// @notice Withdraws from the vault, unwrapping HTS tokens to ERC20 when possible and forwarding native when needed.\n    /// @param vault The address of the ICHIVault to withdraw from.\n    /// @param vaultDeployer The address of the vault deployer.\n    /// @param shares The amount of shares to withdraw.\n    /// @param to The address to receive the withdrawn assets.\n    /// @param minAmount0 The minimum amount of token0 expected to receive.\n    /// @param minAmount1 The minimum amount of token1 expected to receive.\n    /// @return amount0 The amount of token0 (post-unwrap if applicable) delivered.\n    /// @return amount1 The amount of token1 (post-unwrap if applicable) delivered.\n    function withdrawFromICHIVaultAndTryUnwrapToERC20AndForwardNative(\n        address vault,\n        address vaultDeployer,\n        uint256 shares,\n        address to,\n        uint256 minAmount0,\n        uint256 minAmount1\n    ) external returns (uint256 amount0, uint256 amount1);\n}\n"
        },
        "contracts/interfaces/IICHIVaultFactory.sol": {
            "content": "// SPDX-License-Identifier: BUSL-1.1\npragma solidity >=0.5.0;\n\ninterface IICHIVaultFactory {\n    event FeeRecipient(address indexed sender, address feeRecipient);\n\n    event BaseFee(address indexed sender, uint256 baseFee);\n\n    event BaseFeeSplit(address indexed sender, uint256 baseFeeSplit);\n\n    event DeployICHIVaultFactory(address indexed sender, address uniswapV3Factory);\n\n    event ICHIVaultCreated(\n        address indexed sender,\n        address ichiVault,\n        address tokenA,\n        bool allowTokenA,\n        address tokenB,\n        bool allowTokenB,\n        uint24 fee,\n        uint256 count\n    );\n\n    function getICHIVault(bytes32 vaultKey) external view returns (address);\n\n    function uniswapV3Factory() external view returns (address);\n\n    function feeRecipient() external view returns (address);\n\n    function baseFee() external view returns (uint256);\n\n    function baseFeeSplit() external view returns (uint256);\n\n    function setFeeRecipient(address _feeRecipient) external;\n\n    function setBaseFee(uint256 _baseFee) external;\n\n    function setBaseFeeSplit(uint256 _baseFeeSplit) external;\n\n    function createICHIVault(\n        address tokenA,\n        bool allowTokenA,\n        address tokenB,\n        bool allowTokenB,\n        uint24 fee\n    ) external returns (address ichiVault);\n\n    function genKey(\n        address deployer,\n        address token0,\n        address token1,\n        uint24 fee,\n        bool allowToken0,\n        bool allowToken1\n    ) external pure returns (bytes32 key);\n}\n"
        },
        "contracts/interfaces/IWHBAR.sol": {
            "content": "// SPDX-License-Identifier: Unlicense\npragma solidity >=0.5.0;\n\ninterface IWHBAR {\n    function deposit() external payable;\n\n    function withdraw(uint) external;\n\n    // returns the HTS token created by the WHBAR contract\n    function token() external view returns (address);\n}\n"
        },
        "contracts/interfaces/external/hedera/IHRC.sol": {
            "content": "// SPDX-License-Identifier: GPL-2.0-or-later\npragma solidity >=0.5.0;\n\n// added this interface explicitly instead of importing from hedera-smart-contracts\n// in order to avoid issue with solidity compiler versions\n// i.e. this codebase uses 0.7.6 and hedera-smart-contracts uses 0.8+\ninterface IHRC {\n    function associate() external returns (uint256 responseCode);\n\n    function dissociate() external returns (uint256 responseCode);\n}\n"
        }
    },
    "matchId": "26628392",
    "creationMatch": null,
    "runtimeMatch": "exact_match",
    "verifiedAt": "2026-03-24T19:23:21Z",
    "match": "exact_match",
    "chainId": "295",
    "address": "0xCEc8716cdd60856eaCaa74d499Abd14AE34B7dA8"
}

const BYTES4_RESPONSE = {
    "count": 3,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1065295,
            "created_at": "2023-06-17T03:45:54.407074Z",
            "text_signature": "_SIMONdotBLACK_(int8,int224,int104,uint88[],bytes29[])",
            "hex_signature": "0xf305d719",
            "bytes_signature": "ó\u0005×\u0019"
        },
        {
            "id": 844482,
            "created_at": "2022-09-02T10:24:01.310054Z",
            "text_signature": "watch_tg_invmru_8554910(address,address,bool)",
            "hex_signature": "0xf305d719",
            "bytes_signature": "ó\u0005×\u0019"
        },
        {
            "id": 171032,
            "created_at": "2020-05-19T07:39:57.530767Z",
            "text_signature": "addLiquidityETH(address,uint256,uint256,uint256,address,uint256)",
            "hex_signature": "0xf305d719",
            "bytes_signature": "ó\u0005×\u0019"
        }
    ]
}

const BYTES4_RESPONSE_V2 = {
    "count": 4,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1065300,
            "created_at": "2023-06-17T14:00:15.313418Z",
            "text_signature": "_SIMONdotBLACK_(int8[],int224[],int256,int64,uint248[])",
            "hex_signature": "0x095ea7b3",
            "bytes_signature": "\t^§³"
        },
        {
            "id": 844301,
            "created_at": "2022-08-26T12:23:08.868372Z",
            "text_signature": "watch_tg_invmru_2f69f1b(address,address)",
            "hex_signature": "0x095ea7b3",
            "bytes_signature": "\t^§³"
        },
        {
            "id": 165138,
            "created_at": "2019-09-10T17:02:48.483924Z",
            "text_signature": "sign_szabo_bytecode(bytes16,uint128)",
            "hex_signature": "0x095ea7b3",
            "bytes_signature": "\t^§³"
        },
        {
            "id": 149,
            "created_at": "2016-07-09T03:58:29.617584Z",
            "text_signature": "approve(address,uint256)",
            "hex_signature": "0x095ea7b3",
            "bytes_signature": "\t^§³"
        }
    ]
}
