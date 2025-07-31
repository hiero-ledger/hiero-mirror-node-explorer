// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <PlainAmount :amount="gas" none-label="None"/>
  <span v-if="amount" class="h-is-extra-text ml-2">
    <HbarAmount :amount="amount"/>
  </span>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, PropType} from "vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";

export default defineComponent({
  name: "GasAmount",
  components: {HbarAmount, PlainAmount},

  props: {
    gas: {
      type: Number as PropType<number | null>,
      default: null
    },
    price: {
      type: Number as PropType<number | null>,
      default: null
    },
  },

  setup(props) {
    const amount = computed(() =>
        props.gas !== null && props.price !== null ? props.gas * props.price : null
    )
    return {
      amount
    }
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

