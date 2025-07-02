// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

    <template #title>
      Custom Fees
    </template>

    <template #content>

      <Property id="custom-fee-created-at" full-width>
        <template #name>Created at</template>
        <template #value>
          <TimestampValue :nano="true" :show-none="true" :timestamp="props.fees.created_timestamp"/>
        </template>
      </Property>

      <Property id="fixedFee" full-width>
        <template #name>Fixed Fees</template>
        <template #value>
          <FixedFeeTable v-if="fixedFees.length" :fees="fixedFees"/>
          <div v-else class="h-is-low-contrast">None</div>
        </template>
      </Property>

      <Property v-if="hasExemptList" id="fee-exempt-key-list" full-width>
        <template #name>Fee Exempt Key List</template>
        <template #value>
          <div class="exempt-list">
            <KeyValue
                v-for="k in props.exemptKeyList"
                :key="k.key"
                :key-bytes="k.key"
                :key-type="k._type"
                :show-none="true"
            />
          </div>
        </template>
      </Property>

    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import TimestampValue from "@/components/values/TimestampValue.vue";
import Property from "@/components/Property.vue";
import FixedFeeTable from "@/components/token/FixedFeeTable.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ConsensusCustomFees, Key} from "@/schemas/MirrorNodeSchemas.ts";
import KeyValue from "@/components/values/KeyValue.vue";

const props = defineProps({
  fees: {
    type: Object as PropType<ConsensusCustomFees>,
    required: true
  },
  exemptKeyList: {
    type: Array as PropType<Key[]>,
    default: []
  }
})

const fixedFees = computed(() => props.fees.fixed_fees)
const hasExemptList = computed(() => props.exemptKeyList.length > 0)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.exempt-list {
  display: flex;
  flex-direction: column;
  gap: 8px
}

</style>
