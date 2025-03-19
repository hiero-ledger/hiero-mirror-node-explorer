// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <DropdownPanel v-model:deployed="showMobileMenu" :right-aligned="false">
    <template #button>
      <Menu :size="18" style="color: var(--text-primary)" @click="showMobileMenu = !showMobileMenu"
            data-cy="mobile-menu-icon"/>
    </template>

    <template #panel>
      <div class="menu" data-cy="mobile-menu-content">
        <div class="menu-l1">
          <ThemeSwitch/>
          <X :size="18" style="color: var(--text-primary)" @click="showMobileMenu = false"
             data-cy="mobile-menu-close-icon"/>
        </div>
        <div class="menu-items">
          <TabBar vertical/>
        </div>
        <div v-if="showNetworkSelector" class="network-selector">
          <NetworkSelector/>
        </div>
        <template v-else>
          <NetworkMenu/>
        </template>
      </div>
    </template>
  </DropdownPanel>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {Menu, X} from 'lucide-vue-next';
import DropdownPanel from "@/components/DropdownPanel.vue";
import {computed, ref, watch} from "vue";
import TabBar from "@/components/page/header/TabBar.vue";
import NetworkSelector from "@/components/page/header/NetworkSelector.vue";
import ThemeSwitch from "@/components/ThemeSwitch.vue";
import {routeManager} from "@/router.ts";
import NetworkMenu from "@/components/page/header/NetworkMenu.vue";

const MAX_ITEMS_IN_NETWORK_MENU = 5

const showMobileMenu = ref(false)

watch(routeManager.currentNetwork, () => {
  showMobileMenu.value = false
})

const showNetworkSelector = computed(() => routeManager.nbNetworks.value > MAX_ITEMS_IN_NETWORK_MENU)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.menu {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: stretch;
}

div.menu-l1 {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-left: 8px;
  width: 100%;
}

.menu-items {
  padding-left: 18px;
  padding-right: 18px;
}

.network-selector {
  padding-left: 10px;
}

</style>
