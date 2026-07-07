// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Network_RegisteredNodes
      :filter-service-type="RegisteredNodeType.MIRROR_NODE"
      subtitle="Mirror Nodes provide indexed query access to network data for analytics, APIs, and explorer integrations."
      title="Mirror Nodes"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import Network_RegisteredNodes from "@/components/node/Network_RegisteredNodes.vue";
import {RegisteredNodeType} from "@/schemas/MirrorNodeSchemas.ts";

defineProps({
  network: String
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

