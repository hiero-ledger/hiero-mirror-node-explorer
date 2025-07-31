// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

import {describe, expect, test} from 'vitest'
import {ref} from "vue";
import {TransactionDownloader} from "@/utils/downloader/TransactionDownloader";
import {TransactionType} from "@/schemas/MirrorNodeSchemas";
import {DownloaderState} from "@/utils/downloader/EntityDownloader";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("TransactionDownloader.ts", () => {

    test("no mock", async () => {

        const mock = new MockAdapter(axios as any);

        // Constructs
        const accountId = ref<string | null>(null)
        const startDate = ref<Date | null>(null)
        const endDate = ref<Date | null>(null)
        const transactionType = ref<TransactionType | null>(null)
        const d = new TransactionDownloader(accountId, startDate, endDate, transactionType, 1500)
        expect(d.startDate).toBe(startDate)
        expect(d.endDate).toBe(endDate)
        expect(d.maxEntityCount).toBe(1500)
        expect(d.entities.value.length).toBe(0)
        expect(d.state.value).toBe(DownloaderState.Fresh)
        expect(d.downloadedCount.value).toBe(0)
        expect(d.firstDownloadedEntity.value).toBeNull()
        expect(d.lastDownloadedEntity.value).toBeNull()
        expect(d.drained.value).toBe(false)
        expect(d.failureReason.value).toBeNull()
        expect(d.lastDownloadedEntityDate.value).toBeNull()
        expect(d.progress.value).toBe(0)
        expect(d.getOutputName("dummy")).toBe("")
        expect(d.csvBlob.value).toBeNull()

        expect(mock.history.get.length).toBe(0)

        // Runs before setup
        await d.run()
        expect(d.startDate).toBe(startDate)
        expect(d.endDate).toBe(endDate)
        expect(d.maxEntityCount).toBe(1500)
        expect(d.entities.value.length).toBe(0)
        expect(d.state.value).toBe(DownloaderState.Failure)
        expect(d.downloadedCount.value).toBe(0)
        expect(d.firstDownloadedEntity.value).toBeNull()
        expect(d.lastDownloadedEntity.value).toBeNull()
        expect(d.drained.value).toBe(false)
        expect(d.failureReason.value).toBe(d.wrongSetupError)
        expect(d.lastDownloadedEntityDate.value).toBeNull()
        expect(d.progress.value).toBe(0)
        expect(d.getOutputName("dummy")).toBe("")
        expect(d.csvBlob.value).toBeNull()

        expect(mock.history.get.length).toBe(0)

        // Sets up and runs
        d.accountId.value = "0.0.98"
        d.startDate.value = new Date("2024-03-01")
        d.endDate.value = new Date("2024-03-02")
        await d.run()
        expect(d.startDate).toBe(startDate)
        expect(d.endDate).toBe(endDate)
        expect(d.maxEntityCount).toBe(1500)
        expect(d.entities.value.length).toBe(0)
        expect(d.state.value).toBe(DownloaderState.Failure)
        expect(d.downloadedCount.value).toBe(0)
        expect(d.firstDownloadedEntity.value).toBeNull()
        expect(d.lastDownloadedEntity.value).toBeNull()
        expect(d.drained.value).toBe(false)
        expect(d.failureReason.value).not.toBeNull()
        expect(d.lastDownloadedEntityDate.value).toBeNull()
        expect(d.progress.value).toBe(0)
        expect(d.getOutputName("dummy")).toBe("Hedera Transactions 0.0.98 03/01/2024 to 03/02/2024.csv")
        expect(d.csvBlob.value).toBeNull()

        expect(mock.history.get.length).toBe(1)
        expect(mock.history.get[0].url).toBe("api/v1/transactions?account.id=0.0.98&order=asc&timestamp=gte:1709251200.000000000&timestamp=lt:1709337600.000000000&limit=100")
    })
})
