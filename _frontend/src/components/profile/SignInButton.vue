// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <button @click="handleSignIn">Sign In</button>

  <SignInDialog
      v-model:show-dialog="showSignInDialog"
  />
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import SignInDialog from "@/dialogs/profile/SignInDialog.vue";
import {ref} from "vue";

const showSignInDialog = ref(false)

const handleSignIn = async () => {
  showSignInDialog.value = true
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

button {
  appearance: none;
  color: var(--network-theme-color);
  cursor: pointer;
}

</style>

