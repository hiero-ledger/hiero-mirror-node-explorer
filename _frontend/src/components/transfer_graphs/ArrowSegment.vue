// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div ref="rootElement" style="width: 2em" v-html="svgContent"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ref, watch} from "vue";
import {makeTransferSVG} from "@/utils/SVGUtils";
import ResizeObserver from "resize-observer-polyfill";
import {ThemeController} from "@/components/ThemeController.ts";

const props = defineProps({
  sourceCount: {
    type: Number,
    default: 1
  },
  destCount: {
    type: Number,
    default: 1
  },
  rowIndex: {
    type: Number,
    default: 0
  },
  compact: {
    type: Boolean,
    default: false,
  }
})

const rootElement = ref<SVGSVGElement | null>(null)
const parentElement = ref<HTMLElement | null>(null)
const svgContent = ref<string | null>(null)

watch(rootElement, () => {
  parentElement.value = rootElement.value?.parentElement ?? null
})

const resizeObserver = new ResizeObserver(() => {
  updateSvgContent()
})
watch(parentElement, (newValue, oldValue) => {
  if (oldValue !== null) {
    resizeObserver.unobserve(oldValue)
  }
  if (newValue !== null) {
    resizeObserver.observe(newValue)
    updateSvgContent()
  }
})

const updateSvgContent = () => {
  if (parentElement.value != null) {
    const bb = parentElement.value.getBoundingClientRect();
    const dy = props.compact ? 9.5 : 11.5
    svgContent.value = makeTransferSVG(bb.width, bb.height, dy, props.sourceCount, props.destCount, props.rowIndex)
  }
}

const darkSelected = ThemeController.inject().darkSelected
watch(darkSelected, updateSvgContent, {immediate: true})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

