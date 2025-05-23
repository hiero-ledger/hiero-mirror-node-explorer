// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 collapsible-key="contractBytecode">
    <template #title>
      Contract Bytecode
      <div
          v-if="isVerificationAvailable"
          class="h-has-pill"
          :class="{'h-chip-success':isVerified, 'h-chip-default':!isVerified}"
          style="margin-top: 2px">
        {{ isVerified ? 'VERIFIED' : 'NOT VERIFIED' }}
      </div>
    </template>

    <template #right-control>
      <ButtonView
          v-if="isVerificationAvailable && !isVerified"
          :size="ButtonSize.small"
          @action="showVerifyDialog = true"
      >
        VERIFY
      </ButtonView>
    </template>

    <template #content>
      <Property v-if="isVerified" id="verificationStatus" :full-width="true">
        <template v-slot:name>Verification Status</template>
        <template v-slot:value>
          <div class="verification-status">
            {{ isFullMatch ? "Full Match" : "Partial Match" }}
            <InfoTooltip :label="tooltipText"/>
            <ButtonView
                v-if="!isFullMatch"
                id="verify-button"
                :size="ButtonSize.small"
                @action="showVerifyDialog = true"
            >
              RE-VERIFY
            </ButtonView>
          </div>
        </template>
      </Property>
      <Property v-if="isVerified" id="contractName" :full-width="true">
        <template v-slot:name>Contract Name</template>
        <template v-slot:value>
          <StringValue :string-value="contractName ?? undefined"/>
        </template>
      </Property>
      <Property id="solcVersion" :full-width="true">
        <template v-slot:name>Solidity Compiler Version</template>
        <template v-slot:value>
          <StringValue :string-value="solcVersion ?? undefined"/>
        </template>
      </Property>
      <Property v-if="isVerified" id="contractName" :full-width="true">
        <template v-slot:name>EVM Version</template>
        <template v-slot:value>
          <StringValue :string-value="evmVersion"/>
        </template>
      </Property>
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

      <hr class="horizontal-line">

      <template v-if="isVerified">
        <div class="contract-code-header">
          <Tabs :tab-ids=tabIds :tab-labels=tabLabels
                :selected-tab="selectedOption"
                @update:selected-tab="handleTabUpdate($event)"
          />
          <div v-if="selectedOption==='source'" class="contract-code-controls">
            <DownloadButton @click="handleDownload"/>
            <SelectView v-model="selectedSource" :small="true">
              <option value="">All source files</option>
              <optgroup label="Main contract file">
                <option :value="contractFileName">{{ sourceFileName }}</option>
              </optgroup>
              <optgroup label="Include files">
                <option v-for="file in solidityFiles" v-bind:key="file.path"
                        v-bind:value="file.name"
                        v-show="isImportFile(file)">
                  {{ relevantPath(file.path) }}
                </option>
              </optgroup>
            </SelectView>
          </div>
          <div v-else-if="selectedOption==='abi'" class="contract-code-controls">
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
        </div>

        <template v-if="selectedOption==='source'">
          <ContractSourceValue :source-files="solidityFiles" :filter="selectedSource"/>
        </template>

        <template v-else-if="selectedOption==='bytecode'">
          <ContractByteCodeValue :byte-code="byteCode" :show-hexa-opcode="showHexaOpcode"/>
        </template>

        <template v-else>
          <ContractAbiValue :abiController="abiController" :fragment-collection="selectedCollection as FragmentCollection"/>
        </template>
      </template>
      <template v-else>
        <ContractByteCodeValue :byte-code="byteCode" :show-hexa-opcode="showHexaOpcode"/>
      </template>
    </template>
  </DashboardCardV2>

  <ContractVerificationDialog
      v-model:show-dialog="showVerifyDialog"
      :contract-id="contractId"
      v-on:verify-did-complete="verifyDidComplete"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ComputedRef, onBeforeUnmount, onMounted, PropType, ref, watch} from 'vue';
import StringValue from "@/components/values/StringValue.vue";
import Property from "@/components/Property.vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer";
import {routeManager} from "@/router";
import InfoTooltip from "@/components/InfoTooltip.vue";
import ContractVerificationDialog from "@/dialogs/verification/ContractVerificationDialog.vue";
import {AppStorage} from "@/AppStorage";
import ContractSourceValue from "@/components/values/ContractSourceValue.vue";
import ContractAbiValue from "@/dialogs/abi/ContractAbiValue.vue";
import {FragmentCollection} from "@/dialogs/abi/FragmentCollection.ts";
import {SourcifyResponseItem} from "@/utils/cache/SourcifyCache";
import DownloadButton from "@/components/DownloadButton.vue";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import Tabs from "@/components/Tabs.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {ABIController, ABIMode} from "@/components/contract/ABIController";
import {ABIAnalyzer} from "@/utils/analyzer/ABIAnalyzer";
import SelectView from "@/elements/SelectView.vue";
import SwitchView from "@/elements/SwitchView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ButtonView from "@/elements/ButtonView.vue";
import ContractByteCodeValue from "@/components/values/ContractByteCodeValue.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";

