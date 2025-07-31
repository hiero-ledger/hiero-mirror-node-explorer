// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div id="topic-message-table">
    <o-table
        :data="messages"
        :loading="loading"
        :paginated="!isTouchDevice && paginated"
        backend-pagination
        pagination-order="centered"
        :total="total"
        v-model:current-page="currentPage"
        :per-page="perPage"
        @page-change="onPageChange"
        @cell-click="handleClick"

        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"

        row-key="consensus_timestamp"
    >
      <o-table-column v-slot="props" field="sequence_number" label="SEQ.#">
        {{ props.row.sequence_number != null ? props.row.sequence_number : "" }}
      </o-table-column>

      <o-table-column v-slot="props" field="consensus_timestamp" label="TIME">
        <div style="text-wrap: nowrap">
          <TimestampValue v-bind:timestamp="props.row.consensus_timestamp"/>
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="chunk" label="CHUNK">
        {{ formatChunk(props.row) }}
      </o-table-column>

      <o-table-column v-slot="props" field="message" label="MESSAGE">
        <BlobValue :blob-value="props.row.message" :base64="true" :show-none="true"/>
      </o-table-column>

      <template v-slot:bottom-left>
        <TablePageSize
            v-model:size="perPage"
        />
      </template>

    </o-table>

    <TablePageSize
        v-if="!paginated && showPageSizeSelector"
        v-model:size="perPage"
        style="width: 116px; margin-left: 4px"
    />

    <EmptyTable v-if="!messages.length"/>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {TopicMessageTableController} from "@/components/topic/TopicMessageTableController";
import TimestampValue from "@/components/values/TimestampValue.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import {TopicMessage} from "@/schemas/MirrorNodeSchemas";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TopicMessageTableController>,
    required: true
  }
})

const isTouchDevice = inject('isTouchDevice', false)

const formatChunk = (t: TopicMessage) => t.chunk_info ? `${t.chunk_info.number}/${t.chunk_info.total}` : ''

const handleClick = (t: TopicMessage, c: unknown, i: number, ci: number, event: Event) => {
  const consensusTimestamp = t.consensus_timestamp
  if (consensusTimestamp) {
    routeManager.routeToTransactionByTs(consensusTimestamp, event)
  }
}

const messages = props.controller.rows
const loading = props.controller.loading
const total = props.controller.totalRowCount
const currentPage = props.controller.currentPage
const onPageChange = props.controller.onPageChange
const perPage = props.controller.pageSize
const paginated = props.controller.paginated
const showPageSizeSelector = props.controller.showPageSizeSelector

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>
#topic-message-table table.o-table > tbody > tr {
  cursor: default;
}
</style>
