// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref} from "vue";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {TokenTextFieldController, TokenTextFieldState} from "@/dialogs/common/TokenTextFieldController.ts";
import {TokenTransferDownloader} from "@/utils/downloader/TokenTransferDownloader.ts";
import {AbstractTransactionDownloader} from "@/utils/downloader/AbstractTransationDownloader.ts";
import {NFTTransferDownloader} from "@/utils/downloader/NFTTransferDownloader.ts";
import {HbarTransferDownloader} from "@/utils/downloader/HBarTransferDownloader.ts";
import {TransactionDownloader} from "@/utils/downloader/TransactionDownloader.ts";
import {Transaction, TransactionResponse, TransactionType} from "@/schemas/MirrorNodeSchemas.ts";
import {DownloadController} from "@/dialogs/download/DownloadController.ts";

export class TransactionDownloadController extends DownloadController<Transaction, TransactionResponse> {

    public readonly accountId: Ref<string | null>
    public readonly selectedScope = ref<string>("HBAR TRANSFERS")
    public readonly selectedFilter = ref<string>("CRYPTOTRANSFER")
    public readonly tokenController: TokenTextFieldController
    public readonly selectedStartDate: Ref<Date | null> = ref(null)
    public readonly selectedEndDate: Ref<Date | null> = ref(null)

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, accountId: Ref<string | null>, networkConfig: NetworkConfig) {
        super(showDialog)
        this.accountId = accountId
        this.tokenController = new TokenTextFieldController(ref(null), ref(null), networkConfig)
    }

    public readonly tokenIdRequired = computed(
        () => this.selectedScope.value === 'TOKEN TRANSFERS BY ID'
            || this.selectedScope.value === 'NFT TRANSFERS BY ID'
    )

    public readonly feedbackMessage = computed(
        () => this.tokenFeedbackMessage.value
            ?? this.startDateFeedbackMessage.value
            ?? this.endDateFeedbackMessage.value)

    public readonly downloader = computed(() => {
        let result: AbstractTransactionDownloader
        switch (this.selectedScope.value) {
            case "TOKEN TRANSFERS":
            case "TOKEN TRANSFERS BY ID":
                result = new TokenTransferDownloader(
                    this.accountId, this.startDate, this.endDate,
                    this.tokenController.newTokenId, 1000)
                break

            case "NFT TRANSFERS":
            case "NFT TRANSFERS BY ID":
                result = new NFTTransferDownloader(
                    this.accountId, this.startDate, this.endDate,
                    this.tokenController.newTokenId, 1000)
                break

            case "HBAR TRANSFERS":
                result = new HbarTransferDownloader(
                    this.accountId, this.startDate, this.endDate, 1000)
                break

            default:
                result = new TransactionDownloader(
                    this.accountId, this.startDate, this.endDate,
                    this.transactionType, 1000)
                break
        }
        return result
    })

    //
    // DownloadController
    //

    public getDownloader(): AbstractTransactionDownloader {
        return this.downloader.value
    }

    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        let result = true
        if (this.tokenIdRequired.value) {
            result &&= this.tokenIdValid.value
        }
        result &&= this.isStartDateValid.value
        result &&= this.isEndDateValid.value
        return result
    }

    public async execute(): Promise<void> {
        await this.downloader.value.run()
    }

    protected dialogStartShowing() {
        this.selectedScope.value = "HBAR TRANSFERS"
        this.selectedFilter.value = "CRYPTOTRANSFER"
        this.selectedStartDate.value = new Date()
        this.selectedEndDate.value = new Date()
    }

    //
    // Private (selectedFilter)
    //

    private readonly transactionType = computed(
        () => this.selectedFilter.value !== '' ? this.selectedFilter.value as TransactionType : null)

    //
    // Private (tokenId)
    //

    private readonly tokenIdValid = computed(
        () => this.tokenController.newTokenId.value !== null
            && this.tokenController.newTokenInfo.value !== null)

    private readonly tokenFeedbackMessage = computed(() => {
        let result: string | null
        switch (this.tokenController.state.value) {
            case TokenTextFieldState.empty:
                result = null
                break
            case TokenTextFieldState.invalid:
                result = "Invalid token ID"
                break
            case TokenTextFieldState.ok: {
                const tokenInfo = this.tokenController.newTokenInfo.value
                if (tokenInfo === null && this.tokenController.isLoaded.value) {
                    result = "Unknown token ID"
                } else {
                    result = null
                }
                break
            }
            default:
                result = null
                break
        }
        return result
    })


    //
    // Private (startDate)
    //

    private readonly lastMidnight = new Date(new Date().setHours(0, 0, 0, 0))

    private readonly startDate = computed<Date | null>(() => {
            let result: Date | null
            if (this.selectedStartDate.value != null) {
                result = new Date(this.selectedStartDate.value)
                result.setHours(0, 0, 0, 0)
            } else {
                result = null
            }
            return result
        }
    )

    private readonly isStartDateValid = computed(
        () => this.startDate.value !== null && this.startDate.value <= this.lastMidnight)

    private readonly startDateFeedbackMessage = computed(() => {
        let result: string | null
        if (this.startDate.value !== null && this.startDate.value > this.lastMidnight) {
            result = "Select a start date before " + this.lastMidnight.toLocaleDateString()
        } else {
            result = null
        }
        return result
    })


    //
    // Private (endDate)
    //

    private readonly nextMidnight = new Date(new Date().setHours(24, 0, 0, 0))

    private readonly endDate = computed<Date | null>(() => {
            let result
            if (this.selectedEndDate.value != null) {
                result = new Date(this.selectedEndDate.value)
                result.setHours(24, 0, 0, 0)
            } else {
                result = null
            }
            return result
        }
    )

    private readonly isEndDateValid = computed(
        () => this.endDate.value !== null
            && this.endDate.value <= this.nextMidnight
            && (this.startDate.value == null || this.startDate.value < this.endDate.value)
    )

    private readonly endDateFeedbackMessage = computed(() => {
        let result: string | null
        if (this.endDate.value !== null) {
            if (this.endDate.value > this.nextMidnight) {
                result = "Select an end date before " + this.nextMidnight.toLocaleDateString()
            } else if (this.startDate.value !== null && this.startDate.value >= this.endDate.value) {
                result = "Select an end date after " + this.startDate.value.toLocaleDateString()
            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    })
}

export const scopes = [
    'HBAR TRANSFERS',
    'TOKEN TRANSFERS',
    'TOKEN TRANSFERS BY ID',
    'NFT TRANSFERS',
    'NFT TRANSFERS BY ID',
    'TRANSACTION TYPE'
]
