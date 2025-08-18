// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <button @click="handleSignIn">Sign In</button>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ProfileController} from "@/utils/profile/ProfileController.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const profileController = ProfileController.inject()

const handleSignIn = async () => {
  await profileController.connect("victor.hugo@laposte.net", "secret")
  await routeManager.routeToProfile(null)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

button {
  appearance: none;
  color: var(--network-theme-color);
  cursor: pointer;
}

</style>

