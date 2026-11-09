// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="h-side-by-side-content">
    <ClprLedgerConfigurationCard/>
    <ClprEconomicConfigurationCard/>
  </div>

  <ClprEndpointManifestCard/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import ClprLedgerConfigurationCard from "@/components/clpr/ClprLedgerConfigurationCard.vue";
import ClprEconomicConfigurationCard from "@/components/clpr/ClprEconomicConfigurationCard.vue";
import ClprEndpointManifestCard from "@/components/clpr/ClprEndpointManifestCard.vue";

defineProps({
  network: String
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
