// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link v-if="nodeRoute !== null && nodeName !== null"  :to="nodeRoute">
    <span class="node-name">{{ nodeName }}</span>
  </router-link>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {NetworkNode} from "@/schemas/MirrorNodeSchemas.ts";
import {makeNodeOwnerDescription} from "@/schemas/MirrorNodeUtils.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  node: {
    type: Object as PropType<NetworkNode|null>,
    default: null
  }
})

const nodeName = computed(() => {
  return props.node !== null ? makeNodeOwnerDescription(props.node, true) : null
})

const nodeRoute = computed(() => {
  return props.node !== null ? routeManager.makeRouteToNode(props.node.node_id) : null
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.node-name {
  color: var(--text-primary);
  font-size: 12px
}

</style>
