// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="hover-container">
    <EntityLabel
        :label="name"
        :url="website"
        :compact="props.compact"
    >
      <template #icon>
        <Bookmark :size="12" :class="{'low-contrast':props.compact}"/>
      </template>

      <template #tooltip>
        <p>{{ `Bookmark for ID ${entityId}` + (type ? ` [${type}]` : '') }}</p>
        <p>{{ description }}</p>
        <p>{{ website }}</p>
      </template>
    </EntityLabel>
    <Pencil
        v-if="!props.compact && props.editable"
        :size="16"
        @click="onEdit()"
        class="shy-edit-icon"
    />
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {Bookmark, Pencil} from 'lucide-vue-next';
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
  editable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['edit'])

const onEdit = () => {
  emit('edit')
}

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

.hover-container {
  align-items: center;
  display: flex;
  gap: 4px
}

.shy-edit-icon {
  color: var(--network-text-accent-color);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  visibility: hidden;
}

.hover-container:hover .shy-edit-icon {
  opacity: 1;
  visibility: visible;
}

.low-contrast {
  color: var(--text-secondary);
}

</style>
