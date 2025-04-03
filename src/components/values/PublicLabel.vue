// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <EntityLabel :label="name" :url="website">
    <template #icon>
      <Tag :size="12" class="public-tag"/>
    </template>

    <template #tooltip>
      <p>Public label for ID {{ entityId }}</p>
      <p>{{ description }}</p>
    </template>
  </EntityLabel>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import EntityLabel from "@/components/values/EntityLabel.vue";
import {LabelDefinition} from "@/utils/cache/LabelByIdCache.ts";
import {Tag} from 'lucide-vue-next';

const props = defineProps({
  labelDefinition: {
    type: Object as PropType<LabelDefinition | null>,
    default: null
  }
})

const name = computed(() => props.labelDefinition?.name ?? null)
const entityId = computed(() => props.labelDefinition?.entityId ?? null)
const website = computed(() => props.labelDefinition?.website ?? null)
const description = computed(() => props.labelDefinition?.description ?? null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

/*
.public-tag {
  fill: var(--network-text-accent-color);
}
*/

</style>