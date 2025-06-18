// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="dashboard-root">
    <div class="dashboard-content">
      <CounterView :controller="accountCreateCounterController">
        <User :size="32"/>
      </CounterView>

      <div class="mini-line-separator"/>

      <CounterView :controller="contractCreateCounterController">
        <FileScan :size="32"/>
      </CounterView>

      <div v-if="isLargeScreen || !isSmallScreen" class="mini-line-separator"/>

      <CounterView :controller="tokenCreateCounterController">
        <Hexagon :size="32"/>
      </CounterView>

      <div class="mini-line-separator"/>

      <CounterView :controller="accumulatedTransactionCountController">
        <MoveHorizontal :size="32"/>
      </CounterView>
    </div>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, onBeforeUnmount, onMounted, ref} from 'vue';
import {FileScan, Hexagon, MoveHorizontal, User} from 'lucide-vue-next';
import CounterView from "@/charts/core/CounterView.vue";
import {
  AccumulatedTransactionCounterController,
  TransactionCounterController
} from "@/charts/core/CounterController.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const isSmallScreen = inject('isSmallScreen', ref(true))
const isLargeScreen = inject('isLargeScreen', ref(true))

const accountCreateCounterController = new TransactionCounterController(
    TransactionCounterController.ACCOUNT_CREATE, "Account Created", "", routeManager)
onMounted(() => accountCreateCounterController.mount())
onBeforeUnmount(() => accountCreateCounterController.unmount())

const contractCreateCounterController = new TransactionCounterController(
    TransactionCounterController.CONTRACT_CREATE, "Contract Created", "", routeManager)
onMounted(() => contractCreateCounterController.mount())
onBeforeUnmount(() => contractCreateCounterController.unmount())

const tokenCreateCounterController = new TransactionCounterController(
    TransactionCounterController.TOKEN_CREATE, "HTS Token Created", "", routeManager)
onMounted(() => tokenCreateCounterController.mount())
onBeforeUnmount(() => tokenCreateCounterController.unmount())

const accumulatedTransactionCountController = new AccumulatedTransactionCounterController(
    "Total Nb of Transactions", "", routeManager)
onMounted(() => accumulatedTransactionCountController.mount())
onBeforeUnmount(() => accumulatedTransactionCountController.unmount())

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.dashboard-root {
  background-color: var(--background-primary-transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-secondary);
  border-radius: 16px;
  display: flex;
  justify-content: center;
}

</style>
