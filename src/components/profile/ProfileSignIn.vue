// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="sign-in-root">
    <div class="sign-in-line1">Connection to HashScan Backend</div>
    <div class="sign-in-line2">If you have an account on Hedera Portal, you may use it to connect and benefit from additional features like entity bookmarks.</div>
    <div class="sign-in-form">
      <TextFieldView v-model="emailText" placeholder="e-Mail"/>
      <TextFieldView v-model="passwordText" placeholder="Password" type="password"/>
      <ReCaptcha v-if="recaptchaKey !== null"
                 style="display: inline-block"
                 action="connect"
                 :site-key="recaptchaKey"
                 @on-captcha-change="onCaptchaChange"/>
    </div>
    <div class="sign-in-bottom-line">
      <ButtonView @action="handleConnect" :enabled="connectEnabled" :is-default="true">CONNECT</ButtonView>
    </div>
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

div.sign-in-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 30px;
}

div.sign-in-line1 {
  color: var(--text-primary);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 32px;
  font-weight: 400;
  margin-top:60px;
}

div.sign-in-line2 {
  color: var(--text-secondary);
  font-family: var(--font-family-proportional), sans-serif;
  font-size: 16px;
  font-weight: 400;
  max-width: 450px;
  text-align: center;
}

div.sign-in-form {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  row-gap: 20px;
}

div.sign-in-bottom-line {
  padding-top: 20px;
  padding-bottom: 20px;
}

</style>
