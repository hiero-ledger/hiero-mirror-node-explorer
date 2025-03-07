// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <table class="table-view-root"
         :class="{'wide': isMediumScreen, 'narrow': !isMediumScreen, 'clickable': props.clickable}">

    <template v-if="isMediumScreen">
      <thead v-if="columnCount >= 1">
      <tr>
        <makeTHs/>
      </tr>
      </thead>
      <tbody>
        <makeWideTRs/>
      </tbody>
    </template>

    <template v-else>
      <tbody>
        <makeNarrowTRs/>
      </tbody>
    </template>

  </table>

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
  },
  rowHeight: {
    type: Number,
    default: 54
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
  const tableHeaderNodes = makeTableHeaderNodes()
  if (rows.value.length >= 1) {
    const tableDataNodes = makeTableDataNodes(rows.value[0])
    result = Math.min(tableHeaderNodes.length, tableDataNodes.length)
  } else {
    result = tableHeaderNodes.length
  }
  return result
})


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
// TH
//

const makeTHs = (): VNode[] => {
  const result: VNode[] = []
  const tableHeaderNodes = makeTableHeaderNodes()
  const thProps = makePropsForTH()
  for (let i = 0; i < columnCount.value; i += 1) {
    const tableHeaderNode = tableHeaderNodes[i]
    const alignRight = tableHeaderNode.props && tableHeaderNode.props["align-right"]
    result.push(h("th", thProps, makeDIV(tableHeaderNode, alignRight, false)))
  }
  return result
}

const makePropsForTH = (): Record<string, unknown> => {
  const scopeId = getCurrentInstance()?.vnode.scopeId
  return scopeId ? { [scopeId]: "" } : {}
}

//
// TR wide
//

const makeWideTRs = (): VNode[] => {
  const result: VNode[] = []
  const tableHeaderNodes = makeTableHeaderNodes()
  for (const row of rows.value) {
    const tableDataNodes = makeTableDataNodes(row)
    const tdProps = makePropsForWideTD(row)
    const tdNodes: VNode[] = []
    for (let i = 0; i < columnCount.value; i++) {
      const tableHeaderNode = tableHeaderNodes[i]
      const tableDataNode = tableDataNodes[i]
      const alignRight = tableHeaderNode.props && tableHeaderNode.props["align-right"]
      const div = makeDIV(tableDataNode, alignRight, true)
      tdNodes.push(h("td", tdProps, div))
    }
    result.push(h("tr", makePropsForWideTR(row),tdNodes))
  }
  return result
}

const makePropsForWideTR = (row: R): Record<string, unknown> => {
  const result: Record<string, unknown> = {
    key: keyStringForRow(row)
  }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
  }
  return result
}

const makePropsForWideTD = (row: R): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  if (props.clickable) {
    result.onClick = (event: Event) => emit("cell-click",  row, event)
  }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
  }
  return result
}

//
// TR narrow
//

const makeNarrowTRs = (): VNode[] => {
  const result: VNode[] = []
  for (const row of rows.value) {
    const tableHeaderNodes = makeTableHeaderNodes()
    const tableDataNodes = makeTableDataNodes(row)
    for (let i = 0; i < columnCount.value; i++) {
      const leftDIV = makeDIV(tableHeaderNodes[i], false, true)
      const rightDIV = makeDIV(tableDataNodes[i], true, true)
      const tdNodes = [
        h('td', makePropsForNarrowTD(row, i), leftDIV),
        h('td', makePropsForNarrowTD(row, i), rightDIV)
      ]
      result.push(h("tr", makePropsForNarrowTR(row, i), tdNodes))
    }
  }
  return result
}

const makePropsForNarrowTR = (row: R, columnIndex: number): Record<string, unknown> => {
  const result: Record<string, unknown> = {
    key: keyStringForRow(row) + "/" + columnIndex,
  }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
  }
  return result
}

const makePropsForNarrowTD = (row: R, columnIndex: number): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  if (props.clickable) {
    result.onClick = (event: Event) => emit("cell-click",  row, event)
  }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
  }
  result.class = ""
  if (columnIndex === columnCount.value - 1) {
    result.class += " last"
  }
  return result
}

//
// DIV
//

const makeDIV = (tableDataNode: VNode, alignRight: boolean, fixedHeight: boolean): VNode => {
  return h("div", makePropsForDIV(alignRight, fixedHeight), tableDataNode)
}

const makePropsForDIV = (alignRight: boolean, fixedHeight: boolean): Record<string, unknown> => {
  let style = ""
  if (fixedHeight) {
    style += "min-height: " + props.rowHeight + "px; max-height: " + props.rowHeight + "px;"
  }
  if (alignRight) {
    style += "justify-content: flex-end; text-align: right;"
  } else {
    style += "text-align: left;"
  }
  const result: Record<string, unknown> = { style }
  const scopeId = getCurrentInstance()?.vnode.scopeId
  if (scopeId) {
    result[scopeId] = ""
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

table.table-view-root > thead > tr > th {
  border-bottom-color: var(--border-secondary);
  border-bottom-style: solid;
  border-bottom-width: 2px;
  font-family: Inter, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  padding: 12px 12px;
}

table.table-view-root > tbody > tr > td {
  border-bottom-width: 1px;
  border-bottom-color: var(--table-border);
}

table.table-view-root.clickable > tbody > tr:hover {
  background-color: var(--background-primary);
  cursor: pointer;
}

table.table-view-root > tbody > tr > td > div {
  overflow: hidden;
  display: flex;
  align-items: center;
}

table.table-view-root > tbody > tr > td > div * {
  text-overflow: ellipsis;
}


/* Wide */

table.table-view-root.wide > tbody > tr > td {
  border-bottom-style: solid;
  padding: 0 10px;
}

/* Narrow */

table.table-view-root.narrow > tbody > tr > td {
  padding: 0;
}

table.table-view-root.narrow > tbody > tr > td.last {
  border-bottom-style: solid;
}


/*

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
