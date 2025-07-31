// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, Ref, ref, watch, WatchStopHandle} from "vue";
import {BalancesResponse, TokenBalance} from "@/schemas/MirrorNodeSchemas";
import {BalanceCache} from "@/utils/cache/BalanceCache";
import {Duration} from "@/utils/Duration";
import {EntityLoader} from "@/utils/loader/EntityLoader.ts";

export class BalanceAnalyzer extends EntityLoader<BalancesResponse> {

    public readonly accountId = ref<string | null>(null)
    private watchStopHandle: WatchStopHandle | null = null

    //
    // Public
    //

    public constructor(accountId = ref<string | null>(null), updatePeriod: number) {
        super(updatePeriod, EntityLoader.HUGE_COUNT /* refresh forever */)
        this.accountId = accountId
    }

    public readonly hbarBalance: ComputedRef<number | null> = computed(() => {
        const allBalances = this.entity.value?.balances
        return allBalances && allBalances.length >= 1 ? allBalances[0].balance : null
    })

    public readonly tokenBalances: ComputedRef<Array<TokenBalance>> = computed(() => {
        const allBalances = this.entity.value?.balances
        return allBalances && allBalances.length >= 1 ? allBalances[0].tokens : []
    })

    public readonly balanceTimeStamp: ComputedRef<string | null> = computed(() => {
        return this.entity.value?.timestamp ?? null
    })

    public readonly balanceAge: Ref<Duration | null> = computed(() => {
        return this.balanceTimeStamp.value !== null
            ? Duration.decompose(new Date().getTime() / 1000 - Number.parseFloat(this.balanceTimeStamp.value))
            : null
    })

    //
    // EntityLoader
    //

    public mount(): void {
        super.mount()
        this.watchStopHandle = watch(this.accountId, () => {
            this.pause()
            this.resume()
        })
    }

    public unmount(): void {
        if (this.watchStopHandle != null) {
            this.watchStopHandle()
            this.watchStopHandle = null
        }
        super.unmount()
    }

    protected async load(): Promise<BalancesResponse | null> {
        let result: BalancesResponse | null
        if (this.accountId.value !== null) {
            result = await BalanceCache.instance.lookup(this.accountId.value, true)
        } else {
            result = null
        }
        return Promise.resolve(result)
    }
}
