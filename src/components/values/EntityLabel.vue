// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <Tooltip>
    <div
        v-if="label"
        class="h-is-label entity-label"
        :class="{'h-hoverable':props.url !== null}"
        @click="navigate(props.url)"
    >
      <slot name="icon"/>
      <span>{{ label }}</span>
      <SquareArrowOutUpRight v-if="props.url" :size="12" style="color:var(--text-secondary);"/>
    </div>
    <template v-if="slots.tooltip" #content>
      <slot name="tooltip"/>
    </template>
  </Tooltip>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, useSlots} from "vue";
import Tooltip from "@/components/Tooltip.vue";
import {SquareArrowOutUpRight} from 'lucide-vue-next';

const MAX_LABEL_SIZE = 35

const props = defineProps({
  label: {
    type: String as PropType<string | null>,
    default: null
  },
  url: {
    type: String as PropType<string | null>,
    default: null
  },
})

const slots = useSlots()

const label = computed(() =>
    (props.label && props.label.length > MAX_LABEL_SIZE)
        ? props.label.slice(0, MAX_LABEL_SIZE) + '…'
        : props.label
)

const navigate = (url: string | null) => {
  if (url) {
    window.open(url, '_blank');
  }
};

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.h-hoverable {
  cursor: pointer;
}

.entity-label {
  display: flex;
  align-items: center;
  gap: 4px
}

</style>
