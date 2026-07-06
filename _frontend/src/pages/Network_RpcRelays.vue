// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Network_RegisteredNodes
      :nodes="registeredNodes"
      :filter-service-type="RegisteredNodeType.RPC_RELAY"
      subtitle="JSON-RPC relays provide Ethereum-compatible RPC interfaces for interacting with Hedera smart contracts and EVM tooling."
      title="JSON-RPC Relays"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {onBeforeUnmount, onMounted} from "vue";
import Network_RegisteredNodes from "@/components/node/Network_RegisteredNodes.vue";
import {RegisteredNodeCache} from "@/utils/cache/RegisteredNodeCache.ts";
import {RegisteredNodeType} from "@/schemas/MirrorNodeSchemas.ts";

defineProps({
  network: String
})

const registeredNodeLookup = RegisteredNodeCache.instance.makeLookup()
onMounted(() => registeredNodeLookup.mount())
onBeforeUnmount(() => registeredNodeLookup.unmount())
const registeredNodes = registeredNodeLookup.registeredNodes

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
