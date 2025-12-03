// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div style="display: flex; flex-direction: column; gap: 16px;">
    <template v-for="h in hooks" :key="h.hook_id">
      <HieroHookEntry :hook="h"/>
    </template>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, onBeforeUnmount, onMounted} from "vue";
import {HieroHooksByAccountIdCache} from "@/utils/cache/HieroHooksByAccountIdCache.ts";
import HieroHookEntry from "@/components/hooks/HieroHookEntry.vue";

const props = defineProps({
  accountId: String,
})

const accountId = computed(() => props.accountId ?? null)
const hooksLookup = HieroHooksByAccountIdCache.instance.makeLookup(accountId)
onMounted(() => hooksLookup.mount())
onBeforeUnmount(() => hooksLookup.unmount())
const hooks = computed(() => hooksLookup.entity.value || [])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
