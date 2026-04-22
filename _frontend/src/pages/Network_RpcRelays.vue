// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Network_RegisteredNodes
      :nodes="rpcRelays"
      subtitle="JSON-RPC relays provide Ethereum-compatible RPC interfaces for interacting with Hedera smart contracts and EVM tooling."
      title="JSON-RPC Relays"
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
const rpcRelays = networkAnalyzer.rpcRelays

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
