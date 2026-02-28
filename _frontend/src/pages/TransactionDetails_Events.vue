// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ContractResultLogs
      :logs="logs"
      :block-number="blockNumber ?? undefined"
      :transaction-hash="transaction?.transaction_hash"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import {TransactionLocParser} from "@/utils/parser/TransactionLocParser";
import {TransactionAnalyzer} from "@/components/transaction/TransactionAnalyzer";
import ContractResultLogs from "@/components/contract/ContractResultLogs.vue";
import {ContractResultAnalyzer} from "@/utils/analyzer/ContractResultAnalyzer.ts";
import {NetworkFeesCache} from "@/utils/cache/NetworkFeesCache.ts";

const props = defineProps({
  transactionLoc: String,
  network: String
})

const transactionLoc = computed(() => props.transactionLoc ?? null)
const transactionLocParser = new TransactionLocParser(transactionLoc)
onMounted(() => transactionLocParser.mount())
onBeforeUnmount(() => transactionLocParser.unmount())

const transactionAnalyzer = new TransactionAnalyzer(transactionLocParser.transaction)
onMounted(() => transactionAnalyzer.mount())
onBeforeUnmount(() => transactionAnalyzer.unmount())

const transaction = transactionLocParser.transaction
const timestamp = transactionAnalyzer.consensusTimestamp

const contractResultAnalyzer = new ContractResultAnalyzer(transaction)
onMounted(() => contractResultAnalyzer.mount())
onBeforeUnmount(() => contractResultAnalyzer.unmount())

const feeLookup = NetworkFeesCache.instance.makeLookup(timestamp)
onMounted(() => feeLookup.mount())
onBeforeUnmount(() => feeLookup.unmount())

const contractResult = contractResultAnalyzer.contractResult
const blockNumber = transactionAnalyzer.blockNumber

const logs = computed(() => contractResult.value?.logs ?? [])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
