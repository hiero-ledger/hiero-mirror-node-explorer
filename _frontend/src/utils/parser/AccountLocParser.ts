// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, Ref, ref, watch, WatchStopHandle} from "vue";
import {PathParam} from "@/utils/PathParam";
import {EntityID} from "@/utils/EntityID";
import {EthereumAddress} from "@/utils/EthereumAddress";
import {AccountAlias} from "@/utils/AccountAlias";
import {AccountByIdCache} from "@/utils/cache/AccountByIdCache";
import {AccountBalanceTransactions, Key, TokenBalance} from "@/schemas/MirrorNodeSchemas";
import {NetworkConfig} from "@/config/NetworkConfig";
import {NodeAnalyzer} from "@/utils/analyzer/NodeAnalyzer";
import {makeEthAddressForAccount} from "@/schemas/MirrorNodeUtils.ts";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import {AccountByAliasCache} from "@/utils/cache/AccountByAliasCache";
import {routeManager} from "@/utils/RouteManager.ts";

export class AccountLocParser {

    public readonly accountLoc: Ref<string | null>
    public readonly networkConfig: NetworkConfig
    public readonly accountInfo: Ref<AccountBalanceTransactions | null> = ref(null)

    private watchHandle: Ref<WatchStopHandle | null> = ref(null)
    private readonly loadCounter: Ref<number> = ref(0)
    private readonly nodeAnalyzer: NodeAnalyzer

    //
    // Public
    //

    public constructor(accountLoc: Ref<string | null>, networkConfig: NetworkConfig) {
        this.accountLoc = accountLoc
        this.networkConfig = networkConfig
        this.nodeAnalyzer = new NodeAnalyzer(this.accountId)
    }

    public mount(): void {
        this.watchHandle.value = watch(this.accountLocObj, this.accountLocObjDidChange, {immediate: true})
        this.nodeAnalyzer.mount()
    }

    public unmount(): void {
        if (this.watchHandle.value !== null) {
            this.watchHandle.value()
            this.watchHandle.value = null
        }
        this.accountInfo.value = null
        this.loadCounter.value = 0
        this.nodeAnalyzer.unmount()
    }

    public remount(): void {
        if (this.watchHandle.value !== null) { // ie mounted
            if (this.accountInfo.value !== null) {
                // We tell all account caches to forget this account
                if (this.accountInfo.value.account) {
                    AccountByIdCache.instance.forget(this.accountInfo.value.account)
                }
                if (this.accountInfo.value.alias) {
                    AccountByAliasCache.instance.forget(this.accountInfo.value.alias)
                }
                const address = makeEthAddressForAccount(this.accountInfo.value)
                if (address) {
                    AccountByAddressCache.instance.forget(address)
                }
            }
            this.unmount()
            this.mount()
        }
    }

    public readonly isInactiveEvmAddress = computed(() => {
        const l = this.accountLocObj.value
        return l !== null
            && l instanceof EthereumAddress
            && this.accountInfo.value === null
            && this.loadCounter.value >= 1
    })

    public readonly accountId: ComputedRef<string | null>
        = computed(() => this.accountInfo.value?.account ?? null)

    public readonly accountChecksum: ComputedRef<string | null> = computed(() =>
        this.accountId.value ? this.networkConfig.computeChecksum(
            this.accountId.value,
            routeManager.currentNetwork.value
        ) : null)

    public readonly balance: ComputedRef<number | null> = computed(() => this.accountInfo.value?.balance?.balance ?? null)

    public readonly createdTimestamp: ComputedRef<string | null> = computed(() => this.accountInfo.value?.created_timestamp ?? null)

    public readonly key: ComputedRef<Key | null> = computed(() => this.accountInfo.value?.key ?? null)

    public readonly tokens: ComputedRef<TokenBalance[] | null> = computed(() => this.accountInfo.value?.balance?.tokens ?? null)

    public readonly stakedNodeId: ComputedRef<number | null> = computed(() => this.accountInfo.value?.staked_node_id ?? null)

    public readonly stakedAccountId: ComputedRef<string | null> = computed(() => this.accountInfo.value?.staked_account_id ?? null)

    public readonly stakePeriodStart: ComputedRef<string | null> = computed(() => {
        const dateOptions: Intl.DateTimeFormatOptions = {
            // weekDay: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
            minute: "numeric",
            second: "numeric",
            timeZoneName: "short",
            timeZone: "UTC"
        }
        const dateFormat = new Intl.DateTimeFormat("en-US", dateOptions)
        let result: string | null
        if (this.accountInfo.value?.stake_period_start) {
            result = dateFormat.format(Number.parseFloat(this.accountInfo.value.stake_period_start) * 1000)
        } else {
            result = null
        }
        return result
    })

    public readonly pendingReward: ComputedRef<number | null> = computed(() => this.accountInfo.value?.pending_reward ?? null)

    public readonly accountDescription: ComputedRef<string | null> = computed(() => this.nodeAnalyzer.nodeDescription.value)

    public readonly nodeId: ComputedRef<number | null> = computed(() => this.nodeAnalyzer.node.value?.node_id ?? null)

    public readonly ethereumAddress = computed(() => {
        return this.accountInfo.value !== null ? makeEthAddressForAccount(this.accountInfo.value) : null
    })

    public readonly errorNotification: ComputedRef<string | null> = computed(() => {
        let result: string | null
        const l = this.accountLoc.value
        const o = this.accountLocObj.value
        const a = this.accountInfo.value
        if (l !== null && this.watchHandle.value !== null) {
            if (o !== null) {
                if (a !== null) {
                    if (a.deleted == true) {
                        result = "Account is deleted"
                    } else {
                        result = null
                    }
                } else if (this.loadCounter.value >= 1) {
                    if (o instanceof EntityID) {
                        result = "Account with ID " + o + " was not found"
                    } else if (o instanceof EthereumAddress) {
                        result = "Own this account? " +
                            "Activate it by transferring any amount of ℏ or tokens to " + o.toCompactString() + '.'
                    } else { // o instanceof AccountAlias
                        result = "Account with alias " + o + " was not found"
                    }
                } else { // this.loadCounter.value === 0 => not loaded yet
                    result = null
                }
            } else {
                result = "Invalid account ID, address or alias: " + l
            }
        } else {
            result = null
        }
        return result
    })

    //
    // Private
    //

    private readonly accountLocObjDidChange = async () => {
        const l = this.accountLocObj.value
        if (l !== null) {
            try {
                if (l instanceof EntityID) {
                    this.accountInfo.value = await AccountByIdCache.instance.lookup(l.toString())
                } else if (l instanceof EthereumAddress) {
                    this.accountInfo.value = await AccountByAddressCache.instance.lookup(l.toString())
                } else { // l instanceof AccountAlias
                    this.accountInfo.value = await AccountByAliasCache.instance.lookup(l.toString())
                }
            } catch {
                this.accountInfo.value = null
            } finally {
                this.loadCounter.value += 1
            }
        } else {
            this.accountInfo.value = null
        }
    }

    private readonly accountLocObj = computed(() => {
        let result: EntityID | EthereumAddress | AccountAlias | null
        if (this.accountLoc.value !== null) {
            result = PathParam.parseAccountLoc(this.accountLoc.value)
        } else {
            result = null
        }
        return result
    })

}
