// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Network_RegisteredNodes
      :nodes="mirrorNodes"
      subtitle="Mirror Nodes provide indexed query access to network data for analytics, APIs, and explorer integrations."
      title="Mirror Nodes"
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
const mirrorNodes = registeredNodeLookup.mirrorNodes

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

