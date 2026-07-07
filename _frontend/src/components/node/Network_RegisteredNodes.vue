// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      <span>{{ `${filteredNodes.length}  ${props.title}` }}</span>
    </template>
    <template #content>
      <p class="mb-4 h-is-low-contrast"> {{ props.subtitle }}</p>
      <RegisteredNodeTable :filter-service-type="props.filterServiceType" :nodes="filteredNodes"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import RegisteredNodeTable from "@/components/node/RegisteredNodeTable.vue";
import {RegisteredNodeType} from "@/schemas/MirrorNodeSchemas.ts";
import {RegisteredNodeCache} from "@/utils/cache/RegisteredNodeCache.ts";

const props = defineProps({
  title: String,
  subtitle: String,
  filterServiceType: {
    type: Object as PropType<RegisteredNodeType | null>,
    default: null
  }
})

const registeredNodeLookup = RegisteredNodeCache.instance.makeLookup()
onMounted(() => registeredNodeLookup.mount())
onBeforeUnmount(() => registeredNodeLookup.unmount())
const registeredNodes = registeredNodeLookup.registeredNodes

const filteredNodes = computed(() => {
  if (props.filterServiceType === null) {
    return registeredNodes.value
  }
  return registeredNodes.value.filter(node => {
    return node.service_endpoints.some(endPoint => endPoint.type === props.filterServiceType)
  })
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
