// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Block Details
    </template>

    <template #right-control>
    </template>

    <template #content>
      <Property id="blockHash" full-width>
        <template v-slot:name>Hash</template>
        <template v-slot:value>
          <KeyValue :key-bytes="block?.hash" :show-none="true" key-type="SHA384"/>
        </template>
      </Property>
      <Property id="count" full-width>
        <template #name>No. Transactions</template>
        <template v-slot:value>
          <PlainAmount :amount="block?.count"/>
        </template>
      </Property>
      <Property id="fromTimestamp" full-width>
        <template v-slot:name>From Timestamp</template>
        <template v-slot:value>
          <TimestampValue :show-none="true" :timestamp="block?.timestamp?.from"/>
        </template>
      </Property>
      <Property id="toTimestamp" full-width>
        <template v-slot:name>To Timestamp</template>
        <template v-slot:value>
          <TimestampValue :show-none="true" :timestamp="block?.timestamp?.to ?? undefined"/>
        </template>
      </Property>
      <Property id="gasUsed" full-width>
        <template v-slot:name>Gas Used</template>
        <template v-slot:value>
          <PlainAmount :amount="block?.gas_used"/>
        </template>
      </Property>
      <Property id="recordFileName" full-width>
        <template v-slot:name>Record File Name</template>
        <template v-slot:value>
          <StringValue :string-value="block?.name"/>
        </template>
      </Property>
    </template>
  </DashboardCardV2>

  <MirrorLink :network="props.network" entityUrl="blocks" :loc="props.blockHon"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted} from "vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import Property from "@/components/Property.vue";
import StringValue from "@/components/values/StringValue.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import {BlockLocParser} from "@/utils/parser/BlockLocParser.ts";
import MirrorLink from "@/components/MirrorLink.vue";

const props = defineProps({
  blockHon: String,
  network: String
})

//
// BlockLocParser
//
const blockLocParser = new BlockLocParser(computed(() => props.blockHon ?? null))
onMounted(() => blockLocParser.mount())
onBeforeUnmount(() => blockLocParser.unmount())
const block = blockLocParser.block

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped/>
