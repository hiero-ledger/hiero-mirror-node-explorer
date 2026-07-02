// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Network_RegisteredNodes
      :nodes="generalServices"
      subtitle="General services are services provided by a registered node but not currently defined as part of the Hiero Ledger system."
      title="General Services"
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
const generalServices = registeredNodeLookup.generalServices

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
