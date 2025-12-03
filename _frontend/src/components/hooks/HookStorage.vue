// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="" style="display: flex; flex-direction: column; gap: 8px;">

    <div style="display: flex; align-items: center; justify-content: flex-start; gap: 8px; padding-left: 8px">
      <div>Storage State for Hook ID</div>
      <SelectView v-model="hookId" small style="font-size:12px; min-width: 70px;">
        <option v-for="h in hooks" :key="h.hook_id" :value="h.hook_id">
          {{ h.hook_id }}
        </option>
      </SelectView>
    </div>

    <table v-if="slots.length > 0" class="o-table">
      <thead>
      <tr style="text-align: left;">
        <th class="o-table__th" scope="col">ADDRESS</th>
        <th class="o-table__th" scope="col">VALUE</th>
        <th class="o-table__th" scope="col">DATE</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="s in slots" :key="s.timestamp">
        <td class="o-table__td" style="max-width: 300px;">
          <HexaDumpValue :byte-string="s.key" :word-wrap-medium="8" :word-wrap-small="4"/>
        </td>
        <td class="o-table__td" style="max-width: 300px;">
          <HexaDumpValue :byte-string="s.value" :word-wrap-medium="8" :word-wrap-small="4"/>
        </td>
        <td class="o-table__td" style="max-width: 250px;">
          <TimestampValue :nano="true" :timestamp="s.timestamp"/>
        </td>
      </tr>
      </tbody>
    </table>

    <EmptyTable v-else class="mt-3" no-data-message="This hook does not use any storage slot"/>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {HooksByAccountIdCache} from "@/utils/cache/HooksByAccountIdCache.ts";
import SelectView from "@/elements/SelectView.vue";
import {HookStorageByIdCache} from "@/utils/cache/HookStorageByIdCache.ts";
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import EmptyTable from "@/components/EmptyTable.vue";

const props = defineProps({
  accountId: {
    type: String
  }
})

const accountId = computed(() => props.accountId ?? null)
const hooksLookup = HooksByAccountIdCache.instance.makeLookup(accountId)
onMounted(() => hooksLookup.mount())
onBeforeUnmount(() => hooksLookup.unmount())
const hooks = computed(() => hooksLookup.entity.value || [])
const hookId = ref<number>(hooks.value[0]?.hook_id ?? 1)

const storageLookupKey = computed(() => {
  return accountId.value
      ? HookStorageByIdCache.makeKey(accountId.value, hookId.value)
      : ''
})
const storageLookup = HookStorageByIdCache.instance.makeLookup(storageLookupKey)
onMounted(() => storageLookup.mount())
onBeforeUnmount(() => storageLookup.unmount())
const slots = computed(() => storageLookup.entity.value || [])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
