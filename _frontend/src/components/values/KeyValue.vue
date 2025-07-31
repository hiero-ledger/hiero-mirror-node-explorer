// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <template v-if="isComplexKey">
    <ComplexKeyValue
        :account-id="accountId"
        :node-id="nodeId"
        :in-details-page="inDetailsPage"
        :key-bytes="keyBytes"
        :show-none="showNone"
    />
  </template>
  <template v-else>
    <div v-if="inDetailsPage">
      <span class="h-is-extra-text">{{ keyType }}</span>
      <span class="h-is-monospace h-is-low-contrast">{{ ':&#8239;' + keyBytes }}</span>
    </div>
    <div v-else>
      <HexaValue :byte-string="keyBytes" :none-extra="noneExtra" :show-none="showNone"/>
      <div v-if="keyBytes" class="h-is-extra-text">{{ keyType }}</div>
    </div>
  </template>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import ComplexKeyValue from "@/components/values/ComplexKeyValue.vue";
import HexaValue from "@/components/values/HexaValue.vue";

const props = defineProps({
  keyBytes: {
    type: String as PropType<string | null>,
    default: null
  },
  keyType: {
    type: String as PropType<string | null>,
    default: null
  },
  accountId: {
    type: String as PropType<string | null>,
    default: null
  },
  nodeId: {
    type: Number as PropType<number | null>,
    default: null
  },
  inDetailsPage: {
    type: Boolean,
    default: false
  },
  showNone: {
    type: Boolean,
    default: false
  },
  noneExtra: String
})

const isComplexKey = computed(() => props.keyType == "ProtobufEncoded")

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
