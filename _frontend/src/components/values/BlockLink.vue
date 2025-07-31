// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div v-if="blockNumber !== undefined && blockRoute" class="is-inline-block">
    <router-link :to="blockRoute">
      <span class="h-is-numeric">{{ blockNumber }}</span>
    </router-link>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent} from "vue";

import {routeManager} from "@/utils/RouteManager.ts";

export default defineComponent({
  name: "BlockLink",

  props: {
    blockNumber: Number,
  },

  setup(props) {
    const blockRoute = computed(() => props.blockNumber !== undefined ? routeManager.makeRouteToBlock(props.blockNumber) : null)
    return {blockRoute}
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

