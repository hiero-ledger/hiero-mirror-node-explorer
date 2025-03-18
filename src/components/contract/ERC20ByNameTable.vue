// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TableViewV3
      :data-source="dataSource"
      :clickable="true"
      @cell-click="handleClick"
  >

    <template #tableHeaders>

      <TableHeaderView>CONTRACT ID</TableHeaderView>
      <TableHeaderView>NAME</TableHeaderView>
      <TableHeaderView>SYMBOL</TableHeaderView>

    </template>

    <template #tableCells="contract">


      <TableDataView>
        <ContractIOL class="h-is-bold" :contract-id="contract.contractId"/>
      </TableDataView>

      <TableDataView>
        <div class="w400">
          {{ contract.name }}
        </div>
      </TableDataView>

      <TableDataView>
        <div class="w400">
          {{ contract.symbol }}
        </div>
      </TableDataView>

    </template>

  </TableViewV3>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, PropType, ref} from 'vue';
import {routeManager} from "@/router";
import {AppStorage} from "@/AppStorage";
import {ERC20ByNameTableLoader} from "@/components/contract/ERC20ByNameTableLoader.ts";
import {ERC20Info} from "@/utils/cache/ERC20InfoCache.ts";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";
import {ERC20Contract} from "@/utils/cache/ERC20Cache.ts";

const props = defineProps({
  narrowed: Boolean,
  nbItems: Number,
  name: {
    type: String as PropType<string | null>,
    default: null
  }
})
const isMediumScreen = inject('isMediumScreen', true)
const defaultPageSize = isMediumScreen ? 15 : 10
const targetName = computed(() => props.name)
const loader = new ERC20ByNameTableLoader(ref(defaultPageSize), targetName)
onMounted(() => loader.mount())
onBeforeUnmount(() => loader.unmount())

const dataSource = new StaticDataSource(
    loader.rows,
    AppStorage.TOKEN_TABLE_PAGE_SIZE_KEY,
    (contract: ERC20Contract) => contract.contractId,
defaultPageSize)

const handleClick = (t: ERC20Info, event: MouseEvent) => {
  if (t.contractId !== null) {
    routeManager.routeToContract(t.contractId, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
