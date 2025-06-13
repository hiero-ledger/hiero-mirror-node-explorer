// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div ref="containerRef" class="container" :style="{left: iconX + 'px', top: iconY + 'px' }">
    <MapPin :size="iconSize"/>
    <div>{{ props.title }}</div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {MapPin} from 'lucide-vue-next';
import {computed, PropType, useTemplateRef} from "vue";
import {useElementSize} from "@vueuse/core";

const props = defineProps({
  xy: {
    type: Object as PropType<{x: number, y: number}>,
    required: true
  },
  title: {
    type: String,
    default: ""
  },
  subTitle: {
    type: String,
    default: ""
  }
})

const containerRef = useTemplateRef<HTMLDivElement>("containerRef")
const containerSize = useElementSize(containerRef)

const iconSize = 24
const iconX = computed(() => props.xy.x - containerSize.width.value / 2)
const iconY = computed(() => props.xy.y - iconSize)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
}
</style>
