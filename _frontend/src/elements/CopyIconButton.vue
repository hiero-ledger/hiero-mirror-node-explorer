// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <button
      v-if="contentToCopy"
      class="copy-icon-button"
      type="button"
      :title="copied ? 'Copied' : 'Copy'"
      :aria-label="'Copy ' + contentToCopy"
      @click.stop.prevent="copyToClipboard"
  >
    <Check v-if="copied" :size="14" :stroke-width="2.5"/>
    <Copy v-else :size="14" :stroke-width="2"/>
  </button>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onBeforeUnmount, ref} from "vue";
import {Check, Copy} from "@lucide/vue";

const COPIED_FEEDBACK_DURATION_MS = 1500

const props = defineProps({
  contentToCopy: {
    type: String,
    default: null
  },
})

const emit = defineEmits<{ copyMade: [] }>()

const copied = ref(false)
let resetTimer: ReturnType<typeof setTimeout> | null = null

const copyToClipboard = async (): Promise<void> => {
  if (props.contentToCopy?.length) {
    try {
      await navigator.clipboard.writeText(props.contentToCopy)
      copied.value = true
      emit('copyMade')
      if (resetTimer !== null) {
        clearTimeout(resetTimer)
      }
      resetTimer = setTimeout(() => {
        copied.value = false
        resetTimer = null
      }, COPIED_FEEDBACK_DURATION_MS)
    } catch {
      copied.value = false
    }
  }
}

onBeforeUnmount(() => {
  if (resetTimer !== null) {
    clearTimeout(resetTimer)
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

button.copy-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  padding: 2px;
  border: none;
  border-radius: 4px;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  vertical-align: middle;
}

button.copy-icon-button:hover {
  background-color: var(--background-secondary);
  color: var(--text-primary);
}

</style>
