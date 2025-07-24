// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      <ContractSectionTitle v-if="props.contractId" :contract-id="props.contractId">
        Contract Events
      </ContractSectionTitle>
      <span v-else>Events</span>
    </template>

    <template #right-control v-if="props.logs.length > 2">
      <SelectView v-model="pageSize" :small="true">
        <option v-for="n of actualSizeOptions" :key="n" :value="n">
          {{ (n >= props.logs?.length) ? 'Show all items' : 'Show ' + n + ' items' }}
        </option>
      </SelectView>
    </template>

    <template #content>
      <template v-if="nbLogDisplayed">
        <template v-for="l in nbLogDisplayed" :key="l">
          <ContractResultLogEntry
              :log="props.logs[logCursor + l - 1]"
              :block-number="props.blockNumber"
              :transaction-hash="props.transactionHash"
          />
          <hr class="table-separator"/>
        </template>

        <div v-if="isPaginated" class="pagination">
          <o-pagination
              :total="props.logs.length"
              v-model:current="currentPage"
              order="centered"
              :range-before="1"
              :range-after="1"
              :per-page="pageSize"
          >
          </o-pagination>
        </div>
      </template>

      <template v-else>
        <div class="doc-snippet">
          <p>No events have been logged for this contract.</p>
          <p>This may be due to it not being called or its executions did not emit any events.</p>
          <p>
            <span>See how to access event data </span>
            <a
                href="https://hedera.com/blog/how-to-get-event-information-from-hedera-smart-contracts"
                target="_blank"
                class="h-is-extra-text"
            >here</a>
            <span>.</span>
          </p>
        </div>
      </template>
    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onMounted, PropType, Ref, ref, watch} from "vue";
import {OPagination} from "@oruga-ui/oruga-next";
import ContractResultLogEntry from "@/components/contract/ContractResultLogEntry.vue";
import {ContractLog} from "@/schemas/MirrorNodeSchemas";
import {AppStorage} from "@/AppStorage";
import SelectView from "@/elements/SelectView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ContractSectionTitle from "@/components/contract/ContractSectionTitle.vue";

const DEFAULT_PAGE_SIZE = 3

const props = defineProps({
  logs: {
    type: Object as PropType<Array<ContractLog>>,
    required: true
  },
  blockNumber: {
    type: Number,
  },
  transactionHash: {
    type: String
  },
  contractId: {
    type: String
  }
})

const sizeOptions: Array<number> = [3, 5, 10, 15, 20, 30]
const actualSizeOptions: Ref<Array<number>> = ref([])

const currentPage = ref(1)
const pageSize = ref(AppStorage.getLogsTablePageSize() ?? DEFAULT_PAGE_SIZE)
watch(pageSize, () => {
  AppStorage.setLogsTablePageSize(pageSize.value)
  currentPage.value = 1
})

onMounted(() => updatePageSize())
watch(() => props.logs, () => updatePageSize())
const updatePageSize = () => {
  let options: Array<number> = sizeOptions
  for (let i = 0; i < options.length - 1; i++) {
    if (options[i] > (props.logs?.length ?? 0)) {
      options = options.slice(0, i + 1)
      pageSize.value = Math.min(pageSize.value, options[i])
      break
    }
  }
  actualSizeOptions.value = options
}

const isPaginated = computed(() => props.logs?.length && props.logs?.length > pageSize.value)
const logCursor = computed(() => (currentPage.value - 1) * pageSize.value)
const nbLogDisplayed = computed(() => {
  return props.logs?.length ? Math.min(pageSize.value, props.logs?.length - logCursor.value) : 0
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

hr.table-separator {
  background-color: var(--border-secondary);
  height: 1px;
  margin: 0;
}

div.pagination {
  display: flex;
  justify-content: flex-end;
}

</style>
