// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref, watch, WatchStopHandle} from "vue";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache.ts";
import {ContractResponse, TokenInfo} from "@/schemas/MirrorNodeSchemas.ts";
import {EntityID} from "@/utils/EntityID.ts";
import {EthereumAddress} from "@/utils/EthereumAddress.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {routeManager} from "@/utils/RouteManager.ts";

export class TOCLocParser {


    public readonly tokenInfo: Ref<TokenInfo|null> = ref(null)
    public readonly contractInfo: Ref<ContractResponse|null> = ref(null)
    private watchHandle: Ref<WatchStopHandle | null> = ref(null)
    private readonly loadCounter: Ref<number> = ref(0)

    //
    // Public
    //

    public constructor(public readonly tocLoc: Ref<string | null>) {}

    public mount(): void {
        this.watchHandle.value = watch(this.tocLocObj, this.tokLocObjDidChange, {immediate: true})
    }

    public unmount(): void {
        if (this.watchHandle.value !== null) {
            this.watchHandle.value()
            this.watchHandle.value = null
        }
        this.tokenInfo.value = null
        this.loadCounter.value = 0
    }

    public isLoaded = computed(() => this.loadCounter.value >= 1)

    public readonly isToken = computed(() => this.tokenInfo.value !== null)

    public readonly isContract = computed(() => this.contractInfo.value !== null)

    public readonly entityId: ComputedRef<string | null>
        = computed(() => this.tokenInfo.value?.token_id ?? this.contractInfo.value?.contract_id ?? null)

    public readonly ethereumAddress: ComputedRef<string | null> = computed(() => {
        let result: string|null
        if (this.tokenInfo.value !== null) {
            const tokenId = this.tokenInfo.value.token_id
            const entityId = tokenId !== null ? EntityID.parse(tokenId) : null
            const address =  entityId?.toAddress() ?? null
            result = address !== null ? "0x" + address : null
        } else if (this.contractInfo.value !== null) {
            result = this.contractInfo.value.evm_address
        } else {
            result = null
        }
        return result
    })

    public readonly entityChecksum = computed(() => {
        const entityId = this.entityId.value
        const networkConfig = routeManager.networkConfig.value
        const currentNetwork = routeManager.currentNetwork.value
        return entityId !== null ? networkConfig.computeChecksum(entityId, currentNetwork) : null
    })

    public readonly errorNotification: ComputedRef<string | null> = computed(() => {
        let result: string | null
        const l = this.tocLoc.value
        const o = this.tocLocObj.value
        if (l !== null && this.watchHandle.value !== null) {
            if (o !== null) {
                const tokenInfo = this.tokenInfo.value
                const contractInfo = this.contractInfo.value
                if (tokenInfo !== null) {
                    if (tokenInfo.deleted) {
                        result = "Token is deleted"
                    } else {
                        result = null
                    }
                } else if (contractInfo !== null) {
                    if (contractInfo.deleted) {
                        result = "Contract is deleted"
                    } else {
                        result = null
                    }
                } else if (this.loadCounter.value >= 1) {
                    if (o instanceof EntityID) {
                        result = "Token with ID " + o + " was not found"
                    } else { // o instanceof Ethereum address
                        result = "Token with address " + o + " was not found"
                    }
                } else { // this.loadCounter.value === 0 => not loaded yet
                    result = null
                }
            } else {
                result = "Invalid token ID or address: " + l
            }
        } else {
            result = null
        }
        return result
    })

    //
    // Private
    //

    private readonly tokLocObjDidChange = async () => {
        const l = this.tocLocObj.value
        if (l !== null && this.watchHandle.value !== null) {
            try {
                if (l instanceof EntityID) {
                    const entityId = l.toString()
                    this.tokenInfo.value = await TokenInfoCache.instance.lookup(entityId)
                    if (this.tokenInfo.value !== null) {
                        this.contractInfo.value = null
                    } else {
                        this.contractInfo.value = await ContractByIdCache.instance.lookup(entityId)
                    }
                } else { // l instanceof EthereumAddress
                    const entityId = EntityID.fromAddress(l.toString())
                    if (entityId !== null) {
                        this.tokenInfo.value = await TokenInfoCache.instance.lookup(entityId.toString())
                    } else {
                        this.tokenInfo.value = null
                        this.contractInfo.value = await ContractByAddressCache.instance.lookup(l.toString())
                    }
                }
            } catch (error) {
                this.tokenInfo.value = null
                this.contractInfo.value = null
            } finally {
                this.loadCounter.value += 1
            }
        } else {
            this.tokenInfo.value = null
            this.contractInfo.value = null
        }
    }

    private readonly tocLocObj = computed(() => {
        let result: EntityID | EthereumAddress | null
        if (this.tocLoc.value !== null && this.watchHandle.value !== null) {
            result = EntityID.parse(this.tocLoc.value) ?? EthereumAddress.parse(this.tocLoc.value)
        } else {
            result = null
        }
        return result
    })

}
