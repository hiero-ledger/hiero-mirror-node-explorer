// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="value">
    <EVMAddress v-if="addressValue" :address="addressValue" :compact="!isSmallScreen"/>
    <Copyable v-else :content-to-copy="value">
      <template #content>
        <div :class="{'h-is-low-contrast': lowContrast}" class="function-value">
          <p class="mr-1">{{ value }}</p>

          <p v-if="ntv?.comment"
             class="h-is-extra-text">
            ({{ ntv.comment }})
          </p>
        </div>
      </template>
    </Copyable>
    <div v-if="!hideType" class="h-is-extra-text">{{ type }}</div>
  </div>
  <div v-else-if="initialLoading"/>
  <div v-else class="h-is-low-contrast">None</div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, inject, PropType, ref} from 'vue';
import {initialLoadingKey} from "@/AppKeys";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {NameTypeValue} from "@/utils/analyzer/call/FunctionCallDecoder.ts";
import Copyable from "@/elements/Copyable.vue";

const props = defineProps({
  ntv: Object as PropType<NameTypeValue>,
  hideType: {
    type: Boolean,
    default: false,
    required: false,
  },
  lowContrast: {
    type: Boolean,
    default: false,
    required: false
  }
})

const isSmallScreen = inject('isSmallScreen', true)
const initialLoading = inject(initialLoadingKey, ref(false))

const addressValue = computed(() => {
  return props.ntv?.type === 'address' ? props.ntv.value as string : null
})

const type = props.ntv?.type
const value = props.ntv?.value?.toString()

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.function-value {
  display: flex;
  word-break: break-word;
}

</style>
