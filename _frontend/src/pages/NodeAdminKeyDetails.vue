// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 :page-title="pageTitle">

    <DashboardCardV2>
      <template #title>
        <span>Admin Key for Node </span>
        <div v-if="nodeId !== null">
          <router-link :to="routeManager.makeRouteToNode(nodeId)">
            <span>{{ nodeId }} - {{ nodeDescription }}</span>
          </router-link>
        </div>
      </template>

      <template #content>
        <KeyValue
            v-if="nodeId !== null"
            :in-details-page="true"
            :key-bytes="nodeKey?.key"
            :key-type="nodeKey?._type"
            :show-none="true"
        />
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {NodeAnalyzer} from "@/utils/analyzer/NodeAnalyzer.ts";

import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  nodeId: {
    type: String as PropType<string | null>,
    default: null
  },
  network: String
})

//
// node
//

const nodeId = computed(() => {
  let result: number | null
  if (props.nodeId !== null) {
    const id = parseInt(props.nodeId)
    result = isNaN(id) || id < 0 ? null : id
  } else {
    result = null
  }
  return result;
})

const nodeAnalyzer = new NodeAnalyzer(nodeId)
onMounted(() => nodeAnalyzer.mount())
onBeforeUnmount(() => nodeAnalyzer.unmount())

const nodeKey = nodeAnalyzer.adminKey
const nodeDescription = nodeAnalyzer.shortNodeDescription

const pageTitle = computed(() =>
    nodeId.value !== null ? "Admin Key for Node " + nodeId.value : null
)

</script>

<style/>
