// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 collapsible-key="contractResult">
    <template #title>
      <span>Contract Result</span>
    </template>

    <template #left-content>
      <Property id="result">
        <template v-slot:name>Result</template>
        <template v-slot:value>
          <StringValue :string-value="contractResult?.result"/>
        </template>
      </Property>
      <Property id="evm-hash">
        <template v-slot:name>EVM Transaction Hash</template>
        <template v-slot:value>
          <HexaValue v-bind:byteString="contractResult?.hash" v-bind:show-none="true"/>
        </template>
      </Property>
      <Property id="from">
        <template v-slot:name>From</template>
        <template v-slot:value>
          <EVMAddress :address="contractResult?.from" :id="fromId ?? undefined" :compact="!isXLargeScreen"/>
        </template>
      </Property>
      <Property id="to">
        <template v-slot:name>To</template>
        <template v-slot:value>
          <EVMAddress :address="contractResult?.to ?? undefined" :id="toId ?? undefined" :compact="!isXLargeScreen"/>
        </template>
      </Property>

      <FunctionInput :analyzer="analyzer"/>
      <FunctionResult :analyzer="analyzer"/>
      <FunctionError :analyzer="analyzer"/>
    </template>

    <template #right-content>
      <Property v-if="contractType" id="type">
        <template v-slot:name>Type</template>
        <template v-slot:value>
          <StringValue :string-value="contractType"/>
        </template>
      </Property>
      <Property id="gasLimit">
        <template v-slot:name>Gas Limit</template>
        <template v-slot:value>
          <GasAmount
              :gas="contractResult?.gas_limit"
              :price="gasPrice"
          />
        </template>
      </Property>
      <Property id="gasUsed" :tooltip="gasUsedTooltip">
        <template v-slot:name>Gas Used</template>
        <template v-slot:value>
          <GasAmount
              :gas="contractResult?.gas_used"
              :price="gasPrice"
          />
        </template>
      </Property>
      <Property id="gasConsumed" :tooltip="gasConsumedTooltip">
        <template v-slot:name>Gas Consumed</template>
        <template v-slot:value>
          <GasAmount
              :gas="contractResult?.gas_consumed"
              :price="gasPrice"
          />
        </template>
      </Property>
      <template v-if="contractType==='Post-Eip1559'">
        <Property id="maxFeePerGas">
          <template v-slot:name>Max Fee Per Gas</template>
          <template v-slot:value>
            <HbarAmount :amount="maxFeePerGas"/>
            <span v-if="maxFeePerGas"
                  class="h-is-extra-text h-is-numeric h-is-smaller ml-1">{{ gWeiExtra(maxFeePerGas) }}</span>
          </template>
        </Property>
        <Property id="maxPriorityFeePerGas">
          <template v-slot:name>Max Priority Fee Per Gas</template>
          <template v-slot:value>
            <HbarAmount :amount="maxPriorityFeePerGas"/>
            <span v-if="maxPriorityFeePerGas"
                  class="h-is-extra-text h-is-numeric h-is-smaller ml-1">{{ gWeiExtra(maxPriorityFeePerGas) }}</span>
          </template>
        </Property>
      </template>
      <Property id="gasPrice">
        <template v-slot:name>Gas Price</template>
        <template v-slot:value>
          <HbarAmount :amount="gasPrice"/>
          <span v-if="gasPrice"
                class="h-is-extra-text h-is-numeric ml-1">{{ gWeiExtra(gasPrice) }}</span>
        </template>
      </Property>
      <Property id="ethereumNonce">
        <template v-slot:name>Ethereum Nonce</template>
        <template v-slot:value>
          <PlainAmount :amount="ethereumNonce" none-label="None"/>
        </template>
      </Property>
    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted} from 'vue';
