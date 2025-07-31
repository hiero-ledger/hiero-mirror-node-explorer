// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                 -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <Tabs :tab-ids=tabIds :tab-labels=tabLabels v-model:selected-tab="selectedAgentId" :compact="true"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import Tabs from "@/components/Tabs.vue"
import {computed, PropType} from "vue"
import {SearchController} from "@/components/search/SearchController";


const props = defineProps({
  searchController: {
    type: Object as PropType<SearchController>,
    required: true
  }
})

const selectedAgentId = defineModel("selectedAgentId", {
  type: String as PropType<string | null>,
  default: null
})

const selectableAgents = computed(() => props.searchController.visibleAgents.value)

const tabIds = computed(() => {
  const result: string[] = []
  for (const a of selectableAgents.value) {
    result.push(a.id)
  }
  return result
})

const tabLabels = computed(() => {
  const result: string[] = []
  for (const a of selectableAgents.value) {
    result.push(a.title)
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
