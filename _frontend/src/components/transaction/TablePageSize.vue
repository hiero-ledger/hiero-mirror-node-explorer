// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <SelectView
      v-bind:model-value="selected"
      @update:model-value="onSelect($event)"
      :small="true"
      data-cy="select-page-size"
  >
    <!--        Use "as number" to avoid warning as o-select does not allow to force type-->
    <option :value="5 as number">5 per page</option>
    <option :value="10 as number">10 per page</option>
    <option :value="15 as number">15 per page</option>
    <option :value="20 as number">20 per page</option>
    <option :value="50 as number">50 per page</option>
    <option :value="100 as number">100 per page</option>
  </SelectView>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {ref, watch} from "vue";
import SelectView from "@/elements/SelectView.vue";

const props = defineProps({
  size: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(["update:size"])

const selected = ref(props.size)
watch(() => props.size, () => selected.value = props.size)
const onSelect = (value: number) => {
  selected.value = value
  emit("update:size", value)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
