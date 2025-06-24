// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ContractResultLogs
      :logs="contractResult?.logs"
      :block-number="blockNumber ?? undefined"
      :transaction-hash="transaction?.transaction_hash"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import {TransactionDetail} from "@/schemas/MirrorNodeSchemas";
import {TransactionLocParser} from "@/utils/parser/TransactionLocParser";
import {TransactionGroupAnalyzer} from "@/components/transaction/TransactionGroupAnalyzer";
import {TransactionAnalyzer} from "@/components/transaction/TransactionAnalyzer";
import {TransactionGroupCache} from "@/utils/cache/TransactionGroupCache";
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

const transactionGroupLookup = TransactionGroupCache.instance.makeLookup(transactionLocParser.transactionId)
onMounted(() => transactionGroupLookup.mount())
onBeforeUnmount(() => transactionGroupLookup.unmount())

const transactionGroupAnalyzer = new TransactionGroupAnalyzer(transactionGroupLookup.entity)

const transaction = computed(() => {
  let result: TransactionDetail | null
  const consensusTimestamp = transactionAnalyzer.consensusTimestamp.value
  if (consensusTimestamp !== null) {
    result = null
    for (const t of transactionGroupAnalyzer.transactions.value ?? []) {
      if (consensusTimestamp == t.consensus_timestamp) {
        result = t
        break
      }
    }
  } else {
    result = null
  }
  return result
})

const timestamp = transactionAnalyzer.consensusTimestamp

const contractResultAnalyzer = new ContractResultAnalyzer(transaction)
onMounted(() => contractResultAnalyzer.mount())
onBeforeUnmount(() => contractResultAnalyzer.unmount())

const feeLookup = NetworkFeesCache.instance.makeLookup(timestamp)
onMounted(() => feeLookup.mount())
onBeforeUnmount(() => feeLookup.unmount())

const contractResult = contractResultAnalyzer.contractResult
const blockNumber = transactionAnalyzer.blockNumber

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
