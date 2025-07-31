// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import {SAMPLE_TOKEN, SAMPLE_TOKEN_DUDE} from "../../Mocks";
import {TokenTransferLayout} from "@/components/transfer_graphs/layout/TokenTransferLayout";

describe("TokenTransferLayout.ts", () => {

    //
    // Single token
    //

    test("Single token, zero source, one destination", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.200", "amount": +10, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const layouts = TokenTransferLayout.make(transaction as Transaction)

        expect(layouts.length).toBe(1)

        const layout0 = layouts[0]
        expect(layout0.tokenId).toBe(SAMPLE_TOKEN.token_id)
        expect(layout0.sources.length).toBe(1)
        expect(layout0.destinations.length).toBe(1)
        expect(layout0.rowCount).toBe(1)

        const s0 = layout0.sources[0]
        expect(s0.account).toBe(null)
        expect(s0.amount).toBe(-10)
        expect(s0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d0 = layout0.destinations[0]
        expect(d0.account).toBe("0.0.200")
        expect(d0.amount).toBe(+10)
        expect(d0.token_id).toBe(SAMPLE_TOKEN.token_id)
    })

    test("Single token, zero source, two destinations", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.201", "amount": +2, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const layouts = TokenTransferLayout.make(transaction as Transaction)

        expect(layouts.length).toBe(1)

        const layout0 = layouts[0]
        expect(layout0.tokenId).toBe(SAMPLE_TOKEN.token_id)
        expect(layout0.sources.length).toBe(1)
        expect(layout0.destinations.length).toBe(2)
        expect(layout0.rowCount).toBe(2)

        const s0 = layout0.sources[0]
        expect(s0.account).toBe(null)
        expect(s0.amount).toBe(-10)
        expect(s0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d0 = layout0.destinations[0]
        expect(d0.account).toBe("0.0.200")
        expect(d0.amount).toBe(+8)
        expect(d0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d1 = layout0.destinations[1]
        expect(d1.account).toBe("0.0.201")
        expect(d1.amount).toBe(+2)
        expect(d1.token_id).toBe(SAMPLE_TOKEN.token_id)
    })

    test("Single token, one source, one destination", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.100", "amount": -10, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +2, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.201", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const layouts = TokenTransferLayout.make(transaction as Transaction)

        expect(layouts.length).toBe(1)

        const layout0 = layouts[0]
        expect(layout0.tokenId).toBe(SAMPLE_TOKEN.token_id)
        expect(layout0.sources.length).toBe(1)
        expect(layout0.destinations.length).toBe(2)
        expect(layout0.rowCount).toBe(2)

        const s0 = layout0.sources[0]
        expect(s0.account).toBe("0.0.100")
        expect(s0.amount).toBe(-10)
        expect(s0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d0 = layout0.destinations[0]
        expect(d0.account).toBe("0.0.200")
        expect(d0.amount).toBe(+2)
        expect(d0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d1 = layout0.destinations[1]
        expect(d1.account).toBe("0.0.201")
        expect(d1.amount).toBe(+8)
        expect(d1.token_id).toBe(SAMPLE_TOKEN.token_id)

    })

    test("Single token, one source, two destinations", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.100", "amount": -10, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +2, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.201", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const layouts = TokenTransferLayout.make(transaction as Transaction)

        expect(layouts.length).toBe(1)

        const layout0 = layouts[0]
        expect(layout0.tokenId).toBe(SAMPLE_TOKEN.token_id)
        expect(layout0.sources.length).toBe(1)
        expect(layout0.destinations.length).toBe(2)
        expect(layout0.rowCount).toBe(2)

        const s0 = layout0.sources[0]
        expect(s0.account).toBe("0.0.100")
        expect(s0.amount).toBe(-10)
        expect(s0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d0 = layout0.destinations[0]
        expect(d0.account).toBe("0.0.200")
        expect(d0.amount).toBe(+2)
        expect(d0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d1 = layout0.destinations[1]
        expect(d1.account).toBe("0.0.201")
        expect(d1.amount).toBe(+8)
        expect(d1.token_id).toBe(SAMPLE_TOKEN.token_id)
    })

    test("Single token, two sources, one destination", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.101", "amount": -3, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.100", "amount": -7, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +10, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const layouts = TokenTransferLayout.make(transaction as Transaction)

        expect(layouts.length).toBe(1)

        const layout0 = layouts[0]
        expect(layout0.tokenId).toBe(SAMPLE_TOKEN.token_id)
        expect(layout0.sources.length).toBe(2)
        expect(layout0.destinations.length).toBe(1)
        expect(layout0.rowCount).toBe(2)

        const s0 = layout0.sources[0]
        expect(s0.account).toBe("0.0.100")
        expect(s0.amount).toBe(-7)
        expect(s0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const s1 = layout0.sources[1]
        expect(s1.account).toBe("0.0.101")
        expect(s1.amount).toBe(-3)
        expect(s1.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d0 = layout0.destinations[0]
        expect(d0.account).toBe("0.0.200")
        expect(d0.amount).toBe(+10)
        expect(d0.token_id).toBe(SAMPLE_TOKEN.token_id)
    })

    test("Single token, two sources, two destinations", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.101", "amount": -3, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.100", "amount": -7, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.201", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +2, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const layouts = TokenTransferLayout.make(transaction as Transaction)

        expect(layouts.length).toBe(1)

        const layout0 = layouts[0]
        expect(layout0.tokenId).toBe(SAMPLE_TOKEN.token_id)
        expect(layout0.sources.length).toBe(2)
        expect(layout0.destinations.length).toBe(2)
        expect(layout0.rowCount).toBe(2)

        const s0 = layout0.sources[0]
        expect(s0.account).toBe("0.0.100")
        expect(s0.amount).toBe(-7)
        expect(s0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const s1 = layout0.sources[1]
        expect(s1.account).toBe("0.0.101")
        expect(s1.amount).toBe(-3)
        expect(s1.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d0 = layout0.destinations[0]
        expect(d0.account).toBe("0.0.200")
        expect(d0.amount).toBe(+2)
        expect(d0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d1 = layout0.destinations[1]
        expect(d1.account).toBe("0.0.201")
        expect(d1.amount).toBe(+8)
        expect(d1.token_id).toBe(SAMPLE_TOKEN.token_id)
    })

    test("Single token, two sources, two destinations, null account id", async () => {

        const transaction = {
            "token_transfers": [
                {"account": null, "amount": -3, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.100", "amount": -7, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.201", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
                {"account": null, "amount": +2, "token_id": SAMPLE_TOKEN.token_id},
            ],
        }

        const layouts = TokenTransferLayout.make(transaction as Transaction)

        expect(layouts.length).toBe(1)

        const layout0 = layouts[0]
        expect(layout0.tokenId).toBe(SAMPLE_TOKEN.token_id)
        expect(layout0.sources.length).toBe(2)
        expect(layout0.destinations.length).toBe(2)
        expect(layout0.rowCount).toBe(2)

        const s0 = layout0.sources[0]
        expect(s0.account).toBe(null)
        expect(s0.amount).toBe(-3)
        expect(s0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const s1 = layout0.sources[1]
        expect(s1.account).toBe("0.0.100")
        expect(s1.amount).toBe(-7)
        expect(s1.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d0 = layout0.destinations[0]
        expect(d0.account).toBe(null)
        expect(d0.amount).toBe(+2)
        expect(d0.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d1 = layout0.destinations[1]
        expect(d1.account).toBe("0.0.201")
        expect(d1.amount).toBe(+8)
        expect(d1.token_id).toBe(SAMPLE_TOKEN.token_id)
    })

    //
    // Two tokens
    //

    test("Two token", async () => {

        const transaction = {
            "token_transfers": [
                {"account": "0.0.101", "amount": -3, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.100", "amount": -7, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.201", "amount": +8, "token_id": SAMPLE_TOKEN.token_id},
                {"account": "0.0.200", "amount": +2, "token_id": SAMPLE_TOKEN.token_id},

                {"account": "0.0.100", "amount": -6, "token_id": SAMPLE_TOKEN_DUDE.token_id},
                {"account": "0.0.200", "amount": +6, "token_id": SAMPLE_TOKEN_DUDE.token_id},
            ],
        }

        const layouts = TokenTransferLayout.make(transaction as Transaction)

        expect(layouts.length).toBe(2)

        //
        // Layout 0
        //
        const layout0 = layouts[0]
        expect(layout0.tokenId).toBe(SAMPLE_TOKEN.token_id)
        expect(layout0.sources.length).toBe(2)
        expect(layout0.destinations.length).toBe(2)
        expect(layout0.rowCount).toBe(2)

        const s00 = layout0.sources[0]
        expect(s00.account).toBe("0.0.100")
        expect(s00.amount).toBe(-7)
        expect(s00.token_id).toBe(SAMPLE_TOKEN.token_id)

        const s01 = layout0.sources[1]
        expect(s01.account).toBe("0.0.101")
        expect(s01.amount).toBe(-3)
        expect(s01.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d00 = layout0.destinations[0]
        expect(d00.account).toBe("0.0.200")
        expect(d00.amount).toBe(+2)
        expect(d00.token_id).toBe(SAMPLE_TOKEN.token_id)

        const d01 = layout0.destinations[1]
        expect(d01.account).toBe("0.0.201")
        expect(d01.amount).toBe(+8)
        expect(d01.token_id).toBe(SAMPLE_TOKEN.token_id)


        //
        // Layout 1
        //
        const layout1 = layouts[1]
        expect(layout1.tokenId).toBe(SAMPLE_TOKEN_DUDE.token_id)
        expect(layout1.sources.length).toBe(1)
        expect(layout1.destinations.length).toBe(1)
        expect(layout1.rowCount).toBe(1)

        const s10 = layout1.sources[0]
        expect(s10.account).toBe("0.0.100")
        expect(s10.amount).toBe(-6)
        expect(s10.token_id).toBe(SAMPLE_TOKEN_DUDE.token_id)

        const d10 = layout1.destinations[0]
        expect(d10.account).toBe("0.0.200")
        expect(d10.amount).toBe(+6)
        expect(d10.token_id).toBe(SAMPLE_TOKEN_DUDE.token_id)

    })
})
