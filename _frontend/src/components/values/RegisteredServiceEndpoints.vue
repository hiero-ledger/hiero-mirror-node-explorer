// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-table
      v-if="endPoints.length > 0"
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

  <span v-else-if="initialLoading"/>

  <span v-else class="h-is-low-contrast">None</span>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, inject, PropType, ref} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {initialLoadingKey} from "@/AppKeys";
import {RegisteredServiceEndPoint} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";

const props = defineProps({
  endPoints: {
    type: Object as PropType<Array<RegisteredServiceEndPoint>>,
    required: true
  },
})

const initialLoading = inject(initialLoadingKey, ref(false))

const endPoints = computed(() =>
    props.endPoints.filter(s => s.ip_address || s.domain_name)
)
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
