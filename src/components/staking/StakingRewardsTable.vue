// SPDX-License-Identifier: Apache-2.0


<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableView
      :controller="props.controller"
      :clickable="true"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>TIME</TableHeaderView>
      <TableHeaderView :align-right="true">AMOUNT REWARDED</TableHeaderView>

    </template>

    <template #tableCells="reward">

      <TableDataView>
        <TimestampValue class="timestamp-value" :timestamp="reward.timestamp"/>
      </TableDataView>

      <TableDataView>
        <HbarAmount :amount="reward.amount"/>
      </TableDataView>

    </template>

  </TableView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, PropType} from 'vue';
import {StakingReward} from '@/schemas/MirrorNodeSchemas.ts';
import {routeManager} from "@/router";
import TimestampValue from "@/components/values/TimestampValue.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {StakingRewardsTableController} from "@/components/staking/StakingRewardsTableController";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableView from "@/tables/TableView.vue";

const props = defineProps({
  narrowed: Boolean,
  controller: {
    type: Object as PropType<StakingRewardsTableController>,
    required: true
  },
})

onMounted(() => props.controller.mount())
onBeforeUnmount(() => props.controller.unmount())

const handleClick = (t: StakingReward, event: MouseEvent) => {
  if (t.timestamp) {
    routeManager.routeToTransactionByTs(t.timestamp, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.timestamp-value {
  font-weight: 600;
}

</style>
