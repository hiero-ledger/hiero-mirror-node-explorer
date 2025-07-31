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

    <template #transactionDialogTitle>{{ transactionTitle }}</template>

    <template #transactionExecutionLabel>APPROVE</template>

    <template #transactionDialogInput>

      <ContentCell>
        <template #cellTitle>HBAR Amount</template>
        <template #cellContent>
          <TextFieldView
              v-model="hbarAmountInput"
              placeholder="HBAR Amount"
              style="width: 100%"/>
        </template>
      </ContentCell>

    </template>

    <template #transactionDialogConfirm>
      Do you want to approve an allowance for {{ allowanceSpec }}
    </template>

    <template #transactionDialogControls>{{ feedbackMessage }}</template>

  </TransactionDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {UpdateCryptoAllowanceController} from "@/dialogs/allowance/UpdateCryptoAllowanceController.ts";
import {CryptoAllowance} from "@/schemas/MirrorNodeSchemas.ts";
import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import ContentCell from "@/dialogs/core/ContentCell.vue";
import TextFieldView from "@/elements/TextFieldView.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  "hbarAllowance": {
    type: Object as PropType<CryptoAllowance | null>,
    default: null
  }
})

const emit = defineEmits(["allowanceApproved"])

const hbarAllowance = computed(() => props.hbarAllowance)
const controller = new UpdateCryptoAllowanceController(showDialog, hbarAllowance)

const hbarAmountInput = controller.inputText
const feedbackMessage = controller.feedbackMessage

const transactionTitle = computed(() => {
  return "Modify allowance to account " + controller.spenderId.value
})

const allowanceSpec = computed(() => {
  return controller.newUserAmount.value
})

const transactionDidExecute = async (transactionId: string | null) => {
  emit("allowanceApproved", transactionId)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
