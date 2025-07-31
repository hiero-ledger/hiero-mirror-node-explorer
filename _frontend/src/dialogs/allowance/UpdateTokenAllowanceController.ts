// SPDX-License-Identifier: Apache-2.0

import {computed, Ref, watch} from "vue";
import {ethers} from "ethers";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {
    TokenAmountTextFieldController,
    TokenAmountTextFieldState
} from "@/dialogs/common/TokenAmountTextFieldController.ts";
import {TokenAllowance} from "@/schemas/MirrorNodeSchemas.ts";

import {walletManager} from "@/utils/RouteManager.ts";

export class UpdateTokenAllowanceController extends TransactionController {

    public readonly tokenAmountInput: Ref<string>
    private readonly tokenAmountController: TokenAmountTextFieldController

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, public readonly tokenAllowance: Ref<TokenAllowance | null>) {
        super(showDialog)
        this.tokenAmountController = new TokenAmountTextFieldController(this.tokenId, true)
        this.tokenAmountInput = this.tokenAmountController.input
        watch(this.currentUserAmount, this.currentUserAmountDidChange, {immediate: true})
    }

    public readonly spenderId = computed(() => this.tokenAllowance.value?.spender ?? null)

    public readonly tokenId = computed(() => this.tokenAllowance.value?.token_id ?? null)

    public readonly currentTinyAmount = computed(() => {
        const a = this.tokenAllowance.value?.amount_granted
        return a ? BigInt(a) : null
    })

    public readonly currentUserAmount = computed(() => {
        let result: string | null
        const currentTinyAmount = this.currentTinyAmount.value
        const decimals = this.tokenAmountController.decimals.value
        if (currentTinyAmount !== null && decimals !== null) {
            result = ethers.formatUnits(currentTinyAmount, decimals)
        } else {
            result = null
        }
        return result
    })

    public readonly newTinyAmount = computed(() => this.tokenAmountController.tinyAmount.value)

    public readonly newUserAmount = computed(() => this.tokenAmountController.userAmount.value)

    public readonly feedbackMessage = computed(() => {
        let result: string | null
        switch (this.tokenAmountController.state.value) {
            case TokenAmountTextFieldState.empty:
                result = null
                break
            case TokenAmountTextFieldState.invalidSyntax:
                result = "Invalid token amount"
                break
            case TokenAmountTextFieldState.unexpectedNegative:
                result = "Positive amount is expected"
                break;
            case TokenAmountTextFieldState.unexpectedZero:
                result = "Amount cannot be zero"
                break;
            case TokenAmountTextFieldState.ok:
            default:
                result = null
                break
        }
        return result
    })

    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        return this.spenderId.value !== null
            && this.newTinyAmount.value !== null
            && this.newTinyAmount.value !== this.currentTinyAmount.value
    }

    public async executeTransaction(): Promise<string | null> {
        const tokenId = this.tokenId.value!
        const spenderId = this.spenderId.value!
        const newUserAmount = this.newUserAmount.value!
        return await walletManager.approveTokenAllowance(tokenId, spenderId, Number(newUserAmount))
    }

    protected dialogStartShowing(): void {
        this.tokenAmountController.mount()
    }

    protected dialogStopShowing(): void {
        this.tokenAmountController.unmount()
    }

    //
    // Private
    //

    private readonly currentUserAmountDidChange = (): void => {
        this.tokenAmountController.input.value = this.currentUserAmount.value ?? ""
    }

}
