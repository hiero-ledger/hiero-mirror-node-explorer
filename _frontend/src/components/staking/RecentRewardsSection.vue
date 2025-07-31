// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <RewardDownloadDialog
      v-if="accountId"
      v-model:show-dialog="showDownloadDialog"
      :account-id="accountId"
  />

  <DashboardCardV2 v-if="accountId">
    <template #title>
      <span>Recent Staking Rewards</span>
    </template>
    <template #right-control>
      <DownloadButton @click="showDownloadDialog = true"/>
    </template>
    <template #content>
      <StakingRewardsTable :controller="transactionTableController"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, onMounted, ref} from 'vue';
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import DownloadButton from "@/components/DownloadButton.vue";
import StakingRewardsTable from "@/components/staking/StakingRewardsTable.vue";
import {StakingRewardsTableController} from "@/components/staking/StakingRewardsTableController.ts";
import {AppStorage} from "@/AppStorage.ts";
import RewardDownloadDialog from "@/dialogs/download/RewardDownloadDialog.vue";
import {useRouter} from "vue-router";
import {walletManager} from "@/utils/RouteManager.ts";

const router = useRouter()
const showDownloadDialog = ref(false)
const accountId = walletManager.accountId

//
// Rewards Transactions Table Controller
//
const transactionTableController = new StakingRewardsTableController(
    router,
    accountId,
    5,
    AppStorage.STAKING_TABLE_PAGE_SIZE_KEY
)
onMounted(() => transactionTableController.mount())
onBeforeUnmount(() => transactionTableController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
