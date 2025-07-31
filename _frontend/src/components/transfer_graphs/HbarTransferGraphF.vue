// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div v-if="hbarTransferLayout.rowCount >= 1">
    <div class="h-sub-section">
      {{ title }}
    </div>

    <div class="graph-container" :class="{'graph-container-8': dollarVisible }">
      <template v-if="dollarVisible">
        <div style="grid-column-end: span 1" class="transfer-header">
          ACCOUNT
        </div>
        <div style="grid-column-end: span 2" class="transfer-header">
          AMOUNT
        </div>
        <div/>
        <div style="grid-column-end: span 1" class="transfer-header">
          ACCOUNT
        </div>
        <div style="grid-column-end: span 2" class="transfer-header">
          AMOUNT
        </div>
        <div/>
      </template>
      <template v-else>
        <div style="grid-column-end: span 1" class="transfer-header2">
          ACCOUNT
        </div>
        <div style="grid-column-end: span 1" class="transfer-header">
          AMOUNT
        </div>
        <div/>
        <div style="grid-column-end: span 1" class="transfer-header">
          ACCOUNT
        </div>
        <div style="grid-column-end: span 1" class="transfer-header2">
          AMOUNT
        </div>
      </template>

      <template v-for="i in hbarTransferLayout.rowCount" :key="i">

        <!-- #0 : account id -->
        <div class="transfer-account">
          <AccountLink v-if="i <= hbarTransferLayout.sources.length"
                       :account-id="hbarTransferLayout.sources[i-1].transfer.account"
                       null-label="MINT"
                       data-cy="sourceAccount"/>
        </div>

        <!-- #1 : hbar amount -->
        <div class="justify-end">
          <HbarAmount v-if="i <= hbarTransferLayout.sources.length"
                      :amount="hbarTransferLayout.sources[i-1].transfer.amount"
                      :colored="true"/>
        </div>

        <template v-if="dollarVisible">

          <!-- #2 : dollar amount -->
          <div class="justify-end dollar-amount">
            <HbarExtra v-if="i <= hbarTransferLayout.sources.length"
                       :tbarAmount="hbarTransferLayout.sources[i-1].transfer.amount"
                       :timestamp="props.transaction?.consensus_timestamp"/>
          </div>

        </template>

        <!-- #3 : arrow -->
        <div style="position: relative">
          <ArrowSegment
              :source-count="hbarTransferLayout.sources.length"
              :dest-count="hbarTransferLayout.destinations.length"
              :row-index="i-1"/>
        </div>

        <!-- #4 : account id -->
        <div class="transfer-account" :class="{'low-contrast': hasLowContrast(i-1)}">
          <AccountLink v-if="i <= hbarTransferLayout.destinations.length"
                       :account-id="hbarTransferLayout.destinations[i-1].transfer.account"
                       null-label="BURN"
                       data-cy="destinationAccount"/>
        </div>

        <!-- #5 : hbar amount -->
        <div class="justify-end">
          <HbarAmount v-if="i <= hbarTransferLayout.destinations.length"
                      :amount="hbarTransferLayout.destinations[i-1].transfer.amount"
                      :colored="true"/>
        </div>

        <template v-if="dollarVisible">

          <!-- #6 : dollar amount -->
          <div class="justify-end dollar-amount">
            <HbarExtra v-if="i <= hbarTransferLayout.destinations.length"
                       :tbarAmount="hbarTransferLayout.destinations[i-1].transfer.amount"
                       :timestamp="props.transaction?.consensus_timestamp"/>
          </div>

          <!-- #7 : description -->
          <div class="description">
            <span v-if="i <= hbarTransferLayout.destinations.length">
              {{ hbarTransferLayout.destinations[i - 1].description }}
            </span>
          </div>

        </template>
      </template>

    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, PropType} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import ArrowSegment from "@/components/transfer_graphs/ArrowSegment.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import HbarExtra from "@/components/values/HbarExtra.vue";
import {HbarTransferLayout} from "@/components/transfer_graphs/layout/HbarTransferLayout";
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer";

const props = defineProps({
  transaction: Object as PropType<Transaction>,
  title: String,
  showNone: {
    type: Boolean,
    default: false
  }
})

const networkAnalyzer = new NetworkAnalyzer()
onMounted(() => networkAnalyzer.mount())
onBeforeUnmount(() => networkAnalyzer.unmount())

const hbarTransferLayout = computed(
    () => new HbarTransferLayout(props.transaction, networkAnalyzer.nodes.value))

function hasLowContrast(i: number): boolean {
  const destinations = hbarTransferLayout.value.destinations
  const destination = i < destinations.length ? destinations[i] : null
  return destination === null || !destination.payload
}

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

div.description {
  color: var(--text-secondary);
}

div.low-contrast {
  color: var(--text-secondary);
  font-weight: 400;
}

</style>
