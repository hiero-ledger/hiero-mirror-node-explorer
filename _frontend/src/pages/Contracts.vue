// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <PageFrameV2 page-title="Contracts">

    <DashboardCardV2>
      <template #title>
        <span>Recent Contracts</span>
      </template>
      <template #left-control>
        <PlayPauseButton v-if="!filterVerified" :controller="contractTableController"/>
        <PlayPauseButton v-else :controller="verifiedContractsController"/>
      </template>
      <template #right-control>
        <div v-if="enableVerification && !hideVerifiedFilter" class="verify-switch">
          <div class="switch-text">All</div>
          <SwitchView v-model="filterVerified"/>
          <div class="switch-text">Verified</div>
        </div>
      </template>
      <template #content>
        <ContractTable
            v-if="!filterVerified"
            :controller="contractTableController"
        />
        <VerifiedContractTable
            v-else
            :controller="verifiedContractsController"
        />
      </template>
    </DashboardCardV2>

  </PageFrameV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {inject, ref} from 'vue';
import ContractTable from "@/components/contract/ContractTable.vue";
import PageFrameV2 from "@/components/page/PageFrameV2.vue";
import {ContractTableController} from "@/components/contract/ContractTableController";
import {useRouter} from "vue-router";
import VerifiedContractTable from "@/components/contract/verified/VerifiedContractTable.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import SwitchView from "@/elements/SwitchView.vue";
import {VerifiedContractTableController} from "@/components/contract/verified/VerifiedContractTableController.ts";
import {routeManager} from "@/utils/RouteManager.ts";

defineProps({
  network: String
})

const router = useRouter()

const isMediumScreen = inject('isMediumScreen', true)

const enableVerification = routeManager.enableVerification
const hideVerifiedFilter = import.meta.env.VITE_APP_HIDE_VERIFIED_FILTER === 'true'


const filterVerified = ref(false)

//
// ContractTableController
//
const defaultPageSize = isMediumScreen ? 15 : 10
const contractTableController = new ContractTableController(useRouter(), defaultPageSize)
const verifiedContractsController = new VerifiedContractTableController(
    router,
    defaultPageSize
)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.verify-switch {
  align-items: center;
  display: flex;
  gap: 8px;
}

div.switch-text {
  font-family: var(--font-family-heading), sans-serif;
  font-size: 14px;
  font-weight: 400;
  height: 18px;
  vertical-align: center;
}

</style>
