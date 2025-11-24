// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<!--suppress HtmlWrongAttributeValue -->
<template>

  <div class="bytecode-root">

    <div class="assembly-header">
      <Tabs
          :tab-ids=tabIds
          :tab-labels=tabLabels
          :selected-tab="selectedTab"
          @update:selected-tab="handleTabUpdate($event)"
      />

      <div class="show-assembly-checkbox">
        <input id="show-assembly-bytecode" v-model="showAssemblyBytecode" name="show-assembly-bytecode"
               type="checkbox"/>
        <label for="show-assembly-bytecode">Show assembly bytecode</label>
      </div>
    </div>

    <template v-if="selectedTab === 'runtime'">
      <div id="bytecode" class="code-pane">
        <DisassembledCodeValue
            v-if="showAssemblyBytecode"
            class="h-code-box h-code-source"
            :byte-code="props.byteCode ?? undefined"
            :show-hexa-opcode="true"
        />
        <ByteCodeValue
            v-else
            class="h-code-box h-code-source"
            :byte-code="props.byteCode ?? undefined"
            :scroll-bar="false"
        />
      </div>
    </template>

    <template v-else-if="selectedTab === 'creation'">
      <div id="creation-bytecode" class="code-pane">
        <DisassembledCodeValue
            v-if="showAssemblyBytecode"
            class="h-code-box h-code-source"
            :byte-code="props.creationByteCode ?? undefined"
            :show-hexa-opcode="true"
        />
        <ByteCodeValue
            v-else
            class="h-code-box h-code-source"
            :byte-code="props.creationByteCode ?? undefined"
            :scroll-bar="false"
        />
      </div>
    </template>

    <template v-else/>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onMounted, PropType, ref, watch} from 'vue';
import "prismjs/prism";
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/prism.js";
import "prismjs/components/prism-clike.js";
import "prismjs/components/prism-solidity.js";
import ByteCodeValue from "@/components/values/ByteCodeValue.vue";
import DisassembledCodeValue from "@/components/values/DisassembledCodeValue.vue";
import Tabs from "@/components/Tabs.vue";
import {AppStorage} from "@/AppStorage.ts";

const props = defineProps({
  byteCode: {
    type: String as PropType<string | null>,
    default: null
  },
  creationByteCode: {
    type: String as PropType<string | null>,
    default: null
  }
})

const showAssemblyBytecode = ref(false)
onMounted(() => showAssemblyBytecode.value = AppStorage.getShowAssemblyBytecode())
watch(showAssemblyBytecode, () => AppStorage.setShowAssemblyBytecode(showAssemblyBytecode.value ? showAssemblyBytecode.value : null))

const tabIds = ['runtime', 'creation']
const tabLabels = ['Runtime Bytecode', 'Creation Bytecode']
const selectedTab = ref<string | null>(AppStorage.getContractByteCodeTab() ?? tabIds[0])
const handleTabUpdate = (tab: string | null) => {
  selectedTab.value = tab
  AppStorage.setContractByteCodeTab(tab)
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.bytecode-root {
  display: flex;
  flex-direction: column;
  row-gap: 16px;
}

div.code-pane {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

div.assembly-header {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: 8px;
  justify-content: space-between;
}

div.show-assembly-checkbox {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-left: 8px;

  label {
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 400;
  }
}

</style>
