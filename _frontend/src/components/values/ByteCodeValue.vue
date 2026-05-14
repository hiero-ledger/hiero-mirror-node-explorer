// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div id="bytecode">
    <HexaDumpValue
        :byte-string="textValue"
        :copyable="props.copyable"
        :scroll-bar="props.scrollBar"
        :show-none="true"
    />
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, PropType} from 'vue';
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";

const props = defineProps({
  byteCode: {
    type: String as PropType<string | null>,
    default: null
  },
  scrollBar: {
    type: Boolean,
    default: true
  },
  copyable: {
    type: Boolean,
    default: false
  },
})

const textValue = computed(() =>
    props.byteCode && props.byteCode != '0x' ? props.byteCode : null
)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>