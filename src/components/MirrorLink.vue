// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <a v-if="isMediumScreen"
     :href="`${endpointURL}`" target="_blank"
     style="margin-top: auto;"
  >
    <div class="mirror-link">
      <span class="link-text">Raw data</span>
      <ArrowRight :size="16"/>
    </div>
  </a>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {ArrowRight} from "lucide-vue-next";
import {computed, inject, PropType} from "vue";

import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  network: String,
  entityUrl: String,
  loc: {
    type: String as PropType<string | null>,
    default: null
  },
  query: {
    type: String as PropType<string | null>,
    default: null
  }
})

const isMediumScreen = inject("isMediumScreen")

const endpointURL = computed(() => {
  let result = routeManager.currentNetworkEntry.value.url
  result += `api/v1/${props.entityUrl}`
  if (props.loc !== null) {
    result += `/${props.loc}`
  }
  if (props.query !== null) {
    result += `?${props.query}`
  }
  // console.log(`endpointURL: ${endpointURL.value}`)
  return result
})

</script>

<style scoped>

div.mirror-link {
  align-items: center;
  color: var(--icon-default-color);
  display: flex;
  gap: 2px;
  height: 18px;
  justify-content: flex-end;
}

span.link-text {
  font-family: var(--font-family-heading), sans-serif;
  font-size: 14px;
  font-weight: 400;
}

</style>
