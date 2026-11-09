// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ClprTableFrame :row-count="messages.length" :page-size="perPage">
    <o-table
        :data="messages"
        :hoverable="true"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
        paginated
        pagination-order="centered"
        :current-page="currentPage"
        @update:current-page="currentPage = $event as number"
        :per-page="perPage"
        :striped="false"
        row-key="message_id"
        @cell-click="handleClick"
    >
      <o-table-column v-slot="props" field="message_id" label="ID" position="right">
        <span class="message-id">{{ props.row.message_id }}</span>
      </o-table-column>

      <o-table-column v-slot="props" field="type" label="TYPE">
        <ClprPill :label="props.row.type" level="network"/>
      </o-table-column>

      <o-table-column v-slot="props" field="sender" label="SENDER">
        <ClprHexLabel :value="props.row.sender"/>
      </o-table-column>

      <o-table-column v-slot="props" field="target_application" label="TARGET">
        <ClprHexLabel :value="props.row.target_application"/>
      </o-table-column>

      <o-table-column v-slot="props" field="connector_id" label="CONNECTOR">
        <ClprHexLabel :value="props.row.connector_id"/>
      </o-table-column>

      <o-table-column v-slot="props" field="acknowledged" label="ACKNOWLEDGED">
        <Check v-if="props.row.acknowledged" :size="16" class="acknowledged-tick" aria-label="Acknowledged"/>
      </o-table-column>

      <o-table-column v-slot="props" field="reply_status" label="RESPONSE">
        <ClprPill
            v-if="props.row.reply_status"
            :label="props.row.reply_status"
            :level="getReplyStatusLevel(props.row.reply_status)"
        />
        <span v-else class="h-is-low-contrast">None</span>
      </o-table-column>

      <o-table-column v-slot="props" field="reply_to_message_id" label="REPLY TO" position="right">
        <span v-if="props.row.reply_to_message_id !== null">{{ props.row.reply_to_message_id }}</span>
        <span v-else class="h-is-low-contrast">None</span>
      </o-table-column>

      <o-table-column v-slot="props" field="timestamp" label="TIME">
        <TimestampValue :timestamp="props.row.timestamp"/>
      </o-table-column>

      <template v-slot:bottomLeft>
        <TablePageSize v-model:size="perPage"/>
      </template>
    </o-table>
  </ClprTableFrame>

  <EmptyTable v-if="!messages.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType, ref, watch} from "vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {Check} from "@lucide/vue";
import {ClprMessage} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import {routeManager} from "@/utils/RouteManager.ts";
import ClprTableFrame from "@/components/clpr/ClprTableFrame.vue";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";
import ClprPill from "@/components/clpr/ClprPill.vue";
import {getReplyStatusLevel} from "@/components/clpr/ClprUtils.ts";

const props = defineProps({
  messages: {
    type: Array as PropType<ClprMessage[]>,
    required: true
  }
})

const handleClick = (message: ClprMessage, c: unknown, i: number, ci: number, event: Event) => {
  routeManager.routeToClprMessage(message.channel_id, message.message_id, event)
}

const isMediumScreen = inject('isMediumScreen', true)
const currentPage = ref(1)
const perPage = ref(isMediumScreen ? 15 : 5)

// Back to the first page whenever the list changes (channel or type selection)
watch(() => props.messages, () => currentPage.value = 1)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.acknowledged-tick {
  color: var(--text-success);
  vertical-align: middle;
}

span.message-id {
  font-weight: 600;
}

</style>
