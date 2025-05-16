// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <EntityLabel :label="name" :url="website" :compact="props.compact">
    <template #icon>
      <Bookmark :size="12" :class="{'low-contrast':props.compact}"/>
    </template>

    <template #tooltip>
      <p>Bookmark for ID {{ entityId }} [{{ type }}]</p>
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
import {Bookmark} from 'lucide-vue-next';
import EntityLabel from "@/components/values/EntityLabel.vue";
import {Portal} from "@/utils/profile/Portal.ts";

const props = defineProps({
  entityBookmark: {
    type: Object as PropType<Portal.EntityBookmark | null>,
    default: null
  },
  compact: {
    type: Boolean,
    default: false
  },
})

const name = computed(() => props.entityBookmark?.name ?? null)
const entityId = computed(() => props.entityBookmark?.entityId ?? null)
const website = computed(() => props.entityBookmark?.website ?? null)
const description = computed(() => props.entityBookmark?.description ?? null)
const type = computed(() => props.entityBookmark?.type ?? null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.low-contrast {
  color: var(--text-secondary);
}

</style>
