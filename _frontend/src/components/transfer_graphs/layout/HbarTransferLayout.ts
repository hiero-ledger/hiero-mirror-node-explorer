// SPDX-License-Identifier: Apache-2.0

import {compareTransferByAccount, NetworkNode, Transaction, Transfer} from "@/schemas/MirrorNodeSchemas";
import {isFeeTransfer, makeOperatorDescription} from "@/schemas/MirrorNodeUtils.ts";
import {computeNetAmount, makeNetOfRewards} from "@/utils/TransactionTools";

export class HbarTransferLayout {

    public readonly transaction: Transaction | undefined
    public readonly nodes: NetworkNode[]
    public readonly destinationAmount: number
    public readonly sources = Array<HbarTransferRow>()
    public readonly destinations = Array<HbarTransferRow>()
    public readonly rowCount: number

    //
    // Public
    //

    public constructor(transaction: Transaction | undefined, nodes: NetworkNode[], full = true) {

        this.transaction = transaction
        this.nodes = nodes
        let transfersNetOfRewards = Array<Transfer>()

        if (this.transaction?.transfers) {
            transfersNetOfRewards = makeNetOfRewards(this.transaction.transfers, this.transaction.staking_reward_transfers)

            const negativeTransfers = new Array<Transfer>()
            const positiveTransfers = new Array<Transfer>()
            for (const t of transfersNetOfRewards) {
                if (t.amount < 0) {
                    negativeTransfers.push(t)
                } else {
                    positiveTransfers.push(t)
                }
            }
            negativeTransfers.sort(compareTransferByAccount)
            positiveTransfers.sort(compareTransferByAccount)

            for (const t of negativeTransfers) {
                const isFee = isFeeTransfer(t, this.nodes)
                this.sources.push(new HbarTransferRow(t, null, !isFee))
            }
            for (const t of positiveTransfers) {
                const isFee = isFeeTransfer(t, this.nodes)
                const operator = t.account ? makeOperatorDescription(t.account, this.nodes) : null
                this.destinations.push(new HbarTransferRow(t, operator ?? "Transfer", !isFee))
            }
        }

        // Makes sure net amount is distributed across payload transfers
        let remaining = this.transaction ? computeNetAmount(transfersNetOfRewards, this.transaction.charged_tx_fee) : 0
        // First we remove amount from payload transfers
        for (const r of this.destinations) {
            if (r.payload) {
                remaining -= r.transfer.amount
            }
        }
        // If remaining > 0 then we distribute the amount across non payload transfers
        if (remaining > 0) {
            for (const r of this.destinations.slice()) {
                if (!r.payload) {
                    const payloadAmount = Math.min(r.transfer.amount, remaining)
                    const feeAmount = r.transfer.amount - payloadAmount
                    // Removes existing transfer
                    const i = this.destinations.indexOf(r)
                    // assert(i != -1)
                    const replacedTransfer = this.destinations[i]
                    this.destinations.splice(i, 1)
                    // Inserts two new transfers
                    const payloadTransfer = {...r.transfer};
                    payloadTransfer.amount = payloadAmount
                    const payloadRow =
                        new HbarTransferRow(
                            payloadTransfer,
                            makeOperatorDescription(replacedTransfer.transfer.account ?? "", this.nodes),
                            true)
                    this.destinations.splice(i, 0, payloadRow)
                    if (feeAmount > 0) {
                        const feeTransfer = {...r.transfer};
                        feeTransfer.amount = feeAmount
                        const feeRow = new HbarTransferRow(feeTransfer, replacedTransfer.description, false)
                        this.destinations.splice(i + 1, 0, feeRow)
                    }
                    remaining -= payloadAmount
                    if (remaining <= 0) break
                }
            }
        }


        if (!full) {
            // We remove "fee" rows (ie rows with payload == false)
            const sRemovalCount = HbarTransferLayout.removeFeeRows(this.sources)
            const dRemovalCount = HbarTransferLayout.removeFeeRows(this.destinations)
            if ((sRemovalCount >= 1 && this.sources.length == 0) ||
                (dRemovalCount >= 1 && this.destinations.length == 0)) {
                // Sources or destinations or both are all "fees"
                this.sources.splice(0)
                this.destinations.splice(0)
            }
        }

        this.destinationAmount = 0
        for (const r of this.destinations) {
            this.destinationAmount += r.transfer.amount
        }

        this.rowCount = Math.max(this.sources.length, this.destinations.length)
    }

    //
    // Private
    //

    private static removeFeeRows(rows: HbarTransferRow[]): number {
        let result = 0
        let i = 0
        while (i < rows.length) {
            if (rows[i].payload) {
                i += 1
            } else {
                rows.splice(i, 1)
                result += 1
            }
        }
        return result
    }
}

export class HbarTransferRow {
    public readonly transfer: Transfer
    public readonly description: string | null
    public readonly payload: boolean

    constructor(transfer: Transfer, description: string | null, payload: boolean) {
        this.transfer = transfer
        this.description = description
        this.payload = payload

    }
}
