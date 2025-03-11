<!-- SPDX-License-Identifier: Apache-2.0 -->

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <nav class="table-page-selector">
    <template v-if="currentPage >= 2">
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
    <div class="label">Page {{ currentPage }}</div>
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

<script setup lang="ts" generic="R,K">

import {computed} from "vue";
import {ChevronLeft, ChevronRight} from 'lucide-vue-next';
import {PropType} from "vue";
import {TableController} from "@/utils/table/TableController.ts";
import ButtonView from "@/elements/ButtonView.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TableController<R, K>>,
    required: true
  },
})

const currentPage = props.controller.currentPage

const handleFirstPage = () => {
  props.controller.onPageChange(1)
}

const handlePrevPage = () => {
  props.controller.onPageChange(currentPage.value - 1)
}

const handleNextPage = () => {
  props.controller.onPageChange(currentPage.value + 1)
}

const prevPageEnabled = computed(() => currentPage.value >= 2)
const nextPageEnabled = computed(() => true) /* TBD */

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
