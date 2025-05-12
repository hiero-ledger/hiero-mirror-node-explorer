// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div v-if="label"
       :class="{'h-is-label':!compact, 'h-is-compact-label':compact}"
       class="is-inline-block">
    <slot/>
    <span>
      {{ label }}
    </span>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {LabelByIdCache} from "@/utils/cache/LabelByIdCache";

const MAX_LABEL_SIZE = 35

const props = defineProps({
  id: {
    type: String as PropType<string | null>,
    default: null
  },
  slice: {
    type: Number as PropType<number | null>,
    default: MAX_LABEL_SIZE
  },
  compact: {
    type: Boolean,
    default: false
  },
})

const id = computed(() => props.id)

const labelLookup = LabelByIdCache.instance.makeLookup(id)
onMounted(() => labelLookup.mount())
onBeforeUnmount(() => labelLookup.unmount())

const slice = computed(() => props.compact ? 12 : props.slice)
const label = computed(() => {
  let result = labelLookup.entity.value
  if (result != null
      && slice.value != null
      && slice.value > 0
      && slice.value < result.length) {
    result = result.slice(0, slice.value) + '…'
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
