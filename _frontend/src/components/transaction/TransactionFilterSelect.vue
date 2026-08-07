// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <SelectView
      v-model:model-value="selectedFilter"
      :small="true"
      data-cy="select-type"
  >
    <option v-for="f in filterValues" v-bind:key="f" v-bind:value="f">
      {{ makeFilterLabel(f) }}
    </option>
  </SelectView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed} from "vue";
import {TransactionType} from "@/schemas/MirrorNodeSchemas";
import {makeTypeLabel} from "@/utils/TransactionTools";
import SelectView from "@/elements/SelectView.vue";

const props = defineProps({
  nftFilter: {
    type: Boolean,
    required: false,
  },
})

const selectedFilter = defineModel("selectedFilter", {
  type: String,
  required: true
})

const makeFilterLabel = (filterValue: string): string => {
  return filterValue == "" ? "TYPES: ALL" : makeTypeLabel(filterValue as TransactionType)
}

const nftTransactionTypes = new Set<TransactionType>([
  TransactionType.CRYPTOTRANSFER,
  TransactionType.TOKENMINT,
  TransactionType.CRYPTOAPPROVEALLOWANCE,
  TransactionType.CRYPTODELETEALLOWANCE,
  TransactionType.TOKENWIPE,
  TransactionType.TOKENAIRDROP,
  TransactionType.TOKENBURN,
  TransactionType.TOKENCANCELAIRDROP,
  TransactionType.TOKENCLAIMAIRDROP,
  TransactionType.TOKENREJECT,
  TransactionType.TOKENDELETION,
])

const filterValues = computed(() => {
  let result = Object.values(TransactionType)
      .sort((a, b) => makeTypeLabel(a).localeCompare(makeTypeLabel(b)))
      // remove filter options not to be shown (because there will never be any transactions of that type in the table)
      .filter(type =>
          type !== TransactionType.CRYPTOADDLIVEHASH
          && type !== TransactionType.CRYPTODELETELIVEHASH
      )

  // keep only NFT-related transaction types when prop nftFilter is true
  if (props.nftFilter) {
    result = result.filter(type => nftTransactionTypes.has(type))
  }

  return ["", ...result]
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
