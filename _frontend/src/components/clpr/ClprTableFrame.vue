// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="table-frame" :class="{'single-page': isSinglePage, 'too-short': isTooShort}">
    <slot/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";

// Wraps an o-table:
// - for a paginated one (rowCount and pageSize given), the page buttons are hidden when all the rows fit in one page,
//   and the page size selector (left part of the table footer) is hidden as well when there are fewer rows than the
//   smallest page size it offers, since it cannot have any effect then;
// - the rows with the class CLPR_STATIC_ROW_CLASS (see ClprUtils.ts), which do not route anywhere, do not show the
//   cues of a clickable row (pointer cursor, hover highlight) and are slightly muted.
const props = defineProps({
  rowCount: {
    type: Number,
    default: null
  },
  pageSize: {
    type: Number,
    default: null
  }
})

const SMALLEST_PAGE_SIZE = 5 // smallest option of TablePageSize

const isSinglePage = computed(() => props.rowCount !== null && props.pageSize !== null && props.rowCount <= props.pageSize)
const isTooShort = computed(() => props.rowCount !== null && props.rowCount < SMALLEST_PAGE_SIZE)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.single-page :deep(.o-pagination) {
  display: none;
}

div.too-short :deep(.o-table__pagination) {
  display: none;
}

div.table-frame :deep(tr.clpr-static-row) {
  cursor: default;
}

div.table-frame :deep(.o-table--hoverable tr.clpr-static-row:hover) {
  background-color: transparent;
}

div.table-frame :deep(tr.clpr-static-row > td) {
  color: var(--text-secondary);
}

</style>
