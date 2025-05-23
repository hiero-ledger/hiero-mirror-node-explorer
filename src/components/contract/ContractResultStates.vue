// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="stateChanges?.length && isSmallScreen" collapsible-key="stateChanges">
    <template #title>
      Contract States Accessed & Changed
    </template>

    <template #right-control v-if="displayStateChanges.length > 5">
      <SelectView v-model="pageSize" :small="true">
        <option v-for="n of actualSizeOptions" :key="n" :value="n">
          {{ (n >= displayStateChanges?.length) ? 'Show all items' : 'Show ' + n + ' items' }}
        </option>
      </SelectView>
    </template>

    <template #content>

      <div class="state-heading">
        <div>CONTRACT</div>
        <div>ADDRESS</div>
        <div>VALUE READ</div>
        <div>VALUE WRITTEN</div>
      </div>

      <hr class="heading-separator"/>

      <div class="state-changes">
        <template v-for="s in nbChangeDisplayed" :key="s">
          <ContractResultStateChangeEntry
              :change="displayStateChanges[changeCursor + s - 1]"
              :timestamp="timeStamp"
          />
          <hr class="table-separator"/>
        </template>
      </div>

      <div v-if="isPaginated" class="pagination">
        <o-pagination
            :total="stateChanges.length"
            v-model:current="currentPage"
            order="centered"
            :range-before="1"
            :range-after="1"
            :per-page="pageSize"
        >
        </o-pagination>
      </div>

    </template>

  </DashboardCardV2>

  <DashboardCardV2 v-else-if="stateChanges?.length" collapsible-key="stateChanges">
    <template #title>
      Contract States Accessed & Changed
    </template>

    <template #content>
      <p class="not-supported">Not available on this screen size</p>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, inject, onBeforeUnmount, onMounted, PropType, ref, Ref, watch} from 'vue';
import {OPagination} from '@oruga-ui/oruga-next';
import {ContractResultStateChange} from "@/schemas/MirrorNodeSchemas";
import {ORUGA_MOBILE_BREAKPOINT} from "@/BreakPoints";
import {TransactionByTsCache} from "@/utils/cache/TransactionByTsCache";
import ContractResultStateChangeEntry from "@/components/contract/ContractResultStateChangeEntry.vue";
import {AppStorage} from "@/AppStorage";
import SelectView from "@/elements/SelectView.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

export interface DisplayStateChange {
  changes: ContractResultStateChange,
  header: boolean,
  balanceChange: number | null,
  slotType: string,
  slotDecimal: number | null
  valueReadType: string,
  valueReadDecimal: number | null
  valueReadString: string | null
  valueWrittenType: string,
  valueWrittenDecimal: number | null
  valueWrittenString: string | null
  valueChange: number | null,
  index: number
}

const DEFAULT_PAGE_SIZE = 10

