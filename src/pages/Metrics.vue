// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Metrics">

    <div class="mt-2"/>

    <MetricsDashboard/>

    <div class="mt-2"/>

    <Tabs
        :tab-ids="tabIds"
        :tab-labels="tabLabels"
        :selected-tab="selectedTab"
        @update:selected-tab="onUpdate($event)"
    />

    <template v-if="selectedTab === 'network'">
      <div class="metrics-content">
        <ChartView :controller="networkFeeController" data-cy="chart-view"/>
      </div>
      <div class="metrics-content">
        <ChartView :controller="avgTimeToConsensusController" data-cy="chart-view"/>
      </div>
    </template>

    <template v-else-if="selectedTab === 'transactions'">
      <div class="metrics-content">
        <ChartView :controller="txOverTimeController" data-cy="chart-view"/>
      </div>
      <div class="metrics-content">
        <ChartView :controller="transactionCountController" data-cy="chart-view"/>
      </div>
      <div class="metrics-content">
        <ChartView :controller="tpsController" data-cy="chart-view"/>
      </div>
    </template>

    <template v-else-if="selectedTab === 'accounts'">
      <div class="metrics-content">
        <ChartView :controller="activeAccountsController" data-cy="chart-view"/>
      </div>

      <div class="metrics-content">
        <ChartView :controller="accountGrowthController" data-cy="chart-view"/>
      </div>
    </template>

    <template v-else-if="selectedTab === 'nodes'">
      <DashboardCardV2>
        <template #title>
          Map
        </template>
        <template #content>
          <NodeMap :nodes="nodes"/>
        </template>
      </DashboardCardV2>
    </template>

    <template v-else/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import ChartView from "@/charts/core/ChartView.vue";
import {ThemeController} from "@/components/ThemeController.ts";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {TxOverTimeController} from "@/charts/hgraph/TxOverTimeController.ts";
import {NetworkFeeController} from "@/charts/hgraph/NetworkFeeController.ts";
import {ActiveAccountController} from "@/charts/hgraph/ActiveAccountController.ts";
import {AccountGrowthController} from "@/charts/hgraph/AccountGrowthController.ts";
import {TransactionCountController} from "@/charts/hgraph/TransactionCountController.ts";
import {AvgTimeToConsensusController} from "@/charts/hgraph/AvgTimeToConsensusController.ts";
import {TPSController} from "@/charts/hgraph/TPSController.ts";
import MetricsDashboard from "@/components/home/MetricsDashboard.vue";
import Tabs from "@/components/Tabs.vue";
import NodeMap from "@/components/node/NodeMap.vue";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

defineProps({
  network: String
})

const themeController = ThemeController.inject()

const tabIds = routeManager.currentNetwork.value === 'mainnet'
    ? ['network', 'transactions', 'accounts', 'nodes']
    : ['network', 'transactions', 'accounts']

const tabLabels = ['Network', 'Transactions', 'Accounts', 'Nodes']
const selectedTab = ref<string | null>(tabIds[0])
const onUpdate = (tab: string | null) => {
  selectedTab.value = tab
}

const txOverTimeController = new TxOverTimeController(themeController, routeManager)
onMounted(() => txOverTimeController.mount())
onBeforeUnmount(() => txOverTimeController.unmount())

const networkFeeController = new NetworkFeeController(themeController, routeManager)
onMounted(() => networkFeeController.mount())
onBeforeUnmount(() => networkFeeController.unmount())

const activeAccountsController = new ActiveAccountController(themeController, routeManager)
onMounted(() => activeAccountsController.mount())
onBeforeUnmount(() => activeAccountsController.unmount())

const accountGrowthController = new AccountGrowthController(themeController, routeManager)
onMounted(() => accountGrowthController.mount())
onBeforeUnmount(() => accountGrowthController.unmount())

const transactionCountController = new TransactionCountController(themeController, routeManager)
onMounted(() => transactionCountController.mount())
onBeforeUnmount(() => transactionCountController.unmount())

const avgTimeToConsensusController = new AvgTimeToConsensusController(themeController, routeManager)
onMounted(() => avgTimeToConsensusController.mount())
onBeforeUnmount(() => avgTimeToConsensusController.unmount())

const tpsController = new TPSController(themeController, routeManager)
onMounted(() => tpsController.mount())
onBeforeUnmount(() => tpsController.unmount())

const networkNodeAnalyzer = new NetworkAnalyzer()
onMounted(() => networkNodeAnalyzer.mount())
onBeforeUnmount(() => networkNodeAnalyzer.unmount())
const nodes = networkNodeAnalyzer.nodes

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
