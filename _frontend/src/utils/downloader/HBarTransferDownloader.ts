// SPDX-License-Identifier: Apache-2.0

import {compareTransferByAccount, Transaction, TransactionType} from "@/schemas/MirrorNodeSchemas";
import {CSVEncoder} from "@/utils/CSVEncoder";
import {computed, Ref} from "vue";
import {AbstractTransactionDownloader} from "@/utils/downloader/AbstractTransationDownloader";

export class HbarTransferDownloader extends AbstractTransactionDownloader {

    //
    // Public
    //

    public constructor(accountId: Ref<string | null>,
                       startDate: Ref<Date | null>,
                       endDate: Ref<Date | null>,
                       maxTransactionCount: number) {
        super(accountId, computed(() => TransactionType.CRYPTOTRANSFER), startDate, endDate, maxTransactionCount)
    }

    //
    // EntityDownloader
    //

    protected filter(transactions: Transaction[]): Transaction[] {
        const result: Transaction[] = []

        for (const t of transactions) {
            let totalAmount = 0
            for (const transfer of t.transfers) {
                if (transfer.amount > 0) {
                    totalAmount += transfer.amount
                }
            }
            const match = totalAmount > t.charged_tx_fee
            if (match) {
                result.push(t)
            }
        }

        return result
    }

    protected makeCSVEncoder(dateFormat: Intl.DateTimeFormat): CSVEncoder<Transaction> {
        return new HbarTransferEncoder(this.entities.value, dateFormat)
    }

    protected makeOutputPrefix(cryptoName: string): string {
        return this.accountId.value !== null ? `Hedera ${cryptoName} Transfers` : ""
    }
}

export class HbarTransferEncoder extends CSVEncoder<Transaction> {

    //
    // CSVEncoder
    //

    protected encodeEntity(t: Transaction): string[][] {
        const result: string[][] = []
        const timestamp = t.consensus_timestamp ? this.formatTimestamp(t.consensus_timestamp) : ""
        const transactionID = t.transaction_id ?? ""
        const type = t.name ?? ""
        const sortedTransfers = t.transfers?.slice() ?? []
        sortedTransfers.sort(compareTransferByAccount)
        for (const transfer of sortedTransfers) {
            const amount = transfer.amount ? this.formatAmount(transfer.amount) : ""
            const accountId = transfer.account ?? ""
            const fromAccountId = transfer.amount < 0 ? accountId : ""
            const toAccountId = transfer.amount >= 0 ? accountId : ""
            result.push([timestamp, fromAccountId, toAccountId, amount, transactionID, type])
        }
        return result
    }

    protected encodeHeaderRow(): string[] | null {
        return ["#date", "#from_account_id", "#to_account_id", "#amount", "#transaction_id", "#transaction_type"]
    }
}
