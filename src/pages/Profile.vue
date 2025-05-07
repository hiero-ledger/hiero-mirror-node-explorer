/ SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Profile">

    <div class="profile">
      <template v-if="connectionStatus == ProfileConnectionStatus.Disconnected">
        <p>Disconnected</p>
        <p>
          <TextFieldView v-model="passwordText" placeholder="Password"/>
        </p>
        <p>
          <ButtonView @action="handleConnect" :enabled="connectEnabled">Connect</ButtonView>
        </p>
        <p>
          <ReCaptcha v-if="recaptchaKey !== null"
              style="display: inline-block"
              action="connect"
              :site-key="recaptchaKey"
              @on-captcha-change="onCaptchaChange"/>
        </p>
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

import {computed, ref} from "vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";
import ButtonView from "@/elements/ButtonView.vue";
import TextFieldView from "@/elements/TextFieldView.vue";
import ReCaptcha from "@/components/recaptcha/ReCaptcha.vue";

const profileController = ProfileController.inject()
const connectionStatus = profileController.connectionStatus

const passwordText = ref<string>("")

const recaptchaKey = computed(() => profileController.coreConfig.recaptchaKey)
const recaptchaToken = ref<string|null>(null)
const onCaptchaChange = (newToken: string) => {
  recaptchaToken.value = newToken
}

const connectEnabled = computed(() =>
    passwordText.value !== ""
    && (recaptchaKey.value === null || recaptchaToken.value !== null)
)


const handleConnect = async () => {
  await profileController.connect(passwordText.value)
}

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
