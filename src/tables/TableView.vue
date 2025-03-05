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
  <template v-if="isMediumScreen">
    <div class="table-view-root wide" :style="{'grid-template-columns': wideTemplateColumns}">
      <makeHeaderCells/>
      <makeRowCells/>
    </div>
  </template>
  <template v-else>
    <div class="table-view-root narrow" style="grid-template-columns: auto auto">
      <makeKeyValueCells/>
    </div>
  </template>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts" generic="R,K">

import {TableController} from "@/utils/table/TableController.ts";
import {computed, getCurrentInstance, h, inject, PropType, VNode} from "vue";
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

const slots = defineSlots<{
  default(row: R): any,
  tableHeaders: any
}>()


const isMediumScreen = inject('isMediumScreen', true)

const rows = props.controller.rows

const keyStringForRow = (row: R): string => {
  return props.controller.stringFromKey(props.controller.keyFor(row))
}

const columnCount = computed(() => {
  let result: number
  if (rows.value.length >= 1) {
    const tableHeaderNodes = makeTableHeaderNodes()
    const tableDataNodes = makeTableDataNodes(rows.value[0])
    result = Math.min(tableHeaderNodes.length, tableDataNodes.length)
  } else {
    result = 0
  }
  return result
})

const wideTemplateColumns = computed(() => "repeat(" + columnCount.value + ", auto)")


//
// Slots
//

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


//
// Header cell
//

const makeHeaderCells = ():VNode[] => {
  const result: VNode[] = []
  for (const c of makeTableHeaderNodes()) {
    result.push(h('div', makeHeaderCellProps(), c))
  }
  return result
}

const makeHeaderCellProps = (): Record<string, unknown> => {
  const result: Record<string, unknown> = {
    class: "header-cell"
  }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
  }
  return result
}

//
// Row cell
//

const makeRowCells = ():VNode[] => {
  const result: VNode[] = []
  for (const row of rows.value) {
    const tableDataNodes = makeTableDataNodes(row)
    for (let i = 0; i < columnCount.value; i++) {
      result.push(h("div", makeRowCellProps(row, i), tableDataNodes[i]))
    }
  }
  return result
}

const makeRowCellProps = (row: R, columnIndex: number): Record<string, unknown> => {
  const result: Record<string, unknown> = {
    class: "row-cell",
    key: keyStringForRow(row) + "/" + columnIndex
  }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
  }
  if (props.clickable) {
    result.onClick = (event: Event) => emit("cell-click",  row, event)
    result.class += " clickable"
  }
  return result
}

//
// Key/value cell
//

const makeKeyValueCells = ():VNode[] => {
  const result: VNode[] = []
  for (const row of rows.value) {
    const tableHeaderNodes = makeTableHeaderNodes()
    const tableDataNodes = makeTableDataNodes(row)
    for (let i = 0; i < columnCount.value; i++) {
      result.push(h('div', makeKeyCellProps(row, i), tableHeaderNodes[i]))
      result.push(h('div', makeValueCellProps(row, i), tableDataNodes[i]))
    }
  }
  return result
}

const makeKeyCellProps = (row: R, columnIndex: number):Record<string, unknown> => {
  const result: Record<string, unknown> = {
    class: "key-cell",
    key: keyStringForRow(row) + "/" + columnIndex + "/k"
  }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
  }
  if (props.clickable) {
    result.onClick = (event: Event) => emit("cell-click",  row, event)
    result.class += " clickable"
  }
  return result
}

const makeValueCellProps = (row: R, columnIndex: number):Record<string, unknown> => {
  const result: Record<string, unknown> = {
    class: "value-cell",
    key: keyStringForRow(row) + "/" + columnIndex + "/v"
  }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
  }
  if (props.clickable) {
    result.onClick = (event: Event) => emit("cell-click",  row, event)
    result.class += " clickable"
  }
  return result
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.table-view-root.wide {
  display: grid;
  /* grid-template-columns is setup dynamically */
}

div.table-view-root.narrow {
  display: grid;
  grid-template-columns: auto auto;
}

div.table-view-root > div {
  animation: fadeIn linear 1s;
}

div.table-view-root div.header-cell {

}

div.table-view-root div.row-cell {

}

div.table-view-root div.key-cell {

}

div.table-view-root div.value-cell {

}

div.table-view-root > div.clickable {
  cursor: pointer;
}

div.table-view-root > div.clickable:hover {
  background-color: var(--background-primary);
}
/*



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
*/

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
