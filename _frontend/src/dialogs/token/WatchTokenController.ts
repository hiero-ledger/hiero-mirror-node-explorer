// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class WatchTokenController extends TransactionController {

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
        return walletManager.isWatchSupported.value
            && this.tokenAnalyzer.value.isFungible.value !== null
            && this.tokenAnalyzer.value.isFungible.value
    }


    protected async executeTransaction(): Promise<Transaction | string | null> {
        await walletManager.watchToken(this.tokenId.value!)
        return Promise.resolve(null)
    }
}
