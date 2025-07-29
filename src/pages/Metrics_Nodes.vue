// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Map
    </template>
    <template #content>
      <NodeMap :nodes="nodes"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted} from "vue";
import NodeMap from "@/components/node/NodeMap.vue";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

defineProps({
  network: String
})

const networkNodeAnalyzer = new NetworkAnalyzer()
onMounted(() => networkNodeAnalyzer.mount())
onBeforeUnmount(() => networkNodeAnalyzer.unmount())
const nodes = networkNodeAnalyzer.nodes

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
