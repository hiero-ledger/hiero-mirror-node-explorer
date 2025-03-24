// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="label-view">
    <img
        v-if="props.iconUrl"
        :src="props.iconUrl"
        :style="{'height': props.iconSize+'px'}"
        class="label-view-icon"
        alt="label logo">
    <slot/>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

const props = defineProps({
  iconUrl: String,
  iconSize: {
    type: Number,
    default: 40
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.label-view {
  align-items: center;
  column-gap: 8px;
  display: flex;
  justify-content: space-between;
  height: 100%
}

img.label-view-icon {
  flex-grow: 0;
}

</style>
