// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TransactionDialog
      :controller="controller"
      @transaction-did-execute="transactionDidExecute"
  >

    <template #transactionDialogTitle>Dissociate Token</template>

    <template #transactionDialogInput>
      <TaskPanel :mode="TaskPanelMode.none">
        <template #taskPanelMessage>Dissociate {{ tokenType }} {{ tokenId }} from account {{ accountId }} ?</template>
      </TaskPanel>
    </template>

    <template #transactionExecutionLabel>DISSOCIATE</template>

  </TransactionDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import {computed, PropType} from "vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {DissociateTokenController} from "@/dialogs/token/DissociateTokenController.ts";
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

const emit = defineEmits(["tokenDissociated"])

const analyzer = computed(() => props.analyzer)
const controller = new DissociateTokenController(showDialog, analyzer)
const tokenType = controller.tokenType
const tokenId = controller.tokenId
const accountId = walletManager.accountId

const transactionDidExecute = async (transactionId: string | null) => {
  emit('tokenDissociated', transactionId)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
