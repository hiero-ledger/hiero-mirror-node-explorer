// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Rewards Estimator
    </template>

    <template #content>
      <div class="calculator-root">
        <div class="calculator-input">
          <div class="node-selector">
            <p>Choose a node to stake to</p>
            <SelectView v-model="selectedNodeId" width="100%"
                        style="border-radius: 8px; border-color: var(--border-secondary);">
              <option v-for="n in nodes" :key="n.node_id" :value="n.node_id"
                      style="background-color: var(--h-theme-box-background-color);"
              >
                {{ makeNodeSelectorDescription(n) }}
              </option>
            </SelectView>
          </div>
          <div class="amount-chooser">
            <p>{{ `Enter the number of ${cryptoName} you want to stake` }}</p>
            <TextFieldView v-model="amountStaked"
                           id="selectedAutoRenewPeriod"
                           placeholder="0"
                           type="number"
                           min="1"
                           step="1"
                           style="width: 100%; border-radius: 8px; border-color: var(--border-secondary)"
            />
          </div>
        </div>

        <div class="calculator-dashboard">
          <NetworkDashboardItemV2
              id="currentReward"
              title="Current 24h Period Reward"
              :value="currentReward.toString()"
              :unit="cryptoName"
          />
          <NetworkDashboardItemV2
              id="monthlyReward"
              title="Approx Monthly Reward"
              :value="monthlyReward.toString()"
              :unit=cryptoName
          />
          <NetworkDashboardItemV2
              id="yearlyReward"
              title="Approx Yearly Reward"
              :value="yearlyReward.toString()"
              :unit=cryptoName
          />
          <NetworkDashboardItemV2
              id="yearlyRate"
              title="Approx Yearly Reward Rate"
              :value="annualizedRate"
          />
        </div>

        <div v-html="htmlNotice"/>
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {makeNodeSelectorDescription} from "@/schemas/MirrorNodeSchemas";
import {NodeAnalyzer} from "@/utils/analyzer/NodeAnalyzer";
import {CoreConfig} from "@/config/CoreConfig";
import SelectView from "@/elements/SelectView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import NetworkDashboardItemV2 from "@/components/node/NetworkDashboardItemV2.vue";
import TextFieldView from "@/elements/TextFieldView.vue";

const props = defineProps({
  network: String,
  amountInHbar: Number,
  nodeId: Number,
})

const coreConfig = CoreConfig.inject()
const htmlNotice = coreConfig.estimatorNotice ?? ""
const cryptoName = coreConfig.cryptoName

const selectedNodeId = ref<number | null>(props.nodeId ?? null)
watch(() => props.nodeId, () => selectedNodeId.value = props.nodeId ?? null)

//
// Node
//
const nodeAnalyzer = new NodeAnalyzer(selectedNodeId)
onMounted(() => nodeAnalyzer.mount())
onBeforeUnmount(() => nodeAnalyzer.unmount())

const amountStaked = ref<number>(100)
const updateAmountStaked = () => {
  amountStaked.value = props.amountInHbar ?? 100
}
watch(() => props.amountInHbar, updateAmountStaked)
onBeforeMount(updateAmountStaked)

const rewardRate = computed(() => nodeAnalyzer.rewardRate.value)
const currentReward = computed(() => rewardRate.value && amountStaked.value ? Math.round(amountStaked.value * rewardRate.value * 10000) / 10000 : 0)
const monthlyReward = computed(() => currentReward.value ? Math.round(currentReward.value * 30 * 100) / 100 : 0)
const yearlyReward = computed(() => currentReward.value ? Math.round(currentReward.value * 365 * 10) / 10 : 0)

const annualizedRate = nodeAnalyzer.annualizedRate
const nodes = nodeAnalyzer.networkAnalyzer.nodes

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.calculator-root {
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 14px;
}

div.calculator-input {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  min-height: 128px;
}

div.node-selector {
  flex-grow: 1.3;
}

div.amount-chooser {
  flex-grow: 1;
}


div.calculator-dashboard {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: space-between;
}

</style>
