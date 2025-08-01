// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="switch"
       @click="checked = !checked"
       :class="{'unchecked': !checked, 'checked': checked}"
  >
    <div/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

const checked = defineModel({
  type: Boolean,
  default: false
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.switch {
  height: 24px;
  width: 44px;
  border-width: 0;
  border-radius: 12px;
  padding: 3px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

div.switch.unchecked {
  justify-content: flex-start;
  background-color: var(--border-secondary);
}

div.switch.checked {
  justify-content: flex-end;
  background-color: var(--network-theme-color)
}

div.switch > div {
  height: 18px;
  width: 18px;
  background-color: var(--text-secondary);
  border-width: 0;
  border-radius: 9px;
}

</style>
