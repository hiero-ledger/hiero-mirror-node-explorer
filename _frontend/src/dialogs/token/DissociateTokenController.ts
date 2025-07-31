// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {TokenAssociationStatus, TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {waitForTransactionRefresh} from "@/schemas/MirrorNodeUtils.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class DissociateTokenController extends TransactionController {

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
        return this.tokenAnalyzer.value.associationStatus.value === TokenAssociationStatus.Associated
            && this.tokenAnalyzer.value.balance.value === 0
    }


    protected async executeTransaction(): Promise<Transaction | string | null> {
        const tid = await walletManager.dissociateToken(this.tokenId.value!)
        const result = await waitForTransactionRefresh(tid)
        this.tokenAnalyzer.value.tokenAssociationDidChange()
        return Promise.resolve(result)
    }
}
