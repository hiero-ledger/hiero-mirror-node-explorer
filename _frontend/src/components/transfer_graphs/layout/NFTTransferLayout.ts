// SPDX-License-Identifier: Apache-2.0

import {compareNftTransfer, NftTransfer, TransactionDetail} from "@/schemas/MirrorNodeSchemas";

export class NFTTransferLayout {

    public readonly receiver_account_id: string | null | undefined
    public readonly sender_account_id: string | null | undefined
    public readonly token_id: string | null
    public readonly serial_numbers = Array<number>()
    public readonly description: string

    //
    // Public
    //

    public static make(transaction: TransactionDetail | undefined): Array<NFTTransferLayout> {

        const transfers = transaction?.nft_transfers ?? []
        transfers.sort(compareNftTransfer)

        const result = Array<NFTTransferLayout>()
        if (transfers.length >= 1) {
            let g = new NFTTransferLayout(transfers[0])
            for (let i = 1; i < transfers.length; i += 1) {
                const t = transfers[i]
                if (g.receiver_account_id == t.receiver_account_id &&
                    g.sender_account_id == t.sender_account_id &&
                    g.token_id == t.token_id) {
                    g.serial_numbers.push(t.serial_number)
                } else {
                    result.push(g)
                    g = new NFTTransferLayout(t)
                }
            }
            result.push(g)
        }

        return result
    }

    //
    // Private
    //

    constructor(t: NftTransfer) {
        this.receiver_account_id = t.receiver_account_id
        this.sender_account_id = t.sender_account_id
        this.token_id = t.token_id
        this.serial_numbers = [t.serial_number]
        this.description = t.receiver_account_id !== null && t.sender_account_id !== null ? "Transfer" : ""
    }

}
