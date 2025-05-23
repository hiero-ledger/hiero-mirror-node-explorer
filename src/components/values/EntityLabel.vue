// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div>
    <Tooltip>
      <div
          v-if="label"
          class="entity-label"
          :class="{'h-is-label':!compact, 'h-is-compact-label':compact}"
      >
        <slot name="icon"/>
        <span>{{ label }}</span>
        <SquareArrowOutUpRight
            v-if="props.url && !compact"
            :size="14"
            class="link-icon"
            @click="navigate(props.url)"
        />
      </div>
      <template v-if="slots.tooltip" #content>
        <slot name="tooltip"/>
      </template>
    </Tooltip>
  </div>
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
  compact: {
    type: Boolean,
    default: false
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

.entity-label {
  align-items: center;
  display: flex;
  font-family: var(--font-family-proportional), sans-serif;
  gap: 4px
}

.link-icon {
  color: var(--text-secondary);
  cursor: pointer;
}

</style>
