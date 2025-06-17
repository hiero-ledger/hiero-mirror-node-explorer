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

      <div class="line"/>

      <CounterView :controller="contractCreateCounterController">
        <FileScan :size="32"/>
      </CounterView>

      <div v-if="isLargeScreen || !isSmallScreen" class="line"/>

      <CounterView :controller="tokenCreateCounterController">
        <Hexagon :size="32"/>
      </CounterView>

      <div class="line"/>

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

div.dashboard-content {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 32px;
  height: fit-content;
  padding: 26px 32px 26px 32px;
  width: fit-content;
}

@media (min-width: 768px) {
  div.dashboard-content {
    align-items: center;
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr auto 1fr;
    justify-items: flex-start;
  }
}

@media (min-width: 1280px) {
  div.dashboard-content {
    grid-template-columns:  repeat(7, auto);
    justify-items: center;
  }
}

div.line {
  border: 1px solid var(--border-secondary);
  rotate: 0deg;
  width: 100%;
}

@media (min-width: 768px) {
  div.line {
    border: 1px solid var(--border-secondary);
    rotate: -90deg;
    width: 32px;
  }
}

</style>
