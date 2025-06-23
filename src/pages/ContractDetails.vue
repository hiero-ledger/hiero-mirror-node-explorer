// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      Contract
      <span style="white-space: nowrap; font-size: smaller">
        {{ contractId }}
      </span>
    </template>

    <template #left-toolbar>
      <Tabs
          :tab-ids="tabIds"
          :tab-labels="tabLabels"
          :selected-tab="selectedTabId"
          @update:selected-tab="onUpdate($event)"
      />
    </template>

    <template #right-toolbar>
      <ButtonView
          v-if="isVerificationAvailable && !isVerified"
          :size="ButtonSize.small"
          :for-toolbar="true"
          @action="showVerifyDialog = true"
      >
        VERIFY
      </ButtonView>
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <router-view/>

  </PageFrameV2>

  <ContractVerificationDialog
      v-model:show-dialog="showVerifyDialog"
      :contract-id="contractId"
      v-on:verify-did-complete="verifyDidComplete"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import ButtonView from "@/elements/ButtonView.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import Tabs from "@/components/Tabs.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";
import {ContractLocParser} from "@/utils/parser/ContractLocParser";
import {routeManager} from "@/utils/RouteManager.ts";
import ContractVerificationDialog from "@/dialogs/verification/ContractVerificationDialog.vue";

const props = defineProps({
  contractId: {
    type: String,
    required: true
  },
  network: String
})

const tabIds = routeManager.contractDetailsOperator.tabIds
const tabLabels = routeManager.contractDetailsOperator.tabLabels
const selectedTabId = routeManager.contractDetailsOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToContract(props.contractId, null, tabId, true)
  }
}

//
// ContractLocParser
//
const contractLocParser = new ContractLocParser(computed(() => props.contractId ?? null))
onMounted(() => contractLocParser.mount())
onBeforeUnmount(() => contractLocParser.unmount())
const contractId = contractLocParser.contractId
const notification = contractLocParser.errorNotification

//
//  ContractAnalyzer
//
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const isVerified = contractAnalyzer.isVerified


// True when the verification is ENABLED by configuration and the current verification STATUS is known, which
// enables to decide which option to present to the user
const isVerificationAvailable = computed(() => {
  const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup
  return sourcifySetup?.activate
      && sourcifySetup?.serverURL.length
})

const showVerifyDialog = ref(false)
const verifyDidComplete = () => {
  contractAnalyzer.verifyDidComplete()
}


</script>

<style scoped>

</style>
