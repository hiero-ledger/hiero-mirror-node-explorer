/ SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Profile">

    <template v-if="connectionStatus == ProfileConnectionStatus.Disconnected">
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

    <template v-else-if="connectionStatus == ProfileConnectionStatus.Connecting">
      <p>Connecting…</p>
    </template>

    <template v-else>

      <DashboardCardV2 collapsible-key="profileDetails">

        <template #title>
          Profile
        </template>

        <template #right-control>
          <ButtonView
              id="disconnect-profile-button"
              :enabled="connectionStatus == ProfileConnectionStatus.Connected"
              :size="ButtonSize.small"
              @action="profileController.disconnect()"
          >
            <span>DISCONNECT</span>
          </ButtonView>
        </template>

        <template #content>

          <Property id="firstName" full-width>
            <template #name>e-Mail</template>
            <template v-slot:value>
              <StringValue :string-value="email"/>
            </template>
          </Property>

          <Property id="firstName" full-width>
            <template #name>First Name</template>
            <template v-slot:value>
              <StringValue :string-value="firstName"/>
            </template>
          </Property>

          <Property id="firstName" full-width>
            <template #name>Last Name</template>
            <template v-slot:value>
              <StringValue :string-value="lastName"/>
            </template>
          </Property>


        </template>

      </DashboardCardV2>

      <DashboardCardV2 collapsible-key="bookmarks">

        <template #title>
          Bookmarks
        </template>

        <template #right-control>
          <ButtonView
              id="add-bookmark-button"
              :enabled="connectionStatus == ProfileConnectionStatus.Connected"
              :size="ButtonSize.small"
              @action="handleAddBookmark"
          >
            <span>NEW BOOKMARK</span>
          </ButtonView>
        </template>

        <template #content>

          <o-table
              :data="bookmarks"
              :hoverable="true"
              :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
              :narrowed="true"
              :paginated="bookmarks.length > perPage"
              pagination-order="centered"
              :range-before="1"
              :range-after="1"

              :per-page="perPage"
              :striped="true"
              aria-current-label="Current page"

              aria-next-label="Next page"
              aria-page-label="Page"
              aria-previous-label="Previous page"
              customRowKey="contract_id"
          >

            <o-table-column v-slot="props" field="name" label="NAME">
              <StringValue :string-value="props.row.name"/>
            </o-table-column>

            <o-table-column v-slot="props" field="entityId" label="ID">
              <StringValue :string-value="props.row.entityId"/>
            </o-table-column>

            <o-table-column v-slot="props" field="entityType" label="ENTITY">
              <StringValue :string-value="props.row.entityType"/>
            </o-table-column>

            <o-table-column v-slot="props" field="entityType" label="TYPE">
              <StringValue :string-value="props.row.type"/>
            </o-table-column>

            <o-table-column v-slot="props" field="website" label="WEB SITE">
              <StringValue :string-value="props.row.website"/>
            </o-table-column>

          </o-table>

        </template>

      </DashboardCardV2>

    </template>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onMounted, ref, watch} from "vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";
import ButtonView from "@/elements/ButtonView.vue";
import TextFieldView from "@/elements/TextFieldView.vue";
import ReCaptcha from "@/components/recaptcha/ReCaptcha.vue";
import {Portal} from "@/utils/profile/Portal.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import Property from "@/components/Property.vue";
import StringValue from "@/components/values/StringValue.vue";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints.ts";
import {routeManager} from "@/router.ts";

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

const email = computed(() => profileController.user.value?.email ?? null)
const firstName = computed(() => profileController.user.value?.profile?.firstName ?? null)
const lastName = computed(() => profileController.user.value?.profile?.lastName ?? null)

const DEFAULT_PAGE_SIZE = 15
const perPage = ref(DEFAULT_PAGE_SIZE)

const bookmarks = ref<Portal.EntityBookmark[]>([])
const updateBookmark = async () => {
  const network = routeManager.currentNetwork.value
  bookmarks.value = await profileController.portalClient?.listEntityBookmarks(network) ?? []
}
onMounted(() => {
  watch([routeManager.currentNetwork, profileController.session], updateBookmark, { immediate: true})
})

const handleConnect = async () => {
  await profileController.connect(emailText.value, passwordText.value, recaptchaToken.value!)
}

const handleAddBookmark = async () => {
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

const handleRemoveBookmark = async () => {
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
  font-weight: 300;
}

div p {
  margin-bottom: 20px
}

</style>
