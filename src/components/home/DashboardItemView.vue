// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="item-root">

    <slot/>

    <div class="item-content">
      <div class="item-l1">
        {{ title }}
      </div>

      <div v-if="props.value !== null" class="item-l2">
        <span class="item-value">{{ props.value }}</span>
        <span v-if="props.info" class="item-info">({{ props.info }}%)</span>
      </div>
      <div v-else class="none-value">None</div>
    </div>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";

const props = defineProps({
  title: String,
  value: String,
  info: String,
})

const title = computed(() => props.title?.toUpperCase())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.item-root {
  align-items: center;
  display: flex;
  gap: 16px;
}

div.item-content {
  display: flex;
  flex-direction: column;
}

div.item-l1 {
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  height: 16px;
}

div.item-l2 {
  align-items: baseline;
  display: flex;
  gap: 4px;
}

.item-value {
  color: var(--text-primary);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 26px;
}

.item-info {
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
}

.none-value {
  color: hsl(0, 0%, 48%) !important;
}

</style>
