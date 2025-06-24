// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

    <template #title>
      <ContractSectionTitle :contract-id="props.contractId">Contract Source</ContractSectionTitle>
    </template>

    <template #right-control>
      <div v-if="isVerified" class="contract-code-controls">
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
    </template>

    <template #content>
      <template v-if="isVerified">
        <ContractSourceValue :source-files="solidityFiles" :filter="selectedSource"/>
      </template>
      <template v-else>
        <div>Contract sources are available when contract is verified</div>
      </template>
    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ContractSectionTitle from "@/components/contract/ContractSectionTitle.vue";
import ContractSourceValue from "@/components/values/ContractSourceValue.vue";
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";
import DownloadButton from "@/components/DownloadButton.vue";
import SelectView from "@/elements/SelectView.vue";
import JSZip from "jszip";
import {saveAs} from "file-saver";
import {SourcifyResponseItem} from "@/utils/cache/SourcifyCache.ts";

const props = defineProps({
  contractId: String,
  network: String
})

//
// ContractAnalyzer
//

const contractId = computed(() => props.contractId ?? null)
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const isVerified = contractAnalyzer.isVerified
const solidityFiles = contractAnalyzer.solidityFiles
const sourceFileName = contractAnalyzer.sourceFileName
const contractFileName = contractAnalyzer.contractFileName

const selectedSource = ref('')
watch(contractAnalyzer.contractFileName,
    () => selectedSource.value = contractAnalyzer.contractFileName.value ?? '', {immediate: true})

const isImportFile = (file: SourcifyResponseItem): boolean => {
  return file.name !== contractAnalyzer.contractFileName.value
}


//
// handleDownload
//

const handleDownload = async () => {
  const contractURL = contractAnalyzer.sourcifyURL.value ?? ''
  if (selectedSource.value === '') {
    const zip = new JSZip();
    for (const file of contractAnalyzer.sourceFiles.value) {
      const filePath = file.path.substring(file.path.indexOf('match') + 10)
      zip.file(filePath, file.content);
    }
    zip.generateAsync({type: "blob"})
        .then(function (content: Blob) {
          const zipName = contractAnalyzer.contractAddress.value + '.zip'
          saveAs(content, zipName);
        });
  } else {
    for (const file of contractAnalyzer.solidityFiles.value) {
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

const relevantPath = (fullPath: string): string => {
  return fullPath.substring(fullPath.indexOf('sources') + 8)
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
