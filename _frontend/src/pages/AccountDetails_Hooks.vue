// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <HooksSection :account-id="normalizedAccountId ?? undefined"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {computed, onBeforeUnmount, onMounted} from 'vue';
import {AccountLocParser} from "@/utils/parser/AccountLocParser";
import {NetworkConfig} from "@/config/NetworkConfig";
import HooksSection from "@/components/hooks/HooksSection.vue";

const props = defineProps({
  accountId: String,
  network: String,
})

const networkConfig = NetworkConfig.inject()

//
// account
//
const accountLocParser = new AccountLocParser(computed(() => props.accountId ?? null), networkConfig)
onMounted(() => accountLocParser.mount())
onBeforeUnmount(() => accountLocParser.unmount())

const normalizedAccountId = accountLocParser.accountId

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

