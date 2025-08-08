// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <EntityLabel :label="name" :compact="props.compact">
    <template #icon>
      <Circle :size="14" :class="{'low-contrast':props.compact}"/>
    </template>

    <template #tooltip>
      <p style="font-weight: 700">{{ `Data from Merkel Science` }}</p>
      <hr class="horizontal-line" style="margin: 8px 0; height: 0.5px"/>
      <div style="display: flex; flex-direction: column; align-items: center; row-gap: 8px; text-align: left;">
        <div>
          <p>
            <span style="font-weight: 300">Name: </span>
            <span style="font-weight: 500">{{ `${name}` }}</span>
          </p>
          <p>
            <span style="font-weight: 300">ID: </span>
            <span style="font-weight: 500">{{ `${entityId}` }}</span>
          </p>
          <p>
            <span style="font-weight: 300">Type: </span>
            <span style="font-weight: 500">{{ `${type}` }}</span>
          </p>
          <p>
            <span style="font-weight: 300">Sub-type: </span>
            <span style="font-weight: 500">{{ `${subType}` }}</span>
          </p>
        </div>
      </div>
    </template>
  </EntityLabel>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import EntityLabel from "@/components/values/EntityLabel.vue";
import {Circle} from 'lucide-vue-next';
import {MerkleScienceTag} from "@/utils/cache/MerkleScienceAddressCache.ts";

const props = defineProps({
  id: {
    type: Object as PropType<String | null>,
    default: null
  },
  tagDefinition: {
    type: Object as PropType<MerkleScienceTag | null>,
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