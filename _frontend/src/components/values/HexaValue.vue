// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <Copyable v-if="normByteString" :content-to-copy="normByteString" :enable-copy="isCopyEnabled">
    <template v-slot:content>
      <div class="hexa-value">
        {{ normByteString }}
      </div>
    </template>
  </Copyable>

  <template v-else-if="showNone && !initialLoading">
    <div class="h-is-low-contrast">None</div>
    <div v-if="noneExtra" class="h-is-low-contrast">{{ noneExtra }}</div>
  </template>

  <template v-else/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType, ref} from "vue";
import {initialLoadingKey} from "@/AppKeys";
import Copyable from "@/elements/Copyable.vue";

const props = defineProps({
  byteString: {
    type: String as PropType<string | null>,
    default: null
  },
  showNone: {
    type: Boolean,
    default: false
  },
  noneExtra: String,
  copyable: {
    type: Boolean,
    default: true
  }
})

const normByteString = computed(() => {
  let result: string | null
  if (props.byteString !== null) {
    result = props.byteString.startsWith('0x') ? props.byteString : '0x' + props.byteString
  } else {
    result = null
  }
  return result
})

const isCopyEnabled = computed(() => {
  return props.copyable && (normByteString.value?.length ?? 0) >= 1
})

const initialLoading = inject(initialLoadingKey, ref(false))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.hexa-value {
  color: var(--text-secondary);
  font-family: var(--font-family-monospace), sans-serif;
  max-height: 400px;
  overflow-y: auto;
  word-break: break-all;
}

</style>
