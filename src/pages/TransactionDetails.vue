// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Transaction Details">
    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2 collapsible-key="transactionDetails">
      <template #title>
        <span>Transaction </span>
        <TransactionIdValue :id="formattedTransactionId"/>
        <template v-if="transaction">
          <div v-if="transactionSucceeded" class="h-has-pill h-chip-success" style="margin-top: 2px">
            SUCCESS
          </div>
          <div v-else class="h-has-pill h-chip-error" style="margin-top: 2px">
            FAILURE
          </div>
        </template>
        <ArrowLink
            v-if="transactionId && displayAllTransactionsLink"
            id="allTransactionsLink"
            :route="routeManager.makeRouteToTransactionsById(transactionId)"
            text="Transactions with same ID"
        />
      </template>
      <template #right-control>
        <SelectView
            data-cy="select-format"
            v-model="txIdForm"
            small
        >
          <option value="atForm">DEFAULT FORMAT</option>
          <option value="dashForm">EXCHANGE FORMAT</option>
        </SelectView>
      </template>

      <template #left-content>
        <Property id="transactionType">
          <template #name>Type</template>
          <template #value>
            <StringValue :string-value="transactionType ? makeTypeLabel(transactionType) : null"/>
          </template>
        </Property>
        <Property v-if="displayResult" id="result">
          <template #name>Result</template>
          <template #value>
            <StringValue :string-value="transaction?.result"/>
          </template>
        </Property>
        <Property v-if="scheduledTransaction" id="scheduledTransaction">
          <template #name>Scheduled Transaction</template>
          <template #value>
            <div class="multi-item-property-value">
              <TransactionLink :transactionLoc="scheduledTransaction?.consensus_timestamp ?? undefined"/>
              <div class="h-has-pill h-chip-default" style="line-height: 15px">
                {{ schedule?.executed_timestamp ? 'EXECUTED' : 'NOT EXECUTED' }}
              </div>
            </div>
          </template>
        </Property>
        <Property id="consensusAt">
          <template #name>Consensus at</template>
          <template #value>
            <TimestampValue :show-none="true" :timestamp="transaction?.consensus_timestamp"/>
          </template>
        </Property>
        <Property id="transactionHash">
          <template #name>Transaction Hash</template>
          <template #value>
            <HexaValue :byteString="formattedHash" :show-none="true"/>
          </template>
        </Property>
        <Property id="blockNumber">
          <template #name>Block</template>
          <template #value>
            <BlockLink :block-number="blockNumber !== null ? blockNumber : undefined"/>
          </template>
        </Property>
        <Property id="nodeAccount">
          <template #name>Node Submitted To</template>
          <template #value>
            <AccountLink :accountId="transaction?.node" :show-extra="true"/>
          </template>
        </Property>
        <Property id="memo">
          <template #name>Memo</template>
          <template #value>
            <BlobValue :base64="true" :blob-value="transaction?.memo_base64" :show-none="true"/>
          </template>
        </Property>
      </template>

      <template #right-content>
        <Property v-if="isTokenAssociation && associatedTokens.length" id="associatedTokenId">
          <template #name>
            Associated Token<span v-if="associatedTokens.length > 1">s</span>
          </template>
          <template #value>
            <TokenLink v-for="t of associatedTokens" :key="t" :token-id="t" :show-extra="true"/>
          </template>
        </Property>
        <Property v-if="systemContract" id="entityId">
          <template #name>Contract ID</template>
          <template #value>{{ systemContract }}</template>
        </Property>
        <Property v-else-if="transaction?.entity_id" id="entityId">
          <template #name>{{ entity?.label }}</template>
          <template #value>
            <SmartLink v-if="entity?.routeName"
                       :entity-id="transaction?.entity_id ?? undefined"
                       :route-name="routeName ?? undefined"
                       :show-extra="true"
            />
            <span v-else>
                  {{ transaction?.entity_id }}
                </span>
          </template>
        </Property>
        <Property v-if="transactionType === TransactionType.ETHEREUMTRANSACTION" id="senderAccount">
          <template #name>Sender Account</template>
          <template #value>
            <AccountLink :accountId="senderAccount"
                         :show-extra="true"/>
          </template>
        </Property>
        <Property id="operatorAccount">
          <template #name>
            {{ transactionType === TransactionType.ETHEREUMTRANSACTION ? 'Relay Account' : 'Payer Account' }}
          </template>
          <template #value>
            <AccountLink v-if="transaction" :accountId="operatorAccount"
                         :show-extra="true"/>
          </template>
        </Property>
        <Property id="chargedFee">
          <template #name>Charged Fee</template>
          <template #value>
            <HbarAmount v-if="transaction" :amount="transaction.charged_tx_fee"
                        :show-extra="true" :timestamp="transaction.consensus_timestamp"/>
          </template>
        </Property>
        <Property id="maxFee"
                  :tooltip="showMaxFeeTooltip
                  ? `Max Fee limit does not include the ${cryptoName} cost of gas consumed by transactions executed on the EVM.`
                  : undefined">
          <template #name>
            <span>Max Fee</span>
          </template>
          <template #value>
            <HbarAmount v-if="transaction" :amount="maxFee" :show-extra="true"
                        :timestamp="transaction.consensus_timestamp"/>
          </template>
        </Property>
        <Property v-if="false" id="netAmount">
          <template #name>Net Amount</template>
          <template #value>
            <HbarAmount v-if="transaction" :amount="netAmount" :show-extra="true"
                        :timestamp="transaction?.consensus_timestamp"/>
          </template>
        </Property>
        <Property id="duration">
          <template #name>Valid Duration</template>
          <template #value>
            <DurationValue :string-value="transaction?.valid_duration_seconds" :show-none="true"/>
          </template>
        </Property>
        <Property id="nonce">
          <template #name>Transaction Nonce</template>
          <template #value>
            {{ transaction?.nonce }}
          </template>
        </Property>
        <Property v-if="transaction?.scheduled===true" id="scheduled">
          <template #name>Scheduled</template>
          <template #value>True</template>
        </Property>
        <Property v-if="transaction?.scheduled===true && schedulingTransaction" id="scheduleCreateTransaction">
          <template #name>Schedule Create Transaction</template>
          <template #value>
            <div class="multi-item-property-value">
              <TransactionLink :transactionLoc="schedulingTransaction?.consensus_timestamp ?? undefined"/>
            </div>
          </template>
        </Property>
        <Property v-if="parentTransaction" id="parentTransaction">
          <template #name>Parent Transaction</template>
          <template #value>
            <router-link :to="routeManager.makeRouteToTransactionObj(parentTransaction)">
              {{ makeTypeLabel(parentTransaction.name) }}
            </router-link>
          </template>
        </Property>
        <Property v-if="childTransactions.length" id="childTransactions">
          <template #name>Child Transactions</template>
          <template #value>
            <div v-for="tx in childTransactions.slice(0, MAX_INLINE_CHILDREN)" :key="tx.nonce">
              <router-link :to="routeManager.makeRouteToTransactionObj(tx)">
                <span class="h-is-numeric">{{ '#' + tx.nonce }}</span>
                <span class="ml-2">{{ makeTypeLabel(tx.name) }}</span>
              </router-link>
              <span v-for="id in getTargetedTokens(tx, 5)" :key="id" class="ml-2">
                <TokenExtra :token-id="id" :use-anchor="true"/>
              </span>
            </div>
            <ArrowLink
                style="text-align: left"
                v-if="displayAllChildrenLink"
                id="allChildrenLink"
                :route="routeManager.makeRouteToTransactionsById(transactionId ?? '')"
                :text="'All ' + childTransactions.length + ' child transactions'"
            />
          </template>
        </Property>
      </template>
    </DashboardCardV2>

    <DashboardCardV2 v-if="displayTransfers" collapsible-key="transfers">
      <template #title>
        <span>Transfers</span>
      </template>
      <template #content>
        <div>
          <TransferGraphSection :transaction="transaction ?? undefined"/>
        </div>
      </template>
    </DashboardCardV2>

    <TopicMessage :message="topicMessage"/>

    <ContractResult :timestamp="transaction?.consensus_timestamp"
                    :is-parent="transaction?.parent_consensus_timestamp === null"
                    :block-number="blockNumber ?? undefined"
                    :transaction-hash="formattedHash ?? undefined"
                    :transaction-type="transaction?.name ?? undefined"
    />

    <MirrorLink :network="props.network" entityUrl="transactions" :loc="transactionId!"/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {getTargetedTokens, makeTypeLabel} from "@/utils/TransactionTools";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import SmartLink from "@/components/values/link/SmartLink.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import StringValue from "@/components/values/StringValue.vue";
