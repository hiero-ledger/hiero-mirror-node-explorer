// SPDX-License-Identifier: Apache-2.0

import {computed, ComputedRef, Ref} from "vue";
import {Key, makeShortNodeDescription, NetworkNode} from "@/schemas/MirrorNodeSchemas";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer";
import {
    makeAnnualizedRate,
    makeNodeDescription,
    makeRewardRate,
    makeUnclampedStake
} from "@/schemas/MirrorNodeUtils.ts";
import {base64DecToArr, byteToHex} from "@/utils/B64Utils";

export class NodeAnalyzer {

    public readonly nodeLoc: Ref<number | string | null>
    public readonly networkAnalyzer = new NetworkAnalyzer()

    //
    // Public
    //

    public constructor(nodeLoc: Ref<number | string | null>) {
        this.nodeLoc = nodeLoc
    }

    public mount(): void {
        this.networkAnalyzer.mount()
    }

    public unmount(): void {
        this.networkAnalyzer.unmount()
    }

    public node: ComputedRef<NetworkNode | null> = computed(() => {
        let result: NetworkNode | null
        if (typeof this.nodeLoc.value == "number") {
            result = null
            for (const node of this.networkAnalyzer.nodes.value) {
                if (node.node_id == this.nodeLoc.value) {
                    result = node
                    break
                }
            }
        } else if (typeof this.nodeLoc.value == "string") {
            result = null
            for (const node of this.networkAnalyzer.nodes.value) {
                if (node.node_account_id == this.nodeLoc.value) {
                    result = node
                    break
                }
            }
        } else {
            result = null
        }
        return result
    })

    public certificateHash = computed(() => {
        const hash = this.node.value?.node_cert_hash ?? null
        return hash != undefined ? byteToHex(base64DecToArr(hash)) : ""
    })

    public readonly nodeDescription: ComputedRef<string | null> = computed(
        () => this.node.value !== null ? makeNodeDescription(this.node.value) : null)

    public readonly shortNodeDescription: ComputedRef<string | null> = computed(
        () => this.nodeDescription.value ? makeShortNodeDescription(this.nodeDescription.value) : null)

    public adminKey: ComputedRef<Key | null> = computed(() => this.node.value?.admin_key ?? null)

    public nodeId: ComputedRef<number | null> = computed(() => this.node.value?.node_id ?? null)

    //
    // Public (staking)
    //

    public readonly stake = computed(() => this.node.value?.stake ?? 0)
    public readonly minStake = computed(() => this.node.value?.min_stake ?? 0)
    public readonly maxStake = computed(() => this.node.value?.max_stake ?? 0)
    public readonly stakeRewarded = computed(() => this.node.value?.stake_rewarded ?? 0)
    public readonly stakeUnrewarded = computed(() => this.node.value?.stake_not_rewarded ?? 0)
    public readonly rewardRate = computed(() => makeRewardRate(this.node.value?.reward_rate_start ?? 0))
    public readonly annualizedRate = computed(() => makeAnnualizedRate(this.node.value?.reward_rate_start ?? 0))

}
