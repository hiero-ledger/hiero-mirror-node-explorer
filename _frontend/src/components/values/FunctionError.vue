// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <template v-if="errorInputs.length >= 1">
    <div class="h-sub-section">Error</div>

    <template v-if="errorSignature">

      <Property :custom-nb-col-class="customNbColClass" id="errorFunction">
        <template #name>
          <span style="padding-left: 16px;">Signature</span>
        </template>
        <template #value>
          <HexaDumpValue :byte-string="errorHash" :show-none="true"/>
          <div class="h-is-extra-text h-should-wrap">{{ errorSignature }}</div>
        </template>
      </Property>
    </template>

    <template v-for="arg in errorInputs" :key="arg.name">
      <Property :custom-nb-col-class="customNbColClass" :keep-case="true">
        <template #name>
          <span style="padding-left: 16px;">{{ arg.name != "" ? arg.name : "message" }}</span>
        </template>
        <template #value>
          <FunctionValue :ntv="arg"/>
        </template>
      </Property>
    </template>
  </template>

  <template v-else>
    <Property :custom-nb-col-class="customNbColClass" id="errorMessage">
      <template #name>Error Message</template>
      <template #value>
        <StringValue v-if="decodedError" :string-value="decodedError"/>
        <template v-else>
          <HexaDumpValue :byte-string="error" :show-none="true"/>
          <div v-if="errorDecodingStatus" class="h-is-extra-text">
            <span class="icon fas fa-exclamation-circle h-is-low-contrast is-small mt-1 mr-1"/>
            <span>{{ errorDecodingStatus }}</span>
          </div>
        </template>
      </template>
    </Property>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";
import {FunctionCallAnalyzer} from "@/utils/analyzer/FunctionCallAnalyzer";
import Property from "@/components/Property.vue";
import {decodeSolidityErrorMessage} from "@/schemas/MirrorNodeUtils.ts";
import StringValue from "@/components/values/StringValue.vue";
import FunctionValue from "@/components/values/FunctionValue.vue";

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

const decodedError = computed(() =>
    props.analyzer.normalizedError.value != null ? decodeSolidityErrorMessage(props.analyzer.normalizedError.value) : null)

const error = props.analyzer.normalizedError
const errorSignature = props.analyzer.errorSignature
const errorHash = props.analyzer.errorHash
const errorInputs = props.analyzer.errorInputs
const errorDecodingStatus = props.analyzer.errorDecodingStatus

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