export default defineComponent({

  name: 'ContractResultStates',

  components: {
    DashboardCardV2,
    SelectView,
    ContractResultStateChangeEntry,
    OPagination
  },

  props: {
    stateChanges: Object as PropType<Array<ContractResultStateChange> | undefined>,
    timeStamp: String
  },

  setup(props) {
    const isSmallScreen = inject('isSmallScreen', true)
    const sizeOptions: Array<number> = [5, 10, 15, 20, 30, 50, 100]
    const actualSizeOptions: Ref<Array<number>> = ref([])

    const currentPage = ref(1)
    const pageSize = ref(AppStorage.getStatesTablePageSize() ?? DEFAULT_PAGE_SIZE)
    watch(pageSize, () => {
      AppStorage.setStatesTablePageSize(pageSize.value)
      currentPage.value = 1
    })

    onMounted(() => updatePageSize())
    watch(() => props.stateChanges, () => updatePageSize())
    const updatePageSize = () => {
      let options: Array<number> = sizeOptions
      for (let i = 0; i < options.length - 1; i++) {
        if (options[i] > (props.stateChanges?.length ?? 0)) {
          options = options.slice(0, i + 1)
          pageSize.value = Math.min(pageSize.value, options[i])
          break
        }
      }
      actualSizeOptions.value = options
    }

    const isPaginated = computed(
        () => displayStateChanges?.value.length && displayStateChanges?.value.length > pageSize.value)
    const changeCursor = computed(() => (currentPage.value - 1) * pageSize.value)
    watch(changeCursor, () => displayStateChanges.value[changeCursor.value].header = true)
    const nbChangeDisplayed = computed(() => {
      return displayStateChanges?.value.length
          ? Math.min(pageSize.value, displayStateChanges?.value.length - changeCursor.value)
          : 0
    })

    const transactionLookup = TransactionByTsCache.instance.makeLookup(computed(() => props.timeStamp ?? null))
    onMounted(() => transactionLookup.mount())
    onBeforeUnmount(() => transactionLookup.unmount())

    const displayStateChanges: Ref<Array<DisplayStateChange>> = ref([])
    onMounted(() => displayStateChanges.value = makeDisplayStateChanges())
    watch([() => props.stateChanges, transactionLookup.entity],
        () => displayStateChanges.value = makeDisplayStateChanges())

    const makeDisplayStateChanges = () => {
      const result: Array<DisplayStateChange> = []

      if (props.stateChanges) {
        for (const s of props.stateChanges) {

          const newItem: DisplayStateChange = {
            changes: {...s},
            header: true,
            balanceChange: null,
            slotType: 'DECIMAL',
            slotDecimal: makeDecimal(s.slot ?? ""),
            valueReadType: 'DECIMAL',
            valueReadDecimal: makeDecimal(s.value_read ?? ""),
            valueReadString: null,
            valueWrittenType: 'DECIMAL',
            valueWrittenDecimal: makeDecimal(s.value_written ?? ""),
            valueWrittenString: null,
            valueChange: null,
            index: result.length
          }

          if (newItem.changes.value_written === '0x') {
            newItem.changes.value_written = null
            newItem.valueWrittenDecimal = null
          }

          if (result.length > 0 && s.address === (result[result.length - 1].changes.address)) {
            newItem.header = false
          } else {
            newItem.balanceChange = lookupTransfer(s.contract_id ?? "")
          }

          newItem.valueChange = newItem.valueReadDecimal && newItem.valueWrittenDecimal
              ? newItem.valueWrittenDecimal - newItem.valueReadDecimal
              : null

          result.push(newItem)
        }
      }
      return result
    }

    const lookupTransfer = (contractId: string) => {
      let result = null
      const transaction = transactionLookup.entity.value
      if (transaction !== null) {
        for (const t of transaction.transfers ?? []) {
          if (t.account === contractId) {
            result = t.amount
            break
          }
        }
      }
      return result
    }

    const makeDecimal = (hexa: string): number | null => {
      let result
      if (hexa) {
        hexa = hexa.replace(/^0x0+/, '');
        result = (hexa.length === 0) ? 0 : (hexa.length <= 13) ? Number("0x" + hexa) : null
      } else {
        result = null
      }
      return result
    }

    return {
      isSmallScreen,
      displayStateChanges,
      actualSizeOptions,
      currentPage,
      isPaginated,
      changeCursor,
      pageSize,
      nbChangeDisplayed,
      ORUGA_MOBILE_BREAKPOINT
    }
  },
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.state-heading {
  color: var(--text-secondary);
  display: grid;
  font-weight: 500;
  font-size: 12px;
  grid-template-columns: 1.5fr 3fr 3fr 3fr;
}

div.state-changes {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

hr.heading-separator {
  background-color: var(--border-secondary);
  height: 1px;
  margin: 0;
}

hr.table-separator {
  background-color: var(--table-border);
  height: 1px;
  margin: 0;
}

div.pagination {
  display: flex;
  justify-content: flex-end;
}

p.not-supported {
  color: var(--text-secondary);
  font-family: var(--font-family-heading), sans-serif;
  font-weight: 300;
  font-size: 14px;
}

</style>
