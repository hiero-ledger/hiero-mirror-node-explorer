// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Topics">

    <DashboardCardV2>
      <template #title>
        <span>Recent Topics</span>
      </template>
      <template #content>
        <TopicTable v-bind:controller="transactionTableController"/>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, onBeforeUnmount, onMounted, watch} from 'vue';
import TopicTable from "@/components/topic/TopicTable.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import {TransactionResult, TransactionType} from "@/schemas/MirrorNodeSchemas";
import {useRouter} from "vue-router";
import {AppStorage} from "@/AppStorage";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

const props = defineProps({
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)
const router = useRouter()
const defaultPageSize = isMediumScreen ? 15 : 5

const transactionTableController = new TransactionTableController(
    router,
    defaultPageSize,
    TransactionType.CONSENSUSCREATETOPIC,
    TransactionResult.SUCCESS,
    AppStorage.TOPIC_TABLE_PAGE_SIZE_KEY
)
onMounted(() => transactionTableController.mount())
onBeforeUnmount(() => transactionTableController.unmount())

watch(() => props.network, () => {
  transactionTableController.reset()
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
