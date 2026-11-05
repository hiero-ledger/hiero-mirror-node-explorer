// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div :class="{'single-page': isSinglePage, 'too-short': isTooShort}">
    <slot/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";

// Wraps a paginated o-table:
// - the page buttons are hidden when all the rows fit in one page;
// - the page size selector (left part of the table footer) is hidden as well when there are fewer rows
//   than the smallest page size it offers, since it cannot have any effect then.
const props = defineProps({
  rowCount: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  }
})

const SMALLEST_PAGE_SIZE = 5 // smallest option of TablePageSize

const isSinglePage = computed(() => props.rowCount <= props.pageSize)
const isTooShort = computed(() => props.rowCount < SMALLEST_PAGE_SIZE)

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

</style>
