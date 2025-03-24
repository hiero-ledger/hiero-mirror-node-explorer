// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="is-inline-block">

    <EntityLink :route="scheduleRoute">
      <EntityIOL :entity-id="props.scheduleId"/>
    </EntityLink>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed} from "vue";
import {routeManager} from "@/router";
import EntityLink from "@/components/values/link/EntityLink.vue";
import EntityIOL from "@/components/values/link/EntityIOL.vue";

const props = defineProps({
  scheduleId: String,
})

const scheduleRoute = computed(() => props.scheduleId ? routeManager.makeRouteToSchedule(props.scheduleId) : null)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

