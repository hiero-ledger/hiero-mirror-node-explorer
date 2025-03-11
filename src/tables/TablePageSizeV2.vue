// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <SelectView
      v-model="pageSize"
      :small="true"
      data-cy="select-page-size"
  >
    <option :value="5">5 per page</option>
    <option :value="10">10 per page</option>
    <option :value="15">15 per page</option>
    <option :value="20">20 per page</option>
    <option :value="50">50 per page</option>
    <option :value="100">100 per page</option>
  </SelectView>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {onBeforeUnmount, onMounted, PropType, watch} from "vue";
import {AppStorage} from "@/AppStorage";
import SelectView from "@/elements/SelectView.vue";
import {TableController} from "@/utils/table/TableController.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TableController<any, any>>,
    required: true
  },
  storageKey: {
    type: String as PropType<string | null>,
    default: null
  }
})

const pageSize = props.controller.pageSize

onMounted(() => {
  const storageKey = props.storageKey
  if (storageKey !== null) {
    pageSize.value = AppStorage.getTablePageSize(storageKey) ?? 15
    watch(pageSize, (newValue: number) => {
      AppStorage.setTablePageSize(storageKey, newValue)
    })
  } else {
    pageSize.value = 15
  }
})
onBeforeUnmount(() => {
  if (props.storageKey !== null) {
    // We update AppStorage again because watch() does not always trigger before unmount (?)
    AppStorage.setTablePageSize(props.storageKey, pageSize.value)
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
