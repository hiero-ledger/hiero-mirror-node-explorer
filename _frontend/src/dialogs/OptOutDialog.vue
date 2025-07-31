// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ModalDialog v-model:show-dialog="showDialog">

    <template #modalDialogTitle>Disclaimer</template>

    <template #modalDialogContent>
      <div class="opt-out-dialog-content">
        <div v-html="disclaimer"/>
        <label>
          <input v-model="dontShowNextTime" type="checkbox" style="margin-right: 0.5em; vertical-align: text-top"/>
          <span>Please don't show me this next time</span>
        </label>
      </div>
    </template>

    <template #modalDialogButtons>
      <ModalDialogButton v-model:show-dialog="showDialog">CANCEL</ModalDialogButton>
      <ModalDialogButton v-model:show-dialog="showDialog" @action="handleAgree">AGREE</ModalDialogButton>
    </template>

  </ModalDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ref} from "vue";
import ModalDialog from "@/dialogs/core/ModalDialog.vue";
import {AppStorage} from "@/AppStorage.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";
import ModalDialogButton from "@/dialogs/core/ModalDialogButton.vue";


const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const disclaimer = CoreConfig.inject().walletChooserDisclaimerPopup ?? ""

const emit = defineEmits(["onAgree"])

const dontShowNextTime = ref(false)
const handleAgree = () => {
  if (dontShowNextTime.value) {
    AppStorage.setSkipDisclaimer(true)
  }
  emit('onAgree')
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.opt-out-dialog-content {
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}

</style>

