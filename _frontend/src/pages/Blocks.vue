// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Blocks">

    <DashboardCardV2>
      <template #title>
        <span>Blocks</span>
      </template>
      <template #left-control>
        <PlayPauseButton :controller="blockTableController"/>
      </template>
      <template #content>
        <BlockTable :controller="blockTableController"/>
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, onBeforeUnmount, onMounted} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import BlockTable from "@/components/block/BlockTable.vue";
import {BlockTableController} from "@/components/block/BlockTableController";
import {useRouter} from "vue-router";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";

defineProps({
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)

// BlockTableController
const defaultPageSize = isMediumScreen ? 15 : 5
const blockTableController = new BlockTableController(useRouter(), defaultPageSize)
onMounted(() => blockTableController.mount())
onBeforeUnmount(() => blockTableController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
