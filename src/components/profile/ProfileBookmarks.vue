// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

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
          row-key="entityId"
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

        <o-table-column v-slot="props" field="type" label="TYPE">
          <StringValue :string-value="props.row.bookmarkType"/>
        </o-table-column>

        <o-table-column v-slot="props" field="description" label="DESCRIPTION">
          <StringValue :string-value="props.row.description"/>
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
import StringValue from "@/components/values/StringValue.vue";
import {ref} from "vue";
import {Portal} from "@/utils/profile/Portal.ts";
import {Pencil, Trash2} from 'lucide-vue-next';
import EditBookmarkDialog from "@/dialogs/profile/EditBookmarkDialog.vue";
import DeleteBookmarkDialog from "@/dialogs/profile/DeleteBookmarkDialog.vue";
import {RouteLocationRaw} from "vue-router";
import EntityLink from "@/components/values/link/EntityLink.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const profileController = ProfileController.inject()
const connectionStatus = profileController.connectionStatus

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
