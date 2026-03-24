// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="normalizedAccountId">
    <TokensSection :account-id="normalizedAccountId"/>
  </template>
  <template v-else>
    <DashboardCardV2 v-if="accountId">
      <template #title>HTS Tokens</template>
      <template #content>
        <DocSnippet><p>This account does not hold any asset because it is not yet activated.</p></DocSnippet>
      </template>
    </DashboardCardV2>
  </template>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import {AppStorage} from "@/AppStorage";
import {NetworkConfig} from "@/config/NetworkConfig";
import TokensSection from "@/components/token/TokensSection.vue";
import DocSnippet from "@/components/DocSnippet.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

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

