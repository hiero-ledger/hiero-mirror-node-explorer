// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Tabs
      :selected-tab="selectedTab"
      :tab-ids="tabIds"
      :tab-labels="tabLabels"
      @update:selected-tab="onSelectTab($event)"
  />

  <template v-if="selectedTab === 'bookmarks'">
    <ProfileBookmarks/>
  </template>

  <template v-else-if="selectedTab === 'settings'">
    <ProfileDetails/>
    <ProfileSettings/>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {Ref, ref} from "vue";
import Tabs from "@/components/Tabs.vue";
import ProfileDetails from "@/components/profile/ProfileDetails.vue";
import ProfileBookmarks from "@/components/profile/ProfileBookmarks.vue";
import ProfileSettings from "@/components/profile/ProfileSettings.vue";

const tabIds = ['bookmarks', 'settings']
const tabLabels = ['Bookmarks', 'Settings']
const selectedTab: Ref<string | null> = ref(tabIds[0])

const onSelectTab = (tab: string | null) => {
  selectedTab.value = tab
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>