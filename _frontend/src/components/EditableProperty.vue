// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Property :id="id" :full-width="fullWidth" :custom-nb-col-class="customNbColClass" :tooltip="tooltip">
    <template #name>
      <slot name="name"/>
    </template>
    <template #value>
      <div class="compound-value">
        <slot name="value"/>
        <Pencil
            v-if="editable"
            :size="16"
            @click="onEdit"
            style="color: var(--network-text-accent-color);"
        />
      </div>
    </template>
  </Property>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import Property from "@/components/Property.vue";
import {Pencil} from 'lucide-vue-next';

defineProps({
  id: String,
  fullWidth: {
    type: Boolean,
    default: false
  },
  customNbColClass: String,
  tooltip: String,
  editable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['edit'])

const onEdit = () => emit('edit')

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
