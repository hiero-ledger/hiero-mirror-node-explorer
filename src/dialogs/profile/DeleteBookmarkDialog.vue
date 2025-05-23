// SPDX-License-Identifier: Apache-2.0

<template>

  <TaskDialog
      :controller="controller"
      :report-success="false"
  >

    <!-- title -->
    <template #taskDialogTitle>Delete Bookmark</template>

    <template #taskExecuteLabel>DELETE</template>

    <template #taskDialogInput>
      <TaskPanel :mode="TaskPanelMode.none">
        <template #taskPanelMessage>Do you want to remove bookmark "{{ bookmark?.name }}" ?</template>
      </TaskPanel>
    </template>

  </TaskDialog>

</template>

<script setup lang="ts">

import {computed, PropType} from "vue";
import {routeManager} from "@/router.ts";
import TaskDialog from "@/dialogs/core/task/TaskDialog.vue";
import {ProfileController} from "@/utils/profile/ProfileController.ts";
import {TaskController} from "@/dialogs/core/task/TaskController.ts";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  entityId: {
    type: String as PropType<string|null>,
    default: null
  }
})

const profileController = ProfileController.inject()

const bookmark = computed(() => props.entityId !== null ?
    profileController.findBookmark(props.entityId) : null)

class DeleteBookmarkController extends TaskController {

  constructor() {
    super(showDialog)
  }

  canBeExecuted(): boolean {
    return bookmark.value !== null
  }

  async execute(): Promise<void> {
    const network = routeManager.currentNetwork.value
    await profileController.clearBookmark(network, props.entityId!)
  }
}

const controller = new DeleteBookmarkController()

</script>

<style scoped>

</style>
