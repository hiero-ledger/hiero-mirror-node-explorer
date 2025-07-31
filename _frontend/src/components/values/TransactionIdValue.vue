// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <Copyable
      :enable-copy="enableCopy"
      :content-to-copy="transactionId ?? ''"
  >
    <template #content>
      <div class="is-inline-block">
        <span>{{ transactionId }}</span>
      </div>
    </template>
  </Copyable>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType, ref, watch} from "vue";
import {TransactionID} from "@/utils/TransactionID";
import Copyable from "@/elements/Copyable.vue";

const props = defineProps({
  id: {
    type: String as PropType<string | null>,
    default: null
  },
  enableCopy: {
    type: Boolean,
    default: false
  }
})

const transactionId = ref(TransactionID.normalizeForDisplay(props.id ?? ''))
watch([() => props.id, TransactionID.useAtForm], () =>
    transactionId.value = TransactionID.normalizeForDisplay(props.id ?? ''), {immediate: true}
)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