import {TransactionDetail, TransactionType} from "@/schemas/MirrorNodeSchemas";
import {TransactionLocParser} from "@/utils/parser/TransactionLocParser";
import {TransactionGroupAnalyzer} from "@/components/transaction/TransactionGroupAnalyzer";
import {TransactionAnalyzer} from "@/components/transaction/TransactionAnalyzer";
import {TransactionGroupCache} from "@/utils/cache/TransactionGroupCache";
import GasAmount from "@/components/values/GasAmount.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import StringValue from "@/components/values/StringValue.vue";
import Property from "@/components/Property.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import FunctionError from "@/components/values/FunctionError.vue";
import HexaValue from "@/components/values/HexaValue.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import FunctionInput from "@/components/values/FunctionInput.vue";
import FunctionResult from "@/components/values/FunctionResult.vue";
import {ContractResultAnalyzer} from "@/utils/analyzer/ContractResultAnalyzer.ts";
import {NetworkFeesCache} from "@/utils/cache/NetworkFeesCache.ts";
import {lookupTransactionType} from "@/schemas/MirrorNodeUtils.ts";

const props = defineProps({
  transactionLoc: String,
  network: String
})

const gasConsumedTooltip = "This represents the actual amount of gas (i.e. the real computational effort) required to execute the smart contract."
const gasUsedTooltip = "This represents the amount of gas that is actually deducted from the user's balance (i.e it may include additional factors like base fees or refunds, etc…)."

const isXLargeScreen = inject('isXLargeScreen', true)

const transactionLoc = computed(() => props.transactionLoc ?? null)
const transactionLocParser = new TransactionLocParser(transactionLoc)
onMounted(() => transactionLocParser.mount())
onBeforeUnmount(() => transactionLocParser.unmount())

const transactionAnalyzer = new TransactionAnalyzer(transactionLocParser.transaction)
onMounted(() => transactionAnalyzer.mount())
onBeforeUnmount(() => transactionAnalyzer.unmount())

const transactionGroupLookup = TransactionGroupCache.instance.makeLookup(transactionLocParser.transactionId)
onMounted(() => transactionGroupLookup.mount())
onBeforeUnmount(() => transactionGroupLookup.unmount())

const transactionGroupAnalyzer = new TransactionGroupAnalyzer(transactionGroupLookup.entity)

const transaction = computed(() => {
  let result: TransactionDetail | null
  const consensusTimestamp = transactionAnalyzer.consensusTimestamp.value
  if (consensusTimestamp !== null) {
    result = null
    for (const t of transactionGroupAnalyzer.transactions.value ?? []) {
      if (consensusTimestamp == t.consensus_timestamp) {
        result = t
        break
      }
    }
  } else {
    result = null
  }
  return result
})

const timestamp = transactionAnalyzer.consensusTimestamp
const transactionType = transactionAnalyzer.transactionType

const contractResultAnalyzer = new ContractResultAnalyzer(transaction)
onMounted(() => contractResultAnalyzer.mount())
onBeforeUnmount(() => contractResultAnalyzer.unmount())

const feeLookup = NetworkFeesCache.instance.makeLookup(timestamp)
onMounted(() => feeLookup.mount())
onBeforeUnmount(() => feeLookup.unmount())

const gasPrice = computed(() => {
  let result: number | null = contractResultAnalyzer.gasPrice.value

  if (!result && timestamp.value !== null) {
    result = lookupTransactionType(feeLookup.entity.value, transactionType.value ?? TransactionType.ETHEREUMTRANSACTION)
  }
  result = result ?? contractResultAnalyzer.gasPrice.value
  return result
})

const gWeiExtra = (priceInHbar: number): string => {
  return priceInHbar ? ` ${priceInHbar * 10} gWei` : ''
}

const fromId = contractResultAnalyzer.fromId
const toId = contractResultAnalyzer.toId
const maxFeePerGas = contractResultAnalyzer.maxFeePerGas
const maxPriorityFeePerGas = contractResultAnalyzer.maxPriorityFeePerGas
const contractResult = contractResultAnalyzer.contractResult
const analyzer = contractResultAnalyzer.functionCallAnalyzer
const contractType = contractResultAnalyzer.contractType
const ethereumNonce = contractResultAnalyzer.ethereumNonce

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
