// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="endPoints.length > 0" id="service-endpoint-table">
    <o-table
        :data="endPoints"
        :hoverable="false"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
        :narrowed="true"
        :striped="false"
    >
      <o-table-column v-slot="props" field="endpoint" label="ENDPOINT">
        <span class="h-is-monospace">{{ props.row.domain_name || props.row.ip_address }}</span>
      </o-table-column>

      <o-table-column v-slot="props" field="port" label="PORT">
        <span class="h-is-monospace">{{ props.row.port > 0 ? props.row.port : '' }}</span>
      </o-table-column>

      <o-table-column v-slot="props" field="requires_tls" label="TLS REQUIRED">
        <span v-if="props.row.requires_tls">&#10003;</span>
      </o-table-column>
    </o-table>
  </div>

  <EmptyTable v-if="endPoints.length === 0"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {RegisteredServiceEndPoint} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";

const props = defineProps({
  endPoints: {
    type: Object as PropType<Array<RegisteredServiceEndPoint>>,
    required: true
  },
})

const endPoints = computed(() =>
    props.endPoints.filter(s => s.ip_address || s.domain_name)
)
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>
#service-endpoint-table table.o-table > tbody > tr {
  cursor: default;
}
</style>
