// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ClprOverviewStatsCard/>

  <ClprChannelStatusCard/>

  <ClprAttentionCard/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import ClprOverviewStatsCard from "@/components/clpr/ClprOverviewStatsCard.vue";
import ClprChannelStatusCard from "@/components/clpr/ClprChannelStatusCard.vue";
import ClprAttentionCard from "@/components/clpr/ClprAttentionCard.vue";

defineProps({
  network: String
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
