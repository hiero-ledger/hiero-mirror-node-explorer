// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <WorldMap :annotations="annotations"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onMounted, PropType, ref, watch} from "vue";
import WorldMap from "@/components/node/map/WorldMap.vue";
import {NetworkNode} from "@/schemas/MirrorNodeSchemas.ts";
import {MapAnnotation} from "@/components/node/map/MapAnnotation.ts";
import {makeNodeOwnerDescription} from "@/schemas/MirrorNodeUtils.ts";

const props = defineProps({
  nodes: {
    type: Object as PropType<Array<NetworkNode>>,
    required: true
  },
  stakeTotal: Number
})

interface NodeLocation {
  lat: number,
  lon: number,
  publicKey: string
}

const nodeLocationMap = new Map<string, NodeLocation>()
const loadNodeLocations = async () => {
  try {
    const nodeLocationMod = await import("@/assets/node-locations.json")
    const nodeLocations = nodeLocationMod.default as NodeLocation[]
    for (const nl of nodeLocations) {
      nodeLocationMap.set(nl.publicKey, nl)
    }
  } catch (error) {
    console.log(error)
    // Keeps locationMap empty
  }
}

const updateAnnotations = async () => {

  if (nodeLocationMap.size === 0 && props.nodes.length >= 1) {
    await loadNodeLocations()
  }

  const newAnnotations: MapAnnotation[] = []
  for (const node of props.nodes) {
    if (node.public_key !== null) {
      const nl = nodeLocationMap.get(node.public_key)
      if (nl) {
        newAnnotations.push({
          lat: nl.lat,
          lon: nl.lon,
          title: makeNodeOwnerDescription(node, true),
          subTitle: ""
        })
      }
    }
  }

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
