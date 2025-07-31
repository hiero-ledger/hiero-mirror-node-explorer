// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TransactionDialog
      :controller="controller"
      :native-wallet-only="true"
      @transaction-did-execute="transactionDidExecute">

    <template #transactionDialogTitle>Approve allowance</template>

    <template #transactionExecutionLabel>APPROVE</template>

    <template #transactionDialogInput>

      <!-- spender -->

      <ContentCell>
        <template #cellTitle>Spender</template>
        <template #cellContent>
          <TextFieldView
              v-model="spenderInput"
              placeholder="Account or Contract ID (0.0.1234)"
              style="width: 100%"/>
        </template>
      </ContentCell>

      <!-- Allowance Type -->
      <ContentCell>
        <template #cellTitle>Allowance Type</template>
        <template #cellContent>
          <div style="display: flex; column-gap: 12px">
            <RabioBoxView name="allowanceType" value="crypto" v-model="allowanceChoice">HBAR</RabioBoxView>
            <RabioBoxView name="allowanceType" value="token" v-model="allowanceChoice">Fungible Token</RabioBoxView>
            <RabioBoxView name="allowanceType" value="nft" v-model="allowanceChoice">NFT</RabioBoxView>
          </div>
        </template>
      </ContentCell>

      <StackView :visible-index="visibleIndex">

        <ContentCell>
          <template #cellTitle>HBAR Amount</template>
          <template #cellContent>
            <TextFieldView
                v-model="cryptoAmountInput"
                placeholder="HBAR Amount"
                style="width: 100%"/>
          </template>
        </ContentCell>

        <div style="display: flex; flex-direction: column; row-gap: 12px; width: 100%">
          <ContentCell>
            <template #cellTitle>Token ID</template>
            <template #cellContent>
              <TextFieldView
                  v-model="tokenInput"
                  placeholder="Token ID (0.0.1234)"
                  style="width: 100%"/>
            </template>
          </ContentCell>

          <ContentCell>
            <template #cellTitle>Token Amount</template>
            <template #cellContent>
              <TextFieldView
                  v-model="tokenAmountInput"
                  placeholder="Token Amount"
                  style="width: 100%"/>
            </template>
          </ContentCell>
        </div>

        <div style="display: flex; flex-direction: column; row-gap: 12px">
          <ContentCell>
            <template #cellTitle>Token ID</template>
            <template #cellContent>
              <TextFieldView
                  v-model="nftInput"
                  placeholder="Collection ID (0.0.1234)"
                  style="width: 100%"/>
            </template>
          </ContentCell>

          <ContentCell>
            <template #cellTitle>Serial Numbers</template>
            <template #cellContent>
              <TextFieldView
                  v-model="nftSerialInput"
                  placeholder="serial numbers (1, 2, 3…)"
                  style="width: 100%"/>
              <span class="nft-inline-help">leave empty to approve for ALL</span>
            </template>
          </ContentCell>
        </div>

      </StackView>

    </template>

    <template #transactionDialogControls>{{ feedbackMessage }}</template>

  </TransactionDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import {ApproveAllowanceController} from "@/dialogs/allowance/ApproveAllowanceController.ts";
import ContentCell from "@/dialogs/core/ContentCell.vue";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import RabioBoxView from "@/elements/RabioBoxView.vue";
import StackView from "@/elements/StackView.vue";
import TextFieldView from "@/elements/TextFieldView.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const emit = defineEmits(["allowanceApproved"])

const networkConfig = NetworkConfig.inject()
const controller = new ApproveAllowanceController(showDialog, networkConfig)

const spenderInput = controller.spenderController.inputText
const tokenInput = controller.tokenController.inputText
const nftInput = controller.nftController.inputText
const cryptoAmountInput = controller.cryptoController.inputText
const tokenAmountInput = controller.tokenAmountController.input
const nftSerialInput = controller.nftSerialsController.input

const feedbackMessage = controller.feedbackMessage
const allowanceChoice = controller.allowanceChoice

const transactionDidExecute = async (transactionId: string | null) => {
  emit("allowanceApproved", transactionId)
}

const visibleIndex = computed(() => {
  let result: number
  switch (controller.allowanceChoice.value) {
    default:
    case "crypto":
      result = 0
      break
    case "token":
      result = 1
      break
    case "nft":
      result = 2
      break
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.nft-inline-help {
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 400
}

</style>
