// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      <ContractSectionTitle :contract-id="props.contractId">Contract</ContractSectionTitle>
    </template>

    <template #content>
      <Property id="entityId" full-width>
        <template #name>
          Contract ID
        </template>
        <template #value>
          <EntityIDView :id="contractId" :checksum="accountChecksum"/>
        </template>
      </Property>
      <Property id="evmAddress" full-width>
        <template #name>
          EVM Address
        </template>
        <template #value>
          <EVMAddress
              :show-id="false"
              :address="contractAddress"/>
        </template>
      </Property>
      <Property id="obtainer" full-width>
        <template #name>Obtainer</template>
        <template #value>
          <AccountLink :account-id="obtainerId"/>
        </template>
      </Property>
      <Property id="proxyAccount" full-width>
        <template #name>Proxy Account</template>
        <template #value>
          <AccountLink :account-id="proxyAccountId"/>
        </template>
      </Property>
      <Property id="file" full-width>
        <template #name>File</template>
        <template #value>
          <StringValue :string-value="contract?.file_id"/>
        </template>
      </Property>

      <Property v-if="isVerified" id="verificationStatus" full-width>
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
      <Property v-if="isVerified" id="contractName" full-width>
        <template v-slot:name>Contract Name</template>
        <template v-slot:value>
          <StringValue :string-value="contractName ?? undefined"/>
        </template>
      </Property>

    </template>

    <template #footer>
      <MirrorLink :network="props.network" entityUrl="contracts" :loc="contractId"/>
    </template>
  </DashboardCardV2>

  <ContractERCSection :erc-analyzer="ercAnalyzer"/>

  <ContractVerificationDialog
      v-model:show-dialog="showVerifyDialog"
      :contract-id="contractId"
      v-on:verify-did-complete="verifyDidComplete"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import EntityIDView from "@/components/values/EntityIDView.vue";
import Property from "@/components/Property.vue";
import StringValue from "@/components/values/StringValue.vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";
import {ContractLocParser} from "@/utils/parser/ContractLocParser";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {routeManager} from "@/utils/RouteManager.ts";
import {ERCAnalyzer} from "@/utils/analyzer/ERCAnalyzer.ts";
import ContractERCSection from "@/components/contract/ContractERCSection.vue";
import MirrorLink from "@/components/MirrorLink.vue";
import InfoTooltip from "@/components/InfoTooltip.vue";
import ButtonView from "@/elements/ButtonView.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import ContractVerificationDialog from "@/dialogs/verification/ContractVerificationDialog.vue";
import ContractSectionTitle from "@/components/contract/ContractSectionTitle.vue";

const props = defineProps({
  contractId: String,
  network: String
})

//
// contract
//
const contractLocParser = new ContractLocParser(computed(() => props.contractId ?? null))
onMounted(() => contractLocParser.mount())
onBeforeUnmount(() => contractLocParser.unmount())
const contractId = contractLocParser.contractId
const contractAddress = contractLocParser.ethereumAddress
const contract = contractLocParser.entity
const proxyAccountId = computed(() => {
  return contract.value?.proxy_account_id ?? null
})
const obtainerId = computed(() => {
  return contract.value?.obtainer_id ?? null
})

//
// ContractAnalyzer
//
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const contractName = contractAnalyzer.contractName
const isVerified = contractAnalyzer.isVerified
const isFullMatch = contractAnalyzer.fullMatch
const FULL_MATCH_TOOLTIP = `A Full Match indicates that the bytecode of the deployed contract is byte-by-byte the same as the compilation output of the given source code files with the settings defined in the metadata file. This means the contents of the source code files and the compilation settings are exactly the same as when the contract author compiled and deployed the contract.`
const PARTIAL_MATCH_TOOLTIP = `A Partial Match indicates that the bytecode of the deployed contract is the same as the compilation output of the given source code files except for the metadata hash. This means the deployed contract and the given source code + metadata function in the same way but there are differences in source code comments, variable names, or other metadata fields such as source paths.`
const tooltipText = computed(() => isFullMatch.value ? FULL_MATCH_TOOLTIP : PARTIAL_MATCH_TOOLTIP)


//
// ERCAnalyzer
//
const ercAnalyzer = new ERCAnalyzer(contractId)
onMounted(() => ercAnalyzer.mount())
onBeforeUnmount(() => ercAnalyzer.unmount())


//
// Account checksum
//

const networkConfig = NetworkConfig.inject()
const accountChecksum = computed(() =>
    contractId.value ? networkConfig.computeChecksum(
        contractId.value,
        routeManager.currentNetwork.value
    ) : null)


//
// Verify dialog
//
const showVerifyDialog = ref(false)
const verifyDidComplete = () => {
  contractAnalyzer.verifyDidComplete()
}


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
