// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="props.tokenInfo">

    <template #title>
      Token Keys
    </template>

    <template #left-content>
      <Property id="adminKey">
        <template #name>Admin Key</template>
        <template #value>
          <KeyValue :key-bytes="props.tokenInfo.admin_key?.key"
                    :key-type="props.tokenInfo.admin_key?._type"
                    :show-none="true"
                    none-extra="Token is immutable"/>
        </template>
      </Property>
      <Property id="feeScheduleKey">
        <template #name>Fee Schedule Key</template>
        <template #value>
          <KeyValue :key-bytes="props.tokenInfo.fee_schedule_key?.key"
                    :key-type="props.tokenInfo.fee_schedule_key?._type"
                    :show-none="true"
                    none-extra="Custom fee schedule is immutable"/>
        </template>
      </Property>
      <Property id="freezeKey">
        <template #name>Freeze Key</template>
        <template #value>
          <KeyValue :key-bytes="props.tokenInfo.freeze_key?.key"
                    :key-type="props.tokenInfo.freeze_key?._type"
                    :show-none="true"
                    none-extra="Token cannot be frozen"/>
        </template>
      </Property>
      <Property id="kycKey">
        <template #name>KYC Key</template>
        <template #value>
          <KeyValue :key-bytes="props.tokenInfo.kyc_key?.key"
                    :key-type="props.tokenInfo.kyc_key?._type"
                    :show-none="true"
                    none-extra="KYC is not required"/>
        </template>
      </Property>
    </template>

    <template #right-content>
      <Property id="metadataKey">
        <template #name>Metadata Key</template>
        <template #value>
          <KeyValue :key-bytes="props.tokenInfo.metadata_key?.key"
                    :key-type="props.tokenInfo.metadata_key?._type"
                    :show-none="true"
                    none-extra="Token metadata is immutable"/>
        </template>
      </Property>
      <Property id="pauseKey">
        <template #name>Pause Key</template>
        <template #value>
          <KeyValue :key-bytes="props.tokenInfo.pause_key?.key"
                    :key-type="props.tokenInfo.pause_key?._type"
                    :show-none="true"
                    none-extra="Token cannot be paused"/>
        </template>
      </Property>
      <Property id="supplyKey">
        <template #name>Supply Key</template>
        <template #value>
          <KeyValue :key-bytes="props.tokenInfo.supply_key?.key"
                    :key-type="props.tokenInfo.supply_key?._type"
                    :show-none="true"
                    none-extra="Token cannot be minted or burnt"/>
        </template>
      </Property>
      <Property id="wipeKey">
        <template #name>Wipe Key</template>
        <template #value>
          <KeyValue :key-bytes="props.tokenInfo.wipe_key?.key"
                    :key-type="props.tokenInfo.wipe_key?._type"
                    :show-none="true"
                    none-extra="Token cannot be wiped"/>
        </template>
      </Property>
    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import Property from "@/components/Property.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import {TokenInfo} from "@/schemas/MirrorNodeSchemas.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

const props = defineProps({
  tokenInfo: {
    type: Object as PropType<TokenInfo | null>,
    default: null
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>
</style>
