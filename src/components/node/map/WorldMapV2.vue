// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="stack">
    <svg ref="svgRef" width="100%" :height="svgHeight"/>
    <template v-for="(annotation, index) of props.annotations" :key="index">
      <MarkerView
          :xy="projectToXY(annotation.lat, annotation.lon)"
          :title="annotation.title"
          :sub-title="annotation.subTitle"
      />
    </template>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onMounted, PropType, ref, shallowRef, useTemplateRef, watch} from "vue";
import {useElementSize} from "@vueuse/core"
import * as d3 from "d3"
import * as d3geo from "d3-geo"
import * as topojson from "topojson-client"
import { Topology } from "topojson-specification"
import {MapAnnotation} from "@/components/node/map/MapAnnotation.ts";
import MarkerView from "@/components/node/map/MarkerView.vue";

const props = defineProps({
  annotations: {
    type: Object as PropType<MapAnnotation[]>,
    default: []
  },
})

const svgRef = useTemplateRef<HTMLImageElement>("svgRef")
const svgSize = useElementSize(svgRef)
const svgHeight = computed(() => svgSize.width.value * mapRatio.value)

onMounted(() => {
  watch([svgRef, svgSize.width], updateSVG, {immediate: true})
})

const mapRatio = ref(0.5)
const mapProjection = shallowRef<d3geo.GeoProjection|null>(null)
let mapFeatures: GeoJSON.Feature | null = null

const updateSVG = async () => {
  if (svgRef.value !== null && svgSize.width.value > 0) {

    // Removes all svg content
    while (svgRef.value.lastChild !== null) {
      svgRef.value.removeChild(svgRef.value.lastChild)
    }

    // Add new content
    const svg = d3.select(svgRef.value)
    // .attr("width", width)
    // .attr("height", height);

    if (mapFeatures === null) {
      const jsonMod = await import("@/assets/countries-110m.json")
      const jsonData = jsonMod.default as unknown as Topology
      mapFeatures = topojson.feature(jsonData, "countries")
    }
    mapProjection.value = d3geo.geoNaturalEarth1().fitWidth(svgSize.width.value, mapFeatures)

    const path = d3geo.geoPath(mapProjection.value)
    svg.append("path")
        .datum(mapFeatures)
        .attr("d", path);

    const mapSize = d3geo.geoBounds(mapFeatures)[1]
    mapRatio.value = mapSize[1] / mapSize[0]

  }
}

const projectToXY = (lat: number, lon: number): { x: number; y: number } => {
  const p = mapProjection.value !== null ? mapProjection.value([lon, lat]) : null
  return p !== null ? { x: p[0], y: p[1]} : {x: 0, y: 0}
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.stack {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-items: flex-start;
  position: relative;
}

div > svg {
  fill: var(--border-secondary);
  stroke: var(--border-primary)
}

</style>
