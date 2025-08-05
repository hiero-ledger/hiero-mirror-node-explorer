// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TransactionGroupDialog
      :controller="controller"
      :native-wallet-only="true"
      @transaction-group-did-execute="transactionGroupDidExecute"
  >

    <template #transactionGroupDialogTitle>{{ transactionTitle }}</template>

    <template #transactionGroupExecutionLabel>REJECT</template>

    <template #transactionGroupDialogInput>

      <template v-if="filtering">Filtering…</template>

      <template v-else>
        <TaskPanel :mode="panelMode">
          <template #taskPanelMessage>{{ taskPanelMessage }}</template>
          <template v-if="taskPanelExtra1" #taskPanelExtra1>{{ taskPanelExtra1 }}</template>
        </TaskPanel>
      </template>

    </template>

  </TransactionGroupDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import TransactionGroupDialog from "@/dialogs/core/transaction/TransactionGroupDialog.vue";
import {RejectTokenGroupController} from "@/dialogs/token/RejectTokenGroupController.ts";
import {Nft, Token} from "@/schemas/MirrorNodeSchemas.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  tokens: {
    type: Object as PropType<(Token | Nft)[] | null>,
    default: null
  },
})

const emit = defineEmits(["rejected"])


const tokens = computed(() => props.tokens ?? [])
const controller = new RejectTokenGroupController(showDialog, tokens)

const filtering = controller.filtering
const panelMode = controller.panelMode
const taskPanelMessage = controller.taskPanelMessage
const taskPanelExtra1 = controller.taskPanelExtra1

const transactionTitle = computed(
    () => controller.isNft.value ? 'Reject NFTs' : 'Reject Tokens')

const transactionGroupDidExecute = async () => {
  emit('rejected')
}


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
