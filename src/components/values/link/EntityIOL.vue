// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="is-inline-block">

    <template v-if="actualLabel !== null">
      <span :class="{'h-is-label':!compact, 'h-is-compact-label':compact}" class="is-inline-block">
        {{ actualLabel }}
      </span>
    </template>

    <template v-else-if="entityId !== null">
      <span class="h-is-numeric">
        {{ entityId ?? "" }}
      </span>
    </template>

    <template v-else-if="!initialLoading">
      <span class="h-is-low-contrast">
        {{ nullLabel ?? "None" }}
      </span>
    </template>

    <template v-else>
      <!-- Nothing because entityId is null and (showNone=false or initialLoading is true) -->
    </template>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {computed, inject, PropType, ref} from "vue";
import {initialLoadingKey} from "@/AppKeys";

const DEFAULT_LABEL_SIZE = 18

const props = defineProps({
  entityId: {
    type: String as PropType<string | null>,
    default: null
  },
  label: {
    type: String as PropType<string | null>,
    default: null
  },
  slice: {
    type: Number as PropType<number | null>,
    default: DEFAULT_LABEL_SIZE
  },
  compact: {
    type: Boolean,
    default: true
  },
  nullLabel: {
    type: String,
    default: null
  },
})

const initialLoading = inject(initialLoadingKey, ref(false))

const actualLabel = computed(() => {
  let result = props.label
  if (result != null
      && props.slice != null
      && props.slice > 0
      && props.slice < result.length) {
    result = result.slice(0, props.slice) + '…'
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
