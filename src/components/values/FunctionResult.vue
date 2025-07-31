// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="outputs && outputs.length >= 1">

    <div class="h-sub-section">Output</div>

    <template v-for="result in outputs" :key="result.name">
      <Property :custom-nb-col-class="customNbColClass" :keep-case="true">
        <template v-slot:name>
          <span style="padding-left: 16px;">{{ result.name }}</span>
        </template>
        <template v-slot:value>
          <FunctionValue :ntv="result"/>
        </template>
      </Property>
    </template>

  </template>
  <template v-else>

    <Property :custom-nb-col-class="customNbColClass" id="functionOutput">
      <template v-slot:name>Output Result</template>
      <template v-slot:value>
        <ByteCodeValue :byte-code="output ?? undefined"/>
        <div v-if="outputDecodingStatus" class="h-is-extra-text">
          <CircleAlert class="h-is-low-contrast mr-1" :size="16" style="vertical-align: text-top"/>
          <span>{{ outputDecodingStatus }}</span>
        </div>
      </template>
    </Property>

  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {CircleAlert} from "lucide-vue-next";
import {FunctionCallAnalyzer} from "@/utils/analyzer/FunctionCallAnalyzer";
import Property from "@/components/Property.vue";
import FunctionValue from "@/components/values/FunctionValue.vue";
import ByteCodeValue from "@/components/values/ByteCodeValue.vue";

const props = defineProps({
  analyzer: {
    type: Object as PropType<FunctionCallAnalyzer>,
    required: true
  },
  customNbColClass: String,
  showNone: {
    type: Boolean,
    default: false
  }
})

const output = props.analyzer.normalizedOutput
const outputs = props.analyzer.outputs
const outputDecodingStatus = props.analyzer.outputDecodingStatus

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
