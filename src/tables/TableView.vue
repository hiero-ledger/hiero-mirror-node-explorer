<!--
  -
  - Hedera Mirror Node Explorer
  -
  - Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -
  -->

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <table class="table-view-root">
    <thead v-if="$slots.tableHeaders && !compact">
      <renderTHs/>
    </thead>
    <tbody :class="{ 'clickable': props.clickable }">
      <template v-if="compact">
        <renderCompactTRs/>
      </template>
      <template v-else>
        <renderWideTRs/>
      </template>
    </tbody>
  </table>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts" generic="R,K">

import {TableController} from "@/utils/table/TableController.ts";
import {computed, getCurrentInstance, h, PropType, useAttrs, VNode} from "vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<TableController<R,K>>,
    required: true
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["cell-click"])

const rows = props.controller.rows

const keyStringForRow = (row: R): string => {
  return props.controller.stringFromKey(props.controller.keyFor(row))
}

const compact = computed(() => false)

const slots = defineSlots<{
  default(row: R): any,
  tableHeaders: any
}>()


const renderTHs = (): VNode[] => {
  const result: VNode[] = []
  const tableHeaders = makeTableHeaderNodes()
  if (tableHeaders.length >= 1) {
    const scopeId = getCurrentInstance()?.vnode.scopeId
    const thProps = scopeId ? { [scopeId]: "" } : {}
    const THs: VNode[] = []
    for (const c of tableHeaders) {
      THs.push(h('th', thProps, c))
    }
    result.push(h('tr', thProps, THs))
  }
  return result
}

const renderWideTRs = (): VNode[] => {
  const result: VNode[] = []
  const scopeId = getCurrentInstance()?.vnode.scopeId
  const baseProps = scopeId ? { [scopeId]: "" } : {}
  for (const row of rows.value) {
    const TDs: VNode[] = []
    const handleClick = (event: Event) => emit("cell-click",  row, event)
    for (const c of makeTableDataNodes(row)) {
      const tdProps = { ...baseProps, onClick: handleClick}
      TDs.push(h('td', tdProps, c))
    }
    const trProps = { ...baseProps, key: keyStringForRow(row)}
    result.push(h('tr', trProps, TDs))
  }
  return result
}


const renderCompactTRs = (): VNode[] => {
  const result: VNode[] = []
  const scopeId = getCurrentInstance()?.vnode.scopeId
  for (const row of rows.value) {
    let titleIndex = 0
    const tableHeaderNodes = makeTableHeaderNodes()
    const tableDataNodes = makeTableDataNodes(row)
    const handleClick = (event: Event) => emit("cell-click",  row, event)
    for (let i = 0; i < tableDataNodes.length; i++) {
      const c = tableDataNodes[i]
      const last = i === tableDataNodes.length - 1
      const title = titleIndex < tableHeaderNodes.length ? tableHeaderNodes[titleIndex++] : "?"
      const baseStyleClasses = last ? ["compact", "last"] : ["compact"]
      const baseProps = scopeId ? { [scopeId]: "" } : {}
      const leftProps = { ...baseProps, class: baseStyleClasses.concat(["left"]), onClick: handleClick }
      const rightProps = { ...baseProps, class:baseStyleClasses.concat(["right"]), onClick: handleClick }
      const leftTD = h('td', leftProps, h('span',title))
      const rightTD = h('td', rightProps, c)
      const key = keyStringForRow(row) + "-" + titleIndex
      const trProps = { ...baseProps, class:baseStyleClasses, key}
      result.push(h('tr', trProps, [leftTD, rightTD]))
    }
  }
  return result
}

const makeTableHeaderNodes = (): VNode[] => {
  const result: VNode[] = []
  for (const c of slots.tableHeaders() ?? []) {
    if (TableHeaderView == c.type) {
      result.push(c)
    }
  }
  return result
}

const makeTableDataNodes = (row: R): VNode[] => {
  const result: VNode[] = []
  for (const c of slots.default(row) ?? []) {
    if (TableDataView == c.type) {
      result.push(c)
    }
  }
  return result
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

table.table-view-root {
  border-collapse: collapse;
}

table.table-view-root > tbody > tr {
  animation: fadeIn linear 1s;
}

table.table-view-root > tbody.clickable > tr:hover {
  background-color: var(--background-primary)
}

table.table-view-root > tbody > tr > td {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: var(--table-border);
  padding: 16px 10px;
}

table.table-view-root > tbody.clickable > tr > td{
  cursor: pointer;
}

table.table-view-root > tbody > tr > td.compact {
  border-bottom-style: none;
}

table.table-view-root > tbody > tr > td.compact.last {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: var(--table-border);
}

table.table-view-root > tbody > tr > td.compact.right {
  text-align: right
}

table.table-view-root > thead > tr > th {
  border-bottom-color: var(--table-border);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  color: var(--text-secondary);
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  padding: 12px 9px;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  75% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}

</style>
