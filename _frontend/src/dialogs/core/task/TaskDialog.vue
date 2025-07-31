// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ModalDialog v-model:show-dialog="props.controller.showDialog.value" :width="props.width">

    <template #modalDialogTitle>
      <slot name="taskDialogTitle"/>
    </template>

    <template #modalDialogContent>

      <StackView :visible-index="visibleIndex">
        <div class="dialog-layer-input">
          <div class="task-dialog-input">
            <slot name="taskDialogInput"/>
          </div>
          <div v-if="slots.taskDialogControls" class="task-dialog-controls">
            <slot name="taskDialogControls"/>
          </div>
        </div>
        <div class="dialog-layer-busy">
          <slot name="taskDialogBusy">
            <TaskPanel :mode="TaskPanelMode.busy">
              <template #taskPanelMessage>Processing</template>
            </TaskPanel>
          </slot>
        </div>
        <div class="dialog-layer-success">
          <slot name="taskDialogSuccess">
            <TaskPanel :mode="TaskPanelMode.success">
              <template #taskPanelMessage>Operation did succeed</template>
            </TaskPanel>
          </slot>
        </div>
        <div class="dialog-layer-error">
          <slot name="taskDialogError">
            <TaskPanel :mode="TaskPanelMode.error">
              <template #taskPanelMessage>Operation did fail</template>
              <template v-if="props.controller.executeError.value" #taskPanelExtra1>
                {{ JSON.stringify(props.controller.executeError.value) }}
              </template>
            </TaskPanel>
          </slot>
        </div>
      </StackView>

    </template>

    <template #modalDialogButtons>

      <template v-if="state == TaskDialogState.Input || state == TaskDialogState.Busy">

        <ModalDialogButton
            v-model:show-dialog="props.controller.showDialog.value"
            :enabled="cancelButtonEnabled">
          CANCEL
        </ModalDialogButton>

        <ModalDialogButton
            v-model:show-dialog="props.controller.showDialog.value"
            :enabled="executeButtonEnabled"
            :auto-close="false"
            :is-default="true"
            @action="handleExecute">
          <slot name="taskExecuteLabel">EXECUTE</slot>
        </ModalDialogButton>

      </template>

      <template v-else>

        <ModalDialogButton
            v-model:show-dialog="props.controller.showDialog.value">CLOSE
        </ModalDialogButton>

      </template>

    </template>

  </ModalDialog>

  <!-- Confirmation dialog -->

  <ModalDialog v-if="confirmationRequired"
               v-model:show-dialog="showConfirmDialog"
               :width="300"
  >
    <template #modalDialogContent>
      <slot name="taskDialogConfirm"/>
    </template>
    <template #modalDialogButtons>
      <ModalDialogButton v-model:show-dialog="showConfirmDialog">
        CANCEL
      </ModalDialogButton>
      <ModalDialogButton v-model:show-dialog="showConfirmDialog" @action="handleConfirmExecute" is-default>
        CONFIRM
      </ModalDialogButton>
    </template>
  </ModalDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, ref, useSlots, watch} from "vue";
import ModalDialog from "@/dialogs/core/ModalDialog.vue";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import ModalDialogButton from "@/dialogs/core/ModalDialogButton.vue";
import StackView from "@/elements/StackView.vue";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TaskController>,
    required: true
  },
  width: {
    type: Number,
  },
})

enum TaskDialogState {
  Input,
  Busy,
  Error,
  Success
}

const state = ref<TaskDialogState>(TaskDialogState.Input)
watch(props.controller.showDialog, (show) => {
  if (!show) {
    changeState(TaskDialogState.Input)
  }
})

const emit = defineEmits(["taskDialogDidSucceed"])

const slots = useSlots()

const handleExecute = async () => {

  if (confirmationRequired) {
    showConfirmDialog.value = true
  } else {
    await handleConfirmExecute()
  }

}

const handleConfirmExecute = async () => {
  changeState(TaskDialogState.Busy)
  try {
    await props.controller.execute()
    props.controller.executeError.value = null
    changeState(TaskDialogState.Success)
  } catch (error) {
    props.controller.executeError.value = error
    changeState(TaskDialogState.Error)
  }
}

const confirmationRequired = "taskDialogConfirm" in useSlots()

const cancelButtonEnabled = computed(
    () => state.value == TaskDialogState.Input)

const executeButtonEnabled = computed(
    () => state.value == TaskDialogState.Input && props.controller.canBeExecuted())

const visibleIndex = computed((): number => {
  let result: number
  switch (state.value) {
    case TaskDialogState.Input:
      result = 0
      break
    case TaskDialogState.Busy:
      result = 1
      break
    case TaskDialogState.Success:
      result = 2
      break
    case TaskDialogState.Error:
      result = 3
      break
  }
  return result
})

const changeState = (newValue: TaskDialogState) => {
  state.value = newValue
  if (newValue === TaskDialogState.Success) {
    emit("taskDialogDidSucceed")
  }
}

const showConfirmDialog = ref(false)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.dialog-layer-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 16px;
  height: 100%;
}

div.dialog-layer-busy {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%
}

div.dialog-layer-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%
}

div.dialog-layer-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%
}

div.task-dialog-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  row-gap: 16px;
  width: 100%;
  flex-grow: 1;
}

div.task-dialog-controls {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: var(--text-error);
  align-items: center;
  row-gap: 4px;
  width: 100%;
  text-align: center;
  min-height: 40px;
  flex-grow: 0;
  justify-content: flex-end;
}

</style>
