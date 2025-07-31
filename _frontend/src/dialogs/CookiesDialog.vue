// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ModalDialog v-model:show-dialog="showDialog">
    <template #modalDialogTitle>
      <span>Accept Cookies</span>
    </template>
    <template #modalDialogContent>
      <div v-html="cookiesDialogContent"/>
    </template>
    <template #modalDialogButtons>
      <ModalDialogButton v-model:show-dialog="showDialog" @action="handleChooseReject">REJECT</ModalDialogButton>
      <ModalDialogButton v-model:show-dialog="showDialog" :is-default="true" @action="handleChooseAccept">ACCEPT
      </ModalDialogButton>
    </template>
  </ModalDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import ModalDialog from "@/dialogs/core/ModalDialog.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import ModalDialogButton from "@/dialogs/core/ModalDialogButton.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const emit = defineEmits(["onChooseAccept", "onChooseReject"],)

const coreConfig = CoreConfig.inject()
const cookiesDialogContent = coreConfig.cookiesDialogContent

const handleChooseAccept = () => {
  emit('onChooseAccept')
}
const handleChooseReject = () => {
  emit('onChooseReject')
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>

