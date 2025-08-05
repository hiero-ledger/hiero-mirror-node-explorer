// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <render/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {h, useSlots, VNode} from "vue";

const props = defineProps({
  visibleIndex: {
    type: Number,
    default: 0
  }
})

const slots = useSlots()
const render = () => {
  const childNodes: VNode[] = []
  if (slots.default) {
    let i = 0
    for (const c of slots.default()) {
      const visibility = i == props.visibleIndex ? 'inherit' : 'hidden'
      const style = "visibility: " + visibility + "; grid-area: 1 / 1 / 2 / 2"
      childNodes.push(h('div', {'style': style}, c))
      i += 1
    }
  }
  return h('div', {'class': 'stack-view'}, childNodes)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.stack-view {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-items: stretch;
  place-items: stretch;
  width: 100%
}

</style>
