// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <router-link v-if="isXLargeScreen" :to="routeManager.makeRouteToHome()">
    <img alt="Product Logo" :src="productLogoURL"/>
  </router-link>
  <router-link v-else-if="productMiniLogoURL !== null" :to="routeManager.makeRouteToHome()">
    <img class="mini-logo" alt="Product Logo" :src="productMiniLogoURL"/>
  </router-link>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ThemeController} from "@/components/ThemeController.ts";
import {inject} from "vue";
import {routeManager} from "@/utils/RouteManager.ts";

const productLogoURL = ThemeController.inject().productLogoURL
const productMiniLogoURL = ThemeController.inject().productMiniLogoURL
const isXLargeScreen = inject('isXLargeScreen', true)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

img {
  display: block;
  height: auto;
  max-width: 130px;
}

img.mini-logo {
  max-width: 32px;
}

</style>
