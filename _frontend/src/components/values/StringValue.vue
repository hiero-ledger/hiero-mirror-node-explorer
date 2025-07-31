// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <span v-if="stringValue" class="h-should-wrap">{{ stringValue }}</span>

  <span v-else-if="initialLoading"/>

  <span v-else-if="showNone" class="h-is-low-contrast">None</span>

  <span v-else/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent, inject, PropType, ref} from 'vue';
import {initialLoadingKey} from "@/AppKeys";

export default defineComponent({
  name: 'StringValue',

  props: {
    stringValue: {
      type: String as PropType<string | null>,
      default: null
    },
    showNone: {
      type: Boolean,
      default: true
    },
  },

  setup() {
    const initialLoading = inject(initialLoadingKey, ref(false))
    return {initialLoading}
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>