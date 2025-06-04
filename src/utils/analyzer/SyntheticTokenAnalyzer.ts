// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, ref, Ref, watch, WatchStopHandle} from "vue";
import {Blockscout} from "@/utils/blockscout/Blockscout.ts";
import {ERCTokenByAddressCache} from "@/utils/cache/ERCTokenByAddressCache.ts";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache.ts";
import {ContractResponse, TokenInfo, TokenType} from "@/schemas/MirrorNodeSchemas.ts";
import {EntityID} from "@/utils/EntityID.ts";
import {EthereumAddress} from "@/utils/EthereumAddress.ts";
import {PathParam} from "@/utils/PathParam.ts";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";
import {makeEthAddressForToken} from "@/schemas/MirrorNodeUtils.ts";

export class SyntheticTokenAnalyzer {

    public readonly tokenLoc: Ref<string | null>
    public readonly contractInfo: Ref<ContractResponse | null> = ref(null)
    public readonly htsTokenInfo: Ref<TokenInfo | null> = ref(null)
    public readonly ercTokenInfo: Ref<Blockscout.TokenInfo | null> = ref(null)

    private watchHandle: Ref<WatchStopHandle | null> = ref(null)
    private readonly loadCounter: Ref<number> = ref(0)

    //
    // Public
    //

    public constructor(tokenLoc: Ref<string | null>) {
        this.tokenLoc = tokenLoc
    }

    public mount(): void {
        this.watchHandle.value = watch(this.tokenLocObj, this.tokenLocObjDidChange, {immediate: true})
    }

    public unmount(): void {
        if (this.watchHandle.value !== null) {
            this.watchHandle.value()
            this.watchHandle.value = null
        }
        this.htsTokenInfo.value = null
        this.ercTokenInfo.value = null
        this.loadCounter.value = 0
    }

    public readonly tokenId: ComputedRef<string | null> = computed(() =>
        this.htsTokenInfo.value?.token_id ?? this.contractInfo.value?.contract_id ?? null
    )
    public readonly tokenAddress: ComputedRef<string | null> = computed(() => {
        let result: string | null
        if (this.ercTokenInfo.value) {
            result = this.ercTokenInfo.value.address
        } else if (this.htsTokenInfo.value) {
            result = makeEthAddressForToken(this.htsTokenInfo.value)
        } else {
            result = null
        }
        return result
    })

    public readonly errorNotification: ComputedRef<string | null> = computed(() => {
        let result: string | null
        const loc = this.tokenLoc.value
        const locObj = this.tokenLocObj.value
        const hcs = this.htsTokenInfo.value
        const erc = this.ercTokenInfo.value
        console.log(`loc: ${loc}`)
        if (loc !== null && this.watchHandle.value !== null) {
            if (locObj !== null) {
                if (hcs !== null) {
                    if (hcs.deleted) {
                        result = "Token is deleted"
                    } else {
                        result = null
                    }
                } else if (erc !== null) {
                    result = null
                } else if (this.loadCounter.value >= 1) {
                    if (locObj instanceof EntityID) {
                        result = "Token with ID " + locObj + " was not found"
                    } else { // o instanceof Ethereum address
                        result = "Token with address " + locObj + " was not found"
                    }
                } else { // this.loadCounter.value === 0 => not loaded yet
                    result = null
                }
            } else {
                result = "Invalid contract ID or address: " + loc
            }
        } else {
            result = null
        }
        return result
    })

    public readonly isHts = computed(() => this.htsTokenInfo.value !== null)

    public readonly isErc20 = computed(() => this.type.value === "ERC-20")
    public readonly isErc721 = computed(() => this.type.value === "ERC-721")
    public readonly isErc1155 = computed(() => this.type.value === "ERC-1155")

    public readonly type = computed(() => {
        let result: string | null
        if (this.htsTokenInfo.value !== null) {
            result = this.htsTokenInfo.value.type === TokenType.FUNGIBLE_COMMON ? "ERC-20" : "ERC-721"
        } else {
            result = this.ercTokenInfo.value?.type ?? null
        }
        return result
    })

    public readonly name = computed(() =>
        this.htsTokenInfo.value?.name ?? this.ercTokenInfo.value?.name ?? null
    )
    public readonly symbol = computed(() =>
        this.htsTokenInfo.value?.symbol ?? this.ercTokenInfo.value?.symbol ?? null
    )
    public readonly decimals = computed(() =>
        this.htsTokenInfo.value?.decimals ?? this.ercTokenInfo.value?.decimals ?? null
    )
    public readonly totalSupply = computed(() =>
        this.htsTokenInfo.value?.total_supply ?? this.ercTokenInfo.value?.total_supply ?? null
    )
    public readonly holders = computed(() => {
            console.log(`holders: ${this.ercTokenInfo.value?.holders}`)
            return this.ercTokenInfo.value?.holders ?? null
        }
    )

    private readonly tokenLocObj = computed(() => {
        let result: EntityID | EthereumAddress | null
        if (this.tokenLoc.value !== null && this.watchHandle.value !== null) {
            result = PathParam.parseTokenLoc(this.tokenLoc.value)
        } else {
            result = null
        }
        return result
    })

    private readonly tokenLocObjDidChange = async () => {
        const l = this.tokenLocObj.value
        if (l !== null && this.watchHandle.value !== null) {
            try {
                console.log(`locObj: ${JSON.stringify(l)}`)
                console.log(`locObj: ${l.toString()}`)
                if (l instanceof EntityID) {
                    this.htsTokenInfo.value = await TokenInfoCache.instance.lookup(l.toString())
                } else {
                    this.contractInfo.value = await ContractByAddressCache.instance.lookup(l.toString())
                    console.log(`contractInfo: ${JSON.stringify(this.contractInfo.value)}`)
                    this.ercTokenInfo.value = await ERCTokenByAddressCache.instance.lookup(l.toString())
                    console.log(`ercTokenInfo: ${JSON.stringify(this.ercTokenInfo.value)}`)
                }
            } catch (error) {
                this.htsTokenInfo.value = null
                this.ercTokenInfo.value = null
            } finally {
                this.loadCounter.value += 1
            }
        } else {
            this.htsTokenInfo.value = null
            this.ercTokenInfo.value = null
        }
    }

}
