// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div v-if="disassembly" id="disassembly">
    <template v-if="disassembly.length > 0">
      <div v-for="opcode in disassembly" :key="opcode.index16">
        <OpcodeValue :opcode="opcode" :show-hexa-opcode="showHexaOpcode"/>
      </div>
    </template>
    <p v-else class="h-is-low-contrast">{{ disassembledError }}</p>
  </div>

  <span v-else-if="initialLoading"/>

  <span v-else class="h-is-low-contrast">None</span>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, inject, ref} from 'vue';
import {Disassembler} from '@/utils/bytecode_tools/disassembler/BytecodeDisassembler'
import {DisassembledOpcodeOutput} from '@/utils/bytecode_tools/disassembler/utils/helpers';
import OpcodeValue from "@/components/values/OpcodeValue.vue";
import {initialLoadingKey} from "@/AppKeys";

export default defineComponent({
  name: 'DisassembledCodeValue',
  components: {OpcodeValue},

  props: {
    byteCode: {
      type: String,
      default: ""
    },
    showHexaOpcode: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const initialLoading = inject(initialLoadingKey, ref(false))

    const isValidBytecode = computed(() => {
      const BYTECODE_REGEX = /^(0x)?([0-9a-fA-F]{2})+$/;
      return BYTECODE_REGEX.test(props.byteCode)
    })

    const disassembly = computed<DisassembledOpcodeOutput[] | null>(
        () => isValidBytecode.value ? Disassembler.disassemble(props.byteCode) : null)

    const disassembledError = computed<string | null>(() =>
        isValidBytecode.value ? null : (props.byteCode === "" ? "No data found..." : "Invalid bytecode")
    )

    return {
      initialLoading,
      disassembly,
      disassembledError,
    }
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
