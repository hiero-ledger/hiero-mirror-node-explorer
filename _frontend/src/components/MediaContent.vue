// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div
      class="media-container"
      :class="{'media-container-background': !mediaLoaded}"
      :style="containerStyle"
      @click="onClick"
  >

    <!--  PLACE-HOLDER  -->
    <div
        id="media-placeholder"
        :class="{'invisible-element': !showPlaceHolder}"
        class="media-content"
    >
      <slot name="placeHolder"></slot>
    </div>

    <!--  SPINNER  -->
    <span
        :class="{'invisible-element': !showSpinner}"
        class="media-content loader"
    />

    <!--  IMAGE PREVIEW  -->
    <template v-if="imageUrl">
      <figure
          id="image-content"
          class="media-content">
        <img
            :class="{'invisible-element': !mediaLoaded}" alt=""
            :style="contentStyle"
            :src="imageUrl"
            @error="onLoadError"
            @load="onLoadSuccess"
        >
      </figure>
    </template>

    <!--  VIDEO PREVIEW  -->
    <template v-else-if="videoUrl">
      <video
          id="video-content"
          class="media-content"
          :style="contentStyle"
          :autoplay="auto"
          :controls="!auto && size >= 100"
          loop
          @error="onLoadError"
          @loadeddata="onLoadSuccess"
      >
        <source :src="videoUrl" :type="type ?? ''"/>
      </video>
    </template>

    <!--  NO USABLE CONTENT (place-holder will be shown)  -->
    <template v-else/>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ComputedRef, onBeforeUnmount, onMounted, PropType, ref} from "vue";

const MEDIA_LOAD_TIMEOUT = 10000

const props = defineProps({
  url: {
    type: String as PropType<string | null>,
    default: null
  },
  type: {
    type: String as PropType<string | null>,
    default: null
  },
  size: {
    type: Number,
    default: 40
  },
  auto: {
    type: Boolean,
    default: false
  },
  noAnchor: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['onLoadSuccess', 'onLoadError'])

const videoUrl: ComputedRef<string | null> = computed(
    () => props.type?.startsWith('video') || props.type?.startsWith('audio')
        ? props.url
        : null
)

const imageUrl: ComputedRef<string | null> = computed(
    () => videoUrl.value === null || props.type?.startsWith('image')
        ? props.url
        : null
)

const containerStyle = computed(() => {
  return {
    width: props.size + 'px',
    height: props.size + "px"
  }
})

const contentStyle = computed(() => {
  return {
    'width': '100%',
    'max-width': props.size - 2 + 'px',
    'max-height': props.size - 2 + 'px'
  }
})

const mediaLoaded = ref(false)
const onLoadSuccess = () => {
  mediaLoaded.value = true
  stopTimeout()
  emit('onLoadSuccess')
}

const mediaError = ref(false)
const onLoadError = () => {
  mediaError.value = true
  emit('onLoadError')
}

const showSpinner = computed(
    () => (props.url) && !mediaLoaded.value && !mediaError.value
)

const showPlaceHolder = computed(
    () => !props.url || mediaError.value
)

const onClick = () => {
  if (props.url && !props.noAnchor) {
    window.location.assign(props.url)
  }
}

onMounted(() => {
  startTimeout()
})
onBeforeUnmount(() => {
  stopTimeout()
})

let timeoutID = -1
const startTimeout = () => {
  if (props.url !== null && timeoutID === -1) {
    timeoutID = window.setTimeout(() => {
      mediaError.value = true
      timeoutID = -1
    }, MEDIA_LOAD_TIMEOUT)
  }
}
const stopTimeout = () => {
  if (timeoutID !== -1) {
    window.clearTimeout(timeoutID)
    timeoutID = -1
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.media-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  place-items: center;
}

.media-container-background {
  background-color: var(--h-theme-page-background-color);
  border: solid 1px grey;
}

.media-content {
  grid-column-start: 1;
  grid-row-start: 1;
}

video, img {
  object-fit: contain;
  object-position: center;
}

.invisible-element {
  visibility: hidden;
}

</style>
