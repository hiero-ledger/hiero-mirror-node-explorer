// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="nftTransferLayout.length >= 1">
    <div v-if="!compact" class="h-sub-section">
      NFT Transfers
    </div>

    <div
        class="graph-container"
        :class="{'graph-full': !compact,'graph-container-6': !compact && descriptionVisible}"
    >

      <template v-if="!compact">

        <div class="transfer-header">ACCOUNT</div>
        <div/>
        <div class="transfer-header">NFT</div>
        <div/>
        <div class="transfer-header">ACCOUNT</div>
        <div v-if="!compact && descriptionVisible"/>
      </template>

      <template v-for="i in nftTransferLayout.length" :key="i">

        <!-- #0 : account id -->
        <div class="transfer-account">
          <AccountLink
              :account-id="nftTransferLayout[i-1].sender_account_id"
              :no-anchor="compact"
              null-label="MINT"
              data-cy="sourceAccount"/>
        </div>

        <!-- #1 : arrow -->
        <div style="position: relative">
          <ArrowSegment :compact="compact"/>
        </div>

        <!-- #2 : nfts -->
        <div class="transfer-token">
          <TokenLink
              :token-id="nftTransferLayout[i-1].token_id ?? undefined"
              :show-extra="true"
              :no-anchor="compact"
              data-cy="nft"/>
          <div v-if="!compact" class="transfer-serial">
              <span v-for="sn in nftTransferLayout[i-1].serial_numbers" :key="sn">
                #{{ sn }}
              </span>
          </div>
        </div>

        <!-- #3 : arrow -->
        <div style="position: relative">
          <ArrowSegment :compact="compact"/>
        </div>

        <!-- #4 : account id -->
        <div class="transfer-account">
          <AccountLink
              :account-id="nftTransferLayout[i-1].receiver_account_id"
              :no-anchor="compact"
              null-label="BURN"
              data-cy="destinationAccount"/>
        </div>

        <!-- #5 : description -->
        <div v-if="!compact && descriptionVisible" class="description">
          {{ nftTransferLayout[i - 1].description }}
        </div>

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
import TokenLink from "@/components/values/link/TokenLink.vue";
import ArrowSegment from "@/components/transfer_graphs/ArrowSegment.vue";
import {NFTTransferLayout} from "@/components/transfer_graphs/layout/NFTTransferLayout";
import {TransactionDetail} from "@/schemas/MirrorNodeSchemas";

const props = defineProps({
  transaction: Object as PropType<TransactionDetail>,
  compact: {
    type: Boolean,
    default: false
  }
})

const nftTransferLayout = ref(NFTTransferLayout.make(props.transaction))

watch(() => props.transaction, () => {
  nftTransferLayout.value = NFTTransferLayout.make(props.transaction)
})

const descriptionVisible = inject("isSmallScreen", true)

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
}

.graph-full {
  padding-left: 16px;
  padding-top: 8px;
}

.graph-container-6 {
  grid-template-columns: repeat(6, auto);
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

div.transfer-token {
  color: var(--text-primary);
  font-weight: 400;
}

div.transfer-serial {
  color: var(--text-secondary);
  max-width: 200px;
}

div.description {
  color: var(--text-secondary);
}

</style>

