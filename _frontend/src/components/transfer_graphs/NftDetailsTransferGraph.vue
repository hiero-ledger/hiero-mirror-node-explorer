// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div>
    <div class="graph-container">
      <div class="transfer-account">
        <AccountLink
            :account-id="nftTransferLayout.sender_account_id"
            no-anchor
            null-label="MINT"
            data-cy="sourceAccount"
        />
      </div>

      <div style="position: relative">
        <ArrowSegment compact/>
      </div>

      <div class="transfer-token">
        <TokenLink
            :token-id="nftTransferLayout.token_id ?? undefined"
            :show-extra="true"
            no-anchor
            data-cy="nft"
        />
        <!--        <div class="transfer-serial">-->
        <!--            <span v-for="sn in nftTransferLayout.serial_numbers" :key="sn">-->
        <!--              #{{ sn }}-->
        <!--            </span>-->
        <!--        </div>-->
      </div>

      <div style="position: relative">
        <ArrowSegment compact/>
      </div>

      <div class="transfer-account">
        <AccountLink
            :account-id="nftTransferLayout.receiver_account_id"
            no-anchor
            null-label="BURN"
            data-cy="destinationAccount"
        />
      </div>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {computed, PropType} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TokenLink from "@/components/values/link/TokenLink.vue";
import ArrowSegment from "@/components/transfer_graphs/ArrowSegment.vue";
import {NFTTransferLayout} from "@/components/transfer_graphs/layout/NFTTransferLayout";
import {NftTransactionTransfer} from "@/schemas/MirrorNodeSchemas";
import {useRoute} from "vue-router";

const props = defineProps({
  transaction: Object as PropType<NftTransactionTransfer>,
})

const route = useRoute();
const tokenId = route.params.tokenId;
const serialNumber = route.params.serialNumber;

const nftTransferLayout = computed(() =>
    new NFTTransferLayout({
      receiver_account_id: props.transaction?.receiver_account_id,
      sender_account_id: props.transaction?.sender_account_id,
      token_id: tokenId as string,
      serial_number: Number(serialNumber),
      is_approval: props.transaction?.is_approval as boolean
    })
)

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

div.transfer-account {
  color: var(--text-primary);
  font-weight: 700;
}

div.transfer-token {
  color: var(--text-primary);
  font-weight: 400;
}

/*
div.transfer-serial {
  color: var(--text-secondary);
  max-width: 200px;
}
*/

</style>
