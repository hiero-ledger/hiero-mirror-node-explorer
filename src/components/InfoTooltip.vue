// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <Tooltip
      v-if="props.warningLabel || props.label"
      id="info-tooltip"
      :text="props.warningLabel ?? props.label"
      :position="props.position"
      style="height: 16px;"
  >
    <TriangleAlert v-if="props.warningLabel" :size="16" style="color: var(--network-text-accent-color);"/>
    <Info v-else :size="16" style="color: var(--network-text-accent-color);"/>
  </Tooltip>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import Tooltip from "@/components/Tooltip.vue";
import {Info, TriangleAlert} from "lucide-vue-next"

const props = defineProps({
  warningLabel: {
    type: String as PropType<string | null>,
    default: null
  },
  label: {
    type: String as PropType<string | null>,
    default: null
  },
  position: {
    type: String as PropType<"auto" | "left" | "right" | "bottom" | "top" | "bottom-left" | "top-right" | "top-left" | "bottom-right">,
    default: 'auto'
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
