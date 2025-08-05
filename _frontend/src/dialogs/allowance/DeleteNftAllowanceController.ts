// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {TokenInfo} from "@/schemas/MirrorNodeSchemas.ts";
import {EntityLookup} from "@/utils/cache/base/EntityCache.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class DeleteNftAllowanceController extends TransactionController {

    private readonly tokenLookup: EntityLookup<string, TokenInfo | null>


    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>,
                       public readonly tokenId: Ref<string | null>,
                       public readonly spenderId: Ref<string | null>,
                       public readonly serial: Ref<number | null>) {
        super(showDialog)
        this.tokenLookup = TokenInfoCache.instance.makeLookup(this.tokenId)
    }

    public readonly tokenName = computed(() => this.tokenLookup.entity.value?.name ?? null)


    //
    // TaskController
    //

    public canBeExecuted(): boolean {
        return this.spenderId.value !== null && this.tokenId.value !== null
    }

    public async executeTransaction(): Promise<string | null> {
        let result: string | null

        const tokenId = this.tokenId.value!
        const spenderId = this.spenderId.value!
        const serial = this.serial.value
        if (serial !== null) {
            result = await walletManager.deleteNftAllowance(tokenId, serial)
        } else {
            result = await walletManager.deleteNftAllSerialsAllowance(tokenId, spenderId)
        }
        return result
    }

    protected dialogStartShowing(): void {
        this.tokenLookup.mount()
    }

    protected dialogStopShowing(): void {
        this.tokenLookup.unmount()
    }

}
