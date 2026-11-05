// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ClprConnectorsCard :channel-id="selectedChannelId" :state-filter="true">
    <template #channel-filter>
      <span class="filter-label">CHANNEL:</span>
      <SelectView v-model="selectedChannelId" :small="true" data-cy="select-channel">
        <option v-for="c in CLPR_MOCK_COMPLETED_CHANNELS" :key="c.channel_id!" :value="c.channel_id!">
          {{ makeChannelLabel(c) }}
        </option>
      </SelectView>
    </template>
  </ClprConnectorsCard>

  <ClprPendingConnectorsCard/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ref} from "vue";
import SelectView from "@/elements/SelectView.vue";
import {shortenHex} from "@/components/clpr/ClprUtils.ts";
import ClprPendingConnectorsCard from "@/components/clpr/ClprPendingConnectorsCard.vue";
import ClprConnectorsCard from "@/components/clpr/ClprConnectorsCard.vue";
import {CLPR_MOCK_COMPLETED_CHANNELS} from "@/components/clpr/ClprMockData.ts";
import {ClprChannel} from "@/schemas/MirrorNodeSchemas.ts";

defineProps({
  network: String
})

const selectedChannelId = ref<string>(CLPR_MOCK_COMPLETED_CHANNELS[0].channel_id!)

const makeChannelLabel = (c: ClprChannel): string => c.chain_id + " · " + shortenHex(c.channel_id!)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

span.filter-label {
  color: var(--text-secondary);
  font-size: 10px;
}

</style>
