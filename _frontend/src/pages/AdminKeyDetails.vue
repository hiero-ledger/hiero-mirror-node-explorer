// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 :page-title="pageTitle">

    <template v-if="notification" #banner>
      <NotificationBanner :message="notification"/>
    </template>

    <DashboardCardV2>
      <template #title>
        <span>Admin Key for Account </span>
        <div v-if="normalizedAccountId">
          <AccountLink id="accountId" :account-id="normalizedAccountId">
            {{ normalizedAccountId }}
          </AccountLink>
          <span v-if="accountChecksum" class="h-is-low-contrast">-{{ accountChecksum }}</span>
        </div>
      </template>

      <template #content>
        <KeyValue
            v-if="normalizedAccountId"
            :in-details-page="true"
            :key-bytes="key?.key"
            :key-type="key?._type"
            :show-none="true"
        />
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import AccountLink from "@/components/values/link/AccountLink.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import NotificationBanner from "@/components/NotificationBanner.vue";
import {NetworkConfig} from "@/config/NetworkConfig";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

const props = defineProps({
  accountId: String,
  network: String
})

const networkConfig = NetworkConfig.inject()

//
// account
//

const accountLocator = computed(() => props.accountId ?? null)
const accountLocParser = new AccountLocParser(accountLocator, networkConfig)
onMounted(() => accountLocParser.mount())
onBeforeUnmount(() => accountLocParser.unmount())

const notification = accountLocParser.errorNotification
const normalizedAccountId = accountLocParser.accountId
const accountChecksum = accountLocParser.accountChecksum
const key = accountLocParser.key

const pageTitle = computed(() =>
    normalizedAccountId.value !== null ? "Admin Key for Account " + normalizedAccountId.value : null
)
</script>

<style/>
