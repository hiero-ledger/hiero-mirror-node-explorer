// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      :data="messages"
      :hoverable="true"
      :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
      :paginated="false"
      :striped="false"
      row-key="message_id"
  >
    <o-table-column v-slot="props" field="message_id" label="ID" position="right">
      <span class="message-id">{{ props.row.message_id }}</span>
    </o-table-column>

    <o-table-column v-slot="props" field="type" label="TYPE">
      {{ props.row.type }}
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
      {{ props.row.acknowledged ? "Yes" : "No" }}
    </o-table-column>

    <o-table-column v-slot="props" field="reply_status" label="RESPONSE">
      <StringValue :string-value="props.row.reply_status"/>
    </o-table-column>

    <o-table-column v-slot="props" field="reply_to_message_id" label="REPLY TO" position="right">
      <span v-if="props.row.reply_to_message_id !== null">{{ props.row.reply_to_message_id }}</span>
      <span v-else class="h-is-low-contrast">None</span>
    </o-table-column>

    <o-table-column v-slot="props" field="timestamp" label="TIME">
      <TimestampValue :timestamp="props.row.timestamp"/>
    </o-table-column>
  </o-table>

  <EmptyTable v-if="!messages.length"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ClprMessage} from "@/schemas/MirrorNodeSchemas.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";

defineProps({
  messages: {
    type: Array as PropType<ClprMessage[]>,
    required: true
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.message-id {
  font-weight: 600;
}

</style>
