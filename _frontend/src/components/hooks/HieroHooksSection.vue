// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="accountId">

    <template #title>
      Hiero Hooks
    </template>

    <template #content>
      <Tabs
          :selected-tab="selectedTab"
          :tab-ids="tabIds"
          :tabLabels="tabLabels"
          @update:selected-tab="onUpdate($event)"
      />

      <div v-if="selectedTab === 'hooks'" id="hooks-table">
        <HieroHooksList :account-id="props.accountId"/>
      </div>

      <div v-else-if="selectedTab === 'storage'" id="hooks-storage-table">
        <HieroHookStorage :account-id="props.accountId"/>
      </div>
    </template>

  </DashboardCardV2>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {onBeforeMount, ref} from 'vue';
import Tabs from "@/components/Tabs.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import HieroHooksList from "@/components/hooks/HieroHooksList.vue";
import {useRoute, useRouter} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";
import HieroHookStorage from "@/components/hooks/HieroHookStorage.vue";

const props = defineProps({
  accountId: String,
})

const route = useRoute(); // Get the current route object
const router = useRouter(); // Router instance for navigation

const tabIds = ['hooks', 'storage']
const tabLabels = ['Hooks', 'Storage']
const selectedTab = ref<string | null>(AppStorage.getAccountHooksTab() ?? tabIds[0])

const onUpdate = (tab: string | null) => {
  selectedTab.value = tab
  AppStorage.setAccountHooksTab(tab)
}

onBeforeMount(() => {
  const tabQuery = route.query.subtab; // Access the `tab` query parameter
  console.log(`HieroHooksSection: tabQuery: ${JSON.stringify(tabQuery)}`)
  console.log(`HieroHooksSection: tabQuery: ${typeof tabQuery}`)

  if (tabQuery && typeof tabQuery === 'string') {
    onUpdate(tabQuery)
  }
  router.replace({
    path: route.path,
    query: {...route.query, tab: undefined}, // Remove 'tab' from the query parameters
  });
});
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
