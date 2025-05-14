// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

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

    <template #left-content>

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

    <template #right-content>

      <Property id="ecdsa-account-id" full-width>
        <template #name>ECDSA Account ID</template>
        <template v-slot:value>
          <AccountLink :account-id="ecdsaAccountId"/>
        </template>
      </Property>

      <Property id="firstName" full-width>
        <template #name>ED25519 Account ID</template>
        <template v-slot:value>
          <AccountLink :account-id="ed25519AccountId"/>
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

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints.ts";
import ButtonView from "@/elements/ButtonView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import Property from "@/components/Property.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import StringValue from "@/components/values/StringValue.vue";
import {computed, ref} from "vue";
import {Portal} from "@/utils/profile/Portal.ts";

const profileController = ProfileController.inject()
const connectionStatus = profileController.connectionStatus

const email = computed(() => profileController.user.value?.email ?? null)
const firstName = computed(() => profileController.user.value?.profile?.firstName ?? null)
const lastName = computed(() => profileController.user.value?.profile?.lastName ?? null)
const ed25519AccountId = profileController.ed25519AccountId
const ecdsaAccountId = profileController.ecdsaAccountId


const bookmarks = profileController.bookmarks
const perPage = ref(15)

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
    const bookmark = await profileController.writeBookmark("testnet", "0.0.1584", newBookmark)
    console.log("bookmark = " + JSON.stringify(bookmark, null, "  "))
  } catch(error) {
    console.log("error=" + error)
  }
}

const handleRemoveBookmark = async () => {
  try {
    await profileController.clearBookmark("testnet", "0.0.1584")
  } catch(error) {
    console.log("error=" + error)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
