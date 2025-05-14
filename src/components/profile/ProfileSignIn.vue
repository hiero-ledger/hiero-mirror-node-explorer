// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="profile">
    <p>Disconnected</p>
    <p>
      <TextFieldView v-model="emailText" placeholder="e-Mail" style="margin-bottom: 10px"/>
      <br/>
      <TextFieldView v-model="passwordText" placeholder="Password" type="password"/>
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
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ref} from "vue";
import TextFieldView from "@/elements/TextFieldView.vue";
import ButtonView from "@/elements/ButtonView.vue";
import ReCaptcha from "@/components/recaptcha/ReCaptcha.vue";
import {ProfileController} from "@/utils/profile/ProfileController.ts";

const profileController = ProfileController.inject()

const emailText = ref<string>("")
const passwordText = ref<string>("")

const recaptchaKey = computed(() => profileController.coreConfig.recaptchaKey)
const recaptchaToken = ref<string|null>(null)
const onCaptchaChange = (newToken: string) => {
  recaptchaToken.value = newToken
}

const connectEnabled = computed(() =>
    emailText.value !== ""
    && passwordText.value !== ""
    && (recaptchaKey.value === null || recaptchaToken.value !== null)
)

const handleConnect = async () => {
  await profileController.connect(emailText.value, passwordText.value, recaptchaToken.value!)
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
  font-weight: 300;
}

div p {
  margin-bottom: 20px
}

</style>
