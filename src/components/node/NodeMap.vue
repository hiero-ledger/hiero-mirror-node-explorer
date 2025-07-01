// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <WorldMap>
    <template v-for="p in markerData" :key="p.placeName">
      <MapAnnotation :lat="p.lat" :lon="p.lon">
        <MarkerDropdown :place="p" @action="onClick(p)"/>
      </MapAnnotation>
    </template>
  </WorldMap>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onMounted, PropType, ref, watch} from "vue";
import MapAnnotation from "@/components/node/map/utils/MapAnnotation.vue";
import MarkerDropdown from "@/components/node/map/MarkerDropdown.vue";
import WorldMap from "@/components/node/map/utils/WorldMap.vue";
import {GeoLocationCache} from "@/utils/cache/GeoLocationCache.ts";
import {MarkerData} from "@/components/node/map/MarkerData.ts";
import {NetworkNode} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  nodes: {
    type: Object as PropType<Array<NetworkNode>>,
    required: true
  },
  stakeTotal: Number
})

const markerData = ref<MarkerData[]>([])
onMounted(() => {
  watch(() => props.nodes, updateMarkerData, {immediate: true})
})
const updateMarkerData = async () => {

  const geoLocationBook = await GeoLocationCache.instance.lookup()

  const newData: MarkerData[] = []
  for (const p of geoLocationBook.places) {
    const nodeEntries = await findNodesAtPlace(p.name)
    if (nodeEntries.length > 0) {
      newData.push({
        lat: p.lat,
        lon: p.lon,
        placeName: p.name,
        nodes: nodeEntries
      })
    }
  }

  markerData.value = newData
}

const findNodesAtPlace = async (placeName: string): Promise<NetworkNode[]>  => {
  const result: NetworkNode[] = []
  const book = await GeoLocationCache.instance.lookup()
  for (const n of props.nodes) {
    if (n.public_key) {
      const place = book.findPlace(n.public_key)
      if (place !== null && place.name == placeName) {
        result.push(n)
      }
    }
  }
  return Promise.resolve(result)
}

const onClick = (p: MarkerData): void => {
  console.log("click" + JSON.stringify(p))
}


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
