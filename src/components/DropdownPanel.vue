// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div ref="rootRef">
    <slot name="button"/>
    <div v-if="deployed" style="position: relative">
      <div
          class="panelHolder"
          style="position: absolute; z-index: 999;"
          :style="{
            left: panelDX + 'px',
            top: panelDY + 'px',
            'box-shadow': boxShadow,
            'background-color': props.backgroundColor,
            'right': rightDX,
            padding: paddingRadius,
            'border-radius': paddingRadius
          }"
          ref="panelRef">
        <slot name="panel"/>
      </div>
    </div>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {ThemeController} from "@/components/ThemeController.ts";

const props = defineProps({
  rightAligned: {
    type: Boolean,
    default: false
  },
  topAligned: {
    type: Boolean,
    default: false
  },
  stretched: {
    type: Boolean,
    default: false
  },
  backgroundColor: {
    type: String,
    default: "var(--background-tertiary)"
  },
  compact: {
    type: Boolean,
    default: false
  }
})

//
// deployed
//

const deployed = defineModel("deployed", {
  type: Boolean,
  required: true
})

const rootRef = ref<HTMLElement | null>(null)
const isInside = (target: Node) => rootRef.value !== null && rootRef.value.contains(target)

const onMouseDown = (ev: MouseEvent) => {
  if (ev.target instanceof Node && !isInside(ev.target)) {
    deployed.value = false
  }
}

//
// right alignment
//

const buttonWidth = ref<number | null>(null)
const buttonHeight = ref<number | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const panelWidth = ref<number | null>(null)
const panelHeight = ref<number | null>(null)

const resizeObserver = new ResizeObserver(() => {
  if (rootRef.value !== null) {
    buttonWidth.value = rootRef.value.offsetWidth
    buttonHeight.value = rootRef.value.offsetHeight
  } else {
    buttonWidth.value = 0
    buttonHeight.value = 0
  }
  if (panelRef.value !== null) {
    panelWidth.value = panelRef.value.offsetWidth
    panelHeight.value = panelRef.value.offsetHeight
  } else {
    panelWidth.value = 0
    panelHeight.value = 0
  }
 })

watch(rootRef, (newValue, oldValue) => {
  if (newValue !== null) {
    resizeObserver.observe(newValue)
    buttonWidth.value = rootRef.value?.offsetWidth ?? 0
  } else if (oldValue !== null) {
    resizeObserver.unobserve(oldValue)
    buttonWidth.value = 0
  }
})

watch(panelRef, (newValue, oldValue) => {
  if (newValue !== null) {
    resizeObserver.observe(newValue)
    panelWidth.value = panelRef.value?.offsetWidth ?? 0
  } else if (oldValue !== null) {
    resizeObserver.unobserve(oldValue)
    panelWidth.value = null
  }
})

const panelDX = computed(() => {
  let result: number
  if (props.rightAligned && buttonWidth.value !== null && panelWidth.value !== null) {
    result = -(panelWidth.value - buttonWidth.value)
  } else {
    result = 0
  }
  return result
})

const gap = 6

const panelDY = computed(() => {
  let result: number
  if (props.topAligned && buttonHeight.value !== null && panelHeight.value !== null) {
    result = -(panelHeight.value - buttonHeight.value) - gap
  } else {
    result = gap
  }
  return result
})

//
// rightDX
//

const rightDX = computed(() => props.stretched ? "0" : "auto")

//
// padding / radius
//

const paddingRadius = computed(() => props.compact ? "10px" : "16px")

//
// mount/unmount
//

onMounted(() => {
  document.addEventListener("mousedown", onMouseDown)
})
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onMouseDown)
})

//
// box shadow
//

const lightShadow = "0 4px 18px 0 rgba(0, 0, 0, 7%)"
const darkShadow = "0 4px 18px 0 rgba(255, 255, 255, 7%)"
const darkSelected = ThemeController.inject().darkSelected
const boxShadow = computed(() => darkSelected.value ? darkShadow : lightShadow)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.panelHolder {
  border-color: var(--border-secondary);
  border-style: solid;
  border-width: 1px;
}

</style>
