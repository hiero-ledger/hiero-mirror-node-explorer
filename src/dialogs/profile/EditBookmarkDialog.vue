// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TaskDialog
      :controller="controller"
  >

    <!-- title -->
    <template #taskDialogTitle>
      <template v-if="props.entityId">Edit Bookmark</template>
      <template v-else>New Bookmark</template>
    </template>

    <template #taskExecuteLabel>SAVE</template>

    <template #taskDialogInput>

      <!-- Entity ID -->
      <ContentCell>
        <template #cellTitle>{{ entityIdFieldTitle }}</template>
        <template #cellContent>
          <TextFieldView v-model="entityIdInputText"
                         :enabled="entityIdEditingEnabled"
                         placeholder="Entity ID (0.0.1234)"
                         style="width: 100%"
          />
        </template>
      </ContentCell>

      <!-- Name -->
      <ContentCell>
        <template #cellTitle>Name</template>
        <template #cellContent>
          <TextFieldView v-model="nameInputText"
                         placeholder="My nice entity"
                         style="width: 100%"
          />
        </template>
      </ContentCell>

      <div style="width: 100%; height: 2px; background: var(--background-secondary); margin-top:14px"/>

      <!-- Type -->
      <ContentCell>
        <template #cellTitle>Type</template>
        <template #cellContent>
          <TextFieldView v-model="typeInputText"
                         placeholder="Exchange, Committee…"
                         style="width: 100%"
          />
        </template>
      </ContentCell>

      <!-- Description -->
      <ContentCell>
        <template #cellTitle>Description</template>
        <template #cellContent>
          <TextFieldView v-model="descriptionInputText"
                         placeholder="Nice description"
                         style="width: 100%"
          />
        </template>
      </ContentCell>

      <!-- Website -->
      <ContentCell>
        <template #cellTitle>Website</template>
        <template #cellContent>
          <TextFieldView v-model="websiteInputText"
                         placeholder="https://example.com"
                         style="width: 100%"
          />
        </template>
      </ContentCell>

    </template>

    <!-- feedback message -->

    <template #taskDialogControls>{{ feedbackMessage ?? "" }}</template>

  </TaskDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import TaskDialog from "@/dialogs/core/task/TaskDialog.vue";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {EditBookmarkController} from "@/dialogs/profile/EditBookmarkController.ts";
import TextFieldView from "@/elements/TextFieldView.vue";
import ContentCell from "@/dialogs/core/ContentCell.vue";
import {ProfileController} from "@/utils/profile/ProfileController.ts";
import {EntityReportType} from "@/utils/analyzer/EntityAnalyzer.ts";

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

const networkConfig = NetworkConfig.inject()
const profileController = ProfileController.inject()
const controller = new EditBookmarkController(
    showDialog,
    networkConfig,
    profileController,
    computed(() => props.entityId))

const entityIdInputText = controller.entityIdInputText
const nameInputText = controller.nameInputText
const typeInputText = controller.typeInputText
const descriptionInputText = controller.descriptionInputText
const websiteInputText = controller.websiteInputText

const feedbackMessage = controller.feedbackMessage

const entityIdEditingEnabled = computed(() => props.entityId === null)

const entityIdFieldTitle = computed(() => {
  let result: string
  switch(controller.entityReportType.value) {
    case EntityReportType.Account:
      result = "Account ID"
      break
    case EntityReportType.Contract:
      result = "Contract ID"
      break
    case EntityReportType.Topic:
      result = "Topic ID"
      break
    case EntityReportType.Token:
      result = "Token ID"
      break
    default:
      result = "Entity ID"
      break
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
