// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 :page-title="pageTitle">

    <DashboardCardV2 v-if="nodeExists">
      <template #title>
        <span>Admin Key for RegisteredNode </span>
        <router-link :to="routeManager.makeRouteToRegisteredNode(nodeId!)">
          <span>{{ nodeId }}</span>
          <span v-if="nodeDescription !== null"> - {{ nodeDescription }}</span>
        </router-link>
      </template>

      <template #content>
        <KeyValue
            :in-details-page="true"
            :key-bytes="nodeKey?.key"
            :key-type="nodeKey?._type"
            :show-none="true"
        />
      </template>
    </DashboardCardV2>

    <NotificationBanner v-else :message="`Registered Node ${nodeId} was not found`" is-error/>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, onBeforeUnmount, onMounted, PropType} from 'vue';
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import KeyValue from "@/components/values/KeyValue.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

import {routeManager} from "@/utils/RouteManager.ts";
import {RegisteredNodeAnalyzer} from "@/utils/analyzer/RegisteredNodeAnalyzer.ts";
import NotificationBanner from "@/components/NotificationBanner.vue";

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

const nodeAnalyzer = new RegisteredNodeAnalyzer(nodeId)
onMounted(() => nodeAnalyzer.mount())
onBeforeUnmount(() => nodeAnalyzer.unmount())

const nodeExists = computed(() => nodeAnalyzer.registeredNode.value !== null)
const nodeKey = nodeAnalyzer.adminKey
const nodeDescription = nodeAnalyzer.description

const pageTitle = computed(() =>
    nodeId.value !== null ? "Admin Key for Registered Node " + nodeId.value : null
)

</script>

<style/>
