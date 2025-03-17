// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-tooltip
      v-if="props.text"
      :label="props.text"
      :position="position ?? 'auto'"
      :delay="props.delay"
      :teleport="true"
      multiline
      class="tooltip"
  >
    <slot/>
  </o-tooltip>

  <slot v-else/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';

const props = defineProps({
  text: {
    type: String as PropType<string | null>,
    default: null
  },
  position: {
    type: String as PropType<string | null>,
    default: 'auto'
  },
  delay: {
    type: Number as PropType<number | null>,
    default: 100
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.tooltip {
  cursor: default;
}

</style>
