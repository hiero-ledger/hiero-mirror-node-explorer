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

import {PropType} from "vue";
import SelectView from "@/elements/SelectView.vue";
import {TableController} from "@/utils/table/TableController.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TableController<any, any>>,
    required: true
  }
})

const pageSize = props.controller.pageSize

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
