// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Messages
    </template>
    <template #right-control>
      <SelectView v-model="selectedChannelId" :small="true" data-cy="select-channel">
        <option v-for="c in CLPR_MOCK_CHANNELS" :key="c.channel_id" :value="c.channel_id">
          {{ makeChannelLabel(c) }}
        </option>
      </SelectView>
    </template>
    <template #content>
      <ClprMessageTable :messages="messages"/>
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
import ClprMessageTable from "@/components/clpr/ClprMessageTable.vue";
import {CLPR_MOCK_CHANNELS, getClprMockMessages} from "@/components/clpr/ClprMockData.ts";
import {ClprChannelMock} from "@/schemas/MirrorNodeSchemas.ts";

defineProps({
  network: String
})

const selectedChannelId = ref<string>(CLPR_MOCK_CHANNELS[0].channel_id)
const messages = computed(() => getClprMockMessages(selectedChannelId.value))

const makeChannelLabel = (c: ClprChannelMock): string =>
    c.chain_id + " · " + c.channel_id.slice(0, 10) + "…" + c.channel_id.slice(-4)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
