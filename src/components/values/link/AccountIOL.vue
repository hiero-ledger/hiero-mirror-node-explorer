// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <EntityIOL :entityId="accountId" :domain-name="name" :provider-name="providerName" :null-label="nullLabel"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import EntityIOL from "@/components/values/link/EntityIOL.vue";
import {NameQuery} from "@/utils/name_service/NameQuery";

const props = defineProps({
  accountId: {
    type: String as PropType<string | null>,
    default: null
  },
  nullLabel: {
    type: String,
    default: null
  }
})

const accountId = computed(() => props.accountId)

const nameQuery = new NameQuery(accountId)
onMounted(() => nameQuery.mount())
onBeforeUnmount(() => nameQuery.unmount())
const name = nameQuery.name
const providerName = nameQuery.providerName

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
