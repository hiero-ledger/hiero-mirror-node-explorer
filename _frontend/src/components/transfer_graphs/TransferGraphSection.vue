// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="compact">
    <HbarTransferGraphC
        v-if="netAmount > 0"
        data-cy="hbarTransfers"
        v-bind:transaction="transaction ?? undefined"/>
  </template>
  <template v-else>
    <HbarTransferGraphF
        data-cy="hbarTransfers"
        title="Hbar Transfers"
        v-bind:class="{'mb-4': displayRewardTransfers || displayNftTransfers || displayTokenTransfers}"
        v-bind:transaction="transaction ?? undefined"/>
  </template>

  <NftTransferGraph
      data-cy="nftTransfers"
      v-bind:class="{'mb-4': !compact && (displayTokenTransfers || displayRewardTransfers)}"
      v-bind:transaction="transaction ?? undefined"
      v-bind:compact="compact"/>

  <template v-if="compact">
    <TokenTransferGraphC
        data-cy="tokenTransfers"
        v-bind:transaction="transaction ?? undefined"/>
  </template>
  <template v-else>
    <TokenTransferGraphF
        data-cy="tokenTransfers"
        v-bind:class="{'mb-4': displayRewardTransfers}"
        v-bind:transaction="transaction ?? undefined"/>
  </template>

  <template v-if="!compact">
    <RewardTransferGraph
        data-cy="rewardTransfers"
        v-bind:transaction="transaction ?? undefined"/>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, Ref} from "vue";
import {TransactionDetail} from "@/schemas/MirrorNodeSchemas";
import HbarTransferGraphC from "@/components/transfer_graphs/HbarTransferGraphC.vue";
import HbarTransferGraphF from "@/components/transfer_graphs/HbarTransferGraphF.vue";
import NftTransferGraph from "@/components/transfer_graphs/NftTransferGraph.vue";
import TokenTransferGraphC from "@/components/transfer_graphs/TokenTransferGraphC.vue";
import TokenTransferGraphF from "@/components/transfer_graphs/TokenTransferGraphF.vue";
import RewardTransferGraph from "@/components/transfer_graphs/RewardTransferGraph.vue";
import {TransactionAnalyzer} from "@/components/transaction/TransactionAnalyzer.ts";

const props = defineProps({
  analyzer: {
    type: Object as PropType<TransactionAnalyzer>,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const transaction = props.analyzer.transaction as Ref<TransactionDetail | null>
const netAmount = props.analyzer.netAmount
const displayRewardTransfers = props.analyzer.hasRewardTransfers
const displayNftTransfers = props.analyzer.hasNftTransfers
const displayTokenTransfers = props.analyzer.hasTokenTransfers

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
