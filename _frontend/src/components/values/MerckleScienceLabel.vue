// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <EntityLabel :label="name" :compact="props.compact">
    <template #icon>
      <Tag :size="14" :class="{'low-contrast':props.compact}"/>
    </template>

    <template #tooltip>
      <p>{{ `Merckel Science Tag for ID ${entityId}` }}</p>
      <p>{{ `Type: ${type}` }}</p>
      <p>{{ `Sub-type: ${subType}` }}</p>
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
import {MerckleScienceTag} from "@/utils/cache/MerckleScienceInfoCache.ts";

const props = defineProps({
  id: {
    type: Object as PropType<String | null>,
    default: null
  },
  tagDefinition: {
    type: Object as PropType<MerckleScienceTag | null>,
    default: null
  },
  compact: {
    type: Boolean,
    default: false
  },
})

const entityId = computed(() => props.id)
const name = computed(() => props.tagDefinition?.tag_name_verbose ?? null)
const type = computed(() => props.tagDefinition?.tag_type_verbose ?? null)
const subType = computed(() => props.tagDefinition?.tag_subtype_verbose ?? null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.low-contrast {
  color: var(--text-secondary);
}

</style>