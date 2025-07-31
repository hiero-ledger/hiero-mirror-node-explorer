// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="metrics-content">
    <ChartView :controller="activeAccountsController" data-cy="chart-view"/>
  </div>

  <div class="metrics-content">
    <ChartView :controller="accountGrowthController" data-cy="chart-view"/>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import ChartView from "@/charts/core/ChartView.vue";
import {ThemeController} from "@/components/ThemeController.ts";
import {onBeforeUnmount, onMounted} from "vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {ActiveAccountController} from "@/charts/hgraph/ActiveAccountController.ts";
import {AccountGrowthController} from "@/charts/hgraph/AccountGrowthController.ts";

defineProps({
  network: String
})

const themeController = ThemeController.inject()

const activeAccountsController = new ActiveAccountController(themeController, routeManager)
onMounted(() => activeAccountsController.mount())
onBeforeUnmount(() => activeAccountsController.unmount())

const accountGrowthController = new AccountGrowthController(themeController, routeManager)
onMounted(() => accountGrowthController.mount())
onBeforeUnmount(() => accountGrowthController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.metrics-content {
  background-color: var(--background-tertiary);
  border: 1px solid var(--table-border);
  border-radius: 16px;
  padding: 16px;
}

@media (min-width: 1080px) {
  div.metrics-content {
    padding: 32px;
  }
}

</style>
