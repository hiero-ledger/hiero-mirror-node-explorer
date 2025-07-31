// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TransactionDialog
      :controller="controller"
      @transaction-did-execute="transactionDidExecute"
  >

    <template #transactionDialogTitle>Associate Token</template>

    <template #transactionDialogInput>
      <TaskPanel :mode="TaskPanelMode.none">
        <template #taskPanelMessage>Associate {{ tokenType }} {{ tokenId }} to account {{ accountId }} ?</template>
        <template #taskPanelExtra1>
          <label v-if="isWatchSupported">
            <input type="checkbox" style="margin-right: 0.5em; vertical-align: middle" v-model="watchInWallet">
            <span>Import to {{ walletName }}</span>
          </label>
        </template>
      </TaskPanel>
    </template>

    <template #transactionExecutionLabel>ASSOCIATE</template>

  </TransactionDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import {computed, PropType} from "vue";
import {TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import {AssociateTokenController} from "@/dialogs/token/AssociateTokenController.ts";
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

const emit = defineEmits(["tokenAssociated"])

const analyzer = computed(() => props.analyzer)
const controller = new AssociateTokenController(showDialog, analyzer)
const tokenType = controller.tokenType
const tokenId = controller.tokenId
const accountId = walletManager.accountId
const walletName = walletManager.walletName
const watchInWallet = controller.watchInWallet
const isWatchSupported = walletManager.isWatchSupported

const transactionDidExecute = async (transactionId: string | null) => {
  emit('tokenAssociated', transactionId)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
