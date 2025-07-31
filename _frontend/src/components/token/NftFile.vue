// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <MediaContent
      :url="url"
      :type="type"
      :size="size"
      :auto="false"
      :no-anchor="noAnchor"
  >
    <template #placeHolder>
      <div class="icon mt-4" style="font-size: 50px">
        <i class="fas fa-file"></i>
      </div>
      <div class="place-holder-text">
        {{ type }}
      </div>
    </template>
  </MediaContent>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent, PropType} from "vue";
import MediaContent from "@/components/MediaContent.vue";

export default defineComponent({
  name: "NftFile",
  components: {MediaContent},

  props: {
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
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.place-holder-text {
  font-size: 10px;
  margin-top: 1.5rem;
}

</style>
