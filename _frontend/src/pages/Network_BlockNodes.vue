// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Network_RegisteredNodes
      :nodes="blockNodes"
      subtitle="Block Nodes provide verifiable block data derived from Block Streams and serve as canonical data sources for explorer and mirror tooling."
      title="Block Nodes"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer.ts";
import {onBeforeUnmount, onMounted} from "vue";
import Network_RegisteredNodes from "@/components/node/Network_RegisteredNodes.vue";

defineProps({
  network: String
})

const networkAnalyzer = new NetworkAnalyzer()
onMounted(() => networkAnalyzer.mount())
onBeforeUnmount(() => networkAnalyzer.unmount())
const blockNodes = networkAnalyzer.blockNodes

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

