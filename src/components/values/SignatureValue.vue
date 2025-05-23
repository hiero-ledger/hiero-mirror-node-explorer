// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div v-if="signature">
    <HexaDumpValue v-if="functionHash" :byte-string="functionHash" show-none/>
    <div class="signature">
      <div class="h-is-extra-text h-should-wrap">{{ signature }}</div>
      <Tooltip v-if="is4byteSignature"
               text="Decoding of the signature provided by the 4byte.directory Signature Database">
        <span class="h-has-pill" style="background-color: var(--status-success-color)">4byte</span>
      </Tooltip>
    </div>
  </div>
  <div v-else-if="initialLoading"/>
  <div v-else class="h-is-low-contrast">None</div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType, ref} from "vue";
import {initialLoadingKey} from "@/AppKeys";
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";
import {FunctionCallAnalyzer} from "@/utils/analyzer/FunctionCallAnalyzer";
import Tooltip from "@/components/Tooltip.vue";

const props = defineProps({
  analyzer: {
    type: Object as PropType<FunctionCallAnalyzer>,
    required: true
  }
})

const initialLoading = inject(initialLoadingKey, ref(false))

const functionHash = props.analyzer.functionHash
const signature = props.analyzer.signature
const is4byteSignature = props.analyzer.is4byteSignature

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.signature {
  align-items: center;
  display: flex;
  gap: 4px
}

</style>
