// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="isInfinite">
    <span class="h-is-low-contrast">Infinite</span>
  </template>
  <template v-else-if="formattedValue">
    <span>{{ formattedValue }}</span>
  </template>
  <template v-else-if="showNone && !initialLoading">
    <span class="h-is-low-contrast">None</span>
  </template>
  <template v-else>
    <span/>
  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, inject, ref} from "vue";
import {formatSeconds} from "@/utils/Duration";
import {initialLoadingKey} from "@/AppKeys";
import {infiniteDuration} from "@/schemas/MirrorNodeSchemas";

export default defineComponent({
  name: "DurationValue",

  props: {
    numberValue: Number,
    stringValue: String,
    showNone: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {

    const formattedValue = computed(() => {
      let result: string | null
      if (props.numberValue) {
        result = formatSeconds(props.numberValue)
      } else if (props.stringValue) {
        result = formatSeconds(props.stringValue)
      } else {
        result = null
      }
      return result
    })

    const isInfinite = computed(() => {
      const duration = props.numberValue ?? Number.parseInt(props.stringValue ?? "")
      return duration >= infiniteDuration
    })

    const initialLoading = inject(initialLoadingKey, ref(false))

    return {
      isInfinite, formattedValue, initialLoading,
    }
  }
});


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
