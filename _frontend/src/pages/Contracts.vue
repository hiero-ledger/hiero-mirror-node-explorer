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
        <div class="verify-switch">
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
        <VerifiedContractsTable
            v-else
            :controller="verifiedContractsController"
            :loaded="loaded"
            :overflow="overflow"
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
import VerifiedContractsTable from "@/components/account/VerifiedContractsTable.vue";
import {VerifiedContractsController} from "@/components/contract/VerifiedContractsController";
import {VerifiedContractsCache} from "@/utils/cache/VerifiedContractsCache";
import {AppStorage} from "@/AppStorage";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import PlayPauseButton from "@/components/PlayPauseButton.vue";
import SwitchView from "@/elements/SwitchView.vue";

defineProps({
  network: String
})

const isMediumScreen = inject('isMediumScreen', true)

const filterVerified = ref(false)

//
// ContractTableController
//
const defaultPageSize = isMediumScreen ? 15 : 10
const contractTableController = new ContractTableController(useRouter(), defaultPageSize)
const verifiedContractsController = new VerifiedContractsController(
    VerifiedContractsCache.instance.makeLookup(),
    ref(defaultPageSize),
    AppStorage.CONTRACT_TABLE_PAGE_SIZE_KEY
)
const loaded = verifiedContractsController.loaded
const overflow = verifiedContractsController.overflow

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
