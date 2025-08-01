// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      <span>Recent Fungible Tokens</span>
    </template>
    <template #left-control>
      <PlayPauseButton :controller="tokenTableController"/>
    </template>
    <template #content>
      <TokenTable :controller="tokenTableController"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, onBeforeUnmount, onMounted, ref} from 'vue';
import TokenTable from "@/components/token/TokenTable.vue";
import {TokenTableController} from "@/components/token/TokenTableController";
import {useRouter} from "vue-router";
import {TokenType} from "@/schemas/MirrorNodeSchemas";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";

defineProps({
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)

//
// TOKEN TableController
//
const defaultPageSize = isMediumScreen ? 15 : 10
const tokenTableController = new TokenTableController(useRouter(), defaultPageSize, ref(TokenType.FUNGIBLE_COMMON), "p2", "k2")
onMounted(() => {
  tokenTableController.mount()
})
onBeforeUnmount(() => {
  tokenTableController.unmount()
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
