// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <button class="download-button" data-cy="downloadButton">
    <img alt="Download" :src="downloadURL">
  </button>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ThemeController} from "@/components/ThemeController.ts";
import downloadDarkURL from "@/assets/download-dark.svg";
import downloadLightURL from "@/assets/download-light.svg";
import {computed} from "vue";

const darkSelected = ThemeController.inject().darkSelected
const downloadURL = computed(() => darkSelected.value ? downloadDarkURL : downloadLightURL)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

button.download-button {
  height: 24px;
}

</style>

