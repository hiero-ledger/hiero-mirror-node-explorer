// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      <span>{{ `${nodes.length}  Nodes` }}</span>
    </template>
    <template #content>
      <NodeTable :nodes="nodes" :stake-total="totalStakeForConsensus"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NodeTable from "@/components/node/NodeTable.vue";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer.ts";
import {onBeforeUnmount, onMounted} from "vue";

defineProps({
  network: String
})

const networkNodeAnalyzer = new NetworkAnalyzer()
onMounted(() => networkNodeAnalyzer.mount())
onBeforeUnmount(() => networkNodeAnalyzer.unmount())
const nodes = networkNodeAnalyzer.nodes
const totalStakeForConsensus = networkNodeAnalyzer.totalStakeForConsensus

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
