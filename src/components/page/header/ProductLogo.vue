// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link v-if="isXLargeScreen" :to="routeManager.makeRouteToMainDashboard()">
    <img alt="Product Logo" :src="productLogoURL"/>
  </router-link>
  <router-link v-else-if="productMiniLogoURL !== null" :to="routeManager.makeRouteToMainDashboard()">
    <img class="mini-logo" alt="Product Logo" :src="productMiniLogoURL"/>
  </router-link>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {routeManager} from "@/router.ts"
import {ThemeController} from "@/components/ThemeController.ts";
import {inject} from "vue";

const productLogoURL = ThemeController.inject().productLogoURL
const productMiniLogoURL = ThemeController.inject().productMiniLogoURL
const isXLargeScreen = inject('isXLargeScreen', true)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

img {
  height: auto;
  max-width: 130px;
}

img.mini-logo {
  max-width: 32px;
}

</style>
