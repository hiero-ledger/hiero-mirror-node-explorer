// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="nodes" id="node-table">
    <o-table
        :data="props.nodes"
        :hoverable="true"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
        :paginated="false"
        :per-page="props.nodes.length"
        :striped="false"
        default-sort="node_id"
        @cell-click="handleClick"
    >

      <o-table-column v-slot="props" field="node_id" label="REGISTERED NODE ID">
        <div class="regular-node-column node_id">
          {{ props.row.registered_node_id }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="description" label="DESCRIPTION">
        <div class="h-should-wrap regular-node-column is-inline-block">
          <StringValue :show-none="false" :string-value="props.row.description"/>
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="end_points" label="SERVICE ENDPOINT">
        <div class="regular-node-column">
          <StringValue :string-value="makeEndPointString(props.row)"/>
        </div>
      </o-table-column>

    </o-table>
  </div>

  <EmptyTable v-if="nodes && nodes.length === 0"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {RegisteredNode} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import StringValue from "@/components/values/StringValue.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  nodes: {
    type: Object as PropType<Array<RegisteredNode>>,
    required: true
  },
  displayServiceType: {
    type: Boolean,
    default: false
  }
})

const makeEndPointString = (node: RegisteredNode) => {
  let result: string
  const nbEndPoints = node.service_endpoints.length
  if (nbEndPoints === 0) {
    result = 'None'
  } else {
    const endPoint = node.service_endpoints[0]
    result = `${endPoint.domain_name || endPoint.ip_address}:${endPoint.port}`
    if (nbEndPoints > 1) {
      result += ` (+${nbEndPoints - 1} more)`
    }
  }
  return result
}

const handleClick = (node: RegisteredNode, c: unknown, i: number, ci: number, event: Event) => {
  routeManager.routeToRegisteredNode(node.registered_node_id, event)
}


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>

.node_id {
  font-weight: 600;
}

#node-table table.o-table > tbody > tr > td {
  padding: 0 8px;
}

.regular-node-column {
  padding-top: 8px;
  padding-bottom: 8px;
}

</style>
