// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ClprPill :label="props.status" :level="level"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import ClprPill, {ClprPillLevel} from "@/components/clpr/ClprPill.vue";
import {ClprChannelStatus} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  status: {
    type: String as PropType<ClprChannelStatus>,
    required: true
  }
})

const level = computed<ClprPillLevel>(() => {
  switch (props.status) {
    case ClprChannelStatus.ACTIVE:
      return "success"
    case ClprChannelStatus.PAUSED:
      return "error"
    case ClprChannelStatus.CLOSING:
      return "warn"
    default:
      return "default"
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
