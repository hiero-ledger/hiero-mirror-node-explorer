// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="signature">

    <Property :custom-nb-col-class="customNbColClass" id="function">
      <template #name>Signature</template>
      <template #value>
        <SignatureValue :analyzer="analyzer"/>
      </template>
    </Property>

    <template v-if="inputs && inputs.length >= 1">

      <div class="h-sub-section">Input</div>

      <template v-for="arg in inputs" :key="arg.name">
        <Property :custom-nb-col-class="customNbColClass" :keep-case="true">
          <template #name>
            <span style="padding-left: 16px;">{{ arg.name }}</span>
          </template>
          <template #value>
            <FunctionValue :ntv="arg"/>
          </template>
        </Property>
      </template>

    </template>
    <template v-else>

      <Property :custom-nb-col-class="customNbColClass" id="functionInput">
        <template #name>Input Args</template>
        <template #value>
          <ByteCodeValue :byte-code="inputArgsOnly ?? undefined"/>
          <div v-if="inputDecodingStatus" class="h-is-extra-text">
            <CircleAlert class="h-is-low-contrast mr-1" :size="16" style="vertical-align: text-top"/>
            <span>{{ inputDecodingStatus }}</span>
          </div>
        </template>
      </Property>

    </template>

  </template>

  <template v-else>
    <Property :custom-nb-col-class="customNbColClass" id="functionInput">
      <template #name>Input - Function & Args</template>
      <template #value>
        <ByteCodeValue :byte-code="input ?? undefined"/>
        <div v-if="functionDecodingStatus" class="h-is-extra-text">
          <CircleAlert class="h-is-low-contrast mr-1" :size="16" style="vertical-align: text-top"/>
          <span>{{ functionDecodingStatus }}</span>
        </div>
      </template>
    </Property>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import {CircleAlert} from 'lucide-vue-next';
import {FunctionCallAnalyzer} from "@/utils/analyzer/FunctionCallAnalyzer";
import Property from "@/components/Property.vue";
import FunctionValue from "@/components/values/FunctionValue.vue";
import SignatureValue from "@/components/values/SignatureValue.vue";
import ByteCodeValue from "@/components/values/ByteCodeValue.vue";

const props = defineProps({
  analyzer: {
    type: Object as PropType<FunctionCallAnalyzer>,
    required: true
  },
  customNbColClass: String
})

const input = props.analyzer.normalizedInput
const signature = props.analyzer.signature
const inputs = props.analyzer.inputs
const functionDecodingStatus = props.analyzer.functionDecodingStatus
const inputDecodingStatus = props.analyzer.inputDecodingStatus
const inputArgsOnly = props.analyzer.inputArgsOnly

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
