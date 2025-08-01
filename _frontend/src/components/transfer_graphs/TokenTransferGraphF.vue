// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="tokenTransferLayout.length >= 1">
    <div class="h-sub-section">
      Token Transfers
    </div>

    <div class="graph-container" :class="{'graph-container-8': symbolVisible}">

      <template v-if="symbolVisible">
        <div style="grid-column-end: span 1" class="transfer-header">ACCOUNT</div>
        <div style="grid-column-end: span 2" class="transfer-header">AMOUNT</div>
        <div/>
        <div style="grid-column-end: span 1" class="transfer-header">ACCOUNT</div>
        <div style="grid-column-end: span 2" class="transfer-header">AMOUNT</div>
        <div/>
      </template>
      <template v-else>
        <div style="grid-column-end: span 1" class="transfer-header">ACCOUNT</div>
        <div style="grid-column-end: span 1" class="transfer-header">AMOUNT</div>
        <div/>
        <div style="grid-column-end: span 1" class="transfer-header">ACCOUNT</div>
        <div style="grid-column-end: span 1" class="transfer-header2">AMOUNT</div>
      </template>

      <template v-for="s in tokenTransferLayout.length" :key="s">

        <template v-for="i in tokenTransferLayout[s-1].rowCount" :key="i">

          <!-- #0 : account id -->
          <div class="transfer-account">
            <template v-if="i <= tokenTransferLayout[s-1].sources.length">
              <AccountLink :account-id="tokenTransferLayout[s-1].sources[i-1].account"
                           null-label="MINT"
                           data-cy="sourceAccount"/>
            </template>
          </div>

          <!-- #1 : token amount -->
          <div class="justify-end">
            <TokenAmount v-if="i <= tokenTransferLayout[s-1].sources.length"
                         :amount="BigInt(tokenTransferLayout[s-1].sources[i-1].amount)"
                         :token-id="tokenTransferLayout[s-1].tokenId"/>
          </div>

          <!-- #2 : token symbol -->
          <template v-if="symbolVisible">
            <div data-cy="tokenExtra">
              <TokenExtra v-if="i <= tokenTransferLayout[s-1].sources.length"
                          :token-id="tokenTransferLayout[s-1].tokenId ?? undefined"
                          :use-anchor="true"/>
            </div>
          </template>

          <!-- #3 : arrow -->
          <div style="position: relative">
            <ArrowSegment
                :source-count="tokenTransferLayout[s-1].sources.length"
                :dest-count="tokenTransferLayout[s-1].destinations.length"
                :row-index="i-1"/>
          </div>

          <!-- #4 : account id -->
          <div class="transfer-account">
            <template v-if="i <= tokenTransferLayout[s-1].destinations.length">
              <AccountLink :account-id="tokenTransferLayout[s-1].destinations[i-1].account"
                           null-label="BURN"
                           data-cy="destinationAccount"/>
            </template>
          </div>

          <!-- #5 : token amount -->
          <div>
            <TokenAmount v-if="i <= tokenTransferLayout[s-1].destinations.length"
                         :amount="BigInt(tokenTransferLayout[s-1].destinations[i-1].amount)"
                         :token-id="tokenTransferLayout[s-1].tokenId"/>
          </div>

          <template v-if="symbolVisible">

            <!-- #6 : token symbol -->
            <div data-cy="tokenExtra">
              <TokenExtra v-if="i <= tokenTransferLayout[s-1].destinations.length"
                          :token-id="tokenTransferLayout[s-1].tokenId ?? undefined"
                          :use-anchor="true"/>
            </div>

            <!-- #7 : description -->
            <div v-if="i <= tokenTransferLayout[s-1].descriptions.length" class="description">
              {{ tokenTransferLayout[s - 1].descriptions[i - 1] }}
            </div>
          </template>

        </template>

      </template>

    </div>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType, ref, watch} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TokenAmount from "@/components/values/TokenAmount.vue";
import ArrowSegment from "@/components/transfer_graphs/ArrowSegment.vue";
import TokenExtra from "@/components/values/link/TokenExtra.vue";
import {TokenTransferLayout} from "@/components/transfer_graphs/layout/TokenTransferLayout";
import {Transaction} from "@/schemas/MirrorNodeSchemas";

const props = defineProps({
  transaction: Object as PropType<Transaction>
})

const tokenTransferLayout = ref(TokenTransferLayout.make(props.transaction))

watch(() => props.transaction, () => {
  tokenTransferLayout.value = TokenTransferLayout.make(props.transaction)
})

const symbolVisible = inject("isSmallScreen", true)

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
  line-height: 1.4rem;
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

div.description {
  color: var(--text-secondary);
}

</style>
