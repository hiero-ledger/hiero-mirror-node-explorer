// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link :to="targetRoute" custom v-slot="{href, navigate}">
    <a :href="href" @click="navigate" :class="{ 'is-rimmed': isRimmed }">
      <CircleUserRound :size="18" style="vertical-align: text-bottom"/>
    </a>
  </router-link>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import {routeManager} from "@/utils/RouteManager.ts";
import {CircleUserRound} from 'lucide-vue-next'
import {TabId} from "@/router.ts";

const targetRoute = routeManager.makeRouteToProfile()
const isRimmed = computed(() => TabId.Profile === routeManager.currentTabId.value)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

a {
  align-items: center;
  color: var(--text-secondary);
  column-gap: 2px;
}

a.is-rimmed {
  color: var(--text-primary);
}

</style>
