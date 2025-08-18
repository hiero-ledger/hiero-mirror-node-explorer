// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TaskDialog :controller="controller">

    <!-- title -->
    <template #taskDialogTitle>Sign In</template>

    <!-- execute label -->
    <template #taskExecuteLabel>SIGN IN</template>

    <!-- input -->
    <template #taskDialogInput>

      <!-- Email -->
      <ContentCell>
        <template #cellTitle>e-mail</template>
        <template #cellContent>
          <TextFieldView v-model="emailInputText"
                         placeholder="email@example.com"
                         style="width: 100%"
          />
        </template>
      </ContentCell>
    </template>

  </TaskDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import TaskDialog from "@/dialogs/core/task/TaskDialog.vue";
import TextFieldView from "@/elements/TextFieldView.vue";
import ContentCell from "@/dialogs/core/ContentCell.vue";
import {SignInController} from "@/dialogs/profile/SignInController.ts";
import {ProfileController} from "@/utils/profile/ProfileController.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})
const profileController = ProfileController.inject()

const controller = new SignInController(showDialog, profileController, routeManager)
const emailInputText = controller.emailController.inputText

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
