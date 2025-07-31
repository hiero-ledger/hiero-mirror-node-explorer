// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TransactionGroupController} from "@/dialogs/core/transaction/TransactionGroupController.ts";
import {TokenAirdrop, Transaction} from "@/schemas/MirrorNodeSchemas.ts";
import {PendingAirdropCache} from "@/utils/cache/PendingAirdropCache.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class ClaimTokenGroupController extends TransactionGroupController {

    public static readonly MAX_AIRDROPS_PER_CLAIM = 10

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, public readonly airdrops: Ref<TokenAirdrop[]>) {
        super(showDialog)
    }

    public readonly airdropCount = computed(() => this.airdrops.value?.length ?? 0)

    //
    // TransactionGroupController
    //

    public getTransactionCount(): number {
        return Math.ceil(this.airdropCount.value / ClaimTokenGroupController.MAX_AIRDROPS_PER_CLAIM)
    }

    protected async executeTransaction(index: number): Promise<Transaction | string | null> {

        const airdrops = this.airdrops.value!
        PendingAirdropCache.instance.forgetTokenAirdrops(airdrops)

        const start = index * ClaimTokenGroupController.MAX_AIRDROPS_PER_CLAIM
        const end = Math.min(airdrops.length, start + ClaimTokenGroupController.MAX_AIRDROPS_PER_CLAIM)
        return walletManager.claimTokenAirdrops(airdrops.slice(start, end))
    }

}
