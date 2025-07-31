// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {waitForTransactionRefresh} from "@/schemas/MirrorNodeUtils.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class ClaimTokenController extends TransactionController {

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, public readonly tokenAnalyzer: Ref<TokenInfoAnalyzer>) {
        super(showDialog)
    }

    public readonly tokenId = computed(() => this.tokenAnalyzer.value.tokenId.value)

    public readonly tokenType = computed(() => this.tokenAnalyzer.value.isFungible.value ? "token" : "NFT")

    public readonly pendingAirdrop = computed(() => {
        const pendingAirdrops = this.tokenAnalyzer.value.pendingAirdrops.value ?? []
        return pendingAirdrops.length >= 1 ? pendingAirdrops[0] : null
    })

    //
    // TransactionController
    //

    public canBeExecuted(): boolean {
        let result: boolean
        if (this.tokenAnalyzer.value.isFungible.value !== null) {
            result = this.tokenAnalyzer.value.isFungible.value && this.pendingAirdrop.value !== null
        } else {
            result = false
        }
        return result
    }


    protected async executeTransaction(): Promise<Transaction | string | null> {
        const pendingAirdrop = this.pendingAirdrop.value!
        const tid = await walletManager.claimTokenAirdrops([pendingAirdrop])
        const result = await waitForTransactionRefresh(tid)
        this.tokenAnalyzer.value.pendingAirdropsDidChange()
        this.tokenAnalyzer.value.tokenAssociationDidChange()
        return Promise.resolve(result)
    }
}
