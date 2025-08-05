// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <SelectView
      v-model="selected"
      :border-visible="false"
      data-cy="select-page-size"
  >
    <template v-for="accountId in props.accountIds" :key="accountId">
      <option class="account-selector-option" :value="accountId">{{ accountId }}</option>
    </template>
  </SelectView>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import SelectView from "@/elements/SelectView.vue";

const selected = defineModel({
  type: String,
  required: true
})

const props = defineProps({
  accountIds: {
    type: Array as PropType<string[]>,
    required: true
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

select > option {
  color: var(--text-primary);
  background-color: var(--background-primary)
}
</style>
