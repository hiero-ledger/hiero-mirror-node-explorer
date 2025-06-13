// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link :to="targetRoute" custom v-slot="{href, navigate}">
    <a :href="href" @click="navigate" :class="{ 'is-rimmed': isRimmed }">
      Profile
      <Zap v-if="isConnected" :size="12" />
    </a>
  </router-link>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {Zap} from "lucide-vue-next";
import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";
import {TabId} from "@/router.ts";

const targetRoute = routeManager.makeRouteToProfile()
const isRimmed = computed(() => TabId.Profile === routeManager.currentTabId.value)

const profileController = ProfileController.inject()
const isConnected = computed(() => profileController.connectionStatus.value == ProfileConnectionStatus.Connected)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

a {
  align-items: center;
  color: var(--text-secondary);
  column-gap: 2px;
  display: flex;
  vertical-align: text-top;
}

a.is-rimmed {
  color: var(--text-primary);
}

</style>
