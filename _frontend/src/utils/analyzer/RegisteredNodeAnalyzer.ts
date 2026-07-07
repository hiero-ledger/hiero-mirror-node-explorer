// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {RegisteredNode} from "@/schemas/MirrorNodeSchemas";
import {NodeCache} from "@/utils/cache/NodeCache.ts";
import {RegisteredNodeCache} from "@/utils/cache/RegisteredNodeCache.ts";
import {sortRegisteredServiceEndPoint} from "@/schemas/MirrorNodeUtils.ts";

export class RegisteredNodeAnalyzer {

    public readonly registeredNodeId: Ref<number | null>
    public readonly registeredNodeLookup = RegisteredNodeCache.instance.makeLookup()
    public readonly consensusNodeLookup = NodeCache.instance.makeLookup()

    public registeredNode = computed(() => {
        let result: RegisteredNode | null
        if (this.registeredNodeId.value !== null) {
            result = this.registeredNodeLookup.registeredNodes.value
                .find((node) => node.registered_node_id === this.registeredNodeId.value) ?? null
        } else {
            result = null
        }
        return result
    })
    public serviceEndpoints = computed(() =>
        [...(this.registeredNode.value?.service_endpoints ?? [])].sort(sortRegisteredServiceEndPoint)
    )

    public associatedConsensusNodes = computed(() => {
        const id = this.registeredNodeId.value
        const consensusNodes = this.consensusNodeLookup.entity.value
        return (id !== null && consensusNodes !== null)
            ? consensusNodes.filter((node) => node.associated_registered_nodes?.includes(id))
            : []
    })

    public constructor(registeredNodeId: Ref<number | null>) {
        this.registeredNodeId = registeredNodeId
    }

    public mount(): void {
        this.registeredNodeLookup.mount()
        this.consensusNodeLookup.mount()
    }

    public unmount(): void {
        this.registeredNodeLookup.unmount()
        this.consensusNodeLookup.unmount()
    }
}
