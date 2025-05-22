// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {makeEthAddressForToken, makeTokenSymbol} from "@/schemas/MirrorNodeUtils.ts";
import {TokenInfo, TokenType} from "@/schemas/MirrorNodeSchemas";
import {NetworkConfig} from "@/config/NetworkConfig";
import {routeManager, walletManager} from "@/router";
import {TokenAssociationCache} from "@/utils/cache/TokenAssociationCache";
import {PendingAirdropCache} from "@/utils/cache/PendingAirdropCache.ts";

export class TokenInfoAnalyzer {

    private readonly tokenInfo: Ref<TokenInfo | null>
    private readonly networkConfig: NetworkConfig

    //
    // Public
    //

    public constructor(tokenInfo: Ref<TokenInfo | null>, networkConfig: NetworkConfig) {
        this.tokenInfo = tokenInfo
        this.networkConfig = networkConfig
    }

    public mount() {
        this.associationLookup.mount()
        this.pendingAirdropLookup.mount()
    }

    public unmount() {
        this.associationLookup.unmount()
        this.pendingAirdropLookup.unmount()
    }

    public readonly tokenId = computed(
        () => this.tokenInfo.value?.token_id ?? null)

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

    public readonly tokenChecksum = computed(() =>
        this.tokenInfo.value?.token_id ? this.networkConfig.computeChecksum(
            this.tokenInfo.value?.token_id,
            routeManager.currentNetwork.value
        ) : null)


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

    //
    // Private
    //

    private readonly associationLookup
        = TokenAssociationCache.instance.makeTokenAssociationLookup(walletManager.accountId, this.tokenId)

    private readonly pendingAirdropLookup
        = PendingAirdropCache.instance.makeAirdropLookup(walletManager.accountId, this.tokenId)
}

export enum TokenAssociationStatus {
    Unknown,
    Associated,
    Dissociated
}
