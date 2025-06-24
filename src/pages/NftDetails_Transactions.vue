// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="nftInfo" id="recentTransactions" collapsible-key="recentNftTransactions">
    <template #title>
      Recent Transactions
    </template>

    <template #left-control>
      <PlayPauseButton :controller="transactionTableController"/>
    </template>

    <template #right-control>
      <TransactionFilterSelect v-model:selected-filter="transactionType" nft-filter/>
    </template>

    <template #content>
      <NftTransactionTable
          :controller="transactionTableController"
          :narrowed="true"
      />
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {computed, inject, onBeforeUnmount, onMounted, ref, watch} from "vue"
import {EntityID} from "@/utils/EntityID"
import {NftBySerialCache} from "@/utils/cache/NftBySerialCache"
import NftTransactionTable from "@/components/transaction/NftTransactionTable.vue"
import {NftTransactionTableController} from "@/components/transaction/NftTransactionTableController"
import TransactionFilterSelect from "@/components/transaction/TransactionFilterSelect.vue"
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import router, {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  tokenId: {
    type: String,
    required: true,
  },
  serialNumber: {
    type: String,
    required: true,
  },
  network: String,
})

const isMediumScreen = inject("isMediumScreen", true)

const normalizedTokenId = computed(() => {
  const network = routeManager.currentNetworkEntry.value
  const result =
      EntityID.parse(props.tokenId) ??
      EntityID.fromAddress(props.tokenId, network.baseShard, network.baseRealm)
  return result !== null ? result.toString() : null
})

const serialNumber = ref(props.serialNumber)
const nftLookup = NftBySerialCache.instance.makeNftLookup(
    normalizedTokenId,
    serialNumber,
)
onMounted(() => nftLookup.mount())
onBeforeUnmount(() => nftLookup.unmount())

const defaultPageSize = isMediumScreen ? 10 : 5

//
// TransactionTableController
//
const transactionTableController = new NftTransactionTableController(
    router,
    normalizedTokenId,
    serialNumber,
    defaultPageSize,
    "p1",
    "k1",
)

let mounted = false
onMounted(() => {
  mounted = true
  if (serialNumber.value !== null) {
    transactionTableController.mount()
  }
})
onBeforeUnmount(() => {
  mounted = false
  if (serialNumber.value !== null) {
    transactionTableController.unmount()
  }
})
watch(serialNumber, () => {
  if (mounted) {
    if (serialNumber.value !== null) {
      transactionTableController.mount()
    } else {
      transactionTableController.unmount()
    }
  }
})

const nftInfo = nftLookup.entity
const transactionType = transactionTableController.transactionType

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
