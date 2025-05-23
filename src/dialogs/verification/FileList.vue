// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<!--suppress CssUnusedSymbol -->

<template>
  <div v-if="displayedAuditItems.length> 0" id="file-table">
    <div class="table-header">
      <div class="h-is-bold">
        {{ tableTitle }}
      </div>
      <div class="header-right">
        <div v-if="nbUnusedAuditItems > 0"
             style="cursor: pointer; color: var(--network-text-accent-color)"
             @click="handleToggleFiltering"
        >
          {{ isListFiltered ? 'Show unused' : 'Hide unused' }}
          {{ ' (' + nbUnusedAuditItems + ')' }}
        </div>
        <div
            class=" ml-5"
            style="cursor: pointer; color: var(--network-text-accent-color)"
            @click="handleClearAllFiles"
        >
          Clear all
        </div>
      </div>
    </div>

    <o-table
        :current-page="currentPage"
        :data="displayedAuditItems"
        :paginated="isPaginated"
        pagination-order="centered"
        :per-page="perPage"
        aria-current-label="Current page"
        aria-next-label="Next page"
        aria-page-label="Page"
        aria-previous-label="Previous page">

      <o-table-column v-slot="props" field="type_and_name">
        <div class="table-row ">

          <div v-if="isMetadata(props.row)">
            <FileJson :size="20"/>
          </div>

          <img v-else-if="isUnused(props.row)"
               alt="Solidity file"
               style="width: 20px; height: 20px;"
               src="../../assets/solidity-icon-grey.svg"
          >

          <img v-else
               alt="Solidity file"
               style="width: 20px; height: 20px;"
               src="../../assets/solidity-icon.svg"
          >

          <div :class="{'h-is-low-contrast':isUnused(props.row)}" class="ml-1 w300">
            {{ props.row.path }}
          </div>

          <div v-if="!isMetadata(props.row) && props.row.target"
               class="icon ml-1 h-is-low-contrast"
               style="font-size: 14px"
          >
            <i class="fa fa-arrow-left"></i>
          </div>
        </div>
      </o-table-column>

    </o-table>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, ref} from "vue";
import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
import {ContractSourceAnalyzerItem} from "@/utils/analyzer/ContractSourceAnalyzer.ts";
import {FileJson} from 'lucide-vue-next';

const props = defineProps({
  auditItems: {
    type: Array as PropType<ContractSourceAnalyzerItem[]>,
    default: [] as Array<ContractSourceAnalyzerItem> /* to please eslint */
  }
})

const emit = defineEmits(['clearAllFiles'])

const currentPage = ref(1);
const perPage = ref(10);
const isListFiltered = ref(false)
const isPaginated = computed(() => props.auditItems.length > perPage.value)
const tableTitle = computed(() => `Added (${props.auditItems.length})`)

const filteredAuditItems = computed(() => {
  const result: Array<ContractSourceAnalyzerItem> = []
  for (let i = 0; i < props.auditItems.length; i++) {
    if (!props.auditItems[i].unused) {
      result.push(props.auditItems[i])
    }
  }
  return result
})

const displayedAuditItems = computed(() => {
  return isListFiltered.value ? filteredAuditItems.value : props.auditItems
})

const nbUnusedAuditItems = computed(() => {
  let result = 0
  for (const i of props.auditItems) {
    if (i.unused) {
      result++
    }
  }
  return result
})

const isMetadata = (item: ContractSourceAnalyzerItem) => {
  const parts = item.path.split('.')
  const suffix = parts[parts.length - 1].toLowerCase()
  return suffix.toLowerCase() === 'json'
}

const isUnused = (item: ContractSourceAnalyzerItem) => {
  return item.unused
}

const handleClearAllFiles = () => {
  emit("clearAllFiles")
}

const handleToggleFiltering = () => {
  isListFiltered.value = !isListFiltered.value
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>

div.table-header {
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
}

div.header-right {
  align-items: center;
  display: flex;
  justify-content: flex-end;
}

div.table-row {
  align-items: center;
  display: flex;
  font-size: 12px;
  gap: 4px;
}

#file-table table.o-table {
  margin: 0;
}

#file-table table.o-table > tbody > tr {
  cursor: default;
}

#file-table table.o-table > thead > tr > th {
  font-size: 15px;
  line-height: 18px;
  padding-top: 0;
  padding-left: 0;
  padding-bottom: 12px;
  border-width: 0;
}

#file-table td.o-table__td {
  border-width: 0;
  padding: 0.25rem 0;
}
</style>
