// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {NetworkNode, Transaction} from "@/schemas/MirrorNodeSchemas";
import {SAMPLE_NETWORK_NODES} from "../../Mocks";
import {HbarTransferLayout} from "@/components/transfer_graphs/layout/HbarTransferLayout";
import {flushPromises} from "@vue/test-utils";

describe("HbarTransferLayout.vue", () => {

    const NETWORK_NODES = SAMPLE_NETWORK_NODES.nodes as NetworkNode[]

    //
    // Single source
    //

    test("Single source, only fees", async () => {

        await flushPromises()

        const transaction = {
            "charged_tx_fee": 10,
            "transfers": [
                {"account": "0.0.5", "amount": +3},
                {"account": "0.0.98", "amount": +7},
                {"account": "0.0.100", "amount": -10}
            ],
        } as Transaction

        await flushPromises()

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(10)
        expect(fullLayout.rowCount).toBe(2)
        expect(fullLayout.sources.length).toBe(1)
        expect(fullLayout.destinations.length).toBe(2)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.100")
        expect(s0.transfer.amount).toBe(-10)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.5")
        expect(d0.transfer.amount).toBe(+3)
        expect(d0.description).toBe("Node fee (Hedera)")
        expect(d0.payload).toBe(false)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.98")
        expect(d1.transfer.amount).toBe(+7)
        expect(d1.description).toBe("Hedera fee collection account")
        expect(d1.payload).toBe(false)

        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(0)
        expect(compactLayout.rowCount).toBe(0)
        expect(compactLayout.sources.length).toBe(0)
        expect(compactLayout.destinations.length).toBe(0)

    })

    test("Single source, one destination", async () => {

        const transaction = {
            "charged_tx_fee": 10,
            "transfers": [
                {"account": "0.0.100", "amount": -100},
                {"account": "0.0.5", "amount": +3},
                {"account": "0.0.98", "amount": +7},
                {"account": "0.0.120", "amount": +90},
            ],
        } as Transaction

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(100)
        expect(fullLayout.rowCount).toBe(3)
        expect(fullLayout.sources.length).toBe(1)
        expect(fullLayout.destinations.length).toBe(3)

        const fs0 = fullLayout.sources[0]
        expect(fs0.transfer.account).toBe("0.0.100")
        expect(fs0.transfer.amount).toBe(-100)
        expect(fs0.description).toBe(null)
        expect(fs0.payload).toBe(true)

        const fd0 = fullLayout.destinations[0]
        expect(fd0.transfer.account).toBe("0.0.120")
        expect(fd0.transfer.amount).toBe(+90)
        expect(fd0.description).toBe("Transfer")
        expect(fd0.payload).toBe(true)

        const fd1 = fullLayout.destinations[1]
        expect(fd1.transfer.account).toBe("0.0.5")
        expect(fd1.transfer.amount).toBe(+3)
        expect(fd1.description).toBe("Node fee (Hedera)")
        expect(fd1.payload).toBe(false)

        const fd2 = fullLayout.destinations[2]
        expect(fd2.transfer.account).toBe("0.0.98")
        expect(fd2.transfer.amount).toBe(+7)
        expect(fd2.description).toBe("Hedera fee collection account")
        expect(fd2.payload).toBe(false)

        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(90)
        expect(compactLayout.rowCount).toBe(1)
        expect(compactLayout.sources.length).toBe(1)
        expect(compactLayout.destinations.length).toBe(1)

        const cs0 = fullLayout.sources[0]
        expect(cs0.transfer.account).toBe("0.0.100")
        expect(cs0.transfer.amount).toBe(-100)
        expect(cs0.description).toBe(null)
        expect(cs0.payload).toBe(true)

        const cd0 = fullLayout.destinations[0]
        expect(cd0.transfer.account).toBe("0.0.120")
        expect(cd0.transfer.amount).toBe(+90)
        expect(cd0.description).toBe("Transfer")
        expect(cd0.payload).toBe(true)
    })

    test("Single source, two destinations", async () => {

        const transaction = {
            "charged_tx_fee": 10,
            "transfers": [
                {"account": "0.0.100", "amount": -100},
                {"account": "0.0.5", "amount": +3},
                {"account": "0.0.98", "amount": +7},
                {"account": "0.0.120", "amount": +30},
                {"account": "0.0.121", "amount": +60},
            ],
        } as Transaction

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(100)
        expect(fullLayout.rowCount).toBe(4)
        expect(fullLayout.sources.length).toBe(1)
        expect(fullLayout.destinations.length).toBe(4)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.100")
        expect(s0.transfer.amount).toBe(-100)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.120")
        expect(d0.transfer.amount).toBe(+30)
        expect(d0.description).toBe("Transfer")
        expect(d0.payload).toBe(true)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.121")
        expect(d1.transfer.amount).toBe(+60)
        expect(d1.description).toBe("Transfer")
        expect(d1.payload).toBe(true)

        const d2 = fullLayout.destinations[2]
        expect(d2.transfer.account).toBe("0.0.5")
        expect(d2.transfer.amount).toBe(+3)
        expect(d2.description).toBe("Node fee (Hedera)")
        expect(d2.payload).toBe(false)

        const d3 = fullLayout.destinations[3]
        expect(d3.transfer.account).toBe("0.0.98")
        expect(d3.transfer.amount).toBe(+7)
        expect(d3.description).toBe("Hedera fee collection account")
        expect(d3.payload).toBe(false)

        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(90)
        expect(compactLayout.rowCount).toBe(2)
        expect(compactLayout.sources.length).toBe(1)
        expect(compactLayout.destinations.length).toBe(2)

        const cs0 = fullLayout.sources[0]
        expect(cs0.transfer.account).toBe("0.0.100")
        expect(cs0.transfer.amount).toBe(-100)
        expect(cs0.description).toBe(null)
        expect(cs0.payload).toBe(true)

        const cd0 = fullLayout.destinations[0]
        expect(cd0.transfer.account).toBe("0.0.120")
        expect(cd0.transfer.amount).toBe(+30)
        expect(cd0.description).toBe("Transfer")
        expect(cd0.payload).toBe(true)

        const cd1 = fullLayout.destinations[1]
        expect(cd1.transfer.account).toBe("0.0.121")
        expect(cd1.transfer.amount).toBe(+60)
        expect(cd1.description).toBe("Transfer")
        expect(cd1.payload).toBe(true)
    })

    test("Single source, destinations including 800 and 801", async () => {

        const transaction = {
            "charged_tx_fee": 34394,
            "transfers": [
                {
                    "account": "0.0.5",
                    "amount": 1394
                },
                {
                    "account": "0.0.98",
                    "amount": 26400
                },
                {
                    "account": "0.0.800",
                    "amount": 3300
                },
                {
                    "account": "0.0.801",
                    "amount": 3300
                },
                {
                    "account": "0.0.3229",
                    "amount": -34395
                },
                {
                    "account": "0.0.3230",
                    "amount": 1
                }
            ]
        } as Transaction

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(34395)
        expect(fullLayout.rowCount).toBe(5)
        expect(fullLayout.sources.length).toBe(1)
        expect(fullLayout.destinations.length).toBe(5)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.3229")
        expect(s0.transfer.amount).toBe(-34395)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.3230")
        expect(d0.transfer.amount).toBe(+1)
        expect(d0.description).toBe("Transfer")
        expect(d0.payload).toBe(true)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.5")
        expect(d1.transfer.amount).toBe(+1394)
        expect(d1.description).toBe("Node fee (Hedera)")
        expect(d1.payload).toBe(false)

        const d2 = fullLayout.destinations[2]
        expect(d2.transfer.account).toBe("0.0.98")
        expect(d2.transfer.amount).toBe(+26400)
        expect(d2.description).toBe("Hedera fee collection account")
        expect(d2.payload).toBe(false)

        const d3 = fullLayout.destinations[3]
        expect(d3.transfer.account).toBe("0.0.800")
        expect(d3.transfer.amount).toBe(+3300)
        expect(d3.description).toBe("Staking reward account fee")
        expect(d3.payload).toBe(false)

        const d4 = fullLayout.destinations[4]
        expect(d4.transfer.account).toBe("0.0.801")
        expect(d4.transfer.amount).toBe(+3300)
        expect(d4.description).toBe("Node reward account fee")
        expect(d4.payload).toBe(false)

        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(1)
        expect(compactLayout.rowCount).toBe(1)
        expect(compactLayout.sources.length).toBe(1)
        expect(compactLayout.destinations.length).toBe(1)

        const cs0 = compactLayout.sources[0]
        expect(cs0.transfer.account).toBe("0.0.3229")
        expect(cs0.transfer.amount).toBe(-34395)
        expect(cs0.description).toBe(null)
        expect(cs0.payload).toBe(true)

        const cd0 = fullLayout.destinations[0]
        expect(cd0.transfer.account).toBe("0.0.3230")
        expect(cd0.transfer.amount).toBe(+1)
        expect(cd0.description).toBe("Transfer")
        expect(cd0.payload).toBe(true)
    })


    //
    // Multiple sources
    //

    test("Multiple sources, only fees", async () => {

        const transaction = {
            "charged_tx_fee": 10,
            "transfers": [
                {"account": "0.0.100", "amount": -2},
                {"account": "0.0.101", "amount": -8},
                {"account": "0.0.5", "amount": +3},
                {"account": "0.0.98", "amount": +7},
            ],
        } as Transaction

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(10)
        expect(fullLayout.rowCount).toBe(2)
        expect(fullLayout.sources.length).toBe(2)
        expect(fullLayout.destinations.length).toBe(2)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.100")
        expect(s0.transfer.amount).toBe(-2)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const s1 = fullLayout.sources[1]
        expect(s1.transfer.account).toBe("0.0.101")
        expect(s1.transfer.amount).toBe(-8)
        expect(s1.description).toBe(null)
        expect(s1.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.5")
        expect(d0.transfer.amount).toBe(+3)
        expect(d0.description).toBe("Node fee (Hedera)")
        expect(d0.payload).toBe(false)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.98")
        expect(d1.transfer.amount).toBe(+7)
        expect(d1.description).toBe("Hedera fee collection account")
        expect(d1.payload).toBe(false)


        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(0)
        expect(compactLayout.rowCount).toBe(0)
        expect(compactLayout.sources.length).toBe(0)
        expect(compactLayout.destinations.length).toBe(0)

    })

    test("Multiple sources, one destination", async () => {

        const transaction = {
            "charged_tx_fee": 10,
            "transfers": [
                {"account": "0.0.100", "amount": -20},
                {"account": "0.0.101", "amount": -80},
                {"account": "0.0.5", "amount": +3},
                {"account": "0.0.98", "amount": +7},
                {"account": "0.0.120", "amount": +90},
            ],
        } as Transaction

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(100)
        expect(fullLayout.rowCount).toBe(3)
        expect(fullLayout.sources.length).toBe(2)
        expect(fullLayout.destinations.length).toBe(3)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.100")
        expect(s0.transfer.amount).toBe(-20)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const s1 = fullLayout.sources[1]
        expect(s1.transfer.account).toBe("0.0.101")
        expect(s1.transfer.amount).toBe(-80)
        expect(s1.description).toBe(null)
        expect(s1.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.120")
        expect(d0.transfer.amount).toBe(+90)
        expect(d0.description).toBe("Transfer")
        expect(d0.payload).toBe(true)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.5")
        expect(d1.transfer.amount).toBe(+3)
        expect(d1.description).toBe("Node fee (Hedera)")
        expect(d1.payload).toBe(false)

        const d2 = fullLayout.destinations[2]
        expect(d2.transfer.account).toBe("0.0.98")
        expect(d2.transfer.amount).toBe(+7)
        expect(d2.description).toBe("Hedera fee collection account")
        expect(d2.payload).toBe(false)

        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(90)
        expect(compactLayout.rowCount).toBe(2)
        expect(compactLayout.sources.length).toBe(2)
        expect(compactLayout.destinations.length).toBe(1)

        const cs0 = fullLayout.sources[0]
        expect(cs0.transfer.account).toBe("0.0.100")
        expect(cs0.transfer.amount).toBe(-20)
        expect(cs0.description).toBe(null)
        expect(cs0.payload).toBe(true)

        const cs1 = fullLayout.sources[1]
        expect(cs1.transfer.account).toBe("0.0.101")
        expect(cs1.transfer.amount).toBe(-80)
        expect(cs1.description).toBe(null)
        expect(cs1.payload).toBe(true)

        const cd0 = fullLayout.destinations[0]
        expect(cd0.transfer.account).toBe("0.0.120")
        expect(cd0.transfer.amount).toBe(+90)
        expect(cd0.description).toBe("Transfer")
        expect(cd0.payload).toBe(true)
    })

    test("Multiple sources, two destinations", async () => {

        const transaction = {
            "charged_tx_fee": 10,
            "transfers": [
                {"account": "0.0.100", "amount": -20},
                {"account": "0.0.101", "amount": -80},
                {"account": "0.0.5", "amount": +3},
                {"account": "0.0.98", "amount": +7},
                {"account": "0.0.120", "amount": +30},
                {"account": "0.0.121", "amount": +60},
            ],
        } as Transaction

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(100)
        expect(fullLayout.rowCount).toBe(4)
        expect(fullLayout.sources.length).toBe(2)
        expect(fullLayout.destinations.length).toBe(4)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.100")
        expect(s0.transfer.amount).toBe(-20)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const s1 = fullLayout.sources[1]
        expect(s1.transfer.account).toBe("0.0.101")
        expect(s1.transfer.amount).toBe(-80)
        expect(s1.description).toBe(null)
        expect(s1.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.120")
        expect(d0.transfer.amount).toBe(+30)
        expect(d0.description).toBe("Transfer")
        expect(d0.payload).toBe(true)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.121")
        expect(d1.transfer.amount).toBe(+60)
        expect(d1.description).toBe("Transfer")
        expect(d1.payload).toBe(true)

        const d2 = fullLayout.destinations[2]
        expect(d2.transfer.account).toBe("0.0.5")
        expect(d2.transfer.amount).toBe(+3)
        expect(d2.description).toBe("Node fee (Hedera)")
        expect(d2.payload).toBe(false)

        const d3 = fullLayout.destinations[3]
        expect(d3.transfer.account).toBe("0.0.98")
        expect(d3.transfer.amount).toBe(+7)
        expect(d3.description).toBe("Hedera fee collection account")
        expect(d3.payload).toBe(false)


        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(90)
        expect(compactLayout.rowCount).toBe(2)
        expect(compactLayout.sources.length).toBe(2)
        expect(compactLayout.destinations.length).toBe(2)

        const cs0 = fullLayout.sources[0]
        expect(cs0.transfer.account).toBe("0.0.100")
        expect(cs0.transfer.amount).toBe(-20)
        expect(cs0.description).toBe(null)
        expect(cs0.payload).toBe(true)

        const cs1 = fullLayout.sources[1]
        expect(cs1.transfer.account).toBe("0.0.101")
        expect(cs1.transfer.amount).toBe(-80)
        expect(cs1.description).toBe(null)
        expect(cs1.payload).toBe(true)

        const cd0 = fullLayout.destinations[0]
        expect(cd0.transfer.account).toBe("0.0.120")
        expect(cd0.transfer.amount).toBe(+30)
        expect(cd0.description).toBe("Transfer")
        expect(cd0.payload).toBe(true)

        const cd1 = fullLayout.destinations[1]
        expect(cd1.transfer.account).toBe("0.0.121")
        expect(cd1.transfer.amount).toBe(+60)
        expect(cd1.description).toBe("Transfer")
        expect(cd1.payload).toBe(true)
    })

    //
    // Positive net amount with only fee collectors
    //

    test("Positive net amount with only fee collectors", async () => {

        const transaction = {
            "charged_tx_fee": 8,
            "transfers": [
                {"account": "0.0.5", "amount": +3},
                {"account": "0.0.98", "amount": +7},
                {"account": "0.0.100", "amount": -10}
            ],
        } as Transaction

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(10)
        expect(fullLayout.rowCount).toBe(3)
        expect(fullLayout.sources.length).toBe(1)
        expect(fullLayout.destinations.length).toBe(3)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.100")
        expect(s0.transfer.amount).toBe(-10)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.5")
        expect(d0.transfer.amount).toBe(+2)
        expect(d0.description).toBe("Hosted by Hedera | Central, USA")
        expect(d0.payload).toBe(true)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.5")
        expect(d1.transfer.amount).toBe(+1)
        expect(d1.description).toBe("Node fee (Hedera)")
        expect(d1.payload).toBe(false)

        const d2 = fullLayout.destinations[2]
        expect(d2.transfer.account).toBe("0.0.98")
        expect(d2.transfer.amount).toBe(+7)
        expect(d2.description).toBe("Hedera fee collection account")
        expect(d2.payload).toBe(false)

        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(2)
        expect(compactLayout.rowCount).toBe(1)
        expect(compactLayout.sources.length).toBe(1)
        expect(compactLayout.destinations.length).toBe(1)

        const cs0 = fullLayout.sources[0]
        expect(cs0.transfer.account).toBe("0.0.100")
        expect(cs0.transfer.amount).toBe(-10)
        expect(cs0.description).toBe(null)
        expect(cs0.payload).toBe(true)

        const cd0 = fullLayout.destinations[0]
        expect(cd0.transfer.account).toBe("0.0.5")
        expect(cd0.transfer.amount).toBe(+2)
        expect(cd0.description).toBe("Hosted by Hedera | Central, USA")
        expect(cd0.payload).toBe(true)

    })


    test("Transfer and payment of reward", async () => {

        const transaction = {
            "charged_tx_fee": 185749,
            "transfers": [
                {
                    "account": "0.0.5",
                    "amount": 7524,
                    "is_approval": false
                },
                {
                    "account": "0.0.98",
                    "amount": 160403,
                    "is_approval": false
                },
                {
                    "account": "0.0.800",
                    "amount": -7723301000,
                    "is_approval": false
                },
                {
                    "account": "0.0.1859883",
                    "amount": -1376866927,
                    "is_approval": false
                },
                {
                    "account": "0.0.2105083",
                    "amount": 9100000000,
                    "is_approval": false
                }
            ],
            "staking_reward_transfers": [
                {
                    "account": "0.0.1859883",
                    "amount": 7723318822
                }
            ]
        } as Transaction

        //
        // FULL
        //

        const Fee800 = 7723318822 - 7723301000
        const FeeTotal = 7524 + 160403 + Fee800
        const TransferTotal = 9100000000 + FeeTotal

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        expect(fullLayout.destinationAmount).toBe(+TransferTotal)
        expect(fullLayout.rowCount).toBe(4)
        expect(fullLayout.sources.length).toBe(1)
        expect(fullLayout.destinations.length).toBe(4)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.1859883")
        expect(s0.transfer.amount).toBe(-TransferTotal)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.2105083")
        expect(d0.transfer.amount).toBe(+9100000000)
        expect(d0.description).toBe("Transfer")
        expect(d0.payload).toBe(true)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.5")
        expect(d1.transfer.amount).toBe(+7524)
        expect(d1.description).toBe("Node fee (Hedera)")
        expect(d1.payload).toBe(false)

        const d2 = fullLayout.destinations[2]
        expect(d2.transfer.account).toBe("0.0.98")
        expect(d2.transfer.amount).toBe(+160403)
        expect(d2.description).toBe("Hedera fee collection account")
        expect(d2.payload).toBe(false)

        const d3 = fullLayout.destinations[3]
        expect(d3.transfer.account).toBe("0.0.800")
        expect(d3.transfer.amount).toBe(+Fee800)
        expect(d3.description).toBe("Staking reward account fee")
        expect(d3.payload).toBe(false)

        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(+9100000000)
        expect(compactLayout.rowCount).toBe(1)
        expect(compactLayout.sources.length).toBe(1)
        expect(compactLayout.destinations.length).toBe(1)

        const cs0 = compactLayout.sources[0]
        expect(cs0.transfer.account).toBe("0.0.1859883")
        expect(cs0.transfer.amount).toBe(-9100185749)
        expect(cs0.description).toBe(null)
        expect(cs0.payload).toBe(true)

        const cd0 = compactLayout.destinations[0]
        expect(cd0.transfer.account).toBe("0.0.2105083")
        expect(cd0.transfer.amount).toBe(+9100000000)
        expect(cd0.description).toBe("Transfer")
        expect(cd0.payload).toBe(true)
    })


    test("Transfer and payment of reward (take #2)", async () => {

        const transaction = {
            "charged_tx_fee": 118031,
            "transfers": [
                {
                    "account": "0.0.3",
                    "amount": 4798,
                    "is_approval": false
                },
                {
                    "account": "0.0.98",
                    "amount": 113233,
                    "is_approval": false
                },
                {
                    "account": "0.0.800",
                    "amount": -231664272,
                    "is_approval": false
                },
                {
                    "account": "0.0.1784243",
                    "amount": -118046,
                    "is_approval": false
                },
                {
                    "account": "0.0.1934439",
                    "amount": 231664287,
                    "is_approval": false
                }
            ],
            "staking_reward_transfers": [
                {
                    "account": "0.0.1934439",
                    "amount": 231664272
                }
            ]
        } as Transaction

        //
        // FULL
        //

        const fullLayout = new HbarTransferLayout(transaction, NETWORK_NODES)

        expect(fullLayout.transaction).toBe(transaction)
        // expect(fullLayout.destinationAmount).toBe(+TransferTotal)
        expect(fullLayout.rowCount).toBe(3)
        expect(fullLayout.sources.length).toBe(1)
        expect(fullLayout.destinations.length).toBe(3)

        const s0 = fullLayout.sources[0]
        expect(s0.transfer.account).toBe("0.0.1784243")
        expect(s0.transfer.amount).toBe(-118046)
        expect(s0.description).toBe(null)
        expect(s0.payload).toBe(true)

        const d0 = fullLayout.destinations[0]
        expect(d0.transfer.account).toBe("0.0.1934439")
        expect(d0.transfer.amount).toBe(+15)
        expect(d0.description).toBe("Transfer")
        expect(d0.payload).toBe(true)

        const d1 = fullLayout.destinations[1]
        expect(d1.transfer.account).toBe("0.0.3")
        expect(d1.transfer.amount).toBe(+4798)
        expect(d1.description).toBe("Node fee (Hedera)")
        expect(d1.payload).toBe(false)

        const d2 = fullLayout.destinations[2]
        expect(d2.transfer.account).toBe("0.0.98")
        expect(d2.transfer.amount).toBe(+113233)
        expect(d2.description).toBe("Hedera fee collection account")
        expect(d2.payload).toBe(false)

        //
        // COMPACT
        //

        const compactLayout = new HbarTransferLayout(transaction, NETWORK_NODES, false)

        expect(compactLayout.transaction).toBe(transaction)
        expect(compactLayout.destinationAmount).toBe(+15)
        expect(compactLayout.rowCount).toBe(1)
        expect(compactLayout.sources.length).toBe(1)
        expect(compactLayout.destinations.length).toBe(1)

        const cs0 = compactLayout.sources[0]
        expect(cs0.transfer.account).toBe("0.0.1784243")
        expect(cs0.transfer.amount).toBe(-118046)
        expect(cs0.description).toBe(null)
        expect(cs0.payload).toBe(true)

        const cd0 = compactLayout.destinations[0]
        expect(cd0.transfer.account).toBe("0.0.1934439")
        expect(cd0.transfer.amount).toBe(+15)
        expect(cd0.description).toBe("Transfer")
        expect(cd0.payload).toBe(true)
    })
})