import TransferGraphSection from "@/components/transfer_graphs/TransferGraphSection.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Property from "@/components/Property.vue";
import DurationValue from "@/components/values/DurationValue.vue";
import BlockLink from "@/components/values/BlockLink.vue";
import ContractResult from "@/components/contract/ContractResult.vue";
import {TransactionDetail, TransactionType} from "@/schemas/MirrorNodeSchemas";
import TopicMessage from "@/components/topic/TopicMessage.vue";
import {TopicMessageByTimestampCache} from "@/utils/cache/TopicMessageByTimestampCache.ts";
import {routeManager} from "@/router"
import TokenLink from "@/components/values/link/TokenLink.vue";
import {TransactionLocParser} from "@/utils/parser/TransactionLocParser";
import {TransactionGroupAnalyzer} from "@/components/transaction/TransactionGroupAnalyzer";
import {TransactionAnalyzer} from "@/components/transaction/TransactionAnalyzer";
import {TransactionGroupCache} from "@/utils/cache/TransactionGroupCache";
import MirrorLink from "@/components/MirrorLink.vue";
import TokenExtra from "@/components/values/link/TokenExtra.vue";
import {TransactionID} from "@/utils/TransactionID";
import TransactionIdValue from "@/components/values/TransactionIdValue.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import SelectView from "@/elements/SelectView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import ArrowLink from "@/components/ArrowLink.vue";
import {ScheduleByIdCache} from "@/utils/cache/ScheduleByIdCache.ts";
import TransactionLink from "@/components/values/TransactionLink.vue";

