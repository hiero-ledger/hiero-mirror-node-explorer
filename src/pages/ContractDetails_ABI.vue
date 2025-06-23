// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

    <template #title>
      Contract ABI
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
        <ContractAbiValue :abiController="abiController" :fragment-collection="selectedCollection as FragmentCollection"/>
      </template>
      <template v-else>
        <div>ABI is available when contract is verified</div>
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
