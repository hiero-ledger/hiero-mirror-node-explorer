// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <DashboardItemView :title="title" :info="info" :value="value">
    <slot/>
  </DashboardItemView>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import {CounterController} from "@/charts/core/CounterController.ts";
import DashboardItemView from "@/components/home/DashboardItemView.vue";


const props = defineProps({
  controller: {
    type: Object as PropType<CounterController<unknown>>,
    required: true
  }
})

const title = props.controller.title
const info = props.controller.info
const value = props.controller.value

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
