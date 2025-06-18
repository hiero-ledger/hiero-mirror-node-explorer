// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <WorldMapV2 :annotations="annotations"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onMounted, PropType, ref, watch} from "vue";
import WorldMapV2 from "@/components/node/map/WorldMapV2.vue";
import {NetworkNode} from "@/schemas/MirrorNodeSchemas.ts";
import {MapAnnotation} from "@/components/node/map/MapAnnotation.ts";
import makeNodeOwnerName} from "@/schemas/MirrorNodeUtils.ts";
import {GeoLocationCache} from "@/utils/cache/GeoLocationCache.ts";

const props = defineProps({
  nodes: {
    type: Object as PropType<Array<NetworkNode>>,
    required: true
  },
  stakeTotal: Number
})

const updateAnnotations = async () => {

  const geoLocationBook = await GeoLocationCache.instance.lookup()

  const newAnnotations: MapAnnotation[] = []
  for (const p of geoLocationBook.places) {
    const nodeEntries = await findNodesAtPlace(p.name)
    const nodeNames = nodeEntries.map((n) => makeNodeOwnerName(n)).sort()
    if (nodeNames.length > 0) {
      newAnnotations.push({
        lat: p.lat,
        lon: p.lon,
        title: nodeNames,
        placement: p.labelPlacement,
      })
    }
  }

  // const newAnnotations: MapAnnotation[] = []
  // for (const node of props.nodes) {
  //   if (node.public_key !== null) {
  //     const place = GeoLocationCache.instance.lookup(node.public_key)
  //     const nl = nodeLocationMap.get(node.public_key)
  //     if (nl) {
  //       newAnnotations.push({
  //         lat: nl.lat,
  //         lon: nl.lon,
  //         title: makeNodeOwnerDescription(node, true),
  //         subTitle: ""
  //       })
  //     }
  //   }
  // }

  annotations.value = newAnnotations
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

const annotations = ref<MapAnnotation[]>([])
onMounted(() => {
  watch(() => props.nodes, updateAnnotations, {immediate: true})
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
