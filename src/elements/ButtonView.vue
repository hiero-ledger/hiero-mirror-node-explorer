// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <button
      class="button-view"
      :class="{
        'is-small': props.size === 'small',
        'is-medium': props.size === 'medium',
        'is-default': props.isDefault,
        'is-transparent': props.isTransparent,
        'same-size': props.sameSize,
        'for-toolbar': props.forToolbar
      }"
      :disabled="!props.enabled"
      @click="handleClick"
  >
    <span class="button-slot">
      <slot/>
    </span>
  </button>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  isTransparent: {
    type: Boolean,
    default: false
  },
  size: {
    type: String as PropType<ButtonSize>,
    default: ButtonSize.normal
  },
  sameSize: {
    type: Boolean,
    default: false
  },
  forToolbar: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["action"])

const handleClick = () => {
  emit("action")
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

button.button-view {
  appearance: none;
  color: var(--button-text-secondary);
  background-color: var(--button-background-secondary);
  border-style: none;
  border-radius: 32px;
  font-family: var(--font-family-heading), sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 48px;
  padding: 0 24px;
  text-wrap: nowrap;
  cursor: pointer;
}

button.button-view.is-medium {
  border-radius: 24px;
  height: 40px;
}

button.button-view.is-small {
  border-radius: 16px;
  font-size: 12px;
  height: 30px;
  padding: 0 14px;
}

button.button-view:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}

button.button-view.is-default {
  color: var(--network-button-text-color);
  background-color: var(--network-button-color);
}

button.button-view.is-transparent {
  background-color: transparent;
  border-color: var(--network-button-color);
  border-style: solid;
  border-width: 2px;
  color: var(--text-primary);
}

button.button-view.same-size {
  flex-basis: 0;
  flex-grow: 1;
}

button.button-view.for-toolbar {
  background-color: var(--background-tertiary);
}

span.button-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.is-small .button-slot {
  gap: 8px;
}

</style>
