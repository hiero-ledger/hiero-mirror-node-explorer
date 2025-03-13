// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Transactions">

    <DashboardCardV2>
      <template #title>
        <span>Recent Transactions</span>
      </template>
      <template #left-control>
        <PlayPauseButton :controller="transactionTableController"/>
      </template>
      <template #right-control>
        <TransactionFilterSelect v-model:selected-filter="transactionType"/>
      </template>
      <template #content>
        <TransactionTable :controller="transactionTableController"/>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, Ref, ref} from 'vue';

import TransactionTable from "@/components/transaction/TransactionTable.vue";
import TransactionFilterSelect from "@/components/transaction/TransactionFilterSelect.vue";
import {useRouter} from "vue-router";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {TransactionTableControllerXL} from "@/components/transaction/TransactionTableControllerXL";
import {AppStorage} from "@/AppStorage";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";

defineProps({
  network: String
})

const router = useRouter()

//
// transactionTableController
//

const accountId: Ref<string | null> = ref(null)
const transactionTableController = new TransactionTableControllerXL(
    router,
    accountId,
    15,
    false,
    AppStorage.TRANSACTION_TABLE_PAGE_SIZE_KEY
)
onMounted(() => transactionTableController.mount())
onBeforeUnmount(() => transactionTableController.unmount())

const transactionType = transactionTableController.transactionType

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
