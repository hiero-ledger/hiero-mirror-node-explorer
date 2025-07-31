// SPDX-License-Identifier: Apache-2.0

import {compareTransferByAccount, Transaction, TransactionType} from "@/schemas/MirrorNodeSchemas";
import {CSVEncoder} from "@/utils/CSVEncoder";
import {AbstractTransactionDownloader} from "@/utils/downloader/AbstractTransationDownloader";
import {Ref} from "vue";

export class TransactionDownloader extends AbstractTransactionDownloader {

    //
    // Public
    //

    public constructor(accountId: Ref<string | null>,
                       startDate: Ref<Date | null>,
                       endDate: Ref<Date | null>,
                       transactionType: Ref<TransactionType | null>,
                       maxTransactionCount: number) {
        super(accountId, transactionType, startDate, endDate, maxTransactionCount)
    }

    //
    // AbstractTransactionDownloader
    //

    protected makeCSVEncoder(dateFormat: Intl.DateTimeFormat): CSVEncoder<Transaction> {
        return new TransactionEncoder(this.entities.value, dateFormat)
    }

    protected makeOutputPrefix(): string {
        return this.accountId.value !== null ? "Hedera Transactions " + this.accountId.value : ""
    }
}

export class TransactionEncoder extends CSVEncoder<Transaction> {

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
