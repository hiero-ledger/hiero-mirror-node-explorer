// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div v-if="rewardTransferLayout.destinations.length >= 1">
    <div class="h-sub-section">
      Staking Rewards
    </div>

    <div class="graph-container" :class="{'graph-container-8': dollarVisible }">

      <template v-if="dollarVisible">
        <div style="grid-column-end: span 2" class="transfer-header">
          REWARD ACC.
        </div>
        <div/>
        <div style="grid-column-end: span 1" class="transfer-header">
          ACCOUNT
        </div>
        <div style="grid-column-end: span 2" class="transfer-header">
          AMOUNT
        </div>
        <div/>
        <div/>
      </template>
      <template v-else>
        <div style="grid-column-end: span 1" class="transfer-header">
          REWARD ACCOUNT
        </div>
        <div/>
        <div style="grid-column-end: span 1" class="transfer-header">
          ACCOUNT
        </div>
        <div style="grid-column-end: span 1" class="transfer-header">
          AMOUNT
        </div>
        <div/>
      </template>

      <template v-for="i in rewardTransferLayout.destinations.length" :key="i">

        <!-- #0 : account id -->
        <div class="transfer-account">
          <AccountLink
              v-if="i === 1"
              account-id="0.0.800"
              data-cy="awardSourceAccount"
          />
          <div v-else/>
        </div>
        <div/>

        <!-- #1 : arrow -->
        <div style="position: relative">
          <ArrowSegment
              :source-count="1"
              :dest-count="rewardTransferLayout.destinations.length"
              :row-index="i-1"/>
        </div>

        <!-- #2 : account id -->
        <div class="transfer-account">
          <AccountLink v-if="i <= rewardTransferLayout.destinations.length"
                       :account-id="rewardTransferLayout.destinations[i-1].account"
                       data-cy="destinationAccount"/>
        </div>

        <!-- #3 : reward amount -->
        <div class="justify-end">
          <HbarAmount v-if="i <= rewardTransferLayout.destinations.length"
                      :amount="rewardTransferLayout.destinations[i-1].amount"
                      :colored="true"/>
        </div>

        <template v-if="dollarVisible">

          <!-- #4 : dollar amount -->
          <div class="justify-end dollar-amount">
            <HbarExtra v-if="i <= rewardTransferLayout.destinations.length"
                       :tbarAmount="rewardTransferLayout.destinations[i-1].amount"
                       :timestamp="transaction?.consensus_timestamp"/>
          </div>

        </template>
        <div/>
        <div/>

      </template>

    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import ArrowSegment from "@/components/transfer_graphs/ArrowSegment.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import HbarExtra from "@/components/values/HbarExtra.vue";
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import {RewardTransferLayout} from "@/components/transfer_graphs/layout/RewardTransferLayout";

const props = defineProps({
  transaction: Object as PropType<Transaction>,
})

const rewardTransferLayout = computed(() => new RewardTransferLayout(props.transaction))

const dollarVisible = inject("isSmallScreen", true)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.graph-container {
  column-gap: 1em;
  display: inline-grid;
  font-size: 14px;
  grid-template-columns: repeat(5, auto);
  line-height: 1.6rem;
  padding-left: 16px;
  padding-top: 8px;
}

.graph-container-8 {
  grid-template-columns: repeat(8, auto);
}

div.justify-end {
  justify-self: end;
}

div.transfer-header {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 12px;
}

div.transfer-account {
  color: var(--text-primary);
  font-weight: 700;
}

div.dollar-amount {
  color: var(--text-accent2);
}

</style>
