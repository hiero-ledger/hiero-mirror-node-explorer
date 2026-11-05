// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="bar">
    <div :class="['fill', props.level]" :style="{width: percent + '%'}"/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";

const props = defineProps({
  value: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  level: {
    type: String as PropType<"" | "info" | "warn" | "bad">,
    default: ""
  }
})

const percent = computed(() => props.max > 0 ? Math.max(0, Math.min(100, props.value / props.max * 100)) : 0)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.bar {
  background-color: var(--table-border, rgba(128, 128, 128, 0.25));
  border-radius: 2px;
  height: 4px;
  margin-top: 4px;
  min-width: 60px;
  overflow: hidden;
}

div.fill {
  background-color: var(--text-success);
  height: 100%;
}

div.fill.info {
  background-color: var(--text-secondary);
}

div.fill.warn {
  background-color: #d98200;
}

div.fill.bad {
  background-color: var(--text-error);
}

</style>
