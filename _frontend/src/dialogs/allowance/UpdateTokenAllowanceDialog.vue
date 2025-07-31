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
        <template #cellTitle>Token Amount</template>
        <template #cellContent>
          <TextFieldView
              v-model="tokenAmountInput"
              placeholder="Token Amount"
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
import {TokenAllowance} from "@/schemas/MirrorNodeSchemas.ts";
import {UpdateTokenAllowanceController} from "@/dialogs/allowance/UpdateTokenAllowanceController.ts";
import ContentCell from "@/dialogs/core/ContentCell.vue";
import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import TextFieldView from "@/elements/TextFieldView.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  "tokenAllowance": {
    type: Object as PropType<TokenAllowance | null>,
    default: null
  }
})

const emit = defineEmits(["allowanceApproved"])

const tokenAllowance = computed(() => props.tokenAllowance)
const controller = new UpdateTokenAllowanceController(showDialog, tokenAllowance)

const tokenAmountInput = controller.tokenAmountInput
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
