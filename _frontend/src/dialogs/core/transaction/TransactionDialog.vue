// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TaskDialog :controller="props.controller" @task-dialog-did-succeed="taskDidSucceed" :width="props.width">

    <!-- title -->
    <template #taskDialogTitle>
      <slot name="transactionDialogTitle"/>
    </template>

    <!-- input -->
    <template #taskDialogInput>
      <template v-if="walletSupported">
        <slot name="transactionDialogInput"/>
      </template>
      <template v-else>
        <TaskPanel :mode="TaskPanelMode.error">
          <template #taskPanelMessage>This operation cannot be done using {{ walletName }}</template>
          <template #taskPanelExtra1>Use another wallet (Blade or HashPack)</template>
        </TaskPanel>
      </template>
    </template>

    <!-- label -->
    <template #taskExecuteLabel>
      <slot name="transactionExecutionLabel"/>
    </template>

    <!-- confirm -->
    <template v-if="$slots.transactionDialogConfirm" #taskDialogConfirm>
      <slot name="transactionDialogConfirm"/>
    </template>

    <!-- busy -->
    <template #taskDialogBusy>
      <TaskPanel :mode="TaskPanelMode.busy">
        <template #taskPanelMessage>Processing</template>
        <template #taskPanelExtra1>
          <div>Check {{ walletName }} for any approval request</div>
        </template>
        <template #taskPanelExtra2>
          <img :src="walletIconURL" height=32 alt="Wallet Logo"/>
        </template>
      </TaskPanel>
    </template>

    <!-- success -->
    <template #taskDialogSuccess>
      <TaskPanel :mode="TaskPanelMode.success">
        <template #taskPanelMessage>Operation did complete</template>
        <template v-if="controller.transactionId.value" #taskPanelExtra1>
          Transaction ID: {{ transactionId }}
        </template>
        <template v-if="controller.isFailedResult.value" #taskPanelExtra2>
          Result: {{ controller.transactionResult.value }}
        </template>
      </TaskPanel>
    </template>

    <!-- controls -->
    <template v-if="slots.transactionDialogControls" #taskDialogControls>
      <slot name="transactionDialogControls"/>
    </template>

  </TaskDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, useSlots} from "vue";
import TaskDialog from "@/dialogs/core/task/TaskDialog.vue";
import {TransactionController} from "@/dialogs/core/transaction/TransactionController.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import {walletManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TransactionController>,
    required: true
  },
  nativeWalletOnly: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
  }
})

const emit = defineEmits(["transactionDidExecute"])

const slots = useSlots()

const walletName = walletManager.walletName
const walletIconURL = computed(() => walletManager.walletIconURL.value ?? "")
const walletSupported = computed(() => !props.nativeWalletOnly || walletManager.isHieroWallet.value)
const transactionId = props.controller.transactionId

const taskDidSucceed = () => {
  emit("transactionDidExecute", props.controller.transactionId.value)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
