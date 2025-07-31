// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="shy-scope" :class="{'hoverable':enableCopy}">
    <slot name="content"/>
    <div v-if="enableCopy && contentToCopy" id="shyCopyButton" class="shy">
      <div v-if="enableCopy" class="copy-button-container">
        <button class="copy-button" v-on:click.stop="copyToClipboard">Copy</button>
      </div>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

const props = defineProps({
  contentToCopy: String,
  enableCopy: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits(['copyMade'])

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
  background-color: var(--copy-button-background);
  border-radius: 16px;
  color: var(--copy-button-text);
  font-size: 12px;
  height: 28px;
  padding: 6px 12px;
  width: 100px;
  opacity: 80%;
}

button.copy-button:active {
  opacity: 95%;
}

</style>
