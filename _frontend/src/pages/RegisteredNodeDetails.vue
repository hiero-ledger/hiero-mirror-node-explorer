// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 :page-title="pageTitle">
    <template #page-title>
      Registered Node
      <span style="white-space: nowrap; font-size: smaller">
        {{ nodeIdNb }}
      </span>
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2>
      <template #title>
        Overview
      </template>

      <template #content>
        <Property id="node-id" :full-width="true">
          <template #name>Registered Node ID</template>
          <template #value>
            <StringValue :show-none="true" :string-value="registeredNode?.registered_node_id.toString()"/>
          </template>
        </Property>

        <Property id="description" :full-width="true">
          <template #name>Description</template>
          <template #value>
            <BlobValue :base64="false" :blob-value="registeredNode?.description" :show-none="true"/>
          </template>
        </Property>

        <Property id="admin-key" :full-width="true">
          <template #name>Admin Key</template>
          <template #value>
            <KeyValue
                :key-bytes="registeredNode?.admin_key?.key"
                :key-type="registeredNode?.admin_key?._type"
                :node-id="nodeIdNb"
                :show-none="true"
            />
          </template>
        </Property>

        <Property id="service-type" :full-width="true">
          <template #name>Service Type</template>
          <template #value>
            <StringValue :show-none="true" :string-value="nodeType"/>
          </template>
        </Property>

        <Property id="service-endpoints" :full-width="true">
          <template #name>Service Endpoints</template>
          <template #value>
            <RegisteredServiceEndpoints :end-points="serviceEndpoints"></RegisteredServiceEndpoints>
          </template>
        </Property>

      </template>

      <template #footer>
        <MirrorLink :network="props.network" :query="`registerednode.id=${props.nodeId}`"
                    entityUrl="network/registered-nodes"/>
      </template>
    </DashboardCardV2>

    <DashboardCardV2>
      <template #title>
        Associated Consensus Nodes
      </template>

      <template #content>
          <NodeTable :nodes="associatedConsensusNodes" :display-staking-info="false"/>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import BlobValue from "@/components/values/BlobValue.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Property from "@/components/Property.vue";
import {PathParam} from "@/utils/PathParam";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import MirrorLink from "@/components/MirrorLink.vue";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer.ts";
import {loadingKey} from "@/AppKeys.ts";
import StringValue from "@/components/values/StringValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import {printableNodeType} from "@/schemas/MirrorNodeSchemas.ts";
import RegisteredServiceEndpoints from "@/components/values/RegisteredServiceEndpoints.vue";
import NodeTable from "@/components/node/NodeTable.vue";

const props = defineProps({
  nodeId: {
    type: String,
    required: true
  },
  network: String
})

const loading = inject(loadingKey, ref(false))

const nodeIdNb = computed(() => PathParam.parseNodeId(props.nodeId))
const pageTitle = computed(() => nodeIdNb.value !== null ? "Registered Node " + nodeIdNb.value : "Registered Node")

const networkAnalyzer = new NetworkAnalyzer()
onMounted(() => networkAnalyzer.mount())
onBeforeUnmount(() => networkAnalyzer.unmount())

const registeredNode = computed(() => networkAnalyzer.mirrorNodes.value
    .concat(networkAnalyzer.blockNodes.value)
    .concat(networkAnalyzer.rpcRelays.value)
    .find((node) => node.registered_node_id === nodeIdNb.value) ?? null)

const nodeType = computed(() =>
    registeredNode.value ? printableNodeType(registeredNode.value.service_endpoints[0].type) : null
)

const serviceEndpoints = computed(() =>
    registeredNode.value?.service_endpoints ?? []
)

const associatedConsensusNodes = computed(() => {
  const id = nodeIdNb.value
  return id !== null
      ? networkAnalyzer.nodes.value.filter((node) => node.associated_registered_nodes.includes(id))
      : []
})

const notification = computed(() => {
  let result: string | null
  if (!loading.value && registeredNode.value === null) {
    result = "Invalid Registered Node ID"
  } else {
    result = null
  }
  return result
})

</script>

<style/>
