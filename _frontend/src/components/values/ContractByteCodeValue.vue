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

      <div v-if="selectedTab === 'assembly'" class="show-creation-bytecode-checkbox">
        <input id="show-creation-bytecode" v-model="showCreationBytecode" name="show-creation-bytecode"
               type="checkbox"/>
        <label for="show-creation-bytecode">Show creation bytecode</label>
      </div>
    </div>

    <template v-if="selectedTab === 'runtime'">
      <div id="bytecode" class="code-pane">
        <ByteCodeValue
            class="h-code-box h-code-source"
            :byte-code="props.byteCode ?? undefined"
            :scroll-bar="false"
        />
      </div>
    </template>

    <template v-else-if="selectedTab === 'creation'">
      <div id="creation-bytecode" class="code-pane">
        <ByteCodeValue
            class="h-code-box h-code-source"
            :byte-code="props.creationByteCode ?? undefined"
            :scroll-bar="false"
        />
      </div>
    </template>

    <template v-else>
      <div id="assembly-code" class="code-pane">
        <DisassembledCodeValue
            class="h-code-box h-code-source"
            :byte-code="(showCreationBytecode ? props.creationByteCode  : props.byteCode) ?? undefined"
            :show-hexa-opcode="true"
        />
      </div>
    </template>
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

const showCreationBytecode = ref(false)
onMounted(() => showCreationBytecode.value = AppStorage.getShowCreationBytecode())
watch(showCreationBytecode, () => AppStorage.setShowCreationBytecode(showCreationBytecode.value ? showCreationBytecode.value : null))

const tabIds = ['runtime', 'creation', 'assembly']
const tabLabels = ['Runtime Bytecode', 'Creation Bytecode', 'Assembly Bytecode']
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

div.show-creation-bytecode-checkbox {
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
