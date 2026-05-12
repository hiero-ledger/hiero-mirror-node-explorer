// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from "vitest";
import {decodeSolidityErrorMessage, fetchSolidityPanicMessage} from "@/schemas/MirrorNodeUtils.ts";
import {SAMPLE_REVERT_CONTRACT_RESULT_ACTIONS} from "../Mocks.ts";

describe("MirrorNodeUtils.ts", () => {

    test("decodeSolidityErrorMessage()", () => {

        expect(decodeSolidityErrorMessage(null))
            .toBe(null)
        expect(fetchSolidityPanicMessage(null))
            .toBe(null)

        expect(decodeSolidityErrorMessage("0x"))
            .toBe(null)
        expect(fetchSolidityPanicMessage(null))
            .toBe(null)

        expect(decodeSolidityErrorMessage(""))
            .toBe(null)
        expect(fetchSolidityPanicMessage(null))
            .toBe(null)


        expect(decodeSolidityErrorMessage("0x4e487b710000000000000000000000000000000000000000000000000000000000000001"))
            .toBe("Panic(0x01)")
        expect(fetchSolidityPanicMessage("assert called with an argument that evaluates to false"))
            .toBe(null)

        expect(decodeSolidityErrorMessage("0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b566963746f72204875676f000000000000000000000000000000000000000000"))
            .toBe("Error(\"Victor Hugo\")")
        expect(fetchSolidityPanicMessage(null))
            .toBe(null)

        expect(decodeSolidityErrorMessage("0x494e56414c49445f4f5045524154494f4e"))
            .toBe("INVALID_OPERATION")
        expect(fetchSolidityPanicMessage(null))
            .toBe(null)

        expect(decodeSolidityErrorMessage("0xc2bb947c"))
            .toBe("0xc2bb947c")
        expect(fetchSolidityPanicMessage(null))
            .toBe(null)

        const actions = SAMPLE_REVERT_CONTRACT_RESULT_ACTIONS.actions
        expect(decodeSolidityErrorMessage(actions[0].result_data))
            .toBe("Error(\"payWithCardNFT - failed to call accept contract method\")")
        expect(fetchSolidityPanicMessage(null))
            .toBe(null)

        expect(decodeSolidityErrorMessage(actions[1].result_data))
            .toBeNull()
        expect(fetchSolidityPanicMessage(null))
            .toBe(null)
    })

})
