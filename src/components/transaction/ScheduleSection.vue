// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="props.transaction" collapsible-key="scheduleDetails">
    <template #title>
      <span>Schedule</span>
    </template>
    <template #content>
      <Property id="schedule-id" :full-width="true">
        <template v-slot:name>Schedule ID</template>
        <template v-slot:value>
          {{ scheduleId }}
        </template>
      </Property>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import Property from "@/components/Property.vue";
import {TransactionDetail} from "@/schemas/MirrorNodeSchemas";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {ScheduleByIdCache} from "@/utils/cache/ScheduleByIdCache.ts";

const props = defineProps({
  transaction: {
    type: Object as PropType<TransactionDetail | null>,
    default: null
  }
})

const scheduleId = computed(() => props.transaction?.entity_id ?? null)
const scheduleLookup = ScheduleByIdCache.instance.makeLookup(scheduleId)
const schedule = scheduleLookup.entity
onMounted(() => scheduleLookup.mount())
onBeforeUnmount(() => scheduleLookup.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
