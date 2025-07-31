// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <!--  If domain_name is provided:               -->
  <!--      www.example.com:50211 (34.94.106.61)  -->
  <!--  otherwise:                                -->
  <!--      34.94.106.61:50211                    -->

  <div v-if="props.endpoints && props.endpoints.length > 0">
    <div v-for="s in props.endpoints" :key="s.ip_address_v4" class="h-is-monospace">
      <template v-if="s.domain_name.length > 0">
        <span>{{ s.domain_name }}</span>
        <span v-if="s.port > 0" class="h-is-low-contrast">{{ ':' + s.port }}</span>
        <span v-if="s.ip_address_v4.length > 0" class="ml-1">{{ `(${s.ip_address_v4})` }}</span>
      </template>
      <template v-else-if="s.ip_address_v4.length > 0">
        <span>{{ s.ip_address_v4 }}</span>
        <span v-if="s.port > 0" class="h-is-low-contrast">{{ ':' + s.port }}</span>
      </template>
      <template v-else/>
    </div>
  </div>

  <span v-else-if="initialLoading"/>

  <span v-else class="h-is-low-contrast">None</span>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, PropType, ref} from 'vue';
import {initialLoadingKey} from "@/AppKeys";
import {ServiceEndPoint} from "@/schemas/MirrorNodeSchemas";

const props = defineProps({
  endpoints: Object as PropType<Array<ServiceEndPoint> | undefined>,
})

const initialLoading = inject(initialLoadingKey, ref(false))

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
