// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <MediaContent
      :url="props.url"
      :type="props.type"
      :size="props.size"
      :auto="props.auto"
      :no-anchor="props.noAnchor"
      @on-load-error="onLoadError"
  >
    <template #placeHolder>
      <div class="placeholder">
        <ImageOff v-if="size >= 100" :size="40"/>
        <span>
        {{ size > 200 ? 'Non Fungible Token' : 'NFT' }}
      </span>
        <InfoTooltip
            v-if="size >= 100 && (warningTooltip || infoTooltip)"
            :warning-label="warningTooltip"
            :label="infoTooltip"
        />
      </div>
    </template>
  </MediaContent>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, ref} from "vue";
import InfoTooltip from "@/components/InfoTooltip.vue";
import MediaContent from "@/components/MediaContent.vue";
import {ImageOff} from 'lucide-vue-next';

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

const isOnIpfs = computed(() => props.url?.includes('ipfs'))

const mediaError = ref(false)
const onLoadError = () => mediaError.value = true

const infoTooltip = computed(() => !props.url ? 'The NFT metadata does not provide any image' : null)

const warningTooltip = computed(() => {
  let result
  if (mediaError.value) {
    result = 'NFT image could not be loaded. '
    if (isOnIpfs.value) {
      result += 'This might be transient due to the nature of the IPFS network. '
          + 'Try to reload the page in a few moments.'
    }
  } else {
    result = null
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.placeholder {
  align-items: center;
  display: flex;
  gap: 8px;
}

</style>
