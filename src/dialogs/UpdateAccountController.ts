// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref, watch, WatchStopHandle} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {AccountTextFieldController, AccountTextFieldState} from "@/dialogs/common/AccountTextFieldController.ts";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts"
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache.ts";
import {TokenRelationshipCache} from "@/utils/cache/TokenRelationshipCache.ts";
import {AccountUpdateTransaction} from "@hashgraph/sdk";
import {walletManager} from "@/utils/RouteManager.ts";

export enum PeriodUnit {
    Seconds = "seconds",
    Days = 'days',
}

export enum AutoAssociationMode {
    UnlimitedAutoAssociation = -1,
    LimitedAutoAssociation = 1,
    NoAutoAssociation = 0
}

export enum StakeChoice {
    NotStaking = "not-staking",
    StakeToNode = "node",
    StakeToAccount = "account"
}


export class UpdateAccountController extends TransactionController {

    public readonly memoInputText: Ref<string> = ref("")
    public readonly autoRenewPeriodQuantityInputText: Ref<number> = ref(0)
    public readonly newAutoRenewPeriodUnit: Ref<PeriodUnit> = ref(PeriodUnit.Seconds)
    public readonly autoAssociationMode: Ref<AutoAssociationMode> = ref(AutoAssociationMode.UnlimitedAutoAssociation)
    public readonly maxAutoAssociationInputText: Ref<number> = ref(0)
    public readonly newRecSigRequired: Ref<boolean> = ref(false)
    public readonly stakeChoice: Ref<StakeChoice> = ref(StakeChoice.NotStaking)
    public readonly newStakedNodeId: Ref<number> = ref(0)
    public readonly newDeclineReward: Ref<boolean> = ref(false)
    public readonly stakedAccountIdInputText: Ref<string>

    private readonly stakedAccountIdController: AccountTextFieldController

    private readonly networkAnalyzer = new NetworkAnalyzer()
    public readonly nodes = this.networkAnalyzer.nodes

    private readonly accountId = computed(() => walletManager.accountId.value)
    private readonly accountLookup = AccountByIdCache.instance.makeLookup(this.accountId)
    private readonly relationshipLookup = TokenRelationshipCache.instance.makeLookup(this.accountId)

