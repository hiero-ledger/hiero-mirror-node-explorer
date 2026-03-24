// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <template v-if="normalizedAccountId">
    <AllowancesSection :account-id="normalizedAccountId ?? undefined"/>
  </template>
  <template v-else>
    <DashboardCardV2 v-if="accountId">
      <template #title>Allowances</template>
      <template #content>
        <DocSnippet><p>Allowances cannot be granted by this account because it is not yet activated.</p></DocSnippet>
      </template>
    </DashboardCardV2>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import AllowancesSection from "@/components/allowances/AllowancesSection.vue";
import {NetworkConfig} from "@/config/NetworkConfig";
import DocSnippet from "@/components/DocSnippet.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

const props = defineProps({
  accountId: String,
  network: String,
})

const networkConfig = NetworkConfig.inject()

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

