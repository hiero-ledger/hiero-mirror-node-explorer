// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link :to="targetRoute" custom v-slot="{href, navigate}">
    <a :href="href" @click="navigate">
      <UserRoundCheck v-if="isConnected" :size="16" class="profile-icon" :class="{ 'is-rimmed': isRimmed }"/>
      <UserRound v-else :size="16" class="profile-icon" :class="{ 'is-rimmed': isRimmed }"/>
    </a>
  </router-link>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import {routeManager} from "@/router.ts";
import {TabId} from "@/utils/RouteManager.ts";
import {UserRound, UserRoundCheck} from "lucide-vue-next";
import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";

const targetRoute = routeManager.makeRouteToProfile()
const isRimmed = computed(() => TabId.Profile === routeManager.currentTabId.value)

const profileController = ProfileController.inject()
const isConnected = computed(() => profileController.connectionStatus.value == ProfileConnectionStatus.Connected)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.profile-icon {
  color: var(--text-secondary);
  vertical-align: text-top;
}

.profile-icon.is-rimmed {
  color: var(--text-primary);
}

</style>
