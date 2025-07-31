// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="props.direction == 'vertical'">
    <div
        style="display: flex; flex-direction: column; align-items: flex-start; justify-content: stretch; row-gap: 4px; width: 100%;">
      <div class="cellTitle">
        <slot name="cellTitle"/>
      </div>
      <slot name="cellContent"/>
    </div>
  </template>

  <template v-else> <!-- horizontal -->
    <div style="display: flex; align-items: center; justify-content: space-between; column-gap: 4px; width: 100%">
      <div class="cellTitle">
        <slot name="cellTitle"/>
      </div>
      <slot name="cellContent"/>
    </div>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";

const props = defineProps({
  direction: {
    type: String as PropType<"vertical" | "horizontal">,
    default: "vertical"
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.cellTitle {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 400;
}

</style>
