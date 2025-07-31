// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="opcode-value">
    <p class="h-is-low-contrast">{{ opcode.index16 }}:</p>
    <p v-if="showHexaOpcode" class="h-is-extra-text">{{ opcode.hex }}</p>
    <p v-if="showHexaOpcode" class="h-is-low-contrast">-</p>
    <p :class="{'h-is-low-contrast':isInvalidOpcode}">{{ opcode.mnemonic }}</p>
    <div v-if="opcode.operand.length > 0">
      <ContractLink v-if="contract" :contract-id="displayAddress"/>
      <AccountLink v-else-if="account" :account-id="displayAddress"/>
      <p v-else>{{ displayAddress }}</p>
    </div>
    <template v-if="contract || account">
      <p>//</p>
      <ContractLink v-if="contract" :contract-id="contract.contract_id" class="h-is-low-contrast"/>
      <AccountLink v-else-if="account" :account-id="account.account" class="h-is-low-contrast"/>
      <p v-else/>
    </template>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onMounted, PropType, ref, Ref} from 'vue';
import {DisassembledOpcodeOutput, Helpers} from '@/utils/bytecode_tools/disassembler/utils/helpers';
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import ContractLink from "@/components/values/link/ContractLink.vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import {AccountBalanceTransactions, ContractResponse} from "@/schemas/MirrorNodeSchemas";

const props = defineProps({
  opcode: {
    type: Object as PropType<DisassembledOpcodeOutput>,
    required: true
  },
  showHexaOpcode: {
    type: Boolean,
    default: false
  }
})

const displayAddress = computed(() => {
  return `0x${props.opcode.operand.join("")}`
})

const isInvalidOpcode = computed(() => props.opcode.mnemonic === Helpers.INVALID_OPCODE_MNEMONIC)

const contract: Ref<ContractResponse | null> = ref(null)
const account: Ref<AccountBalanceTransactions | null> = ref(null)

onMounted(() => {
  if (props.opcode.mnemonic === 'PUSH20') {
    ContractByAddressCache.instance.lookup(displayAddress.value)
        .then((result) => {
          contract.value = result
          if (!result) {
            AccountByAddressCache.instance.lookup(displayAddress.value)
                .then((result) => account.value = result)
          }
        })
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.opcode-value {
  color: var(--text-primary);
  display: flex;
  font-family: var(--font-family-monospace), sans-serif;
  gap: 4px;
}

</style>