const MAX_INLINE_CHILDREN = 10

const props = defineProps({
  transactionLoc: String,
  network: String
})

const cryptoName = CoreConfig.inject().cryptoName

const displayAllTransactionsLink = computed(() => {
  const hasSchedule = transactionGroupAnalyzer.schedulingTransaction.value !== null
  const txnCount = transactionGroupAnalyzer.transactions.value?.length ?? 0
  return !hasSchedule && txnCount >= 2
})

const txIdForm = ref(TransactionID.useAtForm.value ? 'atForm' : 'dashForm')
watch(txIdForm, () => TransactionID.setUseAtForm(txIdForm.value === 'atForm'))

const transactionLoc = computed(() => props.transactionLoc ?? null)
const transactionLocParser = new TransactionLocParser(transactionLoc)
onMounted(() => transactionLocParser.mount())
onBeforeUnmount(() => transactionLocParser.unmount())

const transactionAnalyzer = new TransactionAnalyzer(transactionLocParser.transaction)
onMounted(() => transactionAnalyzer.mount())
onBeforeUnmount(() => transactionAnalyzer.unmount())

const transactionGroupLookup = TransactionGroupCache.instance.makeLookup(transactionLocParser.transactionId)
onMounted(() => transactionGroupLookup.mount())
onBeforeUnmount(() => transactionGroupLookup.unmount())

const transactionGroupAnalyzer = new TransactionGroupAnalyzer(transactionGroupLookup.entity)

const displayAllChildrenLink = computed(() => {
  return transactionGroupAnalyzer.childTransactions.value.length > MAX_INLINE_CHILDREN
})

const displayTransfers = computed(() =>
    (transactionDetail.value?.transfers && transactionDetail.value.transfers.length > 0)
    || (transactionDetail.value?.token_transfers && transactionDetail.value.token_transfers.length > 0)
    || (transactionDetail.value?.nft_transfers && transactionDetail.value.nft_transfers.length > 0)
)

const displayResult = computed(
    () => transactionAnalyzer.hasSucceeded.value && transactionAnalyzer.result.value != "SUCCESS")

