// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<!--suppress CssUnusedSymbol -->

<template>



  <div v-if="displayedAuditItems.length> 0" id="file-table">

    <TableViewV3
        :data-source="dataSource"
        :page-size-selector-hidden="true"
        :row-height="32"
    >

      <template #tableHeaders>

        <TableHeaderView>
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
        </TableHeaderView>

      </template>

      <template #tableCells="item">

        <TableDataView>
          <div class="table-row ">

            <div v-if="isMetadata(item)">
              <FileJson :size="20"/>
            </div>

            <img v-else-if="isUnused(item)"
                 alt="Solidity file"
                 style="width: 20px; height: 20px;"
                 src="../../assets/solidity-icon-grey.svg"
            >

            <img v-else
                 alt="Solidity file"
                 style="width: 20px; height: 20px;"
                 src="../../assets/solidity-icon.svg"
            >

            <div :class="{'h-is-low-contrast':isUnused(item)}" class="ml-1 w300">
              {{ item.path }}
            </div>

            <div v-if="!isMetadata(item) && item.target"
                 class="icon ml-1 h-is-low-contrast"
                 style="font-size: 14px"
            >
              <i class="fa fa-arrow-left"></i>
            </div>
          </div>
        </TableDataView>

      </template>

    </TableViewV3>

  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, ref} from "vue";
import {ContractSourceAnalyzerItem} from "@/utils/analyzer/ContractSourceAnalyzer.ts";
import {FileJson} from 'lucide-vue-next';
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  auditItems: {
    type: Array as PropType<ContractSourceAnalyzerItem[]>,
    default: [] as Array<ContractSourceAnalyzerItem> /* to please eslint */
  }
})

const emit = defineEmits(['clearAllFiles'])

const isListFiltered = ref(false)
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

const dataSource = new StaticDataSource(
    displayedAuditItems,
    null,
    (item: ContractSourceAnalyzerItem) => item.path,
    5)


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

</style>
