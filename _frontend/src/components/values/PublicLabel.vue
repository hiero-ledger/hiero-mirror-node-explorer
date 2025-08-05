// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <EntityLabel :label="name" :url="website" :compact="props.compact">
    <template #icon>
      <Tag :size="14" :class="{'low-contrast':props.compact}"/>
    </template>

    <template #tooltip>
      <p>{{ `Public Label for ID ${entityId}` + (type ? ` [${type}]` : '') }}</p>
      <p>{{ description }}</p>
      <p>{{ website }}</p>
    </template>
  </EntityLabel>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import EntityLabel from "@/components/values/EntityLabel.vue";
import {Tag} from 'lucide-vue-next';
import {LabelDefinition} from "@/utils/cache/PublicLabelsCache.ts";

const props = defineProps({
  labelDefinition: {
    type: Object as PropType<LabelDefinition | null>,
    default: null
  },
  compact: {
    type: Boolean,
    default: false
  },
})

const name = computed(() => props.labelDefinition?.name ?? null)
const entityId = computed(() => props.labelDefinition?.entityId ?? null)
const website = computed(() => props.labelDefinition?.website ?? null)
const description = computed(() => props.labelDefinition?.description ?? null)
const type = computed(() => props.labelDefinition?.type ?? null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.low-contrast {
  color: var(--text-secondary);
}

</style>