const FULL_MATCH_TOOLTIP = `A Full Match indicates that the bytecode of the deployed contract is byte-by-byte the same as the compilation output of the given source code files with the settings defined in the metadata file. This means the contents of the source code files and the compilation settings are exactly the same as when the contract author compiled and deployed the contract.`
const PARTIAL_MATCH_TOOLTIP = `A Partial Match indicates that the bytecode of the deployed contract is the same as the compilation output of the given source code files except for the metadata hash. This means the deployed contract and the given source code + metadata function in the same way but there are differences in source code comments, variable names, or other metadata fields such as source paths.`

const props = defineProps({
  contractAnalyzer: {
    type: Object as PropType<ContractAnalyzer>,
    required: true
  }
})

const isVerified = props.contractAnalyzer.isVerified
const isFullMatch = props.contractAnalyzer.fullMatch
const contractName = props.contractAnalyzer.contractName
const evmVersion = props.contractAnalyzer.evmVersion

// True when the verification is ENABLED by configuration and the current verification STATUS is known, which
// enables to decide which option to present to the user
const isVerificationAvailable = computed(() => {
  const sourcifySetup = routeManager.currentNetworkEntry.value.sourcifySetup
  return sourcifySetup?.activate
      && sourcifySetup?.serverURL.length
})

const showVerifyDialog = ref(false)
const verifyDidComplete = () => {
  props.contractAnalyzer.verifyDidComplete()
}

const tooltipText = computed(() => isFullMatch.value ? FULL_MATCH_TOOLTIP : PARTIAL_MATCH_TOOLTIP)

const showHexaOpcode = ref(false)
onMounted(() => showHexaOpcode.value = AppStorage.getShowHexaOpcode())
watch(showHexaOpcode, () => AppStorage.setShowHexaOpcode(showHexaOpcode.value ? showHexaOpcode.value : null))

const tabIds = ['abi', 'source', 'bytecode']
const tabLabels = ['ABI', 'Source', 'Bytecode']
const selectedOption = ref<string | null>(AppStorage.getContractByteCodeTab() ?? tabIds[0])
const handleTabUpdate = (tab: string | null) => {
  selectedOption.value = tab
  AppStorage.setContractByteCodeTab(tab)
}

const selectedSource = ref('')
watch(props.contractAnalyzer.contractFileName,
    () => selectedSource.value = props.contractAnalyzer.contractFileName.value ?? '', {immediate: true})

const isImportFile = (file: SourcifyResponseItem): boolean => {
  return file.name !== props.contractAnalyzer.contractFileName.value
}

const relevantPath = (fullPath: string): string => {
  return fullPath.substring(fullPath.indexOf('sources') + 8)
}

const handleDownload = async () => {
  const contractURL = props.contractAnalyzer.sourcifyURL.value ?? ''
  if (selectedSource.value === '') {
    const zip = new JSZip();
    for (const file of props.contractAnalyzer.sourceFiles.value) {
      const filePath = file.path.substring(file.path.indexOf('match') + 10)
      zip.file(filePath, file.content);
    }
    zip.generateAsync({type: "blob"})
        .then(function (content: any) {
          const zipName = props.contractAnalyzer.contractAddress.value + '.zip'
          saveAs(content, zipName);
        });
  } else {
    for (const file of props.contractAnalyzer.solidityFiles.value) {
      if (file.name === selectedSource.value) {
        const URLPrefix = contractURL.substring(0, contractURL.indexOf('contracts'))
        const filePath = file.path.substring(file.path.indexOf('contracts'))
        const fileURL = URLPrefix + filePath

        const a = document.createElement('a')
        a.setAttribute('href', fileURL)
        a.setAttribute('download', file.name);
        a.click()
      }
    }
  }
}

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

const abiAnalyzer = new ABIAnalyzer(props.contractAnalyzer)
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

const byteCode = props.contractAnalyzer.byteCode
const solcVersion = props.contractAnalyzer.solcVersion
const contractId = props.contractAnalyzer.contractId
const solidityFiles = props.contractAnalyzer.solidityFiles
const sourceFileName = props.contractAnalyzer.sourceFileName
const contractFileName = props.contractAnalyzer.contractFileName
const logicModeAvailable = abiController.logicModeAvailable

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.contract-code-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

div.contract-code-controls {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

hr.horizontal-line {
  margin: 8px 0;
}

div.verification-status {
  align-items: center;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: right;
}

@media (min-width: 768px) {
  div.verification-status {
    justify-content: left;
  }
}

</style>
