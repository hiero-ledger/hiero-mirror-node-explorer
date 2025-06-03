// SPDX-License-Identifier: Apache-2.0

import {computed, ref, Ref} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {TokenAssociationStatus, TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {waitForTransactionRefresh} from "@/schemas/MirrorNodeUtils.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class AssociateTokenController extends TransactionController {

    public readonly watchInWallet = ref(false)

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, public readonly tokenAnalyzer: Ref<TokenInfoAnalyzer>) {
        super(showDialog)
    }

    public readonly tokenId = computed(() => this.tokenAnalyzer.value.tokenId.value)

    public readonly tokenType = computed(() => this.tokenAnalyzer.value.isFungible.value ? "token" : "NFT")

    //
    // TransactionController
    //

    public canBeExecuted(): boolean {
        return this.tokenAnalyzer.value.associationStatus.value === TokenAssociationStatus.Dissociated &&
            (walletManager.isWatchSupported.value || !this.watchInWallet.value)
    }


    protected async executeTransaction(): Promise<Transaction | string | null> {
        const tid = await walletManager.associateToken(this.tokenId.value!)
        const result = await waitForTransactionRefresh(tid)
        this.tokenAnalyzer.value.tokenAssociationDidChange()
        if (this.watchInWallet.value) {
            await walletManager.watchToken(this.tokenId.value!)
        }
        return Promise.resolve(result)
    }
}