const routeName = computed(() => {
  return transactionAnalyzer.entityDescriptor.value?.routeName
})

const messageTimestamp = computed(() =>
    (transactionAnalyzer.transactionType.value === TransactionType.CONSENSUSSUBMITMESSAGE)
        ? transactionAnalyzer.consensusTimestamp.value ?? ""
        : ""
)
const topicMessageLookup = TopicMessageByTimestampCache.instance.makeLookup(messageTimestamp)
onMounted(() => topicMessageLookup.mount())
onBeforeUnmount(() => topicMessageLookup.unmount())

const showMaxFeeTooltip = computed(
    () => transactionAnalyzer.chargedFee.value > transactionAnalyzer.maxFee.value)

const transactionDetail = computed(() => {
  let result: TransactionDetail | null
  const consensusTimestamp = transactionAnalyzer.consensusTimestamp.value
  if (consensusTimestamp !== null) {
    result = null
    for (const t of transactionGroupAnalyzer.transactions.value ?? []) {
      if (consensusTimestamp == t.consensus_timestamp) {
        result = t
        break
      }
    }
  } else {
    result = null
  }
  return result
})

const parentTransaction = computed(() => {
  let result: TransactionDetail | null
  const t = transactionLocParser.transaction.value
  const p = transactionGroupAnalyzer.parentTransaction.value
  if (t !== null && p !== null && t.consensus_timestamp !== p.consensus_timestamp) {
    result = p
  } else {
    result = null
  }
  return result
})

const childTransactions = computed(() => {
  let result: TransactionDetail[]
  const t = transactionLocParser.transaction.value
  const p = transactionGroupAnalyzer.parentTransaction.value
  if (t !== null && p !== null && t.consensus_timestamp === p.consensus_timestamp) {
    result = transactionGroupAnalyzer.childTransactions.value
  } else {
    result = []
  }
  return result
})

const scheduledTransaction = computed(() => {
  let result: TransactionDetail | null
  const t = transactionLocParser.transaction.value
  const i = transactionGroupAnalyzer.scheduledTransaction.value
  if (t !== null && i !== null && t.consensus_timestamp !== i.consensus_timestamp) {
    result = i
  } else {
    result = null
  }
  return result
})

const schedulingTransaction = computed(() => {
  let result: TransactionDetail | null
  const t = transactionLocParser.transaction.value
  const o = transactionGroupAnalyzer.schedulingTransaction.value
  if (t !== null && o !== null && t.consensus_timestamp !== o.consensus_timestamp) {
    result = o
  } else {
    result = null
  }
  return result
})

const scheduleId = computed(() => transactionGroupAnalyzer.schedulingTransaction.value?.entity_id ?? null)
const scheduleLookup = ScheduleByIdCache.instance.makeLookup(scheduleId)
const schedule = scheduleLookup.entity
onMounted(() => scheduleLookup.mount())
onBeforeUnmount(() => scheduleLookup.unmount())

const operatorAccount = computed(() => {
  let result: string | null = null
  if (transactionDetail.value?.scheduled) {
    result = schedule.value?.payer_account_id ?? null
  }
  if (result === null) {
    result = transactionAnalyzer.operatorAccount.value

  }
  return result
})

const transactionId = transactionLocParser.transactionId
const transaction = transactionDetail
const formattedTransactionId = transactionAnalyzer.formattedTransactionId
const netAmount = transactionAnalyzer.netAmount
const entity = transactionAnalyzer.entityDescriptor
const systemContract = transactionAnalyzer.systemContract
const maxFee = transactionAnalyzer.maxFee
const formattedHash = transactionAnalyzer.formattedHash
const transactionType = transactionAnalyzer.transactionType
const transactionSucceeded = transactionAnalyzer.hasSucceeded
const senderAccount = transactionAnalyzer.senderAccount
const blockNumber = transactionAnalyzer.blockNumber
const notification = transactionLocParser.errorNotification
const topicMessage = topicMessageLookup.entity
const isTokenAssociation = transactionAnalyzer.isTokenAssociation
const associatedTokens = transactionAnalyzer.tokens

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.multi-item-property-value {
  align-items: center;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

</style>
