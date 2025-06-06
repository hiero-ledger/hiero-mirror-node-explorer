// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      Block
      <span style="white-space: nowrap; font-size: smaller">
         {{ block?.number?.toString() ?? "" }}
      </span>
    </template>

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2 collapsible-key="blockDetails">
      <template #title>
        Block Details
      </template>

      <template #right-control>
        <ButtonView
            id="prev-block-button"
            :enabled="!disablePreviousButton"
            :size="ButtonSize.small"
            @action="handlePreviousBlock"
        >
          <ArrowLeft :size="18" class="block-navigation-button"/>
          <span class="block-navigation-button">{{ isSmallScreen ? 'PREV. BLOCK' : 'PREV.' }}</span>
        </ButtonView>
        <ButtonView
            id="next-block-button"
            :enabled="!disableNextButton"
            :size="ButtonSize.small"
            @action="handleNextBlock"
        >
          <span class="block-navigation-button">{{ isSmallScreen ? 'NEXT BLOCK' : 'NEXT' }}</span>
          <ArrowRight :size="18" class="block-navigation-button"/>
        </ButtonView>
      </template>

      <template #content>
        <Property id="blockHash" full-width>
          <template v-slot:name>Hash</template>
          <template v-slot:value>
            <KeyValue :key-bytes="block?.hash" :show-none="true" key-type="SHA384"/>
          </template>
        </Property>
        <Property id="count" full-width>
          <template #name>No. Transactions</template>
          <template v-slot:value>
            <PlainAmount :amount="block?.count"/>
          </template>
        </Property>
        <Property id="fromTimestamp" full-width>
          <template v-slot:name>From Timestamp</template>
          <template v-slot:value>
            <TimestampValue :show-none="true" :timestamp="block?.timestamp?.from"/>
          </template>
        </Property>
        <Property id="toTimestamp" full-width>
          <template v-slot:name>To Timestamp</template>
          <template v-slot:value>
            <TimestampValue :show-none="true" :timestamp="block?.timestamp?.to ?? undefined"/>
          </template>
        </Property>
        <Property id="gasUsed" full-width>
          <template v-slot:name>Gas Used</template>
          <template v-slot:value>
            <PlainAmount :amount="block?.gas_used"/>
          </template>
        </Property>
        <Property id="recordFileName" full-width>
          <template v-slot:name>Record File Name</template>
          <template v-slot:value>
            <StringValue :string-value="block?.name"/>
          </template>
        </Property>
      </template>
    </DashboardCardV2>

    <DashboardCardV2 id="blockTransactions" collapsible-key="blockTransactions">
      <template #title>
        Block Transactions
      </template>
      <template #content>
        <BlockTransactionTable :transactions="transactions"/>
      </template>
    </DashboardCardV2>

    <MirrorLink :network="props.network" entityUrl="blocks" :loc="props.blockHon"/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {BlockLocParser} from "@/utils/parser/BlockLocParser";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Property from "@/components/Property.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import StringValue from "@/components/values/StringValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import BlockTransactionTable from "@/components/block/BlockTransactionTable.vue";
import {TransactionGroupByBlockCache} from "@/utils/cache/TransactionGroupByBlockCache";
import MirrorLink from "@/components/MirrorLink.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ButtonView from "@/elements/ButtonView.vue";
import {ArrowLeft, ArrowRight} from 'lucide-vue-next';
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  blockHon: String,
  network: String
})

const nullHash = "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
const isSmallScreen = inject('isSmallScreen', true)

//
// block
//
const blockLocParser = new BlockLocParser(computed(() => props.blockHon ?? null))
onMounted(() => blockLocParser.mount())
onBeforeUnmount(() => blockLocParser.unmount())

//
// transactions
//
const transactionsLookup = TransactionGroupByBlockCache.instance.makeLookup(blockLocParser.blockNumber)
onMounted(() => transactionsLookup.mount())
onBeforeUnmount(() => transactionsLookup.unmount())
const transactions = computed(() => transactionsLookup.entity.value ?? [])

const disablePreviousButton = ref(true)
const disableNextButton = ref(true)
watch(blockLocParser.block, () => {
  disablePreviousButton.value = (blockLocParser.errorNotification.value != null) || (blockLocParser.block.value?.previous_hash === nullHash)
  disableNextButton.value = blockLocParser.errorNotification.value != null
})
const handlePreviousBlock = () => {
  const currentBlockNumber = blockLocParser.blockNumber.value ?? 0
  routeManager.routeToBlock(currentBlockNumber - 1)
}
const handleNextBlock = () => {
  const currentBlockNumber = blockLocParser.blockNumber.value ?? 0
  routeManager.routeToBlock(currentBlockNumber + 1)
}

const block = blockLocParser.block
const notification = blockLocParser.errorNotification

</script>

<style scoped>

.block-navigation-button {
  color: var(--text-primary);
}

</style>
