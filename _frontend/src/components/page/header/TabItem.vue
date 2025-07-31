// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link :to="props.targetRoute" custom v-slot="{href, navigate}">
    <a :class="{ 'is-rimmed': isRimmed }" :href="href" @click="navigate">{{ props.tabId }}</a>
  </router-link>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {RouteLocationRaw} from "vue-router";

import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  tabId: {
    type: String,
    required: true
  },
  targetRoute: {
    type: Object as PropType<RouteLocationRaw>,
    required: true
  },
})


const isRimmed = computed(
    () => props.tabId === routeManager.currentTabId.value)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

a {
  color: var(--text-secondary);
}

a.is-rimmed {
  color: var(--text-primary);
}

</style>
