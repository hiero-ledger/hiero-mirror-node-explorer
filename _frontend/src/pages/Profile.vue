/ SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      <span v-if="greeting">{{ greeting }}'s Profile</span>
      <span v-else>User Profile</span>
    </template>

    <template #left-toolbar>
      <Tabs
          :tab-ids="tabIds"
          :tab-labels="tabLabels"
          :selected-tab="selectedTabId"
          @update:selected-tab="onUpdate($event)"
      />
    </template>

    <router-view/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {ProfileController} from "@/utils/profile/ProfileController.ts";
import Tabs from "@/components/Tabs.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const greeting = computed(() =>
    profileController.currentUser.value?.profile?.firstName ?? profileController.currentUser.value?.email ?? null
)

const profileController = ProfileController.inject()

const tabIds = routeManager.profileOperator.tabIds
const tabLabels = routeManager.profileOperator.tabLabels
const selectedTabId = routeManager.profileOperator.selectedTabId

const onUpdate = (tabId: string | null) => {
  if (tabId !== null) {
    routeManager.routeToProfile(tabId, true)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
