// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                 -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="snippet-root">
    <img src="@/assets/header-background.svg" class="snippet-logo" alt=""/>
    <div class="snippet-text">
      <slot/>
      <p v-if="props.docHint && props.docUrl">
        <span>{{ `${props.docHint} ` }}</span>
        <a
            :href="props.docUrl"
            target="_blank"
            class="h-is-extra-text"
        >here</a>
        <span>.</span>
      </p>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";

const props = defineProps({
  docHint: {
    type: String as PropType<string | null>,
    default: null
  },
  docUrl: {
    type: String as PropType<string | null>,
    default: null
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.snippet-root {
  align-self: center;
  align-items: center;
  border: 1px solid var(--border-secondary);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  height: fit-content;
  width: fit-content;
  justify-content: center;
  padding: 0 12px 12px;
}

@media (min-width: 768px) {
  .snippet-root {
    padding: 12px 24px 24px;
  }
}

.snippet-logo {
  height: 100px;
  width: 100px;
}

.snippet-text {
  display: flex;
  flex-direction: column;
  font-weight: 500;
  gap: 12px;
  text-align: center;
}

</style>
