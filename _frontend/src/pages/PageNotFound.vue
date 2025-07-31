// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Page Not Found">

    <div class="page-not-found">
      <p>No page matches the specified URL.</p>
      <p>Check URL value or use tabs in navigation bar.</p>
    </div>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import PageFrameV2 from "@/components/page/PageFrameV2.vue";
</script>


<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.page-not-found {
  color: var(--text-secondary);
  min-height: 450px;
  text-align: center;
  padding-top: 100px;
  font-family: var(--font-family-proportional), sans-serif;
  font-weight: 300;;
}

</style>
