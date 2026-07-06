// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
        <span>{{
            `${associatedNodes.length}  Associated Registered ${associatedNodes.length > 1 ? 'Nodes' : 'Node'}`
          }}</span>
    </template>
    <template #content>
      <RegisteredNodeTable :nodes="associatedNodes"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {RegisteredNode} from "@/schemas/MirrorNodeSchemas.ts";
import RegisteredNodeTable from "@/components/node/RegisteredNodeTable.vue";
import {RegisteredNodeCache} from "@/utils/cache/RegisteredNodeCache.ts";

const props = defineProps({
  nodeIds: {
    type: Object as PropType<Array<number>>,
    required: true
  },
})

const registeredNodeLookup = RegisteredNodeCache.instance.makeLookup()
onMounted(() => {
  registeredNodeLookup.mount()
})
onBeforeUnmount(() => {
  registeredNodeLookup.unmount()
})

const associatedNodes = computed(() => {
  return registeredNodeLookup.registeredNodes.value
      .filter((node) => props.nodeIds.includes(node.registered_node_id)) as Array<RegisteredNode>
})
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
