// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <input type="text" v-model="text"
         :placeholder="props.placeholder"
         :class="{ 'small': props.small }"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

const text = defineModel()

const props = defineProps({
  placeholder: {
    type: String,
    default: ""
  },
  small: {
    type: Boolean,
    default: false
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

input {
  background-color: transparent;
  border-color: var(--text-secondary);
  border-radius: 2px;
  border-style: solid;
  border-width: 1px;
  color: var(--text-primary);
  font-size: 14px;
  height: 40px;
  padding-left: 8px;
  padding-right: 8px;
}

input::placeholder {
  opacity: 0.5;
}

input.small {
  font-size: 10px;
  font-weight: 400;
  height: 28px;
  line-height: 11px;
}

</style>
