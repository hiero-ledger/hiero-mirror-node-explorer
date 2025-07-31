// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ModalDialog v-model:show-dialog="showDialog">

    <template #modalDialogTitle>{{ dialogTitle }}</template>

    <template #modalDialogContent>
      <div style="margin-bottom: 1em">{{ typeDeclaration }}</div>
      <TextAreaView style="width: 728px; height: 100px; margin-bottom: 16px" v-model="currentText"/>
    </template>

    <template #modalDialogButtons>
      <ModalDialogButton v-model:show-dialog="showDialog">CANCEL</ModalDialogButton>
      <ModalDialogButton v-model:show-dialog="showDialog" :enabled="isValidText">OK</ModalDialogButton>
    </template>

  </ModalDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType, ref, watch, WatchStopHandle} from "vue";
import {ContractParamBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";
import {AppStorage} from "@/AppStorage.ts";
import ModalDialog from "@/dialogs/core/ModalDialog.vue";
import ModalDialogButton from "@/dialogs/core/ModalDialogButton.vue";
import {ethers} from "ethers";
import TextAreaView from "@/elements/TextAreaView.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  paramBuilder: {
    type: Object as PropType<ContractParamBuilder>,
    required: true
  },
})

const dialogTitle = computed(() => props.paramBuilder.paramType.name)

const typeDeclaration = computed(() => props.paramBuilder.paramType.format("full"))

const currentText = ref<string>("")

const currentJson = computed(() => {
  let result: string | null
  try {
    result = JSON.parse(currentText.value)
  } catch {
    result = null
  }
  return result
})

const currentEncoding = computed(() => {
  let result: unknown
  if (currentJson.value !== null) {
    try {
      result = ethers.AbiCoder.defaultAbiCoder().encode(
          [props.paramBuilder.paramType],
          [currentJson.value])
    } catch {
      result = null
    }
  } else {
    result = null
  }
  return result
})

const isValidText = computed(() => currentEncoding.value !== null)

const lastParamData = computed(() => {
  const functionHash = props.paramBuilder.callBuilder.fragment.selector
  const paramName = props.paramBuilder.paramType.name
  const paramData = AppStorage.getInputParam(functionHash, paramName)
  return paramData !== null ? JSON.stringify(paramData, null, "  ") : ""
})

let watchHandle: WatchStopHandle | null = null
onMounted(() => {
  currentText.value = lastParamData.value
  watchHandle = watch(currentJson, () => {
    props.paramBuilder.paramData.value = currentJson.value
  }, {immediate: true})
})
onBeforeUnmount(() => {
  if (watchHandle !== null) {
    watchHandle()
    watchHandle = null
  }
  currentText.value = ""
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
