// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <MarketDashboardItem :title="title" :info="info" :value="value">
    <slot/>
  </MarketDashboardItem>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import MarketDashboardItem from "@/components/home/MarketDashboardItem.vue";
import {CounterController} from "@/charts/core/CounterController.ts";


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
