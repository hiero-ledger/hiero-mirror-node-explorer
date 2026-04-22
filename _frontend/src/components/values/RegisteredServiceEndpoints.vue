// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <!--  If domain_name is provided:               -->
  <!--      www.example.com:50211 (34.94.106.61)  -->
  <!--  otherwise:                                -->
  <!--      34.94.106.61:50211                    -->

  <div v-if="endPoints.length > 0">
    <div v-for="s in endPoints" :key="(s.ip_address || s.domain_name)!" class="h-is-monospace">
      <template v-if="s.domain_name && s.domain_name.length > 0">
        <span>{{ s.domain_name }}</span>
        <span v-if="s.port > 0" class="h-is-low-contrast">{{ ':' + s.port }}</span>
        <span v-if="s.ip_address && s.ip_address.length > 0" class="ml-1">{{ `(${s.ip_address})` }}</span>
      </template>
      <template v-else-if="s.ip_address && s.ip_address.length > 0">
        <span>{{ s.ip_address }}</span>
        <span v-if="s.port > 0" class="h-is-low-contrast">{{ ':' + s.port }}</span>
      </template>
      <div v-if="s.requires_tls" class="h-has-pill h-chip-info ml-2">TLS</div>
    </div>
  </div>

  <span v-else-if="initialLoading"/>

  <span v-else class="h-is-low-contrast">None</span>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, inject, PropType, ref} from 'vue';
import {initialLoadingKey} from "@/AppKeys";
import {RegisteredServiceEndPoint} from "@/schemas/MirrorNodeSchemas";

const props = defineProps({
  endPoints: {
    type: Object as PropType<Array<RegisteredServiceEndPoint>>,
    required: true
  },
})

const initialLoading = inject(initialLoadingKey, ref(false))

const endPoints = computed(() =>
    props.endPoints.filter(s => s.ip_address || s.domain_name)
)
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
