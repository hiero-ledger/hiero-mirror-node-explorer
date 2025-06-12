// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="action-details">
    <Property id="actionDetailFrom" :custom-nb-col-class="propertySizeClass">
      <template v-slot:name>From</template>
      <template v-slot:value>
        <EVMAddress :id="action?.caller" :address="action?.from" :entity-type="action?.caller_type"
                    :show-type="true" :compact="!isSmallScreen"/>
      </template>
    </Property>
    <Property id="actionDetailTo" :custom-nb-col-class="propertySizeClass">
      <template v-slot:name>To</template>
      <template v-slot:value>
        <EVMAddress :id="action?.recipient" :address="action?.to" :entity-type="action?.recipient_type"
                    :show-type="true" :compact="!isSmallScreen"/>
      </template>
    </Property>
    <Property id="actionDetailValue" :custom-nb-col-class="propertySizeClass">
      <template v-slot:name>Value</template>
      <template v-slot:value>
        <HbarAmount :amount="action?.value"/>
      </template>
    </Property>
    <Property id="actionDetailGasLimit" :custom-nb-col-class="propertySizeClass">
      <template v-slot:name>Gas Limit</template>
      <template v-slot:value>
        <PlainAmount :amount="action?.gas"/>
      </template>
    </Property>
    <Property id="actionDetailGasUsed" :custom-nb-col-class="propertySizeClass">
      <template v-slot:name>Gas Used</template>
      <template v-slot:value>
        <PlainAmount :amount="action?.gas_used"/>
      </template>
    </Property>
    <FunctionInput :analyzer="functionCallAnalyzer" :custom-nb-col-class="propertySizeClass"/>
    <FunctionResult :analyzer="functionCallAnalyzer" :custom-nb-col-class="propertySizeClass" :show-none="true"/>
    <FunctionError :analyzer="functionCallAnalyzer" :custom-nb-col-class="propertySizeClass" :show-none="true"/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, PropType, ref} from "vue";
import {ContractAction} from "@/schemas/MirrorNodeSchemas";
import Property from "@/components/Property.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import FunctionInput from "@/components/values/FunctionInput.vue";
import FunctionResult from "@/components/values/FunctionResult.vue";
import FunctionError from "@/components/values/FunctionError.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {ContractActionAnalyzer} from "@/utils/analyzer/ContractActionAnalyzer";

const props = defineProps({
  action: Object as PropType<ContractAction>
})

const isSmallScreen = inject('isSmallScreen', ref(false))
const propertySizeClass = 'is-one-fifth'

const contractActionAnalyzer = new ContractActionAnalyzer(computed(() => props.action ?? null))
onMounted(() => contractActionAnalyzer.mount())
onBeforeUnmount(() => contractActionAnalyzer.unmount())

const functionCallAnalyzer = contractActionAnalyzer.functionCallAnalyzer

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.action-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

</style>
