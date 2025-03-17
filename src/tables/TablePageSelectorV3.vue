<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <nav class="table-page-selector">
    <template v-if="pageIndex >= 2">
      <ButtonView
          :size="ButtonSize.small"
          @action="handleFirstPage">First
      </ButtonView>
    </template>
    <ButtonView
        :size="ButtonSize.small"
        :enabled="prevPageEnabled"
        @action="handlePrevPage">
      <ChevronLeft :size="16"/>
    </ButtonView>
    <div class="label">Page {{ pageIndex }}</div>
    <ButtonView
        :size="ButtonSize.small"
        :enabled="nextPageEnabled"
        @action="handleNextPage">
      <ChevronRight :size="16"/>
    </ButtonView>
  </nav>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts" generic="R">

import {computed, PropType} from "vue";
import {ChevronLeft, ChevronRight} from 'lucide-vue-next';
import ButtonView from "@/elements/ButtonView.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import {TableDataSource, tableDataSourcePageCount} from "@/tables/TableDataSource.ts";

const props = defineProps({
  dataSource: {
    type: Object as PropType<TableDataSource<R>>,
    required: true
  },
})

const pageIndex = props.dataSource.pageIndex
const actualPageIndex = props.dataSource.actualPageIndex

const handleFirstPage = () => {
  pageIndex.value = 1
}

const handlePrevPage = () => {
  pageIndex.value -= 1
}

const handleNextPage = () => {
  pageIndex.value += 1
}

const pageUpdating = computed(() => pageIndex.value !== actualPageIndex.value)
const prevPageEnabled = computed(() => pageIndex.value-1 >= 1 && !pageUpdating.value)
const nextPageEnabled = computed(() => pageIndex.value+1 <= (pageCount.value ?? 0) && !pageUpdating.value)

const pageCount = computed(() => tableDataSourcePageCount(
    props.dataSource,
    props.dataSource.rowCount.value,
    props.dataSource.pageSize.value))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

nav.table-page-selector {
  display: flex;
  align-items: center;
  column-gap: 8px;
}

nav.table-page-selector div.label {
  text-align: center;
  font-family: var(--font-family-monospace), monospace;
}

</style>
