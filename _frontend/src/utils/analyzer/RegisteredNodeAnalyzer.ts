// SPDX-License-Identifier: Apache-2.0

import {computed, Ref} from "vue";
import {printableNodeType, RegisteredNode} from "@/schemas/MirrorNodeSchemas";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer";

export class RegisteredNodeAnalyzer {

    public readonly registeredNodeId: Ref<number | null>
    public readonly networkAnalyzer: NetworkAnalyzer = new NetworkAnalyzer()

    public registeredNode = computed(() => {
        let result: RegisteredNode | null
        if (this.registeredNodeId.value !== null) {
            result = this.networkAnalyzer.mirrorNodes.value
                .concat(this.networkAnalyzer.blockNodes.value)
                .concat(this.networkAnalyzer.rpcRelays.value)
                .find((node) => node.registered_node_id === this.registeredNodeId.value) ?? null
        } else {
            result = null
        }
        return result
    })
    public serviceEndpoints = computed(() =>
        this.registeredNode.value?.service_endpoints ?? []
    )
    public nodeType = computed(() =>
        this.serviceEndpoints.value.length > 0
            ? printableNodeType(this.serviceEndpoints.value[0].type)
            : null
    )

    public associatedConsensusNodes = computed(() => {
        const id = this.registeredNodeId.value
        return id !== null
            ? this.networkAnalyzer.nodes.value.filter((node) => node.associated_registered_nodes && node.associated_registered_nodes.includes(id))
            : []
    })

    public constructor(registeredNodeId: Ref<number | null>) {
        this.registeredNodeId = registeredNodeId
    }

    public mount(): void {
        this.networkAnalyzer.mount()
    }

    public unmount(): void {
        this.networkAnalyzer.unmount()
    }
}
