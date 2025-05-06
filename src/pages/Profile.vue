/ SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Profile">

    <div class="profile">
      <template v-if="connectionStatus == ProfileConnectionStatus.Disconnected">
        <p>Disconnected</p>
        <ButtonView @action="profileController.connect('')">Connect</ButtonView>
      </template>
      <template v-else-if="connectionStatus == ProfileConnectionStatus.Connecting">
        <p>Connecting…</p>
      </template>
      <template v-else>
        <p>Connected</p>
        <ButtonView @action="profileController.disconnect()">Disconnect</ButtonView>
      </template>
    </div>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";
import ButtonView from "@/elements/ButtonView.vue";

const profileController = ProfileController.inject()
const connectionStatus = profileController.connectionStatus

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.profile {
  color: var(--text-secondary);
  min-height: 450px;
  text-align: center;
  padding-top: 100px;
  font-family: var(--font-family-proportional), sans-serif;
  font-weight: 300;;
}

</style>
