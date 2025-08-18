// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Profile Overview
    </template>

    <template #right-control>
      <ButtonView
          id="sign-off-button"
          :size="ButtonSize.small"
          @action="handleSignOut"
      >
        SIGN OUT
      </ButtonView>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import {ProfileController} from "@/utils/profile/ProfileController.ts";
import ButtonView from "@/elements/ButtonView.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const profileController = ProfileController.inject()

const handleSignOut = async () => {
  await routeManager.routeToHome(null)
  await profileController.disconnect()
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
