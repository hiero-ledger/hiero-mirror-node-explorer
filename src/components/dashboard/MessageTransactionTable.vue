// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="transactions"
      :loading="loading"
      :per-page="perPage"
      @cell-click="handleClick"

      :hoverable="true"
      :narrowed="true"
      :striped="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

      customRowKey="consensus_timestamp"
  >

    <o-table-column v-slot="props" field="topic_id" label="TOPIC ID">
      <TopicIOL class="topic-id" :topic-id="props.row.entity_id"/>
    </o-table-column>

    <o-table-column v-slot="props" field="content" label="CONTENT">
      <TopicMessageCell
          :timestamp="props.row.consensus_timestamp"
          :property="TopicMessageCellItem.message"
          :truncation="36"
      />
    </o-table-column>

    <o-table-column v-slot="props" field="consensus_timestamp" label="TIME">
      <TimestampValue :timestamp="props.row.consensus_timestamp"/>
    </o-table-column>

  </o-table>

  <EmptyTable v-if="!transactions.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {routeManager} from "@/router";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import TopicIOL from "@/components/values/link/TopicIOL.vue";
import TopicMessageCell, {TopicMessageCellItem} from "@/components/topic/TopicMessageCell.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<TransactionTableController>,
    required: true
  }
})

const handleClick = (t: Transaction, c: unknown, i: number, ci: number, event: MouseEvent) => {
  routeManager.routeToTransaction(t, event)
}

const transactions = props.controller.rows
const loading = props.controller.loading
const perPage = props.controller.pageSize

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.topic-id {
  font-weight: 600;
}

</style>
