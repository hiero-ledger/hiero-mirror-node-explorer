// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="stack">
    <svg ref="svgRef" width="100%" :height="svgHeight"/>
    <slot/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onMounted, provide, ref, ShallowRef, shallowRef, useTemplateRef, watch} from "vue";
import {useElementSize} from "@vueuse/core"
import * as d3 from "d3"
import * as d3geo from "d3-geo"
import * as topojson from "topojson-client"
import {Topology} from "topojson-specification"

const svgRef = useTemplateRef<HTMLImageElement>("svgRef")
const svgSize = useElementSize(svgRef)
const svgHeight = computed(() => svgSize.width.value * mapRatio.value)

onMounted(async () => {
  watch([mapData, svgSize.width], updateMapProjection)
  watch([mapData, mapProjection, svgRef, svgSize.width], updateSVG)
  await updateMapData()
})

const mapData = shallowRef<GeoJSON.Feature|null>(null)
const updateMapData = async () => {
  const jsonMod = await import("@/assets/countries-110m.json")
  const jsonData = jsonMod.default as unknown as Topology
  mapData.value = topojson.feature(jsonData, "countries")
}

const mapProjection = shallowRef<d3geo.GeoProjection|null>(null)
const updateMapProjection = () => {
  if (mapData.value !== null) {
    mapProjection.value = d3geo.geoNaturalEarth1().fitWidth(svgSize.width.value, mapData.value)
  } else {
    mapProjection.value = null
  }
}
provide<ShallowRef<d3.GeoProjection | null>>("mapProjection", mapProjection)

const mapRatio = ref<number>(0.5)
const updateSVG = async () => {
  if (svgRef.value !== null) {

    // Removes all svg content
    while (svgRef.value.lastChild !== null) {
      svgRef.value.removeChild(svgRef.value.lastChild)
    }

    if (svgSize.width.value > 0 && mapProjection.value !== null && mapData.value !== null) {

      // Add new content
      const svg = d3.select(svgRef.value)
      const path = d3geo.geoPath(mapProjection.value)
      svg.append("path")
          .datum(mapData.value)
          .attr("d", path);

      // Update map ratio
      const mapSize = d3geo.geoBounds(mapData.value)[1]
      mapRatio.value = mapSize[1] / mapSize[0]
    }
  }
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
