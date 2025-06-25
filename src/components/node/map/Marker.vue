// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <button :style="itemStyle" @click="onClick"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";

const emits = defineEmits(["action"])

const itemSize = 14
const itemStyle = computed(() => {
  return {
    left: -itemSize / 2 + "px",
    top: -itemSize / 2 + "px",
    width: itemSize + "px",
    height: itemSize + "px",
    "border-radius": itemSize / 2 + "px"
  }
})

const onClick = () => emits("action")

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

button {
  position: absolute;
  background-color: var(--network-text-accent-color);
  border: none;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
}

</style>
