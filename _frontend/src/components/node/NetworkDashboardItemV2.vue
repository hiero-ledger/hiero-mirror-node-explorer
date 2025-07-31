// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div>
    <Tooltip :text="tooltip">
      <div class="item-root">
        <div class="item-l1">
          {{ title }}
          <InfoTooltip v-if="props.value && props.infoLabel" :label="props.infoLabel"/>
        </div>

        <div v-if="props.value !== null" class="item-l2">
          <span class="item-value">{{ props.value }}</span>
          <span class="item-unit">{{ props.unit }}</span>
        </div>
        <div v-else class="none-value">None</div>

        <div v-if="props.value && props.extra" class=" item-l3">
          {{ props.extra }}
        </div>
      </div>
    </Tooltip>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import InfoTooltip from "@/components/InfoTooltip.vue";
import Tooltip from "@/components/Tooltip.vue";

const props = defineProps({
  title: String,
  value: {
    type: String as PropType<string | null>,
    default: null
  },
  unit: String,
  tooltipLabel: {
    type: String as PropType<string | null>,
    default: null
  },
  infoLabel: {
    type: String as PropType<string | null>,
    default: null
  },
  extra: {
    type: String as PropType<string | null>,
    default: null
  },
})

const title = computed(() => props.title?.toUpperCase())
const tooltip = computed(() => props.value ? props.tooltipLabel : null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.item-root {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

div.item-l1 {
  align-items: center;
  color: var(--text-secondary);
  display: flex;
  font-size: 12px;
  font-weight: 500;
  gap: 8px;
  height: 16px;
}

div.item-l2 {
  align-items: baseline;
  display: flex;
  gap: 4px;
  padding-bottom: 5px;
}

.item-value {
  color: var(--text-primary);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 20px;
  font-weight: 500;
  height: 26px;
}

.item-unit {
  color: var(--text-primary);
  font-size: 10px;
  font-weight: 400;
  height: 13px;
}

.none-value {
  color: hsl(0, 0%, 48%) !important;
}

div.item-l3 {
  color: var(--network-text-accent-color);
  font-size: 12px;
  font-weight: 400;
  height: 16px;
}

</style>
