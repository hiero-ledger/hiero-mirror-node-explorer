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

import {onBeforeUnmount, onMounted} from "vue";
import Network_RegisteredNodes from "@/components/node/Network_RegisteredNodes.vue";
import {RegisteredNodeCache} from "@/utils/cache/RegisteredNodeCache.ts";

defineProps({
  network: String
})

const registeredNodeLookup = RegisteredNodeCache.instance.makeLookup()
onMounted(() => registeredNodeLookup.mount())
onBeforeUnmount(() => registeredNodeLookup.unmount())
const blockNodes = registeredNodeLookup.blockNodes

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

