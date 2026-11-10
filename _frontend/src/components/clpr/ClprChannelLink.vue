// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link v-if="props.channelId" :to="routeManager.makeRouteToClprChannel(props.channelId)">
    <HexaValue :byte-string="props.channelId" :copyable="false"/>
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

// Cross-link to a channel, for use outside of tables and not on the channel details themselves
// (there the id remains copyable).
const props = defineProps({
  channelId: {
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
