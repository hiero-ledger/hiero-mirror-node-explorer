// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="shy-scope" :class="{'hoverable':enableCopy}">
    <slot/>
    <div v-if="enableCopy && contentToCopy" id="shyCopyButton" class="shy">
      <div v-if="enableCopy" class="copy-button-container">
        <button class="copy-button" type="button" title="Copy" aria-label="Copy" v-on:click.stop="copyToClipboard">
          <Copy :size="14" :stroke-width="2"/>
        </button>
      </div>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {Copy} from "@lucide/vue";

const props = defineProps({
  contentToCopy: String,
  enableCopy: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits<{ copyMade: [] }>()

const copyToClipboard = (): void => {
  if (props.contentToCopy?.length) {
    navigator.clipboard.writeText(props.contentToCopy)
    emit('copyMade')
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.shy-scope {
  display: inline-block;
  position: relative;
  border-width: 0;
  border-radius: 4px;
}

div.shy-scope.hoverable:hover {
  background-color: var(--background-secondary);
}

div.shy {
  display: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%
}

div.shy-scope:hover > div.shy {
  display: block;
}

div.copy-button-container {
  position: absolute;
  display: inline-block;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

button.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--copy-button-background);
  border: none;
  border-radius: 4px;
  color: var(--copy-button-text);
  cursor: pointer;
  height: 20px;
  padding: 0;
  width: 20px;
  opacity: 80%;
}

button.copy-button:active {
  opacity: 95%;
}

</style>
