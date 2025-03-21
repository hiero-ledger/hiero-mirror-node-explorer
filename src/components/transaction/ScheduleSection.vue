// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="props.transaction" collapsible-key="scheduleDetails">

    <template #title>
      Schedule
      <div
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
      <Property id="schedule-id" :full-width="true">
        <template v-slot:name>Schedule ID</template>
        <template v-slot:value>
          {{ scheduleId }}
        </template>
      </Property>
      <Property id="memo" :full-width="true">
        <template #name>Memo</template>
        <template #value>
          <BlobValue :base64="true" :blob-value="schedule?.memo" :show-none="true" :show-base64-as-extra="true"/>
        </template>
      </Property>
      <Property id="admin-key" :full-width="true">
        <template #name>Admin Key</template>
        <template #value>
          <KeyValue :key-bytes="schedule?.admin_key?.key" :key-type="schedule?.admin_key?._type" :show-none="true"/>
        </template>
      </Property>
      <Property id="payer-id" :full-width="true">
        <template #name>Payer Account</template>
        <template #value>
          <AccountLink :accountId="schedule?.payer_account_id" :show-extra="true"/>
        </template>
      </Property>
      <Property v-if="!schedule?.executed_timestamp" id="expiration-date" :full-width="true">
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
      <Property id="transaction-body" :full-width="true">
        <template #name>Transaction Body</template>
        <template #value>
          <BlobValue :blob-value="schedule?.transaction_body" :base64="false" :show-none="true"/>
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
            <BlobValue :show-none="true" :blob-value="s.public_key_prefix"/>
          </template>
        </Property>
        <Property id="signature" :full-width="true">
          <template #name>
            <span style="padding-left: 16px;">Signature</span>
          </template>
          <template #value>
            <BlobValue :show-none="true" :blob-value="s.signature"/>
          </template>
        </Property>
        <Property id="type" :full-width="true">
          <template #name>
            <span style="padding-left: 16px;">Type</span>
          </template>
          <template #value>{{ s.type }}</template>
        </Property>
      </template>
    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import Property from "@/components/Property.vue";
import {TransactionDetail} from "@/schemas/MirrorNodeSchemas";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ScheduleByIdCache} from "@/utils/cache/ScheduleByIdCache.ts";
import BlobValue from "@/components/values/BlobValue.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {routeManager} from "@/router.ts";
import {makeTypeLabel} from "@/utils/TransactionTools.ts";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache.ts";

const props = defineProps({
  transaction: {
    type: Object as PropType<TransactionDetail | null>,
    default: null
  }
})

const scheduleId = computed(() => props.transaction?.entity_id ?? null)
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

<style/>
