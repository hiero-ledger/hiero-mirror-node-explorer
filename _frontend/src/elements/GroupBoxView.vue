// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="group-box">
    <div v-if="slots.groupBoxTitle" class="group-box-title">
      <slot name="groupBoxTitle"/>
    </div>
    <div class="group-box-content">
      <slot/>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {useSlots} from "vue";

const slots = useSlots()

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.group-box {
  align-items: stretch;
  background-color: var(--background-primary);
  border-color: var(--table-border);
  border-radius: 16px;
  border-style: solid;
  border-width: 1px;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  padding: 16px;
  row-gap: 8px;
}

div.group-box-title {
  display: flex;
  align-items: center;
  column-gap: 8px;
  color: var(--text-secondary);
  font-family: var(--font-family-proportional), sans-serif;
  font-weight: 400;
  font-size: 12px;
}

div.group-box-content {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  row-gap: 2px;
}

</style>
