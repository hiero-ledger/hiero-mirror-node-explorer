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
import {makeNodeOwnerDescription} from "@/schemas/MirrorNodeUtils.ts";
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
    newAnnotations.push({
      lat: p.lat,
      lon: p.lon,
      title: p.name,
      subTitle: ""
    })
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
