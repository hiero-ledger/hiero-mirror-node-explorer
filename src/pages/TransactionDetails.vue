// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 :page-title="pageTitle">
    <template #page-title>
      Transaction
      <span style="white-space: nowrap; font-size: smaller">
        {{ formattedTransactionId }}
      </span>
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <Tabs
        :tab-ids="tabIds"
        :tab-labels="tabLabels"
        :selected-tab="selectedTabId"
        @update:selected-tab="onUpdate($event)"
    />

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import {TransactionLocParser} from "@/utils/parser/TransactionLocParser";
import {TransactionAnalyzer} from "@/components/transaction/TransactionAnalyzer";
import {TransactionID} from "@/utils/TransactionID";
import {routeManager} from "@/utils/RouteManager.ts";
import Tabs from "@/components/Tabs.vue";
import {ContractResultAnalyzer} from "@/utils/analyzer/ContractResultAnalyzer.ts";
import {ContractActionsLoader} from "@/components/contract/ContractActionsLoader.ts";

const props = defineProps({
  transactionLoc: String,
  network: String
})

const excludedTabIds = computed(() => {
  const result = transactionAnalyzer.isSubmitMessage.value ? [] : ["TransactionDetails_Message"]
  if (contractResultAnalyzer.contractResult.value === null) {
    result.push(...[
      "TransactionDetails_Result",
      "TransactionDetails_Trace",
      "TransactionDetails_States",
      "TransactionDetails_Events",
    ])
  } else {
    if (actions.value.length === 0) {
      result.push("TransactionDetails_Trace")
    }
    if (contractResultAnalyzer.contractResult.value.state_changes.length === 0) {
      result.push("TransactionDetails_States")
    }
    if (contractResultAnalyzer.contractResult.value.logs.length === 0) {
      result.push("TransactionDetails_Events")
    }
  }
  // We never exclude currently selected tab id:
  // => it's likely we are loading just after a back action
  const selectedTabId = routeManager.transactionDetailsOperator.selectedTabId.value
  const selectedTabIndex = selectedTabId !== null ? result.indexOf(selectedTabId) : -1
  if (selectedTabIndex !== -1) {
    result.splice(selectedTabIndex, 1)
  }
  return result
})

const tabIds = computed(() =>
    excludedTabIds.value.length > 0
        ? routeManager.transactionDetailsOperator.filterTabIds(excludedTabIds.value)
        : routeManager.transactionDetailsOperator.tabIds
)

const tabLabels = computed(() =>
    excludedTabIds.value.length > 0
        ? routeManager.transactionDetailsOperator.filterTabLabels(excludedTabIds.value)
        : routeManager.transactionDetailsOperator.tabLabels
)

const selectedTabId = routeManager.transactionDetailsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null && transactionAnalyzer.consensusTimestamp.value) {
    routeManager.routeToTransactionByTs(transactionAnalyzer.consensusTimestamp.value, null, tabId, true)
  }
}

const txIdForm = ref(TransactionID.useAtForm.value ? 'atForm' : 'dashForm')
watch(txIdForm, () => TransactionID.setUseAtForm(txIdForm.value === 'atForm'))

const transactionLoc = computed(() => props.transactionLoc ?? null)
const transactionLocParser = new TransactionLocParser(transactionLoc)
onMounted(() => transactionLocParser.mount())
onBeforeUnmount(() => transactionLocParser.unmount())

const transactionAnalyzer = new TransactionAnalyzer(transactionLocParser.transaction)
onMounted(() => transactionAnalyzer.mount())
onBeforeUnmount(() => transactionAnalyzer.unmount())

const formattedTransactionId = computed(() =>
    transactionAnalyzer.formattedTransactionId.value
)
const pageTitle = computed(() =>
    transactionAnalyzer.consensusTimestamp.value !== null
        ? "Transaction " + transactionAnalyzer.consensusTimestamp.value
        : null
)

const contractResultAnalyzer = new ContractResultAnalyzer(transactionAnalyzer.transaction)
onMounted(() => contractResultAnalyzer.mount())
onBeforeUnmount(() => contractResultAnalyzer.unmount())

const txHash = computed(() => contractResultAnalyzer.contractResult.value?.hash ?? null)
const contractActionsLoader = new ContractActionsLoader(txHash)
onMounted(() => contractActionsLoader.mount())
onBeforeUnmount(() => contractActionsLoader.unmount())
const actions = computed(()  => contractActionsLoader.actions.value ?? [])

const notification = transactionLocParser.errorNotification

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
