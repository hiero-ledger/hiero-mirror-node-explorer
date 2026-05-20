// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <slot :contract-id="contractId"></slot>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache.ts";

const props = defineProps({
  evmAddress: {
    type: String as PropType<string>,
    required: true
  }
})

const evmAddress = computed(() => props.evmAddress)
const contractLookup = ContractByAddressCache.instance.makeLookup(evmAddress)
onMounted(() => contractLookup.mount())
onBeforeUnmount(() => contractLookup.unmount())

const contractId = computed(() => contractLookup.entity.value?.contract_id ?? null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
