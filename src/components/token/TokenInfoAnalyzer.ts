// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {makeEthAddressForToken, makeTokenSymbol} from "@/schemas/MirrorNodeUtils.ts";
import {TokenAirdrop, TokenInfo, TokenRelationship, TokenType} from "@/schemas/MirrorNodeSchemas";
import {TokenAssociationCache} from "@/utils/cache/TokenAssociationCache";
import {PendingAirdropCache} from "@/utils/cache/PendingAirdropCache.ts";
import {walletManager} from "@/utils/RouteManager.ts";
import {EntityLookup} from "@/utils/cache/base/EntityCache";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";

export class TokenInfoAnalyzer {

    private readonly tokenLookup: EntityLookup<string, TokenInfo|null>
    private readonly associationLookup: EntityLookup<string, TokenRelationship[]|null>
    private readonly pendingAirdropLookup: EntityLookup<string, TokenAirdrop[]|null>

    //
    // Public
    //

    public constructor(public readonly tokenId: Ref<string|null>) {
        this.tokenLookup = TokenInfoCache.instance.makeLookup(tokenId)
        this.associationLookup = TokenAssociationCache.instance.makeTokenAssociationLookup(walletManager.accountId, tokenId)
        this.pendingAirdropLookup = PendingAirdropCache.instance.makeAirdropLookup(walletManager.accountId, tokenId)

    }

    public mount() {
        this.tokenLookup.mount()
        this.associationLookup.mount()
        this.pendingAirdropLookup.mount()
    }

    public unmount() {
        this.tokenLookup.unmount()
        this.associationLookup.unmount()
        this.pendingAirdropLookup.unmount()
    }

    public readonly tokenInfo = computed(() => this.tokenLookup.entity.value)

    public readonly ethereumAddress = computed(
        () => this.tokenInfo.value !== null ? makeEthAddressForToken(this.tokenInfo.value) : null)

    public readonly tokenSymbol = computed(
        () => makeTokenSymbol(this.tokenInfo.value))

    public readonly decimals = computed(
        () => this.tokenInfo.value?.decimals ?? null)

    public readonly isFungible = computed(
        () => this.tokenInfo.value != null ? this.tokenInfo.value.type == TokenType.FUNGIBLE_COMMON : null)

    public readonly isNft = computed(
        () => this.tokenInfo.value != null ? this.tokenInfo.value.type == TokenType.NON_FUNGIBLE_UNIQUE : null)

    public readonly hasFixedFees = computed(
        () => this.tokenInfo.value?.custom_fees?.fixed_fees && this.tokenInfo.value.custom_fees.fixed_fees.length > 0
    )

    public readonly hasFractionalFees = computed(
        () => this.tokenInfo.value?.custom_fees?.fractional_fees && this.tokenInfo.value.custom_fees.fractional_fees.length > 0
    )

    public readonly hasRoyaltyFees = computed(
        () => this.tokenInfo.value?.custom_fees?.royalty_fees && this.tokenInfo.value.custom_fees.royalty_fees.length > 0
    )

    public readonly hasCustomFees = computed(
        () => this.hasFixedFees.value || this.hasFractionalFees.value || this.hasRoyaltyFees.value
    )

    public readonly fixedFees = computed(
        () => this.hasFixedFees ? this.tokenInfo.value?.custom_fees?.fixed_fees : null)

    public readonly fractionalFees = computed(
        () => this.tokenInfo.value?.custom_fees?.fractional_fees ?? [])

    public readonly royaltyFees = computed(
        () => this.tokenInfo.value?.custom_fees?.royalty_fees ?? [])

    public readonly customFees = computed(() => this.tokenInfo.value?.custom_fees)

    public readonly treasuryAccount = computed(() => this.tokenInfo.value?.treasury_account_id ?? null)


    public readonly balance = computed(() => {
        let result: number | null
        const relationships = this.associationLookup.entity.value
        if (relationships !== null) {
            result = relationships.length >= 1 ? relationships[0].balance : 0
        } else {
            result = null
        }
        return result
    })

    public readonly associationStatus = computed(() => {
        let result: TokenAssociationStatus
        const relationships = this.associationLookup.entity.value
        if (relationships !== null) {
            result = relationships.length == 1 ? TokenAssociationStatus.Associated : TokenAssociationStatus.Dissociated
        } else {
            result = TokenAssociationStatus.Unknown
        }
        return result
    })

    public tokenAssociationDidChange(): void {
        if (walletManager.accountId.value !== null && this.tokenId.value !== null) {
            TokenAssociationCache.instance.forgetTokenAssociation(walletManager.accountId.value, this.tokenId.value)
            this.associationLookup.unmount()
            this.associationLookup.mount()
        }
    }

    public readonly pendingAirdrops = computed(() => this.pendingAirdropLookup.entity.value ?? null)

    public pendingAirdropsDidChange(): void {
        if (walletManager.accountId.value !== null && this.tokenId.value !== null) {
            PendingAirdropCache.instance.forgetTokenAirdrop(walletManager.accountId.value, this.tokenId.value)
            this.associationLookup.unmount()
            this.associationLookup.mount()
        }
    }
}

export enum TokenAssociationStatus {
    Unknown,
    Associated,
    Dissociated
}