    private watchStopHandles: WatchStopHandle[] = []

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>,
                       networkConfig: NetworkConfig) {
        super(showDialog)

        this.stakedAccountIdController = new AccountTextFieldController(
            this.oldStakedAccountId, networkConfig)
        this.stakedAccountIdInputText = this.stakedAccountIdController.inputText
    }

    public readonly feedbackMessage = computed(
        () => this.memoFeedbackMessage.value
            ?? this.autoRenewPeriodFeedbackMessage.value
            ?? this.maxAutoAssociationFeedbackMessage.value
            ?? this.recSigRequiredFeedkbackMessage.value
            ?? this.stakingFeedbackMessage.value
            ?? this.declineRewardFeedbackMessage.value)

    //
    // TransactionController
    //

    public canBeExecuted(): boolean {
        return this.isValid.value && this.isEdited.value
    }

    protected async executeTransaction(): Promise<string | null> {

        const transaction = new AccountUpdateTransaction()
        if (this.memoInputText.value !== this.oldMemo.value) {
            transaction.setAccountMemo(this.memoInputText.value)
        }
        if (this.newMaxAutoAssociation.value !== this.oldAutoAssociationMode.value) {
            transaction.setMaxAutomaticTokenAssociations(this.newMaxAutoAssociation.value)
        }
        if (this.newRecSigRequired.value !== this.oldRecSigRequired.value) {
            transaction.setReceiverSignatureRequired(this.newRecSigRequired.value)
        }
        if (this.newAutoRenewPeriod.value !== this.oldAutoRenewPeriod.value) {
            transaction.setAutoRenewPeriod(this.newAutoRenewPeriod.value)
        }
        if (this.stakeChoice.value !== this.oldStakeChoice.value
            || this.newStakedNodeId.value !== this.oldStakedNodeId.value
            || this.newStakedAccountId.value !== this.oldStakedAccountId.value) {
            switch (this.stakeChoice.value) {
                case StakeChoice.StakeToNode:
                    transaction.setStakedNodeId(this.newStakedNodeId.value)
                    break
                case StakeChoice.StakeToAccount:
                    transaction.setStakedAccountId(this.newStakedAccountId.value!)
                    break
                case StakeChoice.NotStaking:
                    transaction.setStakedNodeId(-1)
                    transaction.setStakedAccountId("0.0.0")
                    break
            }
        }
        if (this.newDeclineReward.value !== this.oldDeclineReward.value) {
            transaction.setDeclineStakingReward(this.newDeclineReward.value)
        }

        return walletManager.updateAccount(transaction)
    }

    protected dialogStartShowing(): void {
        this.networkAnalyzer.mount()
        this.stakedAccountIdController.mount()
        this.accountLookup.mount()
        this.relationshipLookup.mount()
        this.watchStopHandles = [
            watch(this.oldAccountInfo, this.oldAccountInfoDidChange, {immediate: true}),
            watch(this.newAutoRenewPeriodUnit, this.autoRenewPeriodUnitDidChange, {immediate: true})
        ]
    }

    protected dialogStopShowing(): void {
        this.networkAnalyzer.unmount()
        this.stakedAccountIdController.unmount()
        this.accountLookup.unmount()
        this.relationshipLookup.unmount()
        this.watchStopHandles.map((wh) => wh())
        this.watchStopHandles = []
    }


    //
    // Private
    //

    private readonly isValid = computed(() => {
        let result = true
        result = result && this.memoValid.value
        result = result && this.autoRenewPeriodValid.value
        result = result && this.maxAutoAssociationValid.value
        result = result && this.recSigRequiredValid.value
        result = result && this.stakingValid.value
        result = result && this.declineRewardValid.value
        return result
    })

    private readonly isEdited = computed(() => {
        let result = false
        result = result || this.memoEdited.value
        result = result || this.autoRenewPeriodEdited.value
        result = result || this.maxAutoAssociationEdited.value
        result = result || this.recSigRequiredEdited.value
        result = result || this.stakingEdited.value
        result = result || this.declineRewardEdited.value
        return result
    })

    private readonly oldAccountInfo = computed(() => this.accountLookup.entity.value)

    private readonly oldAccountInfoDidChange = () => {
        this.memoInputText.value = this.oldAccountInfo.value?.memo ?? ""
        this.autoRenewPeriodQuantityInputText.value = this.oldAutoRenewPeriod.value ?? this.MIN_AUTO_RENEW_PERIOD
        this.maxAutoAssociationInputText.value = this.oldAutoAssociation.value ?? 0
        this.autoAssociationMode.value = this.oldAutoAssociationMode.value ?? AutoAssociationMode.NoAutoAssociation
        this.newRecSigRequired.value = this.oldRecSigRequired.value ?? false
        this.stakeChoice.value = this.oldStakeChoice.value
        this.newStakedNodeId.value = this.oldStakedNodeId.value ?? 0
        this.stakedAccountIdInputText.value = this.oldStakedAccountId.value ?? ""
        this.newDeclineReward.value = this.oldDeclineReward.value ?? false
    }

    //
    // Private (memo)
    //

    private readonly memoValid = computed(() => true)

    private readonly memoEdited = computed(
        () => this.oldMemo.value !== null && this.oldMemo.value !== this.memoInputText.value)

    private readonly memoFeedbackMessage = computed(() => null)

    private readonly oldMemo = computed(() => this.oldAccountInfo.value?.memo ?? null)


    //
    // Private (auto renew period)
    //

    private readonly MAX_AUTO_RENEW_PERIOD = 8000001 // seconds
    private readonly MIN_AUTO_RENEW_PERIOD = 2592000 // seconds

    private readonly autoRenewPeriodValid = computed(() => {
        const p = this.newAutoRenewPeriod.value
        return this.MIN_AUTO_RENEW_PERIOD <= p && p <= this.MAX_AUTO_RENEW_PERIOD
    })

    private readonly autoRenewPeriodEdited = computed(
        () => this.oldAutoRenewPeriod.value !== this.newAutoRenewPeriod.value)

    private readonly oldAutoRenewPeriod = computed(
        () => this.oldAccountInfo.value?.auto_renew_period ?? null)

    private readonly newAutoRenewPeriod = computed(() => {
        const quantity = this.autoRenewPeriodQuantityInputText.value
        const unit = this.newAutoRenewPeriodUnit.value
        return unit === PeriodUnit.Days ? quantity * 86400 : quantity
    })

    private readonly autoRenewPeriodUnitDidChange = (newValue: PeriodUnit) => {
        const p = this.autoRenewPeriodQuantityInputText.value
        switch (newValue) {
            case PeriodUnit.Days:
                this.autoRenewPeriodQuantityInputText.value = Math.round(p / 86400)
                break
            case PeriodUnit.Seconds:
                this.autoRenewPeriodQuantityInputText.value = p * 86400
                break
        }
    }

    private readonly autoRenewPeriodFeedbackMessage = computed(() => {
        let result: string | null
        if (this.autoRenewPeriodValid.value) {
            result = null
        } else {
            switch (this.newAutoRenewPeriodUnit.value) {
                case PeriodUnit.Days:
                    result = "Auto Renew Period must be comprised between 30 and 92 days."
                    break
                case PeriodUnit.Seconds:
                    result = `Auto Renew Period must be comprised between ${this.MIN_AUTO_RENEW_PERIOD} and ${this.MAX_AUTO_RENEW_PERIOD} seconds.`
                    break
            }
        }
        return result
    })

    //
    // Private (max auto association)
    //

    private readonly maxAutoAssociationValid = computed(() => {
        let result: boolean
        switch (this.autoAssociationMode.value) {
            case AutoAssociationMode.NoAutoAssociation: {
                const usedAutoAssociationCount = this.usedAutoAssociationCount.value
                result = usedAutoAssociationCount == 0
                break
            }
            case AutoAssociationMode.LimitedAutoAssociation: {
                const requestAutoAssociationCount = this.maxAutoAssociationInputText.value
                const usedAutoAssociationCount = this.usedAutoAssociationCount.value
                result = usedAutoAssociationCount !== null && requestAutoAssociationCount >= usedAutoAssociationCount
                break
            }
            case AutoAssociationMode.UnlimitedAutoAssociation: {
                result = true
                break
            }
        }
        return result
    })

    private readonly maxAutoAssociationEdited = computed(
        () => this.oldAutoAssociation.value !== this.newMaxAutoAssociation.value)

    private readonly oldAutoAssociation = computed(
        () => this.oldAccountInfo.value?.max_automatic_token_associations ?? null)

    private readonly oldAutoAssociationMode = computed(() => {
        let result: AutoAssociationMode | null
        switch (this.oldAutoAssociation.value) {
            case null:
                result = null
                break
            case 0:
                result = AutoAssociationMode.NoAutoAssociation
                break
            case -1:
                result = AutoAssociationMode.UnlimitedAutoAssociation
                break
            default:
                result = AutoAssociationMode.LimitedAutoAssociation
                break
        }
        return result
    })

    private readonly newMaxAutoAssociation = computed(() => {
        let result: number
        switch (this.autoAssociationMode.value) {
            case AutoAssociationMode.NoAutoAssociation:
                result = 0
                break
            case AutoAssociationMode.LimitedAutoAssociation:
                result = this.maxAutoAssociationInputText.value
                break
            case AutoAssociationMode.UnlimitedAutoAssociation:
                result = -1
        }
        return result
    })

    private readonly usedAutoAssociationCount = computed(() => {
        let result: number | null
        if (this.relationshipLookup.isLoaded.value) {
            result = 0
            for (const r of this.relationshipLookup.entity.value ?? []) {
                if (r.automatic_association) {
                    result += 1
                }
            }
        } else {
            result = null
        }
        return result
    })

    private readonly maxAutoAssociationFeedbackMessage = computed(() => {
        let result: string | null
        switch (this.autoAssociationMode.value) {
            case AutoAssociationMode.NoAutoAssociation: {
                const requestAutoAssociationCount = 0
                const usedAutoAssociationCount = this.usedAutoAssociationCount.value
                if (usedAutoAssociationCount !== null && requestAutoAssociationCount < usedAutoAssociationCount) {
                    result = `Your account already uses ${usedAutoAssociationCount} automatic associations.`
                } else {
                    result = null
                }
                break
            }
            case AutoAssociationMode.UnlimitedAutoAssociation:
                result = null
                break
            case AutoAssociationMode.LimitedAutoAssociation: {
                const requestAutoAssociationCount = this.maxAutoAssociationInputText.value
                const usedAutoAssociationCount = this.usedAutoAssociationCount.value
                if (usedAutoAssociationCount !== null && requestAutoAssociationCount < usedAutoAssociationCount) {
                    result = `Your account already uses ${usedAutoAssociationCount} automatic associations.`
                } else {
                    result = null
                }
                break
            }
        }
        return result
    })

    //
    // Private (receiver signature required)
    //

    private readonly recSigRequiredValid = computed(() => true)

    private readonly recSigRequiredEdited = computed(
        () => this.oldRecSigRequired.value !== this.newRecSigRequired.value)

    private readonly oldRecSigRequired = computed(() => this.oldAccountInfo.value?.receiver_sig_required ?? null)

    private readonly recSigRequiredFeedkbackMessage = computed(() => null)

    //
    // Private (staking)
    //

    private readonly stakingValid = computed(() => {
        let result: boolean
        switch (this.stakeChoice.value) {
            case StakeChoice.NotStaking:
            case StakeChoice.StakeToNode:
                result = true
                break
            case StakeChoice.StakeToAccount:
                result = this.newStakedAccountId.value !== null
                    && this.newStakedAccountId.value !== walletManager.accountId.value
                break
        }
        return result
    })

    private readonly stakingEdited = computed(() => {
        let result: boolean
        switch (this.stakeChoice.value) {
            case StakeChoice.NotStaking:
                result = this.oldStakeChoice.value !== StakeChoice.NotStaking
                break
            case StakeChoice.StakeToNode:
                result = this.oldStakeChoice.value !== StakeChoice.StakeToNode
                    || this.oldStakedNodeId.value !== this.newStakedNodeId.value
                break
            case StakeChoice.StakeToAccount:
                result = this.oldStakeChoice.value !== StakeChoice.StakeToAccount
                    || this.oldStakedAccountId.value !== this.newStakedAccountId.value
                break
        }
        return result
    })

    private readonly oldStakedNodeId = computed(
        () => this.oldAccountInfo.value?.staked_node_id ?? null)

    private readonly oldStakedAccountId = computed(
        () => this.oldAccountInfo.value?.staked_account_id ?? null)

    private readonly oldStakeChoice = computed(() => {
        let result: StakeChoice
        if (this.oldStakedNodeId.value !== null) {
            result = StakeChoice.StakeToNode
        } else if (this.oldStakedAccountId.value !== null) {
            result = StakeChoice.StakeToAccount
        } else {
            result = StakeChoice.NotStaking
        }
        return result
    })

    private readonly newStakedAccountId = computed(
        () => this.stakedAccountIdController.newAccountId.value)

    private readonly stakingFeedbackMessage = computed(() => {
        let result: string | null
        switch (this.stakeChoice.value) {
            case StakeChoice.NotStaking:
            case StakeChoice.StakeToNode:
                result = null
                break
            case StakeChoice.StakeToAccount:
                if (this.stakedAccountIdController.isLoaded.value) {
                    switch (this.stakedAccountIdController.state.value) {
                        case AccountTextFieldState.empty:
                            result = null
                            break
                        case AccountTextFieldState.invalidChecksum:
                            result = "Invalid account checksum"
                            break
                        case AccountTextFieldState.invalid:
                            result = "Unknown account ID"
                            break
                        case AccountTextFieldState.ok:
                            if (this.stakedAccountIdController.newAccountId.value === walletManager.accountId.value) {
                                result = "Staking needs to be to a different account"
                            } else {
                                result = null
                            }
                            break
                    }
                } else {
                    result = null
                }
                break
        }

        return result
    })

    //
    // Private (declineReward)
    //

    public readonly declineRewardValid = computed(() => true)

    public readonly declineRewardEdited = computed(
        () => this.stakeChoice.value == StakeChoice.StakeToNode
            && this.oldDeclineReward.value !== this.newDeclineReward.value)

    public readonly oldDeclineReward = computed(() => this.oldAccountInfo.value?.decline_reward ?? null)

    public readonly declineRewardFeedbackMessage = computed(() => null)
}
