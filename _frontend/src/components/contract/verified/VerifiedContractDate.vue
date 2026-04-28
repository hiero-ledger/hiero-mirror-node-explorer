// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TimestampValue v-bind:timestamp="timestamp"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {Timestamp} from "@/utils/Timestamp.ts";
import TimestampValue from "@/components/values/TimestampValue.vue";

const props = defineProps({
  verifiedDate: {
    type: String as PropType<string>,
    required: true
  }
})

const timestamp = computed(() => {
  let result: string|null
  const d = new Date(props.verifiedDate)
  if (Number.isNaN(d.getTime())) {
    result = null
  } else {
    result = Timestamp.fromDate(d).toString()
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
