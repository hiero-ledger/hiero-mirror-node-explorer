// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                 -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ul v-if="props.tabIds.length >= 1">
    <li
        :class="{
          'is-selected':selectedTab === tab,
          'sub-tab': props.subTabs,
          'is-active': isActive(i) && props.isEnabled,
          'is-inactive': !isActive(i)
        }"
        v-for="(tab, i) in props.tabIds"
        :key="tab"
        :id="'tab-' + tabIds"
        @click="onSelect(i)"
    >
      <div class="tab-label">
        {{ props.tabLabels[i] ?? tab }}
      </div>
    </li>
  </ul>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, ref, watch} from "vue";

const props = defineProps({
  tabIds: {
    type: Array as PropType<string[]>,
    required: true
  },
  tabLabels: {
    type: Array as PropType<string[]>,
    default: [] as string[] /* to please eslint */
  },
  activeTabs: {     // when omitted, all tabs are considered active
    type: Array as PropType<boolean[]>,
    default: [] as boolean[] /* to please eslint */
  },
  subTabs: {
    type: Boolean,
    default: false
  },
  isEnabled: {
    type: Boolean,
    default: true
  }
})

const selectedTab = defineModel("selectedTab", {
  type: String as PropType<string | null>,
  default: null
})

const interactiveSelection = ref<boolean>(true) // true because initial value must be preserved

const onSelect = (tabIndex: number) => {
  if (props.isEnabled && isActive(tabIndex)) {
    handleSelect(props.tabIds[tabIndex], true)
  }
}

const handleSelect = (tab: string | null, interactive: boolean) => {

  console.log(`handleSelect - tab: ${tab}`)

  selectedTab.value = tab
  interactiveSelection.value = interactive
}

const adjustSelectedTab = () => {
  if (props.tabIds.length >= 1) {
    if (selectedTab.value === null || props.tabIds.indexOf(selectedTab.value) == -1 || !interactiveSelection.value) {
      handleSelect(props.tabIds[0], false)
    } // else selectedTab remains unchanged
  } else {
    handleSelect(null, false)
  }
}

const isActive = (tabIndex: number): boolean => {
  return props.activeTabs.length === 0
      || (props.activeTabs.length >= tabIndex + 1 && props.activeTabs[tabIndex])
}

watch(() => props.tabIds, adjustSelectedTab, {immediate: true})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

ul {
  align-items: center;
  column-gap: 16px;
  display: flex;
  margin: 0;
  padding: 0;
}

li {
  border: 0.5px solid transparent;
  border-radius: 8px;
  color: var(--text-secondary);
  font-family: var(--font-family-proportional), sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  padding: 8px 8px;
}

li.sub-tab {
  font-size: 12px;
  line-height: 15px;
}

li.is-selected {
  background-color: var(--tab-background);
  color: var(--text-primary);
  cursor: default;
}

li.is-active:not(.is-selected):hover {
  cursor: pointer;
  border: 0.5px solid var(--text-secondary);
}

li.is-active div.tab-label:active {
  color: var(--text-primary);
}

li:not(is-active):not(.is-selected):hover {
  cursor: not-allowed;
}

</style>
