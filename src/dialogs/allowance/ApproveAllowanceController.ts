// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {AccountTextFieldController, AccountTextFieldState} from "@/dialogs/common/AccountTextFieldController.ts";
import {TokenTextFieldController, TokenTextFieldState} from "@/dialogs/common/TokenTextFieldController.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {CryptoTextFieldController, HbarTextFieldState} from "@/dialogs/common/CryptoTextFieldController.ts";
import {
    TokenAmountTextFieldController,
    TokenAmountTextFieldState
} from "@/dialogs/common/TokenAmountTextFieldController.ts";
import {
    NftSerialsTextFieldController,
    NftSerialsTextFieldState
} from "@/dialogs/common/NftSerialsTextFieldController.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class ApproveAllowanceController extends TransactionController {

    public readonly spenderController: AccountTextFieldController
    public readonly tokenController: TokenTextFieldController
    public readonly nftController: TokenTextFieldController
    public readonly cryptoController: CryptoTextFieldController
    public readonly tokenAmountController: TokenAmountTextFieldController
    public readonly nftSerialsController: NftSerialsTextFieldController

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, networkConfig: NetworkConfig) {
        super(showDialog)
        this.spenderController = new AccountTextFieldController(ref(null), networkConfig)
        this.tokenController = new TokenTextFieldController(ref(null), walletManager.accountId, networkConfig)
        this.nftController = new TokenTextFieldController(ref(null), walletManager.accountId, networkConfig)
        this.cryptoController = new CryptoTextFieldController(ref(null), true)
        this.tokenAmountController = new TokenAmountTextFieldController(this.tokenId, true)
        this.nftSerialsController = new NftSerialsTextFieldController(this.nftId)
    }

    public readonly allowanceChoice = ref("crypto") // crypto, token, nft

    public readonly feedbackMessage = computed(() => {
        let result: string | null
        if (this.spenderFeedbackMessage.value !== null) {
            result = this.spenderFeedbackMessage.value
        } else {
            switch (this.allowanceChoice.value) {
                case "crypto":
                    result = this.crytpoFeedbackMessage.value
                    break
                case "token":
                    result = this.tokenFeedbackMessage.value ?? this.tokenAmountFeedbackMessage.value
                    break
                case "nft":
                    result = this.nftFeedbackMessage.value ?? this.nftSerialsFeedbackMessage.value
                    break
                default:
                    result = null
                    break
            }
        }
        return result
    })

    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        let result: boolean
        switch (this.allowanceChoice.value) {
            case "crypto":
                result = this.cryptoOK.value
                break
            case "token":
                result = this.tokenOK.value && this.tokenAmountOK.value
                break
            case "nft":
                console.log("nftOK=" + this.nftOK.value + ", nftSerialsOK=" + this.nftSerialsOK.value)
                result = this.nftOK.value && this.nftSerialsOK.value
                break
            default:
                result = false
                break
        }
        return result && this.spenderOK.value
    }

    public async executeTransaction(): Promise<string | null> {
        let result: string | null

        const spender = this.spender.value!
        switch (this.allowanceChoice.value) {
            case "crypto": {
                const cryptoUserAmount = this.cryptoUserAmount.value!
                result = await walletManager.approveHbarAllowance(spender, Number(cryptoUserAmount))
                break
            }
            case "token": {
                const tokenId = this.tokenId.value!
                const tokenAmount = this.tokenAmount.value!
                result = await walletManager.approveTokenAllowance(tokenId, spender, Number(tokenAmount))
                break
            }
            case "nft": {
                const nftId = this.nftId.value!
                const nftSerials = this.nftSerials.value!
                result = await walletManager.approveNFTAllowance(nftId, spender, nftSerials)
                break
            }
            default: {
                result = null
                break
            }
        }

        return Promise.resolve(result)
    }

    protected dialogStartShowing() {
        this.spenderController.mount()
        this.tokenController.mount()
        this.nftController.mount()
        // no mount() for this.cryptoController
        this.tokenAmountController.mount()
        this.nftSerialsController.mount()
    }

    protected dialogStopShowing() {
        this.spenderController.inputText.value = ""
        this.tokenController.inputText.value = ""
        this.nftController.inputText.value = ""
        this.cryptoController.inputText.value = ""
        this.tokenAmountController.input.value = ""

        this.spenderController.unmount()
        this.tokenController.unmount()
        this.nftController.unmount()
        // no unmount() for this.cryptoController
        this.tokenAmountController.unmount()
        this.nftSerialsController.unmount()
    }


    //
    // Private
    //

    //
    // sender
    //

    private readonly spender = computed(() => this.spenderController.newAccountId.value)

    private readonly spenderOK = computed(() =>
        this.spenderController.newAccountId.value !== null &&
        this.spenderController.newAccountId.value !== walletManager.accountId.value &&
        this.spenderController.newAccountInfo.value !== null)

    private readonly spenderFeedbackMessage = computed(() => {
        let result: string | null
        switch (this.spenderController.state.value) {
            case AccountTextFieldState.empty:
                result = null
                break
            case AccountTextFieldState.invalid:
                result = "Invalid spender ID"
                break
            case AccountTextFieldState.ok:
                if (this.spenderController.newAccountInfo.value === null && this.spenderController.isLoaded.value) {
                    result = "Unknown spender"
                } else {
                    result = null
                }
                break
            default:
                result = null
                break
        }
        return result
    })

    //
    // crypto
    //

    private readonly cryptoOK = computed(() => this.cryptoController.newTinyAmount.value !== null)

    private readonly cryptoUserAmount = computed(() => this.cryptoController.newUserAmount.value)

    private readonly crytpoFeedbackMessage = computed(() => {
        let result: string | null
        switch (this.cryptoController.state.value) {
            case HbarTextFieldState.empty:
                result = null
                break
            case HbarTextFieldState.invalidSyntax:
                result = "Invalid HBAR amount"
                break
            case HbarTextFieldState.unexpectedNegative:
                result = "Positive amount is expected"
                break;
            case HbarTextFieldState.unexpectedZero:
                result = "Amount cannot be zero"
                break;
            case HbarTextFieldState.ok:
            default:
                result = null
                break
        }
        return result
    })

    //
    // token id
    //

    private readonly tokenOK = computed(() =>
        this.tokenController.newTokenId.value !== null &&
        this.tokenController.newTokenInfo.value !== null &&
        this.tokenController.newTokenInfo.value.type == "FUNGIBLE_COMMON" &&
        this.tokenController.isTokenAssociated.value)

    private readonly tokenId = computed(() => this.tokenController.newTokenId.value)

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
                if (tokenInfo !== null) {
                    if (tokenInfo.type !== "FUNGIBLE_COMMON") {
                        result = "Token is not fungible"
                    } else {
                        const isAssociated = this.tokenController.isTokenAssociated.value
                        const isAssociationLoaded = this.tokenController.isTokenAssociationLoaded.value
                        if (isAssociationLoaded && !isAssociated) {
                            result = "Not associated with this account"
                        } else {
                            result = null
                        }
                    }
                } else if (this.tokenController.isLoaded.value) {
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
    // token amount
    //

    private readonly tokenAmountOK = computed(() => this.tokenAmount.value !== null)

    private readonly tokenAmount = computed(() => this.tokenAmountController.tinyAmount.value)

    private readonly tokenAmountFeedbackMessage = computed(() => {
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
                break
            case TokenAmountTextFieldState.unexpectedZero:
                result = "Amount cannot be zero"
                break
            case TokenAmountTextFieldState.ok:
                result = null
                break
        }
        return result
    })

    //
    // nft id
    //

    private readonly nftOK = computed(() =>
        this.nftController.newTokenId.value !== null &&
        this.nftController.newTokenInfo.value !== null &&
        this.nftController.newTokenInfo.value.type == "NON_FUNGIBLE_UNIQUE")

    private readonly nftId = computed(() => this.nftController.newTokenId.value)

    private readonly nftFeedbackMessage = computed(() => {
        let result: string | null
        switch (this.nftController.state.value) {
            case TokenTextFieldState.empty:
                result = null
                break
            case TokenTextFieldState.invalid:
                result = "Invalid token ID"
                break
            case TokenTextFieldState.ok: {
                const tokenInfo = this.tokenController.newTokenInfo.value
                if (tokenInfo !== null) {
                    result = tokenInfo.type === "NON_FUNGIBLE_UNIQUE" ? null : "Token is not an NFT"
                } else if (this.tokenController.isLoaded.value) {
                    result = "Unknown token"
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
    // nft serials
    //

    private readonly nftSerialsOK = computed(() =>
        this.nftSerials.value !== null &&
        this.rejectNftSerials.value !== null &&
        this.rejectNftSerials.value.length == 0)

    private readonly nftSerials = computed(() => this.nftSerialsController.serials.value)

    private readonly rejectNftSerials = computed(() => this.nftSerialsController.rejectedSerials.value)

    private readonly nftSerialsFeedbackMessage = computed(() => {
        let result: string | null
        switch (this.nftSerialsController.state.value) {
            case NftSerialsTextFieldState.invalidSyntax:
                result = "Invalid number list"
                break
            default:
            case NftSerialsTextFieldState.ok:
                if (this.rejectNftSerials.value !== null && this.rejectNftSerials.value.length > 0) {
                    result = "Not owned by this account"
                } else {
                    result = null
                }
                break
        }
        return result
    })


}
