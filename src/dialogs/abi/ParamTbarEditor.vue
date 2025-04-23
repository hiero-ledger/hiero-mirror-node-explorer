// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <input class="input is-small has-text-white" type="number" min="0" v-model="currentText"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType, ref, watch, WatchStopHandle} from "vue";
import {ContractParamBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";
import {AppStorage} from "@/AppStorage.ts";
import {ethers} from "ethers";

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

  // text is an amount in tBAR
  // 1 tBAR <=> 10_000_000_000 weiBAR
  // https://hips.hedera.com/hip/hip-410#value-of-gas-price-and-value-fields
  try {
    const weiBAR = ethers.getBigInt(text) * 10_000_000_000n
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
    // 1 weiBAR <=> 1 / 10_000_000_000 tBAR
    // https://hips.hedera.com/hip/hip-410#value-of-gas-price-and-value-fields
    try {
      const weiBAR = ethers.getBigInt(paramData)
      const tBAR = weiBAR / 10_000_000_000n
      result = tBAR.toString()
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
