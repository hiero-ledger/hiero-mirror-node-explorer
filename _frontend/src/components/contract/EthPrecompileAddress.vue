// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div v-if="squeezedAddress">
    <div class="evm-address">
      <Copyable :content-to-copy="props.evmAddress" enable-copy>
        <template #content>
          <div class="h-is-low-contrast h-is-monospace" style="display: inline">
            {{ squeezedAddress }}
          </div>
        </template>
      </Copyable>
      <div v-if="entityId" class="entity-id-or-name" style="margin-left: 4px">
        <span>({{ precompileLabel }})</span>
      </div>
    </div>
    <div v-if="showType"  class="address-type">
      <div class="h-is-low-contrast">PRECOMPILE</div>
    </div>
  </div>
  <div v-else-if="initialLoading"/>
  <div v-else-if="showNone" class="h-is-low-contrast">None</div>
  <div v-else></div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, ref} from "vue";
import Copyable from "@/elements/Copyable.vue";
import {EntityID} from "@/utils/EntityID.ts";
import {EthereumAddress} from "@/utils/EthereumAddress.ts";
import {initialLoadingKey} from "@/AppKeys.ts";
import {labelForEthPrecompiledContract} from "@/schemas/MirrorNodeUtils.ts";

const props = defineProps({
  evmAddress: {
    type: String,
    default: null,
  },
  showType: {
    type: Boolean,
    default: false
  },
  showNone: {
    type: Boolean,
    default: true
  },
})

const initialLoading = inject(initialLoadingKey, ref(false))

const squeezedAddress = computed(() => {
  const a = props.evmAddress? EthereumAddress.parse(props.evmAddress) : null
  return a !== null ? a.toSqueezedString() : null
})

const entityId = computed(() => {
  const entityID = EntityID.fromAddress(props.evmAddress)
  return entityID !== null ? entityID.toString() : null
})

const precompileLabel = computed(() => {
  let result: string|null
  if (props.evmAddress) {
    result = labelForEthPrecompiledContract(props.evmAddress)
  } else {
    result = null
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.evm-address {
  display: inline-block;
  line-height: 18px;
  word-wrap: break-word;
}

div.entity-id-or-name {
  display: inline-flex;
}

div.address-type {
  display: flex;
  line-height: 18px;
  gap: 4px;
}

</style>
