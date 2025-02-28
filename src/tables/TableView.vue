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
    <thead v-if="props.columnTitles.length >= 1 && !compact">
      <tr>
        <template v-for="title in props.columnTitles">
          <th>{{ title }}</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-if="compact">
        <renderCompactTRs/>
      </template>
      <template v-else>
        <renderTRs/>
      </template>
    </tbody>
  </table>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts" generic="R,K">

import {TableController} from "@/utils/table/TableController.ts";
import {computed, getCurrentInstance, h, PropType, VNode} from "vue";
import TableDataView from "@/tables/TableDataView.vue";

const props = defineProps({
  controller: {
    type: Object as PropType<TableController<R,K>>,
    required: true
  },
  columnTitles: {
    type: Object as PropType<string[]>,
    required: true
  }
})

const rows = props.controller.rows

const keyStringForRow = (row: R): string => {
  return props.controller.stringFromKey(props.controller.keyFor(row))
}

const compact = computed(() => false)

const slots = defineSlots<{
  default(row: R): any
}>()


const renderTRs = (): VNode[] => {
  const result: VNode[] = []
  if (slots.default) {
    const scopeId = getCurrentInstance()?.vnode.scopeId
    const tdProps = scopeId ? { [scopeId]: "" } : {}
    for (const row of rows.value) {
      const TDs: VNode[] = []
      for (const c of slots.default(row)) {
        if (TableDataView == c.type) {
          TDs.push(h('td', tdProps, c))
        }
      }
      const trProps = { ...tdProps, key: keyStringForRow(row)}
      result.push(h('tr', trProps, TDs))
    }
  }
  return result
}


const renderCompactTRs = (): VNode[] => {
  const result: VNode[] = []
  if (slots.default) {
    const scopeId = getCurrentInstance()?.vnode.scopeId
    for (const row of rows.value) {
      let titleIndex = 0
      const children = slots.default(row)
      for (let i = 0; i < children.length; i++) {
        const c = children[i]
        const last = i === children.length - 1
        if (TableDataView == c.type) {
          const title = titleIndex < props.columnTitles.length ? props.columnTitles[titleIndex++] : "?"
          const baseStyleClasses = last ? ["compact", "last"] : ["compact"]
          const baseProps = scopeId ? { [scopeId]: "" } : {}
          const leftProps = { ...baseProps, class: baseStyleClasses.concat(["left"]) }
          const rightProps = { ...baseProps, class:baseStyleClasses.concat(["right"])}
          const leftTD = h('td', leftProps, h('span',title))
          const rightTD = h('td', rightProps, c)
          const key = keyStringForRow(row) + "-" + titleIndex
          const trProps = { ...baseProps, class:baseStyleClasses, key}
          result.push(h('tr', trProps, [leftTD, rightTD]))
        }
      }
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
  border-collapse: separate;
}

table.table-view-root > tbody > tr {
  animation: fadeIn linear 1s;
}

table.table-view-root > tbody > tr > td {
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: var(--table-border);
  padding: 16px 10px;
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
