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
          <TextFieldView v-model="emailText" placeholder="e-Mail"/>
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
      </template>
      <template v-else-if="connectionStatus == ProfileConnectionStatus.Connecting">
        <p>Connecting…</p>
      </template>
      <template v-else>
        <p>Connected</p>
        <p>
          <ButtonView @action="handleAdd">Add Bookmark to 0.0.1584</ButtonView>
          <br/>
          <ButtonView @action="handleRemove">Remove Bookmark from 0.0.1584</ButtonView>
          <br/>
          <ButtonView @action="profileController.disconnect()">Disconnect</ButtonView>
        </p>
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
import {Portal} from "@/utils/profile/Portal.ts";

const profileController = ProfileController.inject()
const connectionStatus = profileController.connectionStatus

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

const handleAdd = async () => {
  const newBookmark: Portal.NewEntityBookmark = {
    name: "Testnet ECDSA",
    type: null,
    description: "My testnet account with ECDSA key",
    website: null,
    networkEpoch: "1746726609.785794442",
    entityType: "account",
    publicKey: "0x302d300706052b8104000a03220003d236ba45caea9dd8053b6b0db1953564a4d06c9fb7dbf93bec499e6362b5b45f"
  }
  try {
    const bookmark = await profileController.portalClient?.writeBookmark("testnet", "0.0.1584", newBookmark)
    console.log("bookmark = " + JSON.stringify(bookmark, null, "  "))
  } catch(error) {
    console.log("error=" + error)
  }
}

const handleRemove = async () => {
  try {
    await profileController.portalClient?.clearBookmark("testnet", "0.0.1584")
  } catch(error) {
    console.log("error=" + error)
  }
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
