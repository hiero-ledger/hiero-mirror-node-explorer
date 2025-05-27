// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 collapsible-key="profileDetails">

    <template #title>
      Details
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

  <DashboardCardV2 collapsible-key="bookmarks">

    <template #title>
      Bookmarks
    </template>

    <template #right-control>
      <ButtonView
          id="add-bookmark-button"
          :enabled="connectionStatus == ProfileConnectionStatus.Connected"
          :size="ButtonSize.small"
          @action="handleEditBookmark(null)"
      >
        <span>NEW BOOKMARK</span>
      </ButtonView>
    </template>

    <template #content>

      <o-table
          class="bookmark-table"
          :data="bookmarks"
          :mobile-breakpoint="ORUGA_MOBILE_BREAKPOINT"
          :narrowed="true"
          :paginated="bookmarks.length > perPage"
          pagination-order="centered"
          :per-page="perPage"
          :striped="true"
          row-key="contract_id"
      >

        <o-table-column v-slot="props" field="name" label="NAME">
          <EntityLink :route="selectRoute(props.row.entityId, props.row.entityType)">
            <StringValue :string-value="props.row.name"/>
          </EntityLink>
        </o-table-column>

        <o-table-column v-slot="props" field="entityId" label="ID">
          <EntityLink :route="selectRoute(props.row.entityId, props.row.entityType)">
            <StringValue :string-value="props.row.entityId"/>
          </EntityLink>
        </o-table-column>

        <o-table-column v-slot="props" field="entityType" label="ENTITY">
          <StringValue :string-value="props.row.entityType"/>
        </o-table-column>

        <o-table-column v-slot="props" field="entityType" label="TYPE">
          <StringValue :string-value="props.row.type"/>
        </o-table-column>

        <o-table-column v-slot="props" field="website" label="WEB SITE">
          <BlobValue :blob-value="props.row.website"/>
        </o-table-column>

        <o-table-column v-slot="props" position="right" label="">
          <div style="display: inline-flex; flex-direction: row-reverse; column-gap: 8px">
            <Trash2 :size="16" style="color: var(--text-secondary)" @click="handleDeleteBookmark(props.row)"/>
            <Pencil :size="16" style="color: var(--text-secondary)" @click="handleEditBookmark(props.row)"/>
          </div>
        </o-table-column>

      </o-table>

    </template>

  </DashboardCardV2>

  <EditBookmarkDialog
      v-model:show-dialog="showEditBookmarkDialog"
      :entity-id="bookmarkTargetEntityId"
  />
  <DeleteBookmarkDialog
      v-model:show-dialog="showDeleteBookmarkDialog"
      :entity-id="bookmarkTargetEntityId"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {OTable, OTableColumn} from "@oruga-ui/oruga-next";
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
import {Pencil, Trash2} from 'lucide-vue-next';
import EditBookmarkDialog from "@/dialogs/profile/EditBookmarkDialog.vue";
import DeleteBookmarkDialog from "@/dialogs/profile/DeleteBookmarkDialog.vue";
import {RouteLocationRaw} from "vue-router";
import {routeManager} from "@/router.ts";
import EntityLink from "@/components/values/link/EntityLink.vue";
import BlobValue from "@/components/values/BlobValue.vue";

const profileController = ProfileController.inject()
const connectionStatus = profileController.connectionStatus

const email = computed(() => profileController.user.value?.email ?? null)
const firstName = computed(() => profileController.user.value?.profile?.firstName ?? null)
const lastName = computed(() => profileController.user.value?.profile?.lastName ?? null)
const ed25519AccountId = profileController.ed25519AccountId
const ecdsaAccountId = profileController.ecdsaAccountId


const bookmarks = profileController.bookmarks
const perPage = ref(15)

const showEditBookmarkDialog = ref(false)
const showDeleteBookmarkDialog = ref(false)
const bookmarkTargetEntityId = ref<string | null>(null)

const selectRoute = (entityId: string, type: string) => {
  let result: RouteLocationRaw | null
  switch (type) {
    case 'account':
      result = routeManager.makeRouteToAccount(entityId)
      break
    case 'contract':
      result = routeManager.makeRouteToContract(entityId)
      break
    case 'token':
      result = routeManager.makeRouteToToken(entityId)
      break
    case 'topic':
      result = routeManager.makeRouteToTopic(entityId)
      break
    default:
      result = null
  }
  return result
}

const handleEditBookmark = (bookmark: Portal.EntityBookmark | null) => {
  bookmarkTargetEntityId.value = bookmark?.entityId ?? null
  showEditBookmarkDialog.value = true
}

const handleDeleteBookmark = async (bookmark: Portal.EntityBookmark) => {
  bookmarkTargetEntityId.value = bookmark?.entityId ?? null
  showDeleteBookmarkDialog.value = true
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>

table.o-table.bookmark-table > tbody > tr {
  cursor: default;
}

</style>
