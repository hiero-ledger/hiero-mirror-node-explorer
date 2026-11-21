// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div v-if="isCopyOnClick"
       class="shy-scope hoverable copy-on-click"
       role="button"
       tabindex="0"
       title="Copy"
       aria-label="Copy"
       v-on:click.stop="copyToClipboard"
       v-on:keydown.enter.stop.prevent="copyToClipboard"
       v-on:keydown.space.stop.prevent="copyToClipboard"
  >
    <slot/>
    <div id="shyCopyButton" class="shy">
      <div class="copy-button-container">
        <span class="copy-button" aria-hidden="true">
          <Copy :size="14" :stroke-width="2"/>
        </span>
      </div>
    </div>
  </div>
  <div v-else class="shy-scope" :class="{'hoverable':enableCopy}">
    <slot/>
    <div v-if="enableCopy && contentToCopy" id="shyCopyButton" class="shy">
      <div class="copy-button-container">
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

import {computed} from "vue";
import {Copy} from "@lucide/vue";

const props = defineProps({
  contentToCopy: String,
  enableCopy: {
    type: Boolean,
    default: true
  },
  // When set, the whole content is the click target and the copy icon is only a visual hint.
  // Use it only where the content is not itself a link (e.g. ids in table rows).
  copyOnClick: {
    type: Boolean,
    default: false
  },
})

const isCopyOnClick = computed(() => props.copyOnClick && props.enableCopy && !!props.contentToCopy)

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

div.shy-scope.copy-on-click {
  cursor: pointer;
}

div.shy-scope.copy-on-click:focus-visible > div.shy {
  display: block;
}

div.shy-scope.copy-on-click div.copy-button-container {
  pointer-events: none;
}

div.copy-button-container {
  position: absolute;
  display: inline-block;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.copy-button {
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

button.copy-button:active,
div.shy-scope.copy-on-click:active .copy-button {
  opacity: 95%;
}

</style>
