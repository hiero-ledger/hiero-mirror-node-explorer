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
      <template v-if="nbHooks > 0">
        <Tabs
            :selected-tab="selectedTab"
            :tab-ids="tabIds"
            :tabLabels="tabLabels"
            @update:selected-tab="onUpdate($event)"
        />

        <div v-if="selectedTab === 'hooks'" id="hooks-table">
          <HookList :account-id="props.accountId"/>
        </div>

        <div v-else-if="selectedTab === 'storage'" id="hooks-storage-table">
          <HookStorage :account-id="props.accountId"/>
        </div>
      </template>
      <template v-else>
        <DocSnippet
            doc-hint="See how to create and use hooks in the Hedera documentation"
            doc-url="https://docs.hedera.com/hedera/core-concepts"
        >
          <p>No hooks have been configured for this account.</p>
        </DocSnippet>
      </template>
    </template>

  </DashboardCardV2>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, onBeforeMount, onBeforeUnmount, onMounted, ref} from 'vue';
import Tabs from "@/components/Tabs.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import HookList from "@/components/hooks/HookList.vue";
import {useRoute, useRouter} from "vue-router";
import {AppStorage} from "@/AppStorage.ts";
import HookStorage from "@/components/hooks/HookStorage.vue";
import DocSnippet from "@/components/DocSnippet.vue";
import {HooksByAccountIdCache} from "@/utils/cache/HooksByAccountIdCache.ts";

const props = defineProps({
  accountId: String,
})

const route = useRoute(); // Get the current route object
const router = useRouter(); // Router instance for navigation

const tabIds = ['hooks', 'storage']
const tabLabels = ['Hooks', 'Storage']
const selectedTab = ref<string | null>(AppStorage.getAccountHooksTab() ?? tabIds[0])

const accountId = computed(() => props.accountId ?? null)
const hooksLookup = HooksByAccountIdCache.instance.makeLookup(accountId)
onMounted(() => hooksLookup.mount())
onBeforeUnmount(() => hooksLookup.unmount())
const nbHooks = computed(() => hooksLookup.entity.value?.length ?? 0)

const onUpdate = (tab: string | null) => {
  selectedTab.value = tab
  AppStorage.setAccountHooksTab(tab)
}

onBeforeMount(() => {
  const tabQuery = route.query.subtab; // Access the `tab` query parameter

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
