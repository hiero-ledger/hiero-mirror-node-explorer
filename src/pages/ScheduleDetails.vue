// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Schedule Details">
    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2 collapsible-key="scheduleDetails">

      <template #title>
        Schedule {{ scheduleId }}
        <div v-if="schedule"
            class="h-has-pill h-chip-default"
            :class="{'h-chip-success':schedule?.executed_timestamp, 'h-chip-default':!schedule?.executed_timestamp}"
            style="margin-top: 2px">
          {{ schedule?.executed_timestamp ? 'EXECUTED' : 'NOT EXECUTED' }}
        </div>
      </template>

      <template #content>
        <Property v-if="schedule?.executed_timestamp" id="scheduled-transaction" :full-width="true">
          <template #name>Scheduled Transaction</template>
          <template #value>
            <router-link :to="routeManager.makeRouteToTransaction(schedule?.executed_timestamp)">
              {{ makeTypeLabel(scheduledTx?.name) }}
            </router-link>
          </template>
        </Property>
        <Property v-if="schedule?.executed_timestamp" id="executed-at" :full-width="true">
          <template #name>Executed at</template>
          <template #value>
            <TimestampValue :show-none="true" :timestamp="schedule?.executed_timestamp"/>
          </template>
        </Property>
        <Property id="memo" :full-width="true">
          <template #name>Memo</template>
          <template #value>
            <BlobValue :base64="true" :blob-value="schedule?.memo" :show-none="true" :show-base64-as-extra="true"/>
          </template>
        </Property>
        <Property v-if="schedule?.consensus_timestamp" id="create-transaction" :full-width="true">
          <template #name>Schedule Create Transaction</template>
          <template #value>
            <router-link :to="routeManager.makeRouteToTransaction(schedule.consensus_timestamp)">
              <TransactionLink :transactionLoc="schedule.consensus_timestamp"/>
            </router-link>
          </template>
        </Property>
        <Property id="creator-id" :full-width="true">
          <template #name>Creator Account</template>
          <template #value>
            <AccountLink :accountId="schedule?.creator_account_id" :show-extra="true"/>
          </template>
        </Property>
        <Property id="payer-id" :full-width="true">
          <template #name>Payer Account</template>
          <template #value>
            <AccountLink :accountId="schedule?.payer_account_id" :show-extra="true"/>
          </template>
        </Property>
        <Property v-if="schedule?.expiration_time" id="expiration-date" :full-width="true">
          <template #name>Expiration Date</template>
          <template #value>
            <TimestampValue :show-none="true" :timestamp="schedule?.expiration_time"/>
          </template>
        </Property>
        <Property v-if="schedule?.expiration_time" id="wait-for-expiry" :full-width="true">
          <template #name>Wait for Expiry</template>
          <template #value>
            {{ schedule?.wait_for_expiry ? 'True' : 'False' }}
          </template>
        </Property>
        <Property id="admin-key" :full-width="true">
          <template #name>Admin Key</template>
          <template #value>
            <KeyValue :key-bytes="schedule?.admin_key?.key" :key-type="schedule?.admin_key?._type" :show-none="true"/>
          </template>
        </Property>
        <Property id="transaction-body" :full-width="true">
          <template #name>Transaction Body</template>
          <template #value>
            <BlobValue :blob-value="formattedBody" pretty show-none/>
          </template>
        </Property>

        <template v-for="(s, index) in schedule?.signatures" :key="s.consensus_timestamp">
          <div class="h-sub-section">Signature {{ index + 1 }}</div>

          <Property id="timestamp" :full-width="true">
            <template #name>
              <span style="padding-left: 16px;">Timestamp</span>
            </template>
            <template #value>
              <TimestampValue :show-none="true" :timestamp="s.consensus_timestamp"/>
            </template>
          </Property>
          <Property id="key-prefix" :full-width="true">
            <template #name>
              <span style="padding-left: 16px;">Key Prefix</span>
            </template>
            <template #value>
              <HexaValue :byteString="hexaFormat(s.public_key_prefix)" :show-none="true"/>
            </template>
          </Property>
          <Property id="signature" :full-width="true">
            <template #name>
              <span style="padding-left: 16px;">Signature</span>
            </template>
            <template #value>
              <HexaValue :byteString="hexaFormat(s.signature)" :show-none="true"/>
              <div class="h-is-extra-text">{{ s.type }}</div>
            </template>
          </Property>
        </template>
      </template>

    </DashboardCardV2>

    <MirrorLink :network="props.network" entityUrl="schedules" :loc="scheduleId"/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref} from 'vue';
import {makeTypeLabel} from "@/utils/TransactionTools";
import AccountLink from "@/components/values/link/AccountLink.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import Property from "@/components/Property.vue";
import {routeManager} from "@/router"
import MirrorLink from "@/components/MirrorLink.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ScheduleByIdCache} from "@/utils/cache/ScheduleByIdCache.ts";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache.ts";
import KeyValue from "@/components/values/KeyValue.vue";
import TransactionLink from "@/components/values/TransactionLink.vue";
import {base64DecToArr, byteToHex} from "@/utils/B64Utils.ts";
import HexaValue from "@/components/values/HexaValue.vue";
import {proto} from "@hashgraph/proto";
import {loadingKey} from "@/AppKeys.ts";

const props = defineProps({
  scheduleId: String,
  network: String
})

const loading = inject(loadingKey, ref(false))

const notification = computed(() => {
  let result: string | null
  if (!loading.value && schedule.value === null) {
    result = "Schedule with ID " + props.scheduleId + " was not found"
  } else {
    result = null
  }
  return result
})

const formattedBody = computed(() => {
  let result: string | null
  const body = schedule.value?.transaction_body
  if (body) {
    const bodyBytes = base64DecToArr(body)
    result = JSON.stringify(proto.SchedulableTransactionBody.decode(bodyBytes))
  } else {
    result = null;
  }
  return result;
})

const hexaFormat = (b64encoding: string) => {
  return b64encoding ? byteToHex(base64DecToArr(b64encoding)) : null
}

const scheduleId = computed(() => props.scheduleId ?? null);
const scheduleLookup = ScheduleByIdCache.instance.makeLookup(scheduleId)
const schedule = scheduleLookup.entity
onMounted(() => scheduleLookup.mount())
onBeforeUnmount(() => scheduleLookup.unmount())

const scheduledTxTimestamp = computed(() => schedule.value?.executed_timestamp ?? null)
const scheduledTxLookup = TransactionByTsCache.instance.makeLookup(scheduledTxTimestamp)
const scheduledTx = scheduledTxLookup.entity
onMounted(() => scheduledTxLookup.mount())
onBeforeUnmount(() => scheduledTxLookup.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
