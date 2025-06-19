// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="freezeStatus">
    {{ freezeStatus }}
  </div>

  <div v-else/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {TokenAssociationCache} from "@/utils/cache/TokenAssociationCache.ts";
import {FreezeStatus} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  accountId: {
    type: String as PropType<string | null>,
    default: null
  },
  tokenId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const accountId = computed(() => props.accountId)
const tokenId = computed(() => props.tokenId)

const associationLookup = TokenAssociationCache.instance.makeTokenAssociationLookup(accountId, tokenId)
onMounted(() => associationLookup.mount())
onBeforeUnmount(() => associationLookup.unmount())

const freezeStatus = computed(() => {
  let result: string | null
  const relationships = associationLookup.entity.value
  if (relationships && relationships.length >= 1) {
    result = relationships[0].freeze_status === FreezeStatus.NOT_APPLICABLE ? 'N/A' : relationships[0].freeze_status
  } else {
    result = null
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
