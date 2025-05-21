// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <template v-if="contractResult">

    <DashboardCardV2 collapsible-key="contractResult">
      <template #title>
        <span v-if="props.topLevel">
          Contract Result for {{ contractResult?.contract_id }} at {{ contractResult?.timestamp }}
        </span>
        <span v-else>Contract Result</span>
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

    <ContractResultTrace v-if="props.isParent" :transaction-id-or-hash="contractResult?.hash ?? undefined"
                         :analyzer="analyzer"/>

    <ContractResultStates :state-changes="contractResult?.state_changes" :time-stamp="contractResult?.timestamp"/>

    <ContractResultLogs :logs="contractResult?.logs" :block-number="props.blockNumber"
                        :transaction-hash="props.transactionHash"/>

  </template>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, PropType} from 'vue';
import HbarAmount from "@/components/values/HbarAmount.vue";
import StringValue from "@/components/values/StringValue.vue";
import Property from "@/components/Property.vue";
import PlainAmount from "@/components/values/PlainAmount.vue";
import ContractResultTrace from "@/components/contract/ContractResultTrace.vue";
import ContractResultStates from "@/components/contract/ContractResultStates.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import ContractResultLogs from "@/components/contract/ContractResultLogs.vue";
import {ContractResultAnalyzer} from "@/utils/analyzer/ContractResultAnalyzer";
import FunctionInput from "@/components/values/FunctionInput.vue";
import FunctionResult from "@/components/values/FunctionResult.vue";
import FunctionError from "@/components/values/FunctionError.vue";
import GasAmount from "@/components/values/GasAmount.vue";
import {NetworkFeesCache} from "@/utils/cache/NetworkFeesCache.ts";
import {TransactionType} from "@/schemas/MirrorNodeSchemas.ts";
import {lookupTransactionType} from "@/schemas/MirrorNodeUtils.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import HexaValue from "@/components/values/HexaValue.vue";

const props = defineProps({
  timestamp: {
    type: String,
  },
  topLevel: {
    type: Boolean,
    default: false
  },
  isParent: {
    type: Boolean,
    default: false
  },
  blockNumber: {
    type: Number
  },
  transactionHash: {
    type: String
  },
  transactionType: {
    type: String as PropType<TransactionType>,
    default: TransactionType.ETHEREUMTRANSACTION
  }
})

const gasConsumedTooltip = "This represents the actual amount of gas (i.e. the real computational effort) required to execute the smart contract."
const gasUsedTooltip = "This represents the amount of gas that is actually deducted from the user's balance (i.e it may include additional factors like base fees or refunds, etc…)."

const isXLargeScreen = inject('isXLargeScreen', true)

const timestamp = computed(() => props.timestamp ?? null)

const contractResultAnalyzer = new ContractResultAnalyzer(timestamp)
onMounted(() => contractResultAnalyzer.mount())
onBeforeUnmount(() => contractResultAnalyzer.unmount())

const feeLookup = NetworkFeesCache.instance.makeLookup(timestamp)
onMounted(() => feeLookup.mount())
onBeforeUnmount(() => feeLookup.unmount())

const gasPrice = computed(() => {
  let result: number | null = contractResultAnalyzer.gasPrice.value

  if (!result && timestamp.value !== null) {
    result = lookupTransactionType(feeLookup.entity.value, props.transactionType)
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

<style/>
