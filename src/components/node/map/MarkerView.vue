// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div ref="containerRef" class="container" :style="containerStyle">
    <Circle :size="iconSize"/>
    <div style="font-size: 12px">{{ props.title }}</div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {Circle} from 'lucide-vue-next';
import {computed, PropType, StyleValue, useTemplateRef} from "vue";
import {useElementSize} from "@vueuse/core";
import {LabelPlacement} from "@/utils/cache/GeoLocationCache.ts";

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
  },
  placement: {
    type: String as PropType<LabelPlacement>,
    default: "south"
  }
})

const containerRef = useTemplateRef<HTMLDivElement>("containerRef")
const containerSize = useElementSize(containerRef)

const iconSize = 10

const containerStyle = computed(() => {
  let result: StyleValue = {}
  switch(props.placement) {
    case "north":
      result["left"]    = (props.xy.x - containerSize.width.value / 2) + "px"
      result["top"]     = (props.xy.y - containerSize.height.value + iconSize / 2) + "px"
      result["flex-direction"] = "column-reverse"
      break
    case "south":
      result["left"]    = (props.xy.x - containerSize.width.value / 2) + "px"
      result["top"]     = (props.xy.y - iconSize / 2) + "px"
      result["flex-direction"] = "column"
      break
    case "west":
      result["left"]    = (props.xy.x - containerSize.width.value + iconSize / 2) + "px"
      result["top"]     = (props.xy.y - containerSize.height.value / 2) + "px"
      result["flex-direction"] = "row-reverse"
      break
    case "east":
      result["left"]    = (props.xy.x - iconSize / 2) + "px"
      result["top"]     = (props.xy.y - containerSize.height.value / 2) + "px"
      result["flex-direction"] = "row"
      break
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.container {
  display: flex;
  position: absolute;
  align-items: center;
  column-gap: 2px;
}

</style>
