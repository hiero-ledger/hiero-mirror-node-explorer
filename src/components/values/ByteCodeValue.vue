// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="nonNullValue" id="bytecode">
    <HexaDumpValue :byte-string="textValue" :copyable="false" :scroll-bar="false"/>
  </div>

  <span v-else-if="initialLoading"/>

  <span v-else class="h-is-low-contrast">None</span>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, ref, watch} from 'vue';
import {initialLoadingKey} from "@/AppKeys";
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";

const props = defineProps({
  byteCode: String,
})

const textValue = ref(props.byteCode)
watch(() => props.byteCode, () => {
  textValue.value = props.byteCode
})
const nonNullValue = computed(() => props.byteCode != undefined && props.byteCode != '0x')
const initialLoading = inject(initialLoadingKey, ref(false))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>