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

    <template #transactionExecutionLabel>DELETE</template>

    <template #transactionDialogInput>

      <template v-if="serialNumber === null">
        Do you want to delete the allowance for all NFTs of collection {{ tokenName }}?
      </template>

      <template v-else>
        Do you want to delete the allowance for NFT #{{ serialNumber }} of collection {{ tokenName }} ?
      </template>

    </template>

  </TransactionDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import {DeleteNftAllowanceController} from "@/dialogs/allowance/DeleteNftAllowanceController.ts";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  tokenId: {
    type: Object as PropType<string | null>,
    default: null
  },
  spenderId: {
    type: Object as PropType<string | null>,
    default: null
  },
  serialNumber: {
    type: Object as PropType<number | null>,
    default: null
  },
})

const emit = defineEmits(["allowanceDeleted"])

const tokenId = computed(() => props.tokenId)
const spenderId = computed(() => props.spenderId)
const serialNumber = computed(() => props.serialNumber)
const controller = new DeleteNftAllowanceController(showDialog, tokenId, spenderId, serialNumber)

const transactionTitle = computed(() => "Delete allowance to account " + spenderId.value)

const tokenName = computed(() => controller.tokenName.value)

const transactionDidExecute = async (transactionId: string | null) => {
  emit('allowanceDeleted', transactionId)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
