// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <MediaContent
      :url="props.url"
      :type="props.type"
      :size="props.size"
      :auto="false"
      :no-anchor="props.noAnchor"
  >
    <template #placeHolder>
      <div class="place-holder-content">
        <File :size="50"/>
        <div class="place-holder-text">
          {{ props.type }}
        </div>
      </div>
    </template>
  </MediaContent>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import {File} from "lucide-vue-next";
import MediaContent from "@/components/MediaContent.vue";

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
    default: 50
  },
  noAnchor: {
    type: Boolean,
    default: false
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.place-holder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

div.place-holder-text {
  font-size: 10px;
  margin-top: 1.5rem;
}

</style>
