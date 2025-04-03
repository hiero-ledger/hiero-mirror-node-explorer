// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <EntityIOL :entityId="contractId" :domain-name="name" :provider-name="providerName"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {NameQuery} from "@/utils/name_service/NameQuery";
import EntityIOL from "@/components/values/link/EntityIOL.vue";

const props = defineProps({
  contractId: {
    type: String as PropType<string | null>,
    default: null
  },
})

const contractId = computed(() => props.contractId)

const nameQuery = new NameQuery(contractId)
onMounted(() => nameQuery.mount())
onBeforeUnmount(() => nameQuery.unmount())
const name = nameQuery.name
const providerName = nameQuery.providerName

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
