// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TaskDialog :controller="props.controller"
              @task-dialog-did-succeed="taskDidSucceed"
              :width="props.width">

    <!-- title -->
    <template #taskDialogTitle>
      <slot name="transactionGroupDialogTitle"/>
    </template>

    <!-- label -->
    <template #taskExecuteLabel>
      <slot name="transactionGroupExecutionLabel"/>
    </template>

    <!-- confirm -->
    <template v-if="$slots.transactionGroupDialogConfirm" #taskDialogConfirm>
      <slot name="transactionGroupDialogConfirm"/>
    </template>

    <!-- input -->
    <template #taskDialogInput>
      <template v-if="walletSupported">
        <slot name="transactionGroupDialogInput"/>
      </template>
      <template v-else>
        <TaskPanel :mode="TaskPanelMode.error">
          <template #taskPanelMessage>This operation cannot be done using {{ walletName }}</template>
          <template #taskPanelExtra1>Use another wallet (Blade or HashPack)</template>
        </TaskPanel>
      </template>
    </template>

    <!-- busy -->
    <template #taskDialogBusy>
      <TaskPanel :mode="TaskPanelMode.busy">
        <template #taskPanelMessage>{{ busyMessage }}</template>
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
      <TaskPanel :mode="taskPanelMode">
        <template #taskPanelMessage>{{ taskPanelMessage }}</template>
        <template #taskPanelExtra1>
          <template v-if="singleTransactionId">
            Transaction ID: {{ singleTransactionId }}
          </template>
          <template v-else-if="taskPanelExtra1">
            {{ taskPanelExtra1 }}
          </template>
        </template>
        <template #taskPanelExtra2>
          <template v-if="singleTransactionFailedStatus">
            Result: {{ singleTransactionFailedStatus }}
          </template>
        </template>
      </TaskPanel>
    </template>


  </TaskDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import TaskDialog from "@/dialogs/core/task/TaskDialog.vue";
import {TransactionGroupController} from "@/dialogs/core/transaction/TransactionGroupController.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import {TransactionID} from "@/utils/TransactionID.ts";
import {isSuccessfulResult} from "@/utils/TransactionTools.ts";
import {walletManager} from "@/utils/RouteManager.ts";


const props = defineProps({
  controller: {
    type: Object as PropType<TransactionGroupController>,
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

const emit = defineEmits(["transactionGroupDidExecute"])
const taskDidSucceed = () => {
  emit("transactionGroupDidExecute")
}

const walletName = walletManager.walletName
const walletIconURL = computed(() => walletManager.walletIconURL.value ?? "")
const walletSupported = computed(() => !props.nativeWalletOnly || walletManager.isHieroWallet.value)

const busyMessage = computed(() => {

  const transactionCount = props.controller.getTransactionCount()
  const outcomeCount = props.controller.transactionOutcomes.value.length

  let result: string
  if (transactionCount !== null && transactionCount >= 2) {
    result = "Processing (" + outcomeCount + "/" + transactionCount + ")"
  } else {
    result = "Processing"
  }
  return result
})

const taskPanelMode = computed(() => {

  const errorOutcomes = props.controller.errorOutcomes.value      // transactions have thrown an exception
  const successOutcomes = props.controller.successOutcomes.value  // transactions have completed with successful status
  const failureOutcomes = props.controller.failureOutcomes.value  // transactions have completed with unsuccessful status
  const unknownOutcomes = props.controller.unknownOutcomes.value  // transactions have completed but status is unknown

  const transactionCount = props.controller.transactionOutcomes.value.length

  let result: TaskPanelMode
  if (errorOutcomes.length === transactionCount) {
    // All transactions have throw an error
    result = TaskPanelMode.error
  } else if (successOutcomes.length === transactionCount) {
    // All transactions have been executed and returned a successful status
    result = TaskPanelMode.success
  } else if (failureOutcomes.length === transactionCount) {
    // All transactions have been executed and returned a failed status
    result = TaskPanelMode.error
  } else if (unknownOutcomes.length === transactionCount) {
    // All transactions have been executed but are not yet available through mirror node
    result = TaskPanelMode.success
  } else {
    // Some transactions have thrown exceptions or completed unsuccessfully
    result = TaskPanelMode.error
  }
  return result
})

const taskPanelMessage = computed(() => {

  const errorOutcomes = props.controller.errorOutcomes.value      // transactions have thrown an exception
  const successOutcomes = props.controller.successOutcomes.value  // transactions have completed with successful status
  const failureOutcomes = props.controller.failureOutcomes.value  // transactions have completed with unsuccessful status
  const unknownOutcomes = props.controller.unknownOutcomes.value  // transactions have completed but status is unknown

  const transactionCount = props.controller.transactionOutcomes.value.length

  let result: string
  if (errorOutcomes.length === transactionCount) {
    // All transactions have throw an error                                                 :(
    result = "Operation failed"
  } else if (successOutcomes.length === transactionCount) {
    // All transactions have been executed and returned a successful status                 :)
    result = "Operation completed successfully"
  } else if (failureOutcomes.length === transactionCount) {
    // All transactions have been executed and returned a failed status                     :\
    result = "Operation completed with failures"
  } else if (unknownOutcomes.length === transactionCount) {
    // All transactions have been executed but are not yet available through mirror node    :/
    result = "Operation completed. Check recent transactions for details."
  } else {
    // Some transactions have thrown exceptions or completed unsuccessfully                 :|
    result = "Operation has been executed partially. Check recent transactions for details."
  }
  return result
})


const taskPanelExtra1 = computed(() => {
  let result: string | null

  const errorOutcomes = props.controller.errorOutcomes.value      // transactions have thrown an exception
  const successOutcomes = props.controller.successOutcomes.value  // transactions have completed with successful status
  const failureOutcomes = props.controller.failureOutcomes.value  // transactions have completed with unsuccessful status
  const transactionCount = props.controller.transactionOutcomes.value.length
  if (successOutcomes.length < transactionCount) {
    // Some transaction have failed or unknown status
    if (errorOutcomes.length >= 1) {
      const errorOutcome0 = errorOutcomes[0]
      result = JSON.stringify(errorOutcome0.error)
    } else if (failureOutcomes.length >= 1) {
      const failureOutcome0 = failureOutcomes[0]
      result = failureOutcome0.getResult()
    } else {
      result = "Check recent transactions for details"
    }
  } else {
    // Some transactions have thrown exceptions or completed unsuccessfully                 :|
    result = null
  }
  return result
})


const singleTransactionId = computed(() => {
  let result: string | null
  const transactionCount = props.controller.transactionOutcomes.value.length
  const outcome0 = props.controller.outcome0.value
  if (transactionCount === 1 && outcome0 !== null) {
    const transactionId = outcome0.getTransactionId()
    result = transactionId !== null ? TransactionID.normalize(transactionId, true) : null
  } else {
    result = null
  }
  return result
})

const singleTransactionFailedStatus = computed(() => {
  let result: string | null
  const transactionCount = props.controller.transactionOutcomes.value.length
  const outcome0 = props.controller.outcome0.value
  if (transactionCount === 1 && outcome0 !== null) {
    const outcomeResult = outcome0.getResult()
    result = outcomeResult !== null && !isSuccessfulResult(outcomeResult) ? outcomeResult : null
  } else {
    result = null
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
