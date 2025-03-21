// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="chart-view">

    <div class="chart-view-header">
      <div class="chart-view-header-left">
        <div>{{ controller.chartTitle }}</div>
        <div v-if="$slots.chartViewExtra" class="chart-view-extra">
          <slot name="chartViewExtra"/>
        </div>
      </div>
      <div class="chart-view-header-right">
        <RangeSelectView :controller="props.controller"/>
      </div>
    </div>

    <div class="chart-view-container" ref="containerRef" :style="{height: props.height + 'px'}">

      <template v-if="state === ChartState.unsupported">
        <div class="unsupported">This chart is not supported for this network</div>
      </template>

      <template v-if="state === ChartState.unrevealed">
        <div class="unsupported">This chart is unrevealed</div> <!-- for debug only : should normally not appear -->
      </template>

      <template v-if="state === ChartState.loading">
        <div class="building">Loading data</div>
      </template>

      <template v-else-if="state === ChartState.error">
        <TaskPanel :mode="TaskPanelMode.error">
          <template #taskPanelMessage>Chart data are not available</template>
          <template v-if="errorExtra" #taskPanelExtra1>{{ errorExtra }}</template>
        </TaskPanel>
      </template>

      <template v-else-if="state == ChartState.empty">
        <div class="unsupported">No data for this time range</div>
        <div v-if="latestMetricDate" class="unsupported">(latest measure on {{ latestMetricDate }})</div>
      </template>

      <canvas ref="canvasRef" :style="{ display: canvasDisplay}"/>

    </div>

  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {ChartController, ChartState} from "@/charts/core/ChartController.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import RangeSelectView from "@/charts/core/RangeSelectView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<ChartController<unknown>>,
    required: true
  },
  height: {
    type: Number,
    default: 300
  }
})

const canvasRef = props.controller.canvas
const containerRef = props.controller.container
const canvasDisplay = computed(() => props.controller.state.value === ChartState.ok ? "block" : "none")
const state = props.controller.state
const errorExtra = props.controller.errorExtra
const latestMetricDate = props.controller.latestMetricDate

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.chart-view {
  display: flex;
  flex-direction: column;
  row-gap: 32px;
  font-family: var(--font-family-heading), sans-serif;
}

div.chart-view-header {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 400;
  color: var(--text-secondary);
}

div.chart-view-header-left {
  align-items: flex-start;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  font-size: 14px;
  font-weight: 400;
  row-gap: 8px;
}

div.chart-view-header-right {
  align-items: flex-start;
  color: var(--text-secondary);
  column-gap: 16px;
  display: flex;
  font-size: 14px;
  font-weight: 400;
}

div.chart-view-extra {
  font-size: 20px;
  font-weight: 500;
  color: var(--text-primary);
}

div.chart-view-container {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative; /* Required by chartjs */
  width: 100%;
}

div.building {
  text-align: center;
  color: var(--text-secondary)
}

div.unsupported {
  text-align: center;
  color: var(--text-secondary)
}

</style>
