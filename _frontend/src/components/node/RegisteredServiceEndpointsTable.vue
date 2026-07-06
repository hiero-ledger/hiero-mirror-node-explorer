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
      <o-table-column v-slot="props" field="type" label="SERVICE TYPE">
        <StringValue :show-none="true" :string-value="printableNodeType(props.row.type)"/>
      </o-table-column>

      <o-table-column v-slot="props" field="host" label="HOST">
        <span class="h-is-monospace">{{ props.row.domain_name || props.row.ip_address }}</span>
      </o-table-column>

      <o-table-column v-slot="props" field="port" label="PORT">
        <span class="h-is-monospace">{{ props.row.port > 0 ? props.row.port : '' }}</span>
      </o-table-column>

      <o-table-column v-slot="props" field="tls" label="TLS">
        <span v-if="props.row.requires_tls">&#10003;</span>
      </o-table-column>

      <o-table-column v-slot="props" field="details" label="ENDPOINT DETAILS">
        <StringValue :show-none="false" :string-value="makeRegisteredServiceEndpointDetails(props.row)"/>
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
import {printableNodeType, RegisteredServiceEndPoint} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import StringValue from "@/components/values/StringValue.vue";
import {makeRegisteredServiceEndpointDetails} from "@/schemas/MirrorNodeUtils.ts";

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
