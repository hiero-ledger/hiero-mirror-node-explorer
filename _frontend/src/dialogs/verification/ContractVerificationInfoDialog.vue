// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ModalDialog v-model:show-dialog="showDialog" :width="600">

    <template #modalDialogTitle>Verify Contract {{ props.contractId }}</template>

    <template #modalDialogContent>

      <div class="dialog-content">
        <p>Smart contract verification is now provided by the
          <a :href="sourcifyUrl" class="h-is-extra-text" target="_blank">sourcify.dev</a>
          service.</p>

        <p>You may use any of the following options to verify the contract:</p>

        <div class="dialog-options">
          <p>&bull; Verify directly with sourcify.dev verification service</p>
          <p>&bull; Use the forge command-line of the Foundry toolkit</p>
          <p>&bull; Use the Hardhat environment with its Sourcify plugin</p>
        </div>

        <p>More information on how to verify a contract is available
          <a :href="docUrl" class="h-is-extra-text" target="_blank">here</a>.</p>

        <div class="h-is-low-contrast" style="font-size: 0.9em;">Note: All contracts previously verified with Hashscan
          are
          verified with <a :href="sourcifyUrl" class="" target="_blank">sourcify.dev</a>.
        </div>
      </div>
    </template>

    <template #modalDialogButtons>
      <ModalDialogButton v-model:show-dialog="showDialog">CLOSE</ModalDialogButton>
    </template>

  </ModalDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import ModalDialog from "@/dialogs/core/ModalDialog.vue";
import ModalDialogButton from "@/dialogs/core/ModalDialogButton.vue";
import {PropType} from "vue";

const props = defineProps({
  contractId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const sourcifyUrl = "https://sourcify.dev"
const docUrl = "https://docs.hedera.com/hedera/core-concepts/smart-contracts/verifying-smart-contracts-beta"

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

div.dialog-options {
  display: inline-block;
}

</style>
