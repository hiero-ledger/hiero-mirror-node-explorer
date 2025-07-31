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

    <template #transactionGroupDialogTitle>Claim Token Airdrops</template>

    <template #transactionGroupExecutionLabel>CLAIM</template>

    <template #transactionGroupDialogInput>

      <TaskPanel :mode="TaskPanelMode.none">
        <template #taskPanelMessage>Do you want to claim {{ airdropCount }} token airdrops?</template>
        <template v-if="!props.drained" #taskPanelExtra1>
          (You might have more but we have limited to the first 100)
        </template>
      </TaskPanel>

    </template>

  </TransactionGroupDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import TransactionGroupDialog from "@/dialogs/core/transaction/TransactionGroupDialog.vue";
import {TokenAirdrop} from "@/schemas/MirrorNodeSchemas.ts";
import {ClaimTokenGroupController} from "@/dialogs/token/ClaimTokenGroupController.ts";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  airdrops: {
    type: Object as PropType<TokenAirdrop[] | null>,
    default: null
  },
  drained: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits(["claimed"])


const airdrops = computed(() => props.airdrops ?? [])
const controller = new ClaimTokenGroupController(showDialog, airdrops)

const airdropCount = controller.airdropCount

const transactionGroupDidExecute = async () => {
  emit('claimed')
}


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
