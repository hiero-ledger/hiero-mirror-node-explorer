// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div>
    <template v-if="needsTextEditor">
      <ParamTextEditor :param-builder="props.paramBuilder"/>
    </template>
    <template v-else-if="needsBooleanEditor">
      <ParamBooleanEditor :param-builder="props.paramBuilder"/>
    </template>
    <template v-else>
      <ParamJsonEditor :param-builder="props.paramBuilder"/>
    </template>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import ParamTextEditor from "@/dialogs/abi/ParamTextEditor.vue";
import ParamBooleanEditor from "@/dialogs/abi/ParamBooleanEditor.vue";
import ParamJsonEditor from "@/dialogs/abi/ParamJsonEditor.vue";
import {ContractParamBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";

const props = defineProps({
  paramBuilder: {
    type: Object as PropType<ContractParamBuilder>,
    required: true
  },
})

const needsBooleanEditor = computed(
    () => props.paramBuilder.paramType.baseType == "bool")

const needsTextEditor = computed(() => {
  let result: boolean
  switch (clearSize(props.paramBuilder.paramType.baseType)) {
    case "int":
    case "uint":
    case "string":
    case "address":
    case "bytes":
      result = true
      break
    default:
      result = false
      break
  }
  return result
})

interface SizedType {
  coreType: string, // int, uint, string, bytes
  size: number
}

function clearSize(baseType: string): string {
  const sizedType = parseBaseType(baseType)
  return sizedType?.coreType ?? baseType
}

function parseBaseType(baseType: string): SizedType | null {
  let result: SizedType | null = null
  const sizableTypes = ["int", "uint", "string", "bytes"]
  for (const t of sizableTypes) {
    if (baseType.startsWith(t)) {
      const coreType = baseType.slice(0, t.length)
      const size = parseInt(baseType.slice(t.length))
      if (!isNaN(size) && size >= 1) {
        result = {coreType, size}
        break
      }
    }
  }
  return result
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
