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

      <!-- Password -->
      <ContentCell>
        <template #cellTitle>Password</template>
        <template #cellContent>
          <TextFieldView v-model="passwordInputText"
                         :password="true"
                         style="width: 100%"
          />
        </template>
      </ContentCell>

    </template>

    <!-- error -->
    <template #taskDialogError>
      <TaskPanel :mode="TaskPanelMode.error">
        <template #taskPanelMessage>Authentication failed</template>
        <template #taskPanelExtra1>Check you email or password</template>
      </TaskPanel>
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
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})
const profileController = ProfileController.inject()

const controller = new SignInController(showDialog, profileController, routeManager)
const emailInputText = controller.emailController.inputText
const passwordInputText = controller.passwordController.inputText

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
