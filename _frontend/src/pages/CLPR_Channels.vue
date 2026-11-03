// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Channels
    </template>
    <template #right-control>
      <SelectView v-model="selectedStatus" :small="true" data-cy="select-status">
        <option value="">STATUS: ALL</option>
        <option v-for="st in Object.values(ClprChannelStatus)" :key="st" :value="st">{{ st }}</option>
      </SelectView>
    </template>
    <template #content>
      <ClprChannelTable :channels="channels"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ref} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import SelectView from "@/elements/SelectView.vue";
import ClprChannelTable from "@/components/clpr/ClprChannelTable.vue";
import {getClprMockChannels} from "@/components/clpr/ClprMockData.ts";
import {ClprChannelStatus} from "@/schemas/MirrorNodeSchemas.ts";

defineProps({
  network: String
})

const selectedStatus = ref<string>("")
const channels = computed(() => getClprMockChannels(
    selectedStatus.value === "" ? null : selectedStatus.value as ClprChannelStatus))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
