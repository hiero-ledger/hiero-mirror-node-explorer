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

      <TableHeaderView>TOKEN</TableHeaderView>
      <TableHeaderView>NAME</TableHeaderView>
      <TableHeaderView>SYMBOL</TableHeaderView>

    </template>

    <template #tableCells="token">

      <TableDataView>
        <TokenIOL class="h-is-bold" :token-id="token.token_id"/>
      </TableDataView>

      <TableDataView>
        <div class="w400">
          {{ token.name }}
        </div>
      </TableDataView>

      <TableDataView>
        <div class="w400">
          {{ token.symbol }}
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
import {Token} from '@/schemas/MirrorNodeSchemas.ts';
import {routeManager} from "@/router";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import {TokensByNameTableLoader} from "@/components/token/TokensByNameTableLoader";
import TableViewV3 from "@/tables/TableViewV3.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import {StaticDataSource} from "@/tables/TableDataSource.ts";
import {AppStorage} from "@/AppStorage.ts";

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
const loader = new TokensByNameTableLoader(ref(defaultPageSize), targetName)
onMounted(() => {
  loader.mount()
})
onBeforeUnmount(() => {
  loader.unmount()
})

const dataSource = new StaticDataSource(
    loader.rows,
    AppStorage.TOKEN_TABLE_PAGE_SIZE_KEY,
    (token: Token) => token.token_id ?? "null",
    defaultPageSize)

const handleClick = (t: Token, event: MouseEvent) => {
  if (t.token_id !== null) {
    routeManager.routeToToken(t.token_id, event)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
