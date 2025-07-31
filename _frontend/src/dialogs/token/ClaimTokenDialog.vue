// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TransactionDialog
      :controller="controller"
      :native-wallet-only="true"
      @transaction-did-execute="transactionDidExecute"
  >

    <template #transactionDialogTitle>Claim Token</template>

    <template #transactionExecutionLabel>CLAIM</template>

    <template #transactionDialogInput>
      <TaskPanel :mode="TaskPanelMode.none">
        <template #taskPanelMessage>Claim token {{ tokenId }} airdropped to account {{ accountId }} ?</template>
      </TaskPanel>
    </template>

  </TransactionDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {ClaimTokenController} from "@/dialogs/token/ClaimTokenController.ts";
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

const emit = defineEmits(["tokenClaimed"])

const analyzer = computed(() => props.analyzer)
const controller = new ClaimTokenController(showDialog, analyzer)
const tokenId = controller.tokenId
const accountId = walletManager.accountId

const transactionDidExecute = async (transactionId: string | null) => {
  emit('tokenClaimed', transactionId)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
