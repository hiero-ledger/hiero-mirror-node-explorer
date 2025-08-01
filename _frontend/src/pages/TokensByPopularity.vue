// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Tokens by Popularity">

    <DashboardCardV2>
      <template #title>
        {{ `Popular tokens matching "${props.name}"` }}
      </template>
      <template #content>
        <TokensByPopularityTable :name="props.name"/>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import TokensByPopularityTable from "@/components/token/TokensByPopularityTable.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

const props = defineProps({
  network: String,
  name: {
    type: String as PropType<string | null>,
    default: null
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
