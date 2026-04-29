// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ModalDialog v-model:show-dialog="showDialog" :width="520">

    <template #modalDialogTitle>Verify Contract</template>

    <template #modalDialogContent>

      <div class="dialog-content">
        <p class="dialog-primary-text" >Smart contract verification is now handled by sourcify.dev</p>

        <p class="dialog-secondary-text">You can verify your contract using one of the following methods:</p>

        <div class="dialog-options dialog-secondary-text">
          <p>&bull; Verify directly via the sourcify.dev service</p>
          <p>&bull; Use the Forge CLI (Foundry)</p>
          <p>&bull; Use Hardhat with the Sourcify plugin</p>
        </div>

        <p class="dialog-secondary-text">Learn more about smart contract verification
          <a :href="docUrl" class="h-is-extra-text" target="_blank">here</a></p>

        <p class="dialog-secondary-text">Contracts previously verified on HashScan are verified on sourcify.dev</p>
      </div>
    </template>

    <template #modalDialogButtons>
      <ModalDialogButton v-model:show-dialog="showDialog">CANCEL</ModalDialogButton>
      <ModalDialogButton
          v-model:show-dialog="showDialog"
          :is-default="true"
          @action="handleGoToSourcify">GO TO SOURCIFY
      </ModalDialogButton>
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
import {SourcifyUtils} from "@/utils/sourcify/SourcifyUtils.ts";

defineProps({
  contractAddress: {
    type: String as PropType<string | null>,
    default: null
  }
})

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const docUrl = "https://docs.hedera.com/hedera/core-concepts/smart-contracts/verifying-smart-contracts-beta"

const handleGoToSourcify = () => {
  window.open(SourcifyUtils.VERIFY_URL, "_blank")
}

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

.dialog-primary-text {
  font-size: 1.2rem;
}

.dialog-secondary-text {
  font-size: 0.9em;
  color: var(--text-secondary);
}

div.dialog-options {
  display: inline-block;
}

</style>
