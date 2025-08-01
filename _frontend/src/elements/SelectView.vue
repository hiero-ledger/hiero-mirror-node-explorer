// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <select
      v-model="selected"
      :style="{ 'width': width }"
      :class="{ 'border-visible': props.borderVisible, 'small': props.small, 'dark-mode': darkSelected }"
  >
    <slot/>
  </select>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ThemeController} from "@/components/ThemeController.ts";

const props = defineProps({
  borderVisible: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: "auto"
  },
  small: {
    type: Boolean,
    default: false
  }
})
const selected = defineModel()
const darkSelected = ThemeController.inject().darkSelected

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

select {
  appearance: none;
  background-color: transparent;
  background-image: url("@/assets/chevron-down-light.svg");
  background-position: calc(100% - 6px);
  background-repeat: no-repeat;
  border-width: 0;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 400;
  height: 40px;
  outline: none;
  padding: 0 24px 0 8px;
}

select.dark-mode {
  background-image: url("@/assets/chevron-down-dark.svg");
}

select.border-visible {
  border-color: var(--text-secondary);
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
}

select.small {
  font-size: 10px;
  font-weight: 400;
  height: 28px;
  line-height: 11px;
}

</style>
