// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ModalDialog v-model:show-dialog="visible" :width="350">

    <template #modalDialogContent>
      <TaskPanel :mode="TaskPanelMode.error">
        <template #taskPanelMessage>
          <slot name="alertDialogMessage"/>
        </template>
        <template #taskPanelExtra1>
          <slot name="alertDialogExtra"/>
        </template>
      </TaskPanel>
    </template>

    <template #modalDialogButtons>
      <ModalDialogButton v-model:show-dialog="visible">CLOSE</ModalDialogButton>
    </template>

  </ModalDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import ModalDialog from "@/dialogs/core/ModalDialog.vue";
import ModalDialogButton from "@/dialogs/core/ModalDialogButton.vue";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";

const visible = defineModel("visible", {
  type: Boolean,
  required: true
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>
