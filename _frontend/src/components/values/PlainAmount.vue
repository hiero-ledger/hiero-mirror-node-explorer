// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <span v-if="formattedAmount !== null">{{ formattedAmount }}</span>
  <span v-else-if="initialLoading"/>
  <span v-else class="h-is-low-contrast">{{ noneLabel }}</span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, inject, PropType, ref} from "vue";
import {initialLoadingKey} from "@/AppKeys";

export default defineComponent({
  name: "PlainAmount",

  props: {
    amount: {
      type: Number as PropType<number | null>,
      default: null
    },
    noneLabel: {
      type: String,
      default: "None"
    }
  },

  setup(props) {
    const formattedAmount = computed(() => {
      let result: string | null
      if (props.amount !== null && !isNaN(props.amount)) {
        result = props.amount.toLocaleString()
      } else {
        result = null
      }
      return result
    })

    const initialLoading = inject(initialLoadingKey, ref(false))

    return {
      formattedAmount,
      initialLoading
    }
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

