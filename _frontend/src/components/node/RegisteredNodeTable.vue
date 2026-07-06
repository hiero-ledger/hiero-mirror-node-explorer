// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="nodes" id="node-table">
    <o-table
        :data="filteredNodes"
        :hoverable="true"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
        :paginated="false"
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

      <o-table-column v-if="props.filterServiceType === null" v-slot="props" field="type" label="SERVICE TYPE">
        <div class="regular-node-column">
          <StringValue :string-value="makeServiceTypeString(props.row)"/>
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="end_point" label="SERVICE ENDPOINT">
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

import {computed, PropType} from 'vue';
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {RegisteredNode, RegisteredNodeType, registeredNodeTypeLabels} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
import StringValue from "@/components/values/StringValue.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  nodes: {
    type: Object as PropType<Array<RegisteredNode>>,
    required: true
  },
  filterServiceType: {
    type: Object as PropType<RegisteredNodeType | null>,
    default: null
  }
})

const filteredNodes = computed(() => {
  if (props.filterServiceType === null) {
    return props.nodes
  }
  return props.nodes.filter(node => {
    return node.service_endpoints.some(endPoint => endPoint.type === props.filterServiceType)
  })
})

const makeEndPointString = (node: RegisteredNode) => {
  let result: string
  const endPoints = props.filterServiceType === null
      ? node.service_endpoints
      : node.service_endpoints.filter(endPoint => endPoint.type === props.filterServiceType)
  const nbEndPoints = endPoints.length
  if (nbEndPoints === 0) {
    result = 'None'
  } else {
    const endPoint = endPoints[0]
    result = `${endPoint.domain_name || endPoint.ip_address}:${endPoint.port}`
    if (nbEndPoints > 1) {
      result += ` (+${nbEndPoints - 1} more)`
    }
  }
  return result
}

const makeServiceTypeString = (node: RegisteredNode) => {
  if (props.filterServiceType !== null) {
    return registeredNodeTypeLabels[props.filterServiceType] ?? props.filterServiceType
  }

  const foundTypes: string[] = []
  for (const endPoint of node.service_endpoints) {
    const type = registeredNodeTypeLabels[endPoint.type] ?? endPoint.type
   console.log(`service type: ${type}`)
    if (!foundTypes.includes(type)) {
      foundTypes.push(type)
    }
  }
  return foundTypes.length === 0 ? 'None' : foundTypes.join(', ')
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
