// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div style="display: flex; flex-direction: column; gap: 16px;">
    <template v-for="h in hooks" :key="h.hook_id">
      <HookEntry :hook="h"/>
    </template>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, onBeforeUnmount, onMounted} from "vue";
import {HooksByAccountIdCache} from "@/utils/cache/HooksByAccountIdCache.ts";
import HookEntry from "@/components/hooks/HookEntry.vue";

const props = defineProps({
  accountId: String,
})

const accountId = computed(() => props.accountId ?? null)
const hooksLookup = HooksByAccountIdCache.instance.makeLookup(accountId)
onMounted(() => hooksLookup.mount())
onBeforeUnmount(() => hooksLookup.unmount())
const hooks = computed(() => hooksLookup.entity.value || [])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
