/ SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2>
    <template #page-title>
      <span v-if="greeting">{{ greeting }}'s Profile</span>
      <span v-else>User Profile</span>
    </template>

    <template v-if="connectionStatus == ProfileConnectionStatus.Disconnected">
      <ProfileSignIn/>
    </template>

    <template v-else-if="connectionStatus == ProfileConnectionStatus.Connecting">
      <p>Connecting…</p>
    </template>

    <template v-else>
      <ProfileContent/>
    </template>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";
import ProfileContent from "@/components/profile/ProfileContent.vue";
import ProfileSignIn from "@/components/profile/ProfileSignIn.vue";
import {computed} from "vue";

const greeting = computed(() =>
    profileController.user.value?.profile?.firstName ?? profileController.user.value?.userId ?? null
)

const profileController = ProfileController.inject()
const connectionStatus = profileController.connectionStatus

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
