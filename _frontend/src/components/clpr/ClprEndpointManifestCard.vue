// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Endpoint Manifest
    </template>
    <template #right-control>
      <span class="h-is-secondary-text">version {{ manifest.version }}</span>
    </template>
    <template #content>
      <Property id="manifestSince" full-width>
        <template #name>In Effect Since</template>
        <template #value>
          <TimestampValue :show-none="true" :timestamp="manifest.consensus_timestamp"/>
        </template>
      </Property>
      <Property id="manifestServiceAddress" full-width>
        <template #name>CLPR Service Address</template>
        <template #value>
          <HexaValue :byte-string="manifest.service_address" :show-none="true"/>
        </template>
      </Property>

      <o-table
          :data="manifest.endpoints"
          :hoverable="true"
          :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
          :paginated="false"
          :striped="false"
      >
        <o-table-column v-slot="props" field="service_endpoint" label="SERVICE ENDPOINT">
          {{ props.row.service_endpoint.ip_address }}:{{ props.row.service_endpoint.port }}
        </o-table-column>
      </o-table>
      <EmptyTable v-if="!manifest.endpoints.length"/>
    </template>
    <template #footer>
      <div class="note">
        The endpoints peers deliver bundles through. On Hiero every consensus node is a CLPR endpoint, so this
        manifest follows the consensus roster.
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import EmptyTable from "@/components/EmptyTable.vue";
import Property from "@/components/Property.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {CLPR_MOCK_ENDPOINT_MANIFEST} from "@/components/clpr/ClprMockData.ts";

// Static mockup data, to be replaced by a call to GET /api/v1/clpr/endpoint-manifest
const manifest = CLPR_MOCK_ENDPOINT_MANIFEST

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.note {
  color: var(--text-secondary);
  font-size: 12px;
}

</style>
