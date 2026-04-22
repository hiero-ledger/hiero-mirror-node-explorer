// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      {{ props.title }}
    </template>
    <template #content>
      <p class="mb-4"> {{ props.subtitle }}</p>
      <RegisteredNodeTable :nodes="props.nodes"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {PropType} from "vue";
import RegisteredNodeTable from "@/components/node/RegisteredNodeTable.vue";
import {RegisteredNode} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  title: String,
  subtitle: String,
  nodes: {
    type: Object as PropType<Array<RegisteredNode>>,
    required: true
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
