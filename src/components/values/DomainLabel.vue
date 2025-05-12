// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <EntityLabel :label="props.domainName" :compact="props.compact">
    <template #icon>
      <NotebookTabs :size="12" :class="{'low-contrast':props.compact}"/>
    </template>

    <template #tooltip>
      <p>Domain name</p>
      <p>provided by {{ props.providerName }}</p>
    </template>
  </EntityLabel>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import EntityLabel from "@/components/values/EntityLabel.vue";
import {NotebookTabs} from 'lucide-vue-next';

const props = defineProps({
  domainName: {
    type: String as PropType<string | null>,
    default: null
  },
  providerName: {
    type: String as PropType<string | null>,
    default: null
  },
  compact: {
    type: Boolean,
    default: false
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.low-contrast {
  color: var(--text-secondary);
}

</style>