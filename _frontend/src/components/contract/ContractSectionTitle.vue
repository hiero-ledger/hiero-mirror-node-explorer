// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <slot/>
  <div v-if="contractName" class="card-title-extra">
    {{ contractName }}
  </div>
  <span class="mr-1"/>
  <div v-if="isVerified" class="h-has-pill h-chip-success">
    VERIFIED
  </div>
  <div v-if="isErc20" class="h-has-pill">
    ERC 20
  </div>
  <div v-if="isErc721" class="h-has-pill">
    ERC 721
  </div>
  <div v-if="isErc1155" class="h-has-pill">
    ERC 1155
  </div>
  <DomainLabel v-if="domainName" :domain-name="domainName" :provider-name="domainProviderName"/>
  <PublicLabel v-if="label" :label-definition="label"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import DomainLabel from "@/components/values/DomainLabel.vue";
import PublicLabel from "@/components/values/PublicLabel.vue";
import {ContractAnalyzer} from "@/utils/analyzer/ContractAnalyzer.ts";
import {ERCAnalyzer} from "@/utils/analyzer/ERCAnalyzer.ts";
import {computed, onBeforeUnmount, onMounted} from "vue";
import {NameQuery} from "@/utils/name_service/NameQuery.ts";
import {PublicLabelsCache} from "@/utils/cache/PublicLabelsCache.ts";

const props = defineProps({
  contractId: String
})

//
// ContractAnalyzer
//
const contractId = computed(() => props.contractId ?? null)
const contractAnalyzer = new ContractAnalyzer(contractId)
onMounted(() => contractAnalyzer.mount())
onBeforeUnmount(() => contractAnalyzer.unmount())
const contractName = contractAnalyzer.contractName
const isVerified = contractAnalyzer.isVerified


//
// ERCAnalyzer
//
const ercAnalyzer = new ERCAnalyzer(contractId)
onMounted(() => ercAnalyzer.mount())
onBeforeUnmount(() => ercAnalyzer.unmount())
const isErc20 = ercAnalyzer.isErc20
const isErc721 = ercAnalyzer.isErc721
const isErc1155 = ercAnalyzer.isErc1155

//
// Naming
//
const nameQuery = new NameQuery(contractId)
onMounted(() => nameQuery.mount())
onBeforeUnmount(() => nameQuery.unmount())
const domainName = nameQuery.name
const domainProviderName = nameQuery.providerName

//
// Label
//
const indexLookup = PublicLabelsCache.instance.makeLookup()
onMounted(() => indexLookup.mount())
onBeforeUnmount(() => indexLookup.unmount())
const index = indexLookup.entity
const label = computed(() =>
    contractId.value ? index.value?.lookup(contractId.value) ?? null : null
)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
