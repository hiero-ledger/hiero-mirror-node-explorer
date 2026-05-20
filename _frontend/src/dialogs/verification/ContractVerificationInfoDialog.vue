// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ModalDialog v-model:show-dialog="showDialog" :width="550">

    <template #modalDialogTitle>Verify Contract</template>

    <template #modalDialogContent>

      <div class="dialog-content">
        <p class="dialog-primary-text" >Smart contract verification is now handled by sourcify.dev</p>

        <p class="dialog-secondary-text">You can verify your contract using one of the following methods:</p>

        <div class="dialog-options dialog-secondary-text">
          <p>&bull; Verify directly at verify.sourcify.dev</p>
          <p>&bull; Use Foundry:
            <span class="h-is-monospace" style="font-size: 0.9rem">forge verify-contract --verifier sourcify...</span>
          </p>
          <p>&bull; Use Hardhat with the Sourcify plugin</p>
        </div>

        <p class="dialog-secondary-text">{{ bottomNotice }}</p>
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
import {routeManager} from "@/utils/RouteManager.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";

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

const coreConfig = CoreConfig.inject()
const bottomNotice = `Contracts previously verified by ${coreConfig.productName} are verified on sourcify.dev.`

const handleGoToSourcify = () => {
  const verifierURL = routeManager.currentNetworkEntry.value.sourcifySetup?.verifierURL
  if (verifierURL) {
    window.open(verifierURL, "_blank")
  } else {
    console.error("No verifier URL defined for selected network")
  }
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
