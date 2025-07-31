// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<!-- TODO: remove BULMA styling, redo chips,...-->

<template>
  <div class="entry-container">
    <!-- Row 0 -->
    <button
        data-cy="execFunction"
        class="exec-button"
        v-on:click="handleClick()">
      <RotateCw v-if="isGetter" :size="12" :stroke-width="3" style="vertical-align: text-top"/>
      <Play v-else :size="12" :stroke-width="3" style="vertical-align: text-top"/>
    </button>
    <div class="entry-content">
      <div class="entry-index">
        {{ props.index }}.
      </div>
      <SolidityCode class="source-code">
        {{ signature }}
      </SolidityCode>
      <div class="h-has-pill">
        {{ mutability }}
      </div>
      <div class="h-has-pill h-chip-default ml-2">
        {{ selector }}
      </div>
    </div>

    <!-- Row 1 -->
    <div/>
    <div v-if="hasResult">
      <MoveRight :size="14" :stroke-width="3" style="display: inline; vertical-align: text-top" class="h-is-low-contrast"/>
      <span class="ml-1">
        {{ callOutput }}
      </span>
    </div>
  </div>

  <ContractAbiDialog
      v-model:show-dialog="showAbiCallDialog"
      :contract-call-builder="props.contractCallBuilder"
      @did-update-contract-state="dialogDidUpdateContractState"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onMounted, PropType, ref} from "vue";
import "prismjs/prism";
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/prism.js";
import "prismjs/components/prism-clike.js";
import "prismjs/components/prism-solidity.js";
import SolidityCode from "@/components/SolidityCode.vue";
import ContractAbiDialog from "@/dialogs/abi/ContractAbiDialog.vue";
import {ContractCallBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";
import {MoveRight, Play, RotateCw} from 'lucide-vue-next';

const props = defineProps({
  contractCallBuilder: {
    type: Object as PropType<ContractCallBuilder>,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(["didUpdateContractState"])

const running = ref(true)

const handleClick = () => {
  if (props.contractCallBuilder.isGetter()) {
    running.value = true
    try {
      props.contractCallBuilder.execute()
          .finally(() => {
            running.value = false
          })
    } catch {
      running.value = false
    }
  } else {
    showAbiCallDialog.value = true
  }
}

const showAbiCallDialog = ref(false)

onMounted(() => {
  if (props.contractCallBuilder.isGetter()) {
    handleClick()
  }
})

const isGetter = computed(() => props.contractCallBuilder.isGetter())

const signature = computed(() => props.contractCallBuilder.fragment.format("full"))

const mutability = computed(() => props.contractCallBuilder.fragment.stateMutability.toUpperCase())

const selector = computed(() => props.contractCallBuilder.fragment.selector)

const hasResult = computed(() => props.contractCallBuilder.hasResult())

const dialogDidUpdateContractState = () => {
  emit("didUpdateContractState")
}

const callOutput = props.contractCallBuilder.callOutput

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.entry-container {
  display: grid;
  grid-template-columns: min-content auto;
  align-items: center;
  font-size: 11px;
  gap: 8px;
  margin-bottom: 24px;
}

button.exec-button {
  color: var(--text-primary);
  background-color: transparent;
  border: 0;
  border-radius: 0;
  cursor: pointer;
}

div.entry-content {
  align-items: baseline;
  display: flex;
}

div.entry-index {
  color: var(--text-secondary);
}

.source-code {
  background-color: var(--background-secondary);
  padding: 0 4px;
}

</style>
