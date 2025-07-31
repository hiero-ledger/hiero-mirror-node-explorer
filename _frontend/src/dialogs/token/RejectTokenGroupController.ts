// SPDX-License-Identifier: Apache-2.0

import {TransactionGroupController} from "@/dialogs/core/transaction/TransactionGroupController.ts";
import {computed, Ref, ref, watch, WatchStopHandle} from "vue";
import {FreezeStatus, Nft, Token, Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {tokenOrNftId} from "@/schemas/MirrorNodeUtils.ts";
import {NftId, TokenId, TokenRejectTransaction} from "@hashgraph/sdk";
import {TokenAssociationCache} from "@/utils/cache/TokenAssociationCache.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class RejectTokenGroupController extends TransactionGroupController {

    private readonly rejectCandidates = ref<(Token | Nft)[]>([])
    private readonly treasuryTokens = ref<string[]>([])
    private readonly pausedTokens = ref<string[]>([])
    private readonly frozenTokens = ref<string[]>([])
    private readonly zeroBalanceTokens = ref<string[]>([])
    public readonly filtering = ref(false)

    private watchStopHandle: WatchStopHandle | null = null


    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, public readonly tokens: Ref<(Token | Nft)[]>) {
        super(showDialog)
    }

    public readonly isNft = computed(() => {
        let nftCount = 0
        for (const t of this.tokens.value ?? []) {
            if ((t as Nft).serial_number) {
                // t is an NFT
                nftCount += 1
            }
        }
        return this.tokens.value.length >= 1 && nftCount === this.tokens.value.length
    })

    public readonly panelMode = computed(
        () => this.rejectCandidates.value.length == 0 ? TaskPanelMode.error : TaskPanelMode.none)

    public readonly taskPanelMessage = computed(() => {
        let result: string
        const tokenCount = this.tokens.value.length
        const candidateCount = this.rejectCandidates.value.length
        const prefix = this.isNft.value ? "NFT" : "token"
        if (tokenCount == 1) {
            const t0 = this.tokens.value[0]
            const tokenId = tokenOrNftId(t0)
            if (candidateCount == 1) {
                result = `Do you want to reject ${prefix} ${tokenId} ?`
            } else {
                result = `This ${prefix} cannot be rejected.`
            }
        } else if (tokenCount >= 2) {
            if (candidateCount == 0) {
                result = `Selected ${prefix}s can be rejected.`
            } else if (candidateCount == 1) {
                const t0 = this.rejectCandidates.value[0]
                const tokenId = tokenOrNftId(t0)
                result = `Do you want to reject ${prefix} ${tokenId}`
            } else {
                result = `Do you want to reject ${candidateCount} ${prefix}s`
            }
        } else {
            result = `Selected ${prefix} can be rejected.`
        }
        return result
    })

    public readonly taskPanelExtra1 = computed(() => {
        let result: string | null
        const tokenCount = this.tokens.value.length
        const candidateCount = this.rejectCandidates.value.length
        const prefix = this.isNft.value ? "NFT" : "token"
        const longPrefix = this.isNft.value ? "collection" : "token"
        if (tokenCount == candidateCount) {
            result = null
        } else if (tokenCount == 1) {
            if (this.treasuryTokens.value.length == 1) {
                result = `Your account is treasury for this ${prefix}`
            } else if (this.pausedTokens.value.length === 1) {
                result = `This ${longPrefix} is paused`
            } else if (this.frozenTokens.value.length === 1) {
                result = `This ${longPrefix} is frozen`
            } else if (this.zeroBalanceTokens.value.length === 1) {
                result = "This token has a 0 balance"
            } else {
                result = null
            }
        } else if (tokenCount >= 2) {
            if (this.treasuryTokens.value.length == tokenCount) {
                result = `Your account is treasury for these  ${longPrefix}s`
            } else if (this.pausedTokens.value.length === tokenCount) {
                result = `This ${longPrefix} are paused`
            } else if (this.frozenTokens.value.length === tokenCount) {
                result = `This ${longPrefix} are frozen`
            } else if (this.zeroBalanceTokens.value.length === tokenCount) {
                result = "This token have a 0 balance"
            } else if (candidateCount < tokenCount) {
                result = `Other ${prefix} cannot be rejected`
            } else {
                result = null
            }
        } else {
            result = null
        }
        return result
    })


    //
    // TransactionController
    //

    protected dialogStartShowing(): void {
        this.watchStopHandle = watch(this.tokens, this.tokensDidChange, {immediate: true})
    }

    protected dialogStopShowing(): void {

        if (this.watchStopHandle !== null) {
            this.watchStopHandle()
            this.watchStopHandle = null
        }

        this.rejectCandidates.value = []
        this.treasuryTokens.value = []
        this.pausedTokens.value = []
        this.frozenTokens.value = []
        this.zeroBalanceTokens.value = []
    }

    //
    // TransactionGroupController
    //

    public getTransactionCount(): number {
        return this.requiredTransactionCount.value
    }

    protected async executeTransaction(index: number): Promise<Transaction | string | null> {
        const start = index * MAX_TOKENS_PER_REJECT
        const end = Math.min(this.rejectCandidates.value.length, start + MAX_TOKENS_PER_REJECT)
        console.log(`rejecting tokens from ${start} to ${end}`)
        const rejected = this.rejectCandidates.value.slice(start, end)
        const transaction = new TokenRejectTransaction()

        for (const t of rejected) {
            if ((t as Nft).serial_number) {
                transaction.addNftId(new NftId(TokenId.fromString(t.token_id!), (t as Nft).serial_number))
            } else {
                transaction.addTokenId(TokenId.fromString(t.token_id!))
            }
            TokenAssociationCache.instance.forgetTokenAssociation(walletManager.accountId.value!, t.token_id!)
        }

        return await walletManager.rejectTokens(transaction)
    }


    //
    // Private
    //

    private readonly tokensDidChange = async () => {

        this.rejectCandidates.value = []
        this.treasuryTokens.value = []
        this.pausedTokens.value = []
        this.frozenTokens.value = []
        this.zeroBalanceTokens.value = []

        this.filtering.value = true

        try {
            for (const t of this.tokens.value) {
                let isTreasury = false
                let isPaused = false

                if ((await TokenInfoCache.instance.lookup(t.token_id!))?.treasury_account_id === walletManager.accountId.value) {
                    isTreasury = true
                    this.treasuryTokens.value.push(t.token_id!)
                }
                if ((await TokenInfoCache.instance.lookup(t.token_id!))?.pause_status === 'PAUSED') {
                    isPaused = true
                    this.pausedTokens.value.push(t.token_id!)
                }
                const associations = await TokenAssociationCache.instance.lookup(
                    TokenAssociationCache.makeAssociationKey(walletManager.accountId.value!, t.token_id!)
                )
                const isFrozen = associations && associations.length >= 1 && associations[0].freeze_status === FreezeStatus.FROZEN
                if (isFrozen) {
                    this.frozenTokens.value.push((t.token_id!))
                }
                const balance = (associations && associations.length >= 1) ? associations[0].balance : 0
                if (balance === 0) {
                    this.zeroBalanceTokens.value.push(t.token_id!)
                }
                if (!isTreasury && !isPaused && !isFrozen && balance > 0) {
                    console.log(`Adding token ${t.token_id} to the TokenRejectTransaction`)
                    this.rejectCandidates.value.push(t)
                }
            }
        } finally {
            this.filtering.value = false
        }
    }

    private readonly requiredTransactionCount = computed(() => {
        return Math.ceil(this.rejectCandidates.value.length / MAX_TOKENS_PER_REJECT)
    })
}

const MAX_TOKENS_PER_REJECT = 10
