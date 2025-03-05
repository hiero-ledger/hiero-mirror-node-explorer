<!--
  -
  - Hedera Mirror Node Explorer
  -
  - Copyright (C) 2021 - 2024 Hedera Hashgraph, LLC
  -
  - Licensed under the Apache License, Version 2.0 (the "License");
  - you may not use this file except in compliance with the License.
  - You may obtain a copy of the License at
  -
  -      http://www.apache.org/licenses/LICENSE-2.0
  -
  - Unless required by applicable law or agreed to in writing, software
  - distributed under the License is distributed on an "AS IS" BASIS,
  - WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  - See the License for the specific language governing permissions and
  - limitations under the License.
  -
  -->

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TableView :controller="props.controller" :clickable="true" @cell-click="handleClick">

    <template #tableHeaders>

      <TableHeaderView>ID</TableHeaderView>
      <TableHeaderView>TYPE</TableHeaderView>
      <TableHeaderView>CONTENT</TableHeaderView>
      <TableHeaderView>TIME</TableHeaderView>

    </template>

    <template #default="transaction">

      <!-- Bof -->
      <TableDataView>
        <TransactionLabel
            class="h-is-bold"
            :transaction-id="transaction.transaction_id"
            :result="transaction.result"
        />
      </TableDataView>

      <TableDataView>
        <div class="h-has-pill" style="display: inline-block">
          {{ makeTypeLabel(transaction.name) }}
        </div>
      </TableDataView>

      <TableDataView>
        <TransactionSummary v-bind:transaction="transaction"/>
      </TableDataView>

      <TableDataView>
        <TimestampValue v-bind:timestamp="transaction.consensus_timestamp"/>
      </TableDataView>

    </template>

  </TableView>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import TableView from "@/tables/TableView.vue";
import {TransactionTableControllerXL} from "@/components/transaction/TransactionTableControllerXL.ts";
import TransactionLabel from "@/components/values/TransactionLabel.vue";
import {makeTypeLabel} from "@/utils/TransactionTools.ts";
import TransactionSummary from "@/components/transaction/TransactionSummary.vue";
import TimestampValue from "@/components/values/TimestampValue.vue";
import TableDataView from "@/tables/TableDataView.vue";
import TableHeaderView from "@/tables/TableHeaderView.vue";
import {routeManager} from "@/router.ts";
import {Transaction} from "@/schemas/MirrorNodeSchemas.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<TransactionTableControllerXL>,
    required: true
  }
})

const handleClick = (t: Transaction, event: MouseEvent) => {
  routeManager.routeToTransaction(t, event)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
