// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="card-root">
    <div
        style="display: flex; flex-direction: column; gap: 8px;  padding-bottom: 16px;  border-bottom: 1px solid var(--network-theme-color);">
      <div class="card-header">
        <div class="left-header">
          <slot name="title"/>
          <slot name="left-control" v-if="!isCollapsed"/>
        </div>
        <div v-if="isMediumScreen" class="right-header">
          <slot name="right-control" v-if="!isCollapsed"/>
          <template v-if="isCollapsible">
            <img v-if="isCollapsed" id="expandIcon" alt="Expand" @click="toggleCollapsed" :src="arrowDownURL">
            <img v-else id="collapseIcon" alt="Collapse" @click="toggleCollapsed" :src="arrowUpURL">
          </template>
        </div>
      </div>
      <div v-if="!isMediumScreen && !isCollapsed" class="wrapped-controls">
        <slot name="right-control"/>
      </div>
    </div>

    <div v-if="!isCollapsed">

      <div v-if="slots['notification']" style="padding-bottom: 16px;">
        <slot name="notification"/>
      </div>

      <div v-if="slots['content']" class="left-content">
        <slot name="content"/>
      </div>

      <div
          v-if="slots['media-content'] || slots['media-description']"
          class="split-media"
          :class="{'left-content': !isMediumScreen}"
      >
        <div class="media-content">
          <slot name="media-content"/>
        </div>
        <div class="media-description" :class="{'split-separator': isMediumScreen}">
          <slot name="media-description"/>
        </div>
      </div>

      <hr v-if="showHorizontalSeparation" class="horizontal-line">

      <div
          v-if="slots['left-content'] || slots['right-content']"
          :class="{'split-content': isMediumScreen, 'left-content': !isMediumScreen}"
      >
        <div class="left-content">
          <slot name="left-content"/>
        </div>
        <div class="right-content" :class="{'split-separator': isMediumScreen}">
          <slot name="right-content"/>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onMounted, ref, useSlots} from "vue";
import {AppStorage} from "@/AppStorage";
import arrowDownLightURL from "@/assets/arrow-down-light.svg"
import arrowDownDarkURL from "@/assets/arrow-down-dark.svg"
import arrowUpLightURL from "@/assets/arrow-up-light.svg"
import arrowUpDarkURL from "@/assets/arrow-up-dark.svg"
import {ThemeController} from "@/components/ThemeController.ts";

const props = defineProps({
  subtitle: Boolean,
  collapsibleKey: {
    type: String,
    default: ''
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const isMediumScreen = inject('isMediumScreen', true)
const slots = useSlots()

const isCollapsible = computed(() => props.collapsibleKey != '')
const isCollapsed = ref(false)

const darkSelected = ThemeController.inject().darkSelected
const arrowUpURL = computed(() => darkSelected.value ? arrowUpDarkURL : arrowUpLightURL)
const arrowDownURL = computed(() => darkSelected.value ? arrowDownDarkURL : arrowDownLightURL)

const showHorizontalSeparation = computed(() =>
    slots['content'] && (slots['left-content'] || slots['right-content'])
)

onMounted(() => {
  if (isCollapsible.value) {
    const userPref = AppStorage.getCollapsedState(props.collapsibleKey)
    isCollapsed.value = userPref != null ? userPref : props.collapsed
  }
})
const toggleCollapsed = () => {
  const newValue = !isCollapsed.value
  if (newValue === props.collapsed) {
    AppStorage.setCollapsedState(props.collapsibleKey, null)
  } else {
    AppStorage.setCollapsedState(props.collapsibleKey, newValue)
  }
  isCollapsed.value = newValue
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.card-root {
  background-color: var(--background-tertiary);
  border: 1px solid var(--table-border);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 16px;
  padding: 16px;
}

@media (min-width: 1080px) {
  div.card-root {
    gap: 32px;
    padding: 32px;
  }
}

@media (min-width: 1080px) {
  div.card-header {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }
}

div.left-header {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  color: var(--text-primary);
  font-family: var(--font-family-heading), sans-serif;
  font-size: 14px;
  font-weight: 500;
  flex-wrap: wrap;
  word-wrap: anywhere;
}

@media (min-width: 1080px) {
  div.left-header {
    font-size: 20px;
  }
}

div.right-header {
  align-items: center;
  display: flex;
  gap: 16px;
  height: 26px;
  justify-content: flex-end;
}

div.wrapped-controls {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start;
}

div.split-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

div.left-content {
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

div.right-content {
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

div.split-media {
  display: flex;
  gap: 32px
}

div.media-content {
  display: flex;
  flex-grow: 0;
  justify-content: center;
}

div.media-description {
  align-content: flex-start;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

div.split-separator {
  border-left: 1px solid var(--border-secondary);
  padding-left: 24px;
}

hr.horizontal-line {
  margin: 24px 0;
}

</style>
