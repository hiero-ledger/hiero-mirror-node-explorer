// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TabsView
      v-model:selected-tab="selectedRange"
      :tab-ids="ids"
      :tab-labels="labels"
      :active-tabs="active"
      :is-enabled="!loading"
  />
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {ChartController, ChartState} from "@/charts/core/ChartController.ts";
import {ChartRange} from "@/charts/core/ChartRange.ts";
import TabsView from "@/components/TabsView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<ChartController<unknown>>,
    required: true
  }
})

const ids = [ChartRange.day, ChartRange.month, ChartRange.year, ChartRange.all]
const labels = ['24h', '30d', '1Y', 'All']
const active = computed(() => [
  dayRangeSupported.value,
  monthRangeSupported.value,
  yearRangeSupported.value,
  allRangeSupported.value
])

const loading = computed(() => props.controller.state.value === ChartState.loading)
const selectedRange = props.controller.range
const dayRangeSupported = computed(() => props.controller.isRangeSupported(ChartRange.day))
const monthRangeSupported = computed(() => props.controller.isRangeSupported(ChartRange.month))
const yearRangeSupported = computed(() => props.controller.isRangeSupported(ChartRange.year))
const allRangeSupported = computed(() => props.controller.isRangeSupported(ChartRange.all))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
