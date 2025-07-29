// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TokensSection :account-id="normalizedAccountId"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import {AppStorage} from "@/AppStorage";
import TokensSection from "@/components/token/TokensSection.vue";
import {NetworkConfig} from "@/config/NetworkConfig";

const props = defineProps({
  accountId: String,
  network: String,
})

const networkConfig = NetworkConfig.inject()

const minTinyBar = ref(AppStorage.getMinTinyBarTransfer() ?? 0)
watch(minTinyBar, (newValue) => AppStorage.setMinTinyBarTransfer(newValue))

//
// account
//
const accountLocParser = new AccountLocParser(computed(() => props.accountId ?? null), networkConfig)
onMounted(() => accountLocParser.mount())
onBeforeUnmount(() => accountLocParser.unmount())

const normalizedAccountId = accountLocParser.accountId

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>

