// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div>
    <Copyable
        :content-to-copy="props.id ?? ''"
        :enable-copy="props.enableCopy"
    >
      <template #content>
        <span style="font-weight: bold">{{ props.id ?? "" }}</span>
      </template>
    </Copyable>
    <span v-if="props.checksum" class="h-is-low-contrast">-{{ props.checksum }}</span>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import Copyable from "@/elements/Copyable.vue";

const props = defineProps({
  id: {
    type: String as PropType<string | null>,
    default: null
  },
  checksum: {
    type: String as PropType<string | null>,
    default: null
  },
  enableCopy: {
    type: Boolean,
    default: true
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
