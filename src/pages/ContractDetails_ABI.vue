// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

    <template #title>
      <ContractSectionTitle :contract-id="props.contractId">Contract ABI</ContractSectionTitle>
    </template>

    <template #right-control>
      <div v-if="isVerified" class="contract-code-controls">
        <template v-if="logicModeAvailable">
          <p>Show Logic Contract ABI</p>
          <SwitchView v-model="showLogicABI"/>
        </template>
        <DownloadButton @click="handleDownloadABI"/>
        <SelectView v-model="selectedCollection" :small="true">
          <option :value="FragmentCollection.ALL">All definitions</option>
          <option :value="FragmentCollection.READONLY">Read-only functions</option>
          <option :value="FragmentCollection.READWRITE">Read-write functions</option>
          <option :value="FragmentCollection.EVENTS">Events</option>
          <option :value="FragmentCollection.ERRORS">Errors</option>
          <option :value="FragmentCollection.OTHER">Other definitions</option>
        </SelectView>
      </div>
    </template>

    <template #content>
      <template v-if="isVerified">
        <template v-if="logicContractId">
          <Property id="logicContract" :full-width="true">
            <template v-slot:name>Proxying to Logic Contract</template>
            <template v-slot:value>
              <AccountLink v-bind:accountId="logicContractId"
                           v-bind:show-extra="true"/>
            </template>
          </Property>
          <Property id="adminContract" :full-width="true">
            <template v-slot:name>Proxying with Admin Contract</template>
            <template v-slot:value>
              <AccountLink v-bind:accountId="adminContractId"
                           v-bind:show-extra="true"/>
            </template>
          </Property>
        </template>

        <ContractAbiValue :abiController="abiController" :fragment-collection="selectedCollection as FragmentCollection"/>
      </template>
      <template v-else>
        <p>The contract ABI is available once the contract is verified.</p>
        <p>If you have the contract solidity source and metadata files, you may click VERIFY and proceed with verification.</p>
      </template>
    </template>

  </DashboardCardV2>


</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ComputedRef, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";
import {FragmentCollection} from "@/dialogs/abi/FragmentCollection.ts";
import ContractAbiValue from "@/dialogs/abi/ContractAbiValue.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ABIAnalyzer} from "@/utils/analyzer/ABIAnalyzer.ts";
import {ABIController, ABIMode} from "@/components/contract/ABIController.ts";
import DownloadButton from "@/components/DownloadButton.vue";
import SelectView from "@/elements/SelectView.vue";
import SwitchView from "@/elements/SwitchView.vue";
import {AppStorage} from "@/AppStorage.ts";
import Property from "@/components/Property.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import ContractSectionTitle from "@/components/contract/ContractSectionTitle.vue";

const props = defineProps({
  contractId: String,
  network: String
})

const contractId = computed(() => props.contractId ?? null)
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const isVerified = contractAnalyzer.isVerified


const abiAnalyzer = new ABIAnalyzer(contractAnalyzer)
onMounted(() => abiAnalyzer.mount())
onBeforeUnmount(() => abiAnalyzer.unmount())
const logicContractId = computed(() => {
  return abiAnalyzer.logicContractId.value ?? undefined
})

const adminContractId = computed(() => {
  return abiAnalyzer.adminContractId.value ?? undefined
})

const showLogicABI = ref(AppStorage.getShowLogicABI())
watch(showLogicABI, () => {
  AppStorage.setShowLogicABI(showLogicABI.value)
})
const mode: ComputedRef<ABIMode> = computed(() => {
  return showLogicABI.value && abiController.logicModeAvailable.value ? ABIMode.Logic : ABIMode.Normal
})

const abiController = new ABIController(abiAnalyzer, mode)
const logicModeAvailable = abiController.logicModeAvailable


const selectedCollection = ref<string>(FragmentCollection.ALL)
onMounted(() => {
  const preferredCollection = AppStorage.getFragmentCollection()
  if (preferredCollection && Object.values(FragmentCollection).includes(preferredCollection as FragmentCollection)) {
    selectedCollection.value = preferredCollection
  } else {
    AppStorage.setFragmentCollection(null)
    selectedCollection.value = FragmentCollection.ALL
  }
})
watch(selectedCollection, () => AppStorage.setFragmentCollection(selectedCollection.value))


const abiBlob = computed(() => {
  let result: Blob | null
  const itf = abiController.targetInterface.value
  if (itf !== null) {
    result = new Blob([itf.formatJson()], {type: "text/json"})
  } else {
    result = null
  }
  return result
})
const handleDownloadABI = () => {
  if (abiBlob.value !== null) {
    const url = window.URL.createObjectURL(abiBlob.value)
    const outputName = abiController.targetContractName.value + ".json"
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', outputName);
    a.click()
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.contract-code-controls {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

</style>
