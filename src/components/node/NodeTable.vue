// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      id="node-table"
      :data-source="dataSource"
      :clickable="true"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>NODE ID</TableHeaderView>
      <TableHeaderView v-if="!enableStaking">ACCOUNT</TableHeaderView>
      <TableHeaderView>DESCRIPTION</TableHeaderView>
      <TableHeaderView v-if="enableStaking" :align-right="true">STAKE FOR CONSENSUS</TableHeaderView>
      <TableHeaderView v-if="enableStaking" :align-right="true">%</TableHeaderView>
      <TableHeaderView v-if="enableStaking" :align-right="true">STAKE RANGE</TableHeaderView>
      <TableHeaderView v-if="enableStaking" :align-right="true">REWARD RATE</TableHeaderView>

    </template>

    <template #tableCells="node">

      <TableDataView>
        <div class="regular-node-column node_id">
          {{ node.node_id }}
        </div>
      </TableDataView>

      <TableDataView v-if="!enableStaking">
        <div class="h-is-numeric regular-node-column">
          {{ node.node_account_id }}
        </div>
      </TableDataView>

      <TableDataView>
        <div class="h-should-wrap regular-node-column is-inline-block">
          <StringValue :string-value="makeNodeDescriptionPrefix(node)" :show-none="false"
                       class="h-is-low-contrast"/>
          <StringValue :string-value="makeNodeOwnerDescription(node)"/>
        </div>
      </TableDataView>

      <TableDataView v-if="enableStaking">
        <Tooltip :text="tooltipStake">
          <div class="regular-node-column">
            <HbarAmount :amount="node.stake" :decimals="0"/>
          </div>
        </Tooltip>
      </TableDataView>

      <TableDataView v-if="enableStaking">
        <Tooltip :text="tooltipPercentage">
          <div class="regular-node-column">
            <StringValue :string-value="makeWeightPercentage(node)"/>
          </div>
        </Tooltip>
      </TableDataView>

      <TableDataView v-if="enableStaking">
        <o-tooltip :delay="tooltipDelay" :teleport="true" class="h-tooltip">
          <StakeRange
              :node="node"
              :network-analyzer="networkAnalyzer"
              style="height: 48px; padding-top: 20px"
          />
          <template #content>
            <div class="reward-range-tooltip">
              <div class="caption" style="background-color: var(--text-success);"/>
              <p class="has-text-left">Rewarded:</p>
              <div class="has-text-right">
                <HbarAmount :amount="node.stake_rewarded ?? 0" :decimals="0"/>
              </div>
              <div class="caption" style="background-color: var(--text-accent2);"/>
              <p class="has-text-left">Not Rewarded:</p>
              <div class="has-text-right">
                <HbarAmount :amount="node.stake_not_rewarded ?? 0" :decimals="0"/>
              </div>
              <div/>
              <p class="has-text-left">Min:</p>
              <div class="has-text-right">
                <HbarAmount :amount="node.min_stake ?? 0" :decimals="0"/>
              </div>
              <div/>
              <p class="has-text-left">Max:</p>
              <div class="has-text-right">
                <HbarAmount :amount="node.max_stake ?? 0" :decimals="0"/>
              </div>
            </div>
          </template>
        </o-tooltip>
      </TableDataView>

      <TableDataView v-if="enableStaking">
        <Tooltip :text="tooltipRewardRate">
          <div class="regular-node-column">
            {{ makeAnnualizedRate(node.reward_rate_start ?? -1) }}
          </div>
        </Tooltip>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import {NetworkNode} from "@/schemas/MirrorNodeSchemas";
import HbarAmount from "@/components/values/HbarAmount.vue";
import StakeRange from "@/components/node/StakeRange.vue";
import {routeManager} from "@/router";
import StringValue from "@/components/values/StringValue.vue";
import {
  makeAnnualizedRate,
  makeNodeDescriptionPrefix,
  makeNodeOwnerDescription,
  makeStakePercentage
} from "@/schemas/MirrorNodeUtils.ts";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer";
import Tooltip from "@/components/Tooltip.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";

const props = defineProps({
  nodes: Object as PropType<Array<NetworkNode> | undefined>,
  stakeTotal: Number
})

const dataSource = new StaticDataSource(computed(() => props.nodes ?? null), null, (n: NetworkNode) => n.node_id.toString())

const tooltipDelay = 500
const tooltipStake = "Total amount of HBAR staked to this specific validator for consensus."
const tooltipPercentage = "Total amount of HBAR staked to this validator for consensus / total amount of HBAR staked to all validators for consensus."
const tooltipRewardRate = "Approximate annual reward rate based on the reward earned during the last 24h period."

const enableStaking = routeManager.enableStaking

const networkAnalyzer = new NetworkAnalyzer()
onMounted(() => networkAnalyzer.mount())
onBeforeUnmount(() => networkAnalyzer.unmount())

const makeWeightPercentage = (node: NetworkNode) => {
  return node.stake && props.stakeTotal ? makeStakePercentage(node, props.stakeTotal) : "0"
}

const handleClick = (node: NetworkNode, event: MouseEvent) => {
  if (node.node_id !== undefined) {
    routeManager.routeToNode(node.node_id, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>

.node_id {
  font-weight: 600;
}

.regular-node-column {
  padding-top: 8px;
  padding-bottom: 8px;
}

.caption {
  align-self: center;
  height: 14px;
  width: 14px;
  border: 0.5px solid var(--border-secondary);
}

.reward-range-tooltip {
  display: grid;
  grid-template-columns: 1fr 4fr 3fr;
  column-gap: 0.5rem;
  row-gap: 0.25rem;
  padding: 8px 4px;
}

</style>
