// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="formattedId && routeToTransaction" class="h-is-numeric h-should-wrap">
    <router-link :to="routeToTransaction">
      <div>
        <TransactionIdValue :id="formattedId"/>
      </div>
    </router-link>
  </div>

  <span v-else-if="showNone" class="h-is-low-contrast">None</span>

  <span v-else/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onMounted, PropType, ref, watch} from "vue";
import {TransactionID} from "@/utils/TransactionID";
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import {PathParam} from "@/utils/PathParam";
import {Timestamp} from "@/utils/Timestamp";
import {TransactionHash} from "@/utils/TransactionHash";
import {TransactionByHashCache} from "@/utils/cache/TransactionByHashCache";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache";
import TransactionIdValue from "@/components/values/TransactionIdValue.vue";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  transactionLoc: String as PropType<string | undefined>,
  showNone: {
    type: Boolean,
    default: true
  },
})

const normalizedId = ref<string | null>(null)
const updateNormalizedId = () => {
  if (props.transactionLoc) {
    const tloc = PathParam.parseTransactionLoc(props.transactionLoc)
    if (tloc instanceof Timestamp) {
      TransactionByTsCache.instance.lookup(props.transactionLoc)
          .then((t: Transaction | null) => {
            normalizedId.value = t?.transaction_id ?? null
          })
          .catch(() => {
            normalizedId.value = null
          })
    } else if (tloc instanceof TransactionHash) {
      TransactionByHashCache.instance.lookup(props.transactionLoc)
          .then((t: Transaction | null) => {
            normalizedId.value = t?.transaction_id ?? null
          })
          .catch(() => {
            normalizedId.value = null
          })
    } else {
      normalizedId.value = null
    }
  } else {
    normalizedId.value = null
  }
}
watch(computed(() => props.transactionLoc), () => updateNormalizedId())
onMounted(() => updateNormalizedId())

const formattedId = computed(() => {
  return normalizedId.value !== null ? TransactionID.normalizeForDisplay(normalizedId.value) : null
})

const routeToTransaction = computed(() => {
  return props.transactionLoc ? routeManager.makeRouteToTransaction(props.transactionLoc) : null
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

