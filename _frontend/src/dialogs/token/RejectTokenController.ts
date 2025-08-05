// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {waitForTransactionRefresh} from "@/schemas/MirrorNodeUtils.ts";
import {TokenId, TokenRejectTransaction} from "@hashgraph/sdk";
import {walletManager} from "@/utils/RouteManager.ts";

export class RejectTokenController extends TransactionController {

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
        return this.tokenAnalyzer.value.balance.value !== null
            && this.tokenAnalyzer.value.balance.value > 0
            && this.tokenAnalyzer.value.isFungible.value !== null
            && this.tokenAnalyzer.value.isFungible.value
    }


    protected async executeTransaction(): Promise<Transaction | string | null> {
        const transaction = new TokenRejectTransaction()
        transaction.addTokenId(TokenId.fromString(this.tokenId.value!))
        const tid = await walletManager.rejectTokens(transaction)
        const result = await waitForTransactionRefresh(tid)
        this.tokenAnalyzer.value.tokenAssociationDidChange()
        return Promise.resolve(result)
    }
}
