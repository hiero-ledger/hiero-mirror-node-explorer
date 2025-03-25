// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="nodes" id="node-table">
    <o-table
        :data="props.nodes"
        :hoverable="true"
        :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
        :paginated="false"
        :per-page="props.nodes.length"
        :striped="true"
        default-sort="node_id"
        @cell-click="handleClick"
    >

      <o-table-column v-slot="props" field="node_id" label="NODE ID">
        <div class="regular-node-column node_id">
          {{ props.row.node_id }}
        </div>
      </o-table-column>

      <o-table-column v-if="!enableStaking" v-slot="props" field="node_account_id" label="ACCOUNT">
        <div class="h-is-numeric regular-node-column">
          {{ props.row.node_account_id }}
        </div>
      </o-table-column>

      <o-table-column v-slot="props" field="description" label="DESCRIPTION">
        <div class="h-should-wrap regular-node-column is-inline-block">
          <StringValue :string-value="makeNodeDescriptionPrefix(props.row)" :show-none="false"
                       class="h-is-low-contrast"/>
          <StringValue :string-value="makeNodeOwnerDescription(props.row)"/>
        </div>
      </o-table-column>

      <o-table-column v-if="enableStaking" v-slot="props" field="stake" label="STAKE FOR CONSENSUS" position="right">
        <Tooltip :text="tooltipStake">
          <div class="regular-node-column">
            <HbarAmount :amount="props.row.stake" :decimals="0"/>
          </div>
        </Tooltip>
      </o-table-column>

      <o-table-column v-if="enableStaking" v-slot="props" field="percentage" label="%" position="right">
        <Tooltip :text="tooltipPercentage">
          <div class="regular-node-column">
            <StringValue :string-value="makeWeightPercentage(props.row)"/>
          </div>
        </Tooltip>
      </o-table-column>

      <o-table-column
          v-if="enableStaking"
          id="stake-range-column" v-slot="props" field="stake-range" label="STAKE RANGE" position="right"
          style="padding-bottom: 2px; padding-top: 12px;"
      >
        <o-tooltip :delay="tooltipDelay" class="h-tooltip">
          <StakeRange
              :node="props.row"
              :network-analyzer="networkAnalyzer"
              style="height: 48px; padding-top: 20px"
          />
          <template #content>
            <div class="reward-range-tooltip">
              <div class="caption" style="background-color: var(--text-success);"/>
              <p class="has-text-left">Rewarded:</p>
              <div class="has-text-right">
                <HbarAmount :amount="props.row.stake_rewarded ?? 0" :decimals="0"/>
              </div>
              <div class="caption" style="background-color: var(--text-accent2);"/>
              <p class="has-text-left">Not Rewarded:</p>
              <div class="has-text-right">
                <HbarAmount :amount="props.row.stake_not_rewarded ?? 0" :decimals="0"/>
              </div>
              <div/>
              <p class="has-text-left">Min:</p>
              <div class="has-text-right">
                <HbarAmount :amount="props.row.min_stake ?? 0" :decimals="0"/>
              </div>
              <div/>
              <p class="has-text-left">Max:</p>
              <div class="has-text-right">
                <HbarAmount :amount="props.row.max_stake ?? 0" :decimals="0"/>
              </div>
            </div>
          </template>
        </o-tooltip>
      </o-table-column>

      <o-table-column v-if="enableStaking" v-slot="props" field="last_reward_rate" label="REWARD RATE" position="right">
        <Tooltip :text="tooltipRewardRate">
          <div class="regular-node-column">
            {{ makeAnnualizedRate(props.row.reward_rate_start) }}
          </div>
        </Tooltip>
      </o-table-column>

    </o-table>
  </div>

  <EmptyTable v-if="nodes && nodes.length === 0"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, PropType} from 'vue';
import {NetworkNode} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import EmptyTable from "@/components/EmptyTable.vue";
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

const props = defineProps({
  nodes: {
    type: Object as PropType<Array<NetworkNode>>,
    required: true
  },
  stakeTotal: Number
})

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

const handleClick = (node: NetworkNode, c: unknown, i: number, ci: number, event: MouseEvent) => {
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

#node-table table.o-table > tbody > tr > td {
  padding-top: 0;
  padding-bottom: 0;
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
