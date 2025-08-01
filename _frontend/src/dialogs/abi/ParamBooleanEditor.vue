// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <input class="checkbox" type="checkbox" v-model="checked"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType, ref, watch, WatchStopHandle} from "vue";
import {ContractParamBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";
import {AppStorage} from "@/AppStorage.ts";

const props = defineProps({
  paramBuilder: {
    type: Object as PropType<ContractParamBuilder>,
    required: true
  },
})

const checked = ref<boolean>(false)

const lastParamData = computed(() => {
  const functionHash = props.paramBuilder.callBuilder.fragment.selector
  const paramName = props.paramBuilder.paramType.name
  return AppStorage.getInputParam(functionHash, paramName)
})

let watchHandle: WatchStopHandle | null = null
onMounted(() => {
  checked.value = !!lastParamData.value
  watchHandle = watch(checked, () => {
    props.paramBuilder.paramData.value = checked.value
  }, {immediate: true})
})
onBeforeUnmount(() => {
  if (watchHandle !== null) {
    watchHandle()
    watchHandle = null
  }
  props.paramBuilder.paramData.value = null
  checked.value = false
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
