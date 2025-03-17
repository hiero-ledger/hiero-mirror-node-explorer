// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div id="topic-message-table">

    <TableViewV3
        :data-source="dataSource"
        :clickable="true"
        :row-height="90"
        @cell-click="handleClick"
    >

      <template #tableHeaders>

        <TableHeaderView>SEQ.#</TableHeaderView>
        <TableHeaderView>TIME</TableHeaderView>
        <TableHeaderView>CHUNK</TableHeaderView>
        <TableHeaderView>MESSAGE</TableHeaderView>

      </template>

      <template #tableCells="message">

        <TableDataView>
          {{ message.sequence_number ?? "" }}
        </TableDataView>

        <TableDataView>
          <div style="text-wrap: nowrap">
            <TimestampValue v-bind:timestamp="message.consensus_timestamp"/>
          </div>
        </TableDataView>

        <TableDataView>
          {{ formatChunk(message) }}
        </TableDataView>

        <TableDataView>
          <BlobValue :blob-value="message.message" :base64="true" :show-none="true"/>
        </TableDataView>

      </template>

    </TableViewV3>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import {TopicMessageTableController} from "@/components/topic/TopicMessageTableController";
import TimestampValue from "@/components/values/TimestampValue.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {TopicMessage} from "@/schemas/MirrorNodeSchemas";
import {routeManager} from "@/router";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";
import {DynamicDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TopicMessageTableController>,
    required: true
  }
})

const dataSource = new DynamicDataSource(props.controller)

const formatChunk = (t: TopicMessage) => t.chunk_info ? `${t.chunk_info.number}/${t.chunk_info.total}` : ''

const handleClick = (t: TopicMessage, event: MouseEvent) => {
  const consensusTimestamp = t.consensus_timestamp
  if (consensusTimestamp) {
    routeManager.routeToTransactionByTs(consensusTimestamp, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>
#topic-message-table table.o-table > tbody > tr {
  cursor: default;
}
</style>
