// SPDX-License-Identifier: Apache-2.0

import {
    compareTokenTransferByTokenId,
    compareTransferByAccount,
    TokenTransfer,
    Transaction
} from "@/schemas/MirrorNodeSchemas";

export class TokenTransferLayout {

    public readonly tokenId: string | null
    public readonly sources = Array<TokenTransfer>()
    public readonly destinations = Array<TokenTransfer>()
    public readonly descriptions = Array<string>()
    public readonly netAmount: number
    public readonly rowCount: number

    public constructor(tokenId: string | null, transfers: Array<TokenTransfer>) {

        this.tokenId = tokenId

        let balance = 0
        for (const t of transfers) {
            if (t.amount < 0) {
                this.sources.push(t)
            } else {
                this.destinations.push(t)
            }
            balance += t.amount
        }
        if (balance < 0) {
            // We add a destination transfer to null account id
            this.destinations.push({account: null, amount: -balance, token_id: tokenId, is_approval: false})
        } else if (balance > 0) {
            // We add a source transfer from null account id
            this.sources.push({account: null, amount: -balance, token_id: tokenId, is_approval: false})
        }

        let netAmount = 0
        for (const t of this.destinations) {
            netAmount += t.amount
        }
        this.netAmount = netAmount
        this.rowCount = Math.max(this.sources.length, this.destinations.length)

        const nonNullSourceAccount = TokenTransferLayout.countNonNullAcounts(this.sources)
        for (const d of this.destinations) {
            if (nonNullSourceAccount == 0 || d.account === null) {
                this.descriptions.push("")
            } else {
                this.descriptions.push("Transfer")
            }
        }
    }

    public static make(transaction: Transaction | undefined): Array<TokenTransferLayout> {
        const result = new Array<TokenTransferLayout>()

        const transferSplit = TokenTransferLayout.splitByTokenID(transaction?.token_transfers ?? [])
        for (const [tid, t] of transferSplit) {
            result.push(new TokenTransferLayout(tid, t))
        }

        return result
    }

    //
    // Private
    //

    private static splitByTokenID(transfers: Array<TokenTransfer>): Map<string | null, Array<TokenTransfer>> {
        const result = new Map<string | null, Array<TokenTransfer>>()

        if (transfers.length >= 1) {
            transfers.sort(compareTokenTransferByTokenId)

            let currentTokenId = transfers[0].token_id
            let currentTransfers = new Array<TokenTransfer>(transfers[0])

            for (let i = 1; i < transfers.length; i += 1) {
                const t = transfers[i]
                if (currentTokenId == t.token_id) {
                    currentTransfers.push(t)
                } else {
                    currentTransfers.sort(compareTransferByAccount)
                    result.set(currentTokenId, currentTransfers)
                    currentTokenId = t.token_id
                    currentTransfers = new Array<TokenTransfer>(t)
                }
            }
            currentTransfers.sort(compareTransferByAccount)
            result.set(currentTokenId, currentTransfers)
        }

        return result
    }

    private static countNonNullAcounts(transfers: Array<TokenTransfer>): number {
        let result = 0
        for (const t of transfers) {
            if (t.account !== null) {
                result += 1
            }
        }
        return result
    }
}
