// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

    <template #title>
      User Details
    </template>

    <template #right-control>
      <ButtonView
          id="disconnect-profile-button"
          :enabled="connectionStatus == ProfileConnectionStatus.Connected"
          :size="ButtonSize.small"
          @action="profileController.disconnect()"
      >
        <span>SIGN OUT</span>
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
        <template #name>ECDSA Account</template>
        <template v-slot:value>
          <AccountLink :account-id="ecdsaAccountId"/>
        </template>
      </Property>

      <Property id="firstName" full-width>
        <template #name>ED25519 Account</template>
        <template v-slot:value>
          <AccountLink :account-id="ed25519AccountId"/>
        </template>
      </Property>

    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ProfileConnectionStatus, ProfileController} from "@/utils/profile/ProfileController.ts";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import ButtonView from "@/elements/ButtonView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import Property from "@/components/Property.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import StringValue from "@/components/values/StringValue.vue";
import {computed} from "vue";

const profileController = ProfileController.inject()
const connectionStatus = profileController.connectionStatus

const email = computed(() => profileController.user.value?.email ?? null)
const firstName = computed(() => profileController.user.value?.profile?.firstName ?? null)
const lastName = computed(() => profileController.user.value?.profile?.lastName ?? null)
const ed25519AccountId = profileController.ed25519AccountId
const ecdsaAccountId = profileController.ecdsaAccountId

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
