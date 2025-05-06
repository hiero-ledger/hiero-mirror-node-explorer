// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="tab-bar" :class="{'vertical': props.vertical}">

    <TabItem :tabId="TabId.Home"
             :target-route="routeManager.makeRouteToHome()"/>
    <TabItem :tabId="TabId.Transactions"
             :target-route="routeManager.makeRouteToTransactions()"/>
    <TabItem :tabId="TabId.Tokens"
             :target-route="routeManager.makeRouteToTokens()"/>
    <TabItem :tabId="TabId.Topics"
             :target-route="routeManager.makeRouteToTopics()"/>
    <TabItem :tabId="TabId.Contracts"
             :target-route="routeManager.makeRouteToContracts()"/>
    <TabItem :tabId="TabId.Accounts"
             :target-route="routeManager.makeRouteToAccounts()"/>
    <TabItem :tabId="TabId.Nodes"
             :target-route="routeManager.makeRouteToNodes()"/>
    <TabItem v-if="enableStaking"
             :tabId="TabId.Staking"
             :target-route="routeManager.makeRouteToStaking()"/>
    <TabItem :tabId="TabId.Blocks"
             :target-route="routeManager.makeRouteToBlocks()"/>
    <ProfileTabItem v-if="profileVisible"/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import {TabId} from "@/router.ts";
import {routeManager} from "@/utils/RouteManager.ts"
import TabItem from "@/components/page/header/TabItem.vue";
import ProfileTabItem from "@/components/page/header/ProfileTabItem.vue";
import {ProfileController} from "@/utils/profile/ProfileController.ts";

const props = defineProps({
  vertical: {
    type: Boolean,
    default: false
  }
})

const profileController = ProfileController.inject()

const enableStaking = routeManager.enableStaking
const profileVisible = computed(() => profileController.coreConfig.portalURL !== null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.tab-bar {
  align-items: baseline;
  column-gap: 16px;
  display: flex;
  font-family: var(--font-family-heading), sans-serif;
  font-size: 14px;
  font-weight: 400;
  height: 42px;
  justify-content: space-between;
  padding: 11px 20px;
  line-height: 19px;
}

div.vertical {
  align-items: flex-start;
  flex-direction: column;
  height: fit-content;
  row-gap: 8px;
  padding: 0;
}

</style>
