// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Pending Connectors
    </template>
    <template #content>
      <ClprTableFrame :row-count="pendingConnectors.length" :page-size="perPage">
        <o-table
            :data="pendingConnectors"
            :hoverable="true"
            :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
            paginated
            pagination-order="centered"
            :current-page="currentPage"
            @update:current-page="currentPage = $event as number"
            :per-page="perPage"
            row-key="commitment"
        >
          <o-table-column v-slot="props" field="commitment" label="COMMITMENT">
            <ClprHexLabel :value="props.row.commitment"/>
          </o-table-column>

          <o-table-column v-slot="props" field="status" label="STATUS">
            <ClprPill :label="props.row.status"/>
          </o-table-column>

          <o-table-column v-slot="props" field="created_timestamp" label="CREATED">
            <TimestampValue :timestamp="props.row.created_timestamp"/>
          </o-table-column>

          <template v-slot:bottomLeft>
            <TablePageSize v-model:size="perPage"/>
          </template>
        </o-table>
      </ClprTableFrame>

      <EmptyTable v-if="!pendingConnectors.length"/>
    </template>
    <template #footer>
      <div class="note">
        A connector's id stays secret until its registration is completed, so a pending entry only shows its
        commitment.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, ref} from "vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import EmptyTable from "@/components/EmptyTable.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TablePageSize from "@/components/transaction/TablePageSize.vue";
import ClprTableFrame from "@/components/clpr/ClprTableFrame.vue";
import ClprPill from "@/components/clpr/ClprPill.vue";
import ClprHexLabel from "@/components/clpr/ClprHexLabel.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {getClprMockPendingConnectors} from "@/components/clpr/ClprMockData.ts";

// Pending connectors of one channel
const props = defineProps({
  channelId: {
    type: String,
    required: true
  }
})

// Static mockup data, to be replaced by a call to GET /api/v1/clpr/channels/{channelId}/connectors?status=eq:PENDING
const pendingConnectors = computed(() => getClprMockPendingConnectors(props.channelId))

const isMediumScreen = inject('isMediumScreen', true)
const currentPage = ref(1)
const perPage = ref(isMediumScreen ? 15 : 5)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.note {
  color: var(--text-secondary);
  font-size: 12px;
  margin-top: 8px;
}

</style>
