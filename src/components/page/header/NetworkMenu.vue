// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="network-menu" data-cy="network-menu">
    <div v-for="network in networkEntries" :key="network.name" class="menu-item">
      <Check :style="{'visibility': selectedNetwork === network.name ? 'visible' : 'hidden'}" :size="14"/>
      <span @click="selectedNetwork=network.name" class="network-name">{{ network.displayName }}</span>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ref, watch} from "vue";
import {routeManager} from "@/router.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {Check} from 'lucide-vue-next';

const networkEntries = NetworkConfig.inject().entries

const selectedNetwork = ref(routeManager.currentNetwork.value)
watch(routeManager.currentNetwork, (newNetwork) => {
  selectedNetwork.value = newNetwork // Checked : does not trigger any watch when value is unchanged
})
watch(selectedNetwork, (newNetwork) => {
  if (newNetwork !== routeManager.currentNetwork.value) {
    routeManager.routeToMainDashboard(newNetwork)
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.network-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

div.menu-item {
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: 4px;
}

</style>
