// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <component :is="lucideIcon" :size="lucideSize"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {ChevronLeft, ChevronRight, CircleQuestionMark, LoaderCircle, LucideIcon} from "@lucide/vue";
import {computed, PropType} from "vue";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  size: {
    type: [String, Number] as PropType<string | number>,
    default: undefined,
  },
});

const lucideSize = computed<number | undefined>(() => {
  if (props.size === undefined || props.size === "") {
    return undefined;
  }
  return Number(props.size);
});

const iconMap: Record<string, LucideIcon> = {

  // List of internal icons used by Oruga is in _frontend/node_modules/@oruga-ui/oruga-next/src/utils/icons.ts
  // We should only need the following, but we can add more if needed.
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'loading': LoaderCircle,
}

const lucideIcon = computed(() => iconMap[props.icon] ?? CircleQuestionMark)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
