// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Accounts">

    <DashboardCardV2>
      <template #title>
        <span>Recent Accounts</span>
      </template>
      <template #left-control>
        <PlayPauseButton :controller="accountTableController"/>
      </template>
      <template #content>
        <AccountTable :controller="accountTableController"/>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, onBeforeUnmount, onMounted} from 'vue';
import AccountTable from "@/components/account/AccountTable.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {AccountTableController} from "@/components/account/AccountTableController";
import {useRouter} from "vue-router";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";

defineProps({
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)

//
// AccountTableController
//
const defaultPageSize = isMediumScreen ? 15 : 10
const accountTableController = new AccountTableController(useRouter(), defaultPageSize)
onMounted(() => accountTableController.mount())
onBeforeUnmount(() => accountTableController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
