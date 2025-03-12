// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div>
    <template v-if="compact">
      <HbarTransferGraphC
          v-if="netAmount > 0"
          data-cy="hbarTransfers"
          v-bind:transaction="transaction"/>
    </template>
    <template v-else>
      <HbarTransferGraphF
          data-cy="hbarTransfers"
          title="Hbar Transfers"
          v-bind:class="{'mb-4': displayRewardTransfers || displayNftTransfers || displayTokenTransfers}"
          v-bind:transaction="transaction"/>
    </template>

    <NftTransferGraph
        data-cy="nftTransfers"
        v-bind:class="{'mb-4': !compact && (displayTokenTransfers || displayRewardTransfers)}"
        v-bind:transaction="transaction"
        v-bind:compact="compact"/>

    <template v-if="compact">
      <TokenTransferGraphC
          data-cy="tokenTransfers"
          v-bind:transaction="transaction"/>
    </template>
    <template v-else>
      <TokenTransferGraphF
          data-cy="tokenTransfers"
          v-bind:class="{'mb-4': displayRewardTransfers}"
          v-bind:transaction="transaction"/>
    </template>

    <template v-if="!compact">
      <RewardTransferGraph
          data-cy="rewardTransfers"
          v-bind:transaction="transaction"/>
    </template>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {TransactionDetail} from "@/schemas/MirrorNodeSchemas";
import HbarTransferGraphC from "@/components/transfer_graphs/HbarTransferGraphC.vue";
import HbarTransferGraphF from "@/components/transfer_graphs/HbarTransferGraphF.vue";
import NftTransferGraph from "@/components/transfer_graphs/NftTransferGraph.vue";
import TokenTransferGraphC from "@/components/transfer_graphs/TokenTransferGraphC.vue";
import TokenTransferGraphF from "@/components/transfer_graphs/TokenTransferGraphF.vue";
import {computeNetAmount} from "@/utils/TransactionTools";
import RewardTransferGraph from "@/components/transfer_graphs/RewardTransferGraph.vue";

const props = defineProps({
  transaction: Object as PropType<TransactionDetail>,
  compact: {
    type: Boolean,
    default: false
  }
})

const netAmount = computed(() => {
  return props.transaction ? computeNetAmount(props.transaction.transfers, props.transaction.charged_tx_fee) : 0
})

const displayRewardTransfers = computed(() => props.transaction?.staking_reward_transfers && props.transaction?.staking_reward_transfers.length >= 1)
const displayNftTransfers = computed(() => props.transaction?.nft_transfers && props.transaction?.nft_transfers.length >= 1)
const displayTokenTransfers = computed(() => props.transaction?.token_transfers && props.transaction?.token_transfers.length >= 1)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
