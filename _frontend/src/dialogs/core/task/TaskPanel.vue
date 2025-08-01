// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="task-panel">

    <template v-if="props.mode === TaskPanelMode.success">
      <CircleCheck :size="48" style="color: var(--text-success)"/>
    </template>
    <template v-else-if="props.mode === TaskPanelMode.error">
      <TriangleAlert :size="48" style="color: var(--text-error)"/>
    </template>
    <template v-else-if="props.mode === TaskPanelMode.busy">
      <SpinnerView :size="48"/>
    </template>

    <div class="task-panel-message">
      <slot name="taskPanelMessage"/>
    </div>
    <div v-if="slots.taskPanelExtra1" class="task-panel-extra">
      <slot name="taskPanelExtra1"/>
    </div>
    <div v-if="slots.taskPanelExtra2" class="task-panel-extra">
      <slot name="taskPanelExtra2"/>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, useSlots} from "vue";
import {CircleCheck, TriangleAlert} from 'lucide-vue-next';
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import SpinnerView from "@/elements/SpinnerView.vue";

const props = defineProps({
  mode: {
    type: String as PropType<TaskPanelMode>,
    default: TaskPanelMode.busy
  }
})

const slots = useSlots()

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.task-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 24px;
  width: 100%;
}

div.task-panel-message {
  align-items: center;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  row-gap: 8px;
  text-align: center;
}

div.task-panel-extra {
  align-items: center;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-proportional), sans-serif;
  font-size: 14px;
  font-weight: 400;
  row-gap: 4px;
  text-align: center;
}

</style>
