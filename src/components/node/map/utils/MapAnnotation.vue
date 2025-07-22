// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div ref="containerRef" class="container" :style="containerStyle">
    <slot/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, ref, ShallowRef} from "vue";
import * as d3 from "d3";

const props = defineProps({
  lat: {
    type: Number,
    required: true
  },
  lon: {
    type: Number,
    required: true
  }
})

const mapProjection = inject<ShallowRef<d3.GeoProjection | null>>("mapProjection", ref(null))
const projectToXY = (lat: number, lon: number): { x: number; y: number } => {
  const p = mapProjection.value !== null ? mapProjection.value([lon, lat]) : null
  return p !== null ? { x: p[0], y: p[1]} : {x: 0, y: 0}
}

const xy = computed<{x: number; y: number}>(() => {
  return projectToXY(props.lat, props.lon)
})

const containerStyle = computed(() => {
  return { "left": xy.value.x + "px", "top": xy.value.y + "px" }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.container {
  position: absolute;
}

</style>
