// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
      :clickable="true"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>TOPIC</TableHeaderView>
      <TableHeaderView>CREATED</TableHeaderView>
      <TableHeaderView>MEMO</TableHeaderView>

    </template>

    <template #tableCells="topic">

      <TableDataView>
        <TopicIOL class="topic_id" :topic-id="topic.entity_id"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="topic.valid_start_timestamp"/>
      </TableDataView>

      <TableDataView>
        <BlobValue :blob-value="topic.memo_base64" :base64="true" :show-none="true"/>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {routeManager} from "@/router";
import BlobValue from "@/components/values/BlobValue.vue";
import {TransactionTableController} from "@/components/transaction/TransactionTableController";
import TopicIOL from "@/components/values/link/TopicIOL.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TransactionTableController>,
    required: true
  }
})

const dataSource = new DynamicDataSource(props.controller)

const handleClick = (t: Transaction, event: MouseEvent) => {
  if (t.entity_id) {
    routeManager.routeToTopic(t.entity_id, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.topic_id {
  font-weight: 600;
}

</style>
