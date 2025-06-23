// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      Account
      <span style="white-space: nowrap; font-size: smaller">
        {{ normalizedAccountId }}
      </span>
    </template>

    <template #left-toolbar>
      <Tabs
          :tab-ids="tabIds"
          :tab-labels="tabLabels"
          :selected-tab="selectedTabId"
          @update:selected-tab="onUpdate($event)"
      >
        <template #extra>
          <ArrowLink
              v-if="showContractVisible && contractRoute"
              :route="contractRoute" id="showContractLink"
              :is-contrasted="true"
              text="Associated contract"
          />
        </template>
      </Tabs>
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification" :is-error="!isInactiveEvmAddress"/>
    </template>

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import {NetworkConfig} from "@/config/NetworkConfig";
import Tabs from "@/components/Tabs.vue";
import {routeManager} from "@/utils/RouteManager.ts";
import ArrowLink from "@/components/ArrowLink.vue";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache.ts";

const props = defineProps({
  accountId: {
    type: String,
    required: true
  },
  network: String,
})

const networkConfig = NetworkConfig.inject()

const tabIds = routeManager.accountDetailsOperator.tabIds
const tabLabels = routeManager.accountDetailsOperator.tabLabels
const selectedTabId = routeManager.accountDetailsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToAccount(props.accountId, null, tabId, true)
  }
}

//
// account
//
const accountLocParser = new AccountLocParser(computed(() => props.accountId ?? null), networkConfig)
onMounted(() => accountLocParser.mount())
onBeforeUnmount(() => accountLocParser.unmount())

const notification = accountLocParser.errorNotification
const isInactiveEvmAddress = accountLocParser.isInactiveEvmAddress
const normalizedAccountId = accountLocParser.accountId
const contractRoute = computed(() => {
  const accountId = accountLocParser.accountId.value
  return accountId ? routeManager.makeRouteToContract(accountId) : ''
})

//
// contract
//
const contractLookup = ContractByIdCache.instance.makeLookup(accountLocParser.accountId)
onMounted(() => contractLookup.mount())
onBeforeUnmount(() => contractLookup.unmount())
const showContractVisible = computed(() => {
  return contractLookup.entity.value != null
})


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

