// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="stack">
    <img ref="imgRef" :src="worldMapURL" alt=""/>
    <div>imgHeight: {{ imgSize.height }}</div>
    <div style="left:100px; top: 50px; position: absolute">o</div>
    <template v-for="(annotation, index) of props.annotations" :key="index">
      <MarkerView
          :xy="projectToXY(annotation.lat, annotation.lon)"
           :title="annotation.title"
          :sub-title="annotation.subTitle"
      />
      <div style="left:100px; top: 50px; position: absolute">o</div>
    </template>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, useTemplateRef} from "vue";
import {useElementSize} from '@vueuse/core'
import MarkerView from "@/components/node/map/MarkerView.vue";
import worldMapURL from "@/assets/world.svg";
import {MapAnnotation} from "@/components/node/map/MapAnnotation.ts";
import {projectAbsolute} from "@/components/node/map/robinson.ts";

const props = defineProps({
  annotations: {
    type: Object as PropType<MapAnnotation[]>,
    default: []
  },
})

const projectToXY = (lat: number, lon: number): { x: number, y: number} => {
  const {x, y} = projectAbsolute(lat, lon, imgSize.width.value)
  return {x: x - 10, y: y - 10}
}


const imgRef = useTemplateRef<HTMLImageElement>("imgRef")
const imgSize = useElementSize(imgRef)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.stack {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-items: stretch;
  place-items: stretch;
  width: 100%;
  position: relative;
}

</style>
