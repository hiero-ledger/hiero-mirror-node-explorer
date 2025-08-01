// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="props.log" :class="{'log-wrapper-grid': isMediumScreen, 'log-wrapper-flex': !isMediumScreen}">

    <!-- left content-->
    <div :class="{'log-left-content-grid': isMediumScreen}">
      <Property id="transactionHash" :vertical="isMediumScreen">
        <template v-slot:name>Transaction Hash</template>
        <template v-slot:value>
          <HexaDumpValue :byteString="txHashToShow" :show-none="true"/>
        </template>
      </Property>

      <Property id="blockNumber" :vertical="isMediumScreen">
        <template v-slot:name>Block</template>
        <template v-slot:value>
          <BlockLink :block-number="blockNumberToShow"/>
        </template>
      </Property>

      <Property id="address" :vertical="isMediumScreen">
        <template v-slot:name>Address</template>
        <template v-slot:value>
          <EVMAddress :address="props.log.address" enable-copy compact/>
        </template>
      </Property>
    </div>

    <!-- right content -->
    <Property id="Args" vertical style="grid-column: span 14;">
      <template v-slot:name>Logs</template>
      <template v-slot:value>

        <!-- not verified -->
        <div v-if="!isContractVerified" class="log-content">
          <div
              v-for="(t, ti) in props.log.topics"
              :class="{'unverif-log-args-prop': !isMediumScreen || !isSmallScreen}"
              :key="t"
              class="unverified-log-entry"
          >
            <div class="topic-title-box">
              <span>{{ 'Topic ' + ti }}</span>
            </div>
            <HexaDumpValue :show-none="true" :byteString="t" :word-wrap-small="0" :word-wrap-medium="8"/>
          </div>
        </div>

        <!-- verified -->
        <div v-else class="log-content">
          <span class="h-should-wrap">{{ fullLogSignature }}</span>

          <div
              v-for="(arg, i) in args"
              :key="arg.name"
              class="verified-log-entry"
          >
            <div v-if="arg.indexed" class="topic-title-box">{{ 'Topic ' + i }}</div>
            <div v-else/>

            <div class="log-entry-arg">
              <Property :id="'logArg_' + arg.name" keep-case full-width :vertical="isMediumScreen">
                <template v-slot:name>
                  <span class=" log-arg-title">
                      <span class="h-is-extra-text">
                        {{ arg.type }}
                      </span>
                      {{ " " + arg.name }}
                    </span>
                </template>
                <template v-slot:value>
                  <FunctionValue :ntv="arg" :hide-type="true" :low-contrast="i === 0"/>
                </template>
              </Property>
            </div>
          </div>
        </div>

      </template>
    </Property>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, PropType} from "vue";
import {ContractLog} from "@/schemas/MirrorNodeSchemas";
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractLogAnalyzer} from "@/utils/analyzer/ContractLogAnalyzer";
import FunctionValue from "@/components/values/FunctionValue.vue";
import BlockLink from "@/components/values/BlockLink.vue";
import Property from "@/components/Property.vue";

const props = defineProps({
  log: {
    type: Object as PropType<ContractLog | null>,
    default: null
  },
  blockNumber: {
    type: Number,
  },
  transactionHash: {
    type: String
  }
})

const isSmallScreen = inject('isSmallScreen', true)
const isMediumScreen = inject('isMediumScreen', true)

const blockNumberToShow = computed(() => props.blockNumber || props.log?.block_number)
const txHashToShow = computed(() => props.transactionHash || props.log?.transaction_hash)

const logAnalyzer = new ContractLogAnalyzer(computed(() => props.log))
onMounted(() => logAnalyzer.mount())
onBeforeUnmount(() => logAnalyzer.unmount())

const args = logAnalyzer.args
const fullLogSignature = logAnalyzer.fullLogSignature
const isContractVerified = logAnalyzer.isContractVerified

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.log-wrapper-grid {
  position: relative;
  display: grid;
  column-gap: 3rem;
  grid-template-columns: repeat(19, minmax(0, 1fr));
}

.log-left-content-grid {
  grid-column: span 5;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.log-wrapper-flex {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem
}

.unverif-log-args-prop {
  justify-content: space-between;
}

div.log-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

div.unverified-log-entry {
  align-items: center;
  display: flex;
  gap: 16px;
}

div.verified-log-entry {
  display: grid;
  grid-template-columns: 75px 1fr;
  gap: 8px;
}

.topic-title-box {
  border-width: 0;
  border-radius: 8px;
  background-color: var(--background-secondary);
  font-size: 0.85rem;
  width: 70px;
  text-align: center;
  padding: 3px 0;
  height: fit-content;
}

div.log-entry-arg {
  padding-top: 2px;
}

.log-arg-title {
  font-size: small;
  letter-spacing: -0.025em;
}
</style>
