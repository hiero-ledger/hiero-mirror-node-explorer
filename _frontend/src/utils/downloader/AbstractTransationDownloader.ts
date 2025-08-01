// SPDX-License-Identifier: Apache-2.0

import {Transaction, TransactionResponse, TransactionType} from "@/schemas/MirrorNodeSchemas";
import {dateToTimestamp, EntityDownloader} from "@/utils/downloader/EntityDownloader";
import axios, {AxiosResponse} from "axios";
import {Ref, watch} from "vue";

export abstract class AbstractTransactionDownloader extends EntityDownloader<Transaction, TransactionResponse> {

    public readonly accountId: Ref<string | null>
    public readonly transactionType: Ref<TransactionType | null>

    public readonly wrongSetupError = new Error("this.accountId or this.startDate not set")

    //
    // EntityDownloader
    //

    protected async loadNext(nextURL: string | null): Promise<AxiosResponse<TransactionResponse>> {

        if (nextURL == null) {
            if (this.accountId.value !== null && this.startDate.value !== null) {
                const startTimestamp = dateToTimestamp(this.startDate.value)
                const endTimestamp = this.endDate.value !== null ? dateToTimestamp(this.endDate.value) : null

                nextURL = "api/v1/transactions"
                    + "?account.id=" + this.accountId.value
                    + "&order=asc"
                    + "&timestamp=gte:" + startTimestamp
                if (endTimestamp !== null) {
                    nextURL += "&timestamp=lt:" + endTimestamp
                }
                if (this.transactionType.value !== null) {
                    nextURL += "&transactiontype=" + this.transactionType.value
                }
                nextURL += "&limit=100"
            } else {
                throw this.wrongSetupError
            }
        }

        return axios.get<TransactionResponse>(nextURL)
    }

    protected fetchEntities(response: TransactionResponse): Transaction[] {
        return response.transactions ?? []
    }

    protected nextURL(response: TransactionResponse): string | null {
        return response.links?.next ?? null
    }

    protected entityTimestamp(entity: Transaction): string | null {
        return entity.consensus_timestamp ?? null
    }


    //
    // Protected
    //

    protected constructor(accountId: Ref<string | null>,
                          transactionType: Ref<TransactionType | null>,
                          startDate: Ref<Date | null>,
                          endDate: Ref<Date | null>,
                          maxTransactionCount: number) {
        super(startDate, endDate, maxTransactionCount)
        this.accountId = accountId
        this.transactionType = transactionType
        watch(this.accountId, () => {
            this.abort().then()
        })
    }
}
