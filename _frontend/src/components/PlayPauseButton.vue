// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE   v-on:click="clicked"                                                  -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="root">
    <img v-if="!isPlaying" alt="Play" :src="playURL" @click="handleClick" data-cy="playButton">
    <img v-else alt="Pause" :src="pauseURL" @click="handleClick" data-cy="pauseButton">
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ComputedRef, onMounted, PropType, ref} from "vue";
import playLightURL from "@/assets/play-light.svg"
import playDarkURL from "@/assets/play-dark.svg"
import pauseLightURL from "@/assets/pause-light.svg"
import pauseDarkURL from "@/assets/pause-dark.svg"
import {ThemeController} from "@/components/ThemeController.ts";

export interface PlayPauseController {
  startAutoRefresh(): void

  stopAutoRefresh(): void

  autoRefresh: ComputedRef<boolean>
}

const props = defineProps({
  controller: Object as PropType<PlayPauseController>
})

const isPlaying = computed(() => {
  return props.controller && props.controller.autoRefresh.value
})

const darkSelected = ThemeController.inject().darkSelected
const playURL = computed(() => darkSelected.value ? playDarkURL : playLightURL)
const pauseURL = computed(() => darkSelected.value ? pauseDarkURL : pauseLightURL)

const userRequestedStop = ref(false)
onMounted(() => userRequestedStop.value = false)
const handleClick = () => {
  if (props.controller) {
    const controller = props.controller
    if (controller.autoRefresh.value) {
      controller.stopAutoRefresh()
      userRequestedStop.value = true
    } else {
      controller.startAutoRefresh()
      userRequestedStop.value = false
    }
  } else {
    console.log("Ignoring click because props.controller is undefined")
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.root {
  height: 26px;
  width: 26px;
  padding-top: 2px;
}

</style>
