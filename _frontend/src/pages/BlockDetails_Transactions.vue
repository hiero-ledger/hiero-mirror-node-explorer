// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 id="blockTransactions">
    <template #title>
      Block Transactions
    </template>
    <template #content>
      <BlockTransactionTable :transactions="transactions"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import BlockTransactionTable from "@/components/block/BlockTransactionTable.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {BlockLocParser} from "@/utils/parser/BlockLocParser.ts";
import {TransactionGroupByBlockCache} from "@/utils/cache/TransactionGroupByBlockCache.ts";

const props = defineProps({
  blockHon: String,
  network: String
})


//
// BlockLocParser
//
const blockLocParser = new BlockLocParser(computed(() => props.blockHon ?? null))
onMounted(() => blockLocParser.mount())
onBeforeUnmount(() => blockLocParser.unmount())

//
// transactions
//
const transactionsLookup = TransactionGroupByBlockCache.instance.makeLookup(blockLocParser.blockNumber)
onMounted(() => transactionsLookup.mount())
onBeforeUnmount(() => transactionsLookup.unmount())
const transactions = computed(() => transactionsLookup.entity.value ?? [])


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
