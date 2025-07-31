// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TransactionDialog
      :controller="controller"
      @transaction-did-execute="transactionDidExecute"
  >

    <template #transactionDialogTitle>Import Token</template>

    <template #transactionDialogInput>
      <TaskPanel :mode="TaskPanelMode.none">
        <template #taskPanelMessage>Import {{ tokenType }} {{ tokenId }} to wallet {{ walletName }} ?</template>
      </TaskPanel>
    </template>

    <template #transactionExecutionLabel>IMPORT</template>

  </TransactionDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {WatchTokenController} from "@/dialogs/token/WatchTokenController.ts";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";
import {walletManager} from "@/utils/RouteManager.ts";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  analyzer: {
    type: Object as PropType<TokenInfoAnalyzer>,
    required: true
  }
})

const emit = defineEmits(["tokenWatched"])

const analyzer = computed(() => props.analyzer)
const controller = new WatchTokenController(showDialog, analyzer)
const tokenId = controller.tokenId
const tokenType = controller.tokenType
const walletName = walletManager.walletName

const transactionDidExecute = async () => {
  emit('tokenWatched')
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
