// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <template v-if="transaction">

    <TransferGraphSection
        v-if="shouldGraph"
        :analyzer="transactionAnalyzer"
        :compact="true"
    />

    <div v-else-if="isTokenAssociation" class="h-should-wrap tx-summary">
      <EntityIOL :entity-id="entityId"/>
      <template v-if="tokens.length">
        <Link :size="16" :stroke-width="2.5" class="h-is-low-contrast"/>
        <TokenExtra :token-id="tokens[0]"/>
        <span v-if="additionalTokensNumber" class="h-is-smaller h-is-extra-text h-should-wrap">
          {{ ' (+' + additionalTokensNumber + ' more)' }}
        </span>
      </template>
    </div>

    <div v-else-if="displayMemo" class="h-should-wrap">
      {{ displayMemo }}
    </div>

    <div v-else-if="entityType && entityId" class="h-should-wrap tx-summary">
      <span>{{ entityType + ':' }}</span>
      <EntityIOL :entity-id="entityId"/>
    </div>

  </template>
  <div v-else/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {Transaction, TransactionDetail, TransactionType} from "@/schemas/MirrorNodeSchemas";
import {formatMemo, makeEntityType} from "@/utils/TransactionTools";
import TransferGraphSection from "@/components/transfer_graphs/TransferGraphSection.vue";
import {TransactionAnalyzer} from "@/components/transaction/TransactionAnalyzer";
import TokenExtra from "@/components/values/link/TokenExtra.vue";
import EntityIOL from "@/components/values/link/EntityIOL.vue";
import {Link} from "lucide-vue-next";

const GRAPH_TRANSACTION_TYPES = [
  TransactionType.CRYPTOTRANSFER,
  TransactionType.TOKENBURN,
  TransactionType.TOKENMINT,
  TransactionType.TOKENREJECT,
  TransactionType.TOKENAIRDROP,
  TransactionType.TOKENCLAIMAIRDROP
]

const MEMO_TRANSACTION_TYPES = [
  TransactionType.CONSENSUSSUBMITMESSAGE,
  TransactionType.CRYPTOAPPROVEALLOWANCE,
  TransactionType.CRYPTODELETEALLOWANCE
]

const props = defineProps({
  transaction: Object as PropType<Transaction | undefined>
})

const transactionDetail = computed(() => props.transaction as TransactionDetail ?? null)

const shouldGraph = computed(() => {
  let result: boolean
  if (props.transaction?.name) {
    const alwaysGraph = GRAPH_TRANSACTION_TYPES.indexOf(props.transaction.name) != -1
    const contractCallWithTransfer = props.transaction.name === TransactionType.CONTRACTCALL
        && (netAmount.value > 0 || hasTokenTransfers.value || hasNftTransfers.value)
    result = alwaysGraph || contractCallWithTransfer
  } else {
    result = false
  }
  return result
})

const displayMemo = computed(() => {
  let result: string | null
  if (transactionDetail.value?.name && MEMO_TRANSACTION_TYPES.indexOf(transactionDetail.value.name) != -1) {
    result = formatMemo(transactionDetail.value?.memo_base64 ?? "")
  } else {
    result = null
  }
  return result
})

const transactionAnalyzer = new TransactionAnalyzer(transactionDetail)
onMounted(() => transactionAnalyzer.mount())
onBeforeUnmount(() => transactionAnalyzer.unmount())

const additionalTokensNumber = computed(() =>
    Math.max(0, transactionAnalyzer.tokens.value.length - 1)
)

const entityType = computed(() => {
  let result: string | null
  if (isEthereumTransaction.value) {
    result = contractId.value ? 'Contract' : entityId.value ? 'Account' : ""
  } else {
    result = makeEntityType(transactionDetail.value)
  }
  return result
})

const entityId = transactionAnalyzer.entityId
const contractId = transactionAnalyzer.contractId
const netAmount = transactionAnalyzer.netAmount
const hasTokenTransfers = transactionAnalyzer.hasTokenTransfers
const hasNftTransfers = transactionAnalyzer.hasNftTransfers
const isTokenAssociation = transactionAnalyzer.isTokenAssociation
const isEthereumTransaction = transactionAnalyzer.isEthereumTransaction
const tokens = transactionAnalyzer.tokens

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.tx-summary {
  align-items: center;
  display: flex;
  gap: 4px
}

</style>
