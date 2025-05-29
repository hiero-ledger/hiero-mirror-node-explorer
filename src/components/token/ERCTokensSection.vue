// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="ethereumAddress && showSection" id="ercTokensSection" collapsible-key="tokens">

    <template #title>
      ERC Tokens
    </template>

    <template #content>

      <AccountERCTokenTable :account-address="ethereumAddress"/>

<!--      <ArrowLink-->
<!--          v-if="showAllTokensLink"-->
<!--          id="all-tokens-link"-->
<!--          :route="routeManager.makeRouteToTokensByAccount(accountId)"-->
<!--          text="All tokens"-->
<!--          style="display: flex; justify-content: center;"-->
<!--      />-->

    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {AccountLocParser} from "@/utils/parser/AccountLocParser.ts";
import AccountERCTokenTable from "@/components/ercToken/AccountERCTokenTable.vue";

const props = defineProps({
  accountId: {
    type: String as PropType<string | null>,
    default: null
  },
  fullPage: {
    type: Boolean,
    default: false
  }
})

const networkConfig = NetworkConfig.inject()

const showSection = computed(() =>
    // props.accountId === walletManager.accountId.value
    // &&
    true
)

const accountId = computed(() => props.accountId)

//
// account
//
const accountLocParser = new AccountLocParser(accountId, networkConfig)
onMounted(() => accountLocParser.mount())
onBeforeUnmount(() => accountLocParser.unmount())

const ethereumAddress = accountLocParser.ethereumAddress

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
