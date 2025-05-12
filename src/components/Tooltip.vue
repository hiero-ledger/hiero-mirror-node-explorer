// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <o-tooltip
      v-if="props.text || slots.content"
      :label="props.text"
      :position="position ?? 'auto'"
      :delay="props.delay"
      multiline
  >
    <slot/>
    <template #content>
      <slot name="content"/>
    </template>
  </o-tooltip>

  <slot v-else/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, useSlots} from 'vue';

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

const slots = useSlots()

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
