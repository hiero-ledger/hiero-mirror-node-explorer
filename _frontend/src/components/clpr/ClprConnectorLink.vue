// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link
      v-if="props.channelId && props.connectorId"
      :to="routeManager.makeRouteToClprConnector(props.channelId, props.connectorId)"
  >
    <HexaValue :byte-string="props.connectorId" :copyable="false"/>
  </router-link>
  <span v-else class="h-is-low-contrast">None</span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import HexaValue from "@/components/values/HexaValue.vue";
import {routeManager} from "@/utils/RouteManager.ts";

// Cross-link to a connector, which is identified by its channel and its own id, for use outside of tables and not
// on the connector details themselves (there the id remains copyable).
const props = defineProps({
  channelId: {
    type: String as PropType<string | null>,
    default: null
  },
  connectorId: {
    type: String as PropType<string | null>,
    default: null
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
