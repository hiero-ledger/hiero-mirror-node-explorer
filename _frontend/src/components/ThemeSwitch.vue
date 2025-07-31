// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div @click="darkSelected = !darkSelected" :class="{'start': !darkSelected, 'end': darkSelected}">
    <img :src="imageURL" alt="theme switch"/>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import {ThemeController} from "@/components/ThemeController.ts";
import moonURL from "../assets/moon.svg"
import sunURL from "../assets/sun.svg"

const darkSelected = ThemeController.inject().darkSelected
const imageURL = computed(() => darkSelected.value ? moonURL : sunURL)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div {
  align-items: center;
  background: var(--text-secondary);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  height: 24px;
  padding: 4px;
  width: 40px;
}

div.start {
  justify-content: flex-start;
}

div.end {
  justify-content: flex-end;
}

img {
  height: 16px;
  width: 16px;
}

</style>
