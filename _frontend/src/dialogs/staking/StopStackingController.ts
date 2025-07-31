// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import {AccountBalanceTransactions} from "@/schemas/MirrorNodeSchemas.ts";
import {NodeAnalyzer} from "@/utils/analyzer/NodeAnalyzer.ts";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache.ts";
import {EntityLookup} from "@/utils/cache/base/EntityCache.ts";
import {AccountByAliasCache} from "@/utils/cache/AccountByAliasCache.ts";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache.ts";
import {walletManager} from "@/utils/RouteManager.ts";

export class StopStackingController extends TransactionController {

    private readonly accountLookup: EntityLookup<string, AccountBalanceTransactions | null>
    private readonly stakedNodeAnalyzer: NodeAnalyzer

    //
    // Public
    //

    public constructor(showDialog: Ref<boolean>, public readonly accountId: Ref<string | null>) {
        super(showDialog)
        this.accountLookup = AccountByIdCache.instance.makeLookup(this.accountId)
        this.stakedNodeAnalyzer = new NodeAnalyzer(this.stakedNodeId)
    }

    public readonly stakedTo = computed(() => {
        let result: string | null
        if (this.stakedNodeId.value !== null) {
            result = "node " + this.stakedNodeId.value + " - " + this.stakedNodeDescription.value
        } else if (this.stakedAccountId.value !== null) {
            result = "account " + this.stakedAccountId.value
        } else {
            result = null
        }
        return result
    })


    //
    // TransactionController
    //

    public canBeExecuted(): boolean {
        return this.accountLookup.entity.value !== null
    }


    protected async executeTransaction(): Promise<string | null> {
        const result = await walletManager.changeStaking(null, null, null)

        if (this.accountId.value !== null) {
            AccountByIdCache.instance.forget(this.accountId.value)
        }
        if (this.accountInfo.value?.evm_address) {
            AccountByAddressCache.instance.forget(this.accountInfo.value.evm_address)
        }
        if (this.accountInfo.value?.alias) {
            AccountByAliasCache.instance.forget(this.accountInfo.value.alias)
        }
        return result
    }

    protected dialogStartShowing(): void {
        this.accountLookup.mount()
        this.stakedNodeAnalyzer.mount()
    }

    protected dialogStopShowing(): void {
        this.accountLookup.unmount()
        this.stakedNodeAnalyzer.unmount()
    }

    //
    // Private
    //

    private readonly accountInfo = computed(
        () => this.accountLookup.entity.value)

    private readonly stakedNodeId = computed(
        () => this.accountInfo.value?.staked_node_id ?? null)

    private readonly stakedNodeDescription = computed(
        () => this.stakedNodeAnalyzer.shortNodeDescription.value ?? null)

    private readonly stakedAccountId = computed(
        () => this.accountInfo.value?.staked_account_id ?? null)
}
