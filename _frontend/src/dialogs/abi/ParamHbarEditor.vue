// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TextFieldView v-model="currentText"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType, ref, watch, WatchStopHandle} from "vue";
import {ContractParamBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";
import {AppStorage} from "@/AppStorage.ts";
import {ethers} from "ethers";
import TextFieldView from "@/elements/TextFieldView.vue";

const props = defineProps({
  paramBuilder: {
    type: Object as PropType<ContractParamBuilder>,
    required: true
  },
})

const currentText = ref<string>("")

const lastParamData = computed(() => {
  const functionHash = props.paramBuilder.callBuilder.fragment.selector
  const paramName = props.paramBuilder.paramType.name
  return AppStorage.getInputParam(functionHash, paramName)
})

let watchHandle: WatchStopHandle | null = null
onMounted(() => {
  currentText.value = paramDataToText(lastParamData.value) ?? ""
  watchHandle = watch(currentText, () => {
    props.paramBuilder.paramData.value = textToParamData(currentText.value)
  }, {immediate: true})
})
onBeforeUnmount(() => {
  if (watchHandle !== null) {
    watchHandle()
    watchHandle = null
  }
  props.paramBuilder.paramData.value = null
  currentText.value = ""
})

const textToParamData = (text: string): string|null => {
  let result: string|null

  // text is an amount in HBAR
  // 1 hBAR <=> 10^18 weiBAR
  // https://hips.hedera.com/hip/hip-410#value-of-gas-price-and-value-fields
  try {
    const tBAR = Math.round(parseFloat(text) * 100_000_000)
    const weiBAR = ethers.getBigInt(tBAR) * 10n**10n
    result = ethers.toBeHex(weiBAR, 32)
  } catch {
    result = null
  }
  return result
}

const paramDataToText = (paramData: unknown): string|null => {
  let result: string|null
  if (typeof paramData == "string") {
    // paramData is hex encoding of a weiBAR amount
    // 1 weiBAR <=> 10^-18 hBAR
    // https://hips.hedera.com/hip/hip-410#value-of-gas-price-and-value-fields
    try {
      const weiBAR = ethers.getBigInt(paramData)
      const tBAR = weiBAR / 10n**10n
      const hBAR = ethers.toNumber(tBAR) / 100_000_000
      result = hBAR.toString()
    } catch {
      result = null
    }
  } else {
    result = null
  }
  return result
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
