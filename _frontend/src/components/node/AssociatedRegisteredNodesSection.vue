// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      Associated Registered Nodes
    </template>
    <template #content>
      <RegisteredNodeTable :nodes="props.nodes" :display-service-type="true"/>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {PropType} from "vue";
import {RegisteredNode} from "@/schemas/MirrorNodeSchemas.ts";
import RegisteredNodeTable from "@/components/node/RegisteredNodeTable.vue";

const props = defineProps({
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
