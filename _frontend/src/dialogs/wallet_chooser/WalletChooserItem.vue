// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="wallet-chooser-item"
       :class="{'selected': isSelected}"
       @click="selection = props.walletItem"
       @dblclick="handleDoubleClick">
    <div style="display: flex; align-items: center; justify-content: center; column-gap: 8px">
      <img :src="props.walletItem.iconURL ?? undefined" alt="wallet logo" style="height: 32px;"/>
      <div style="flex-basis: 0">{{ props.walletItem.name }}</div>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {WalletItem} from "@/dialogs/wallet_chooser/WalletChooserDialog.vue";

const selection = defineModel("selection", {
  type: Object as PropType<WalletItem | null>,
  default: null
})

const props = defineProps({
  walletItem: {type: Object as PropType<WalletItem>, required: true},
})

const emit = defineEmits(["connect"])

const isSelected = computed(() => {
  return selection.value !== null && selection.value.uuid === props.walletItem.uuid
})

const handleDoubleClick = () => {
  if (selection.value !== null) {
    emit("connect")
  }
}


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.wallet-chooser-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  width: 155px;
  height: 155px;
  border-radius: 8px;
  border-style: solid;
  border-width: 1px;
  border-color: var(--border-secondary);
  color: var(--text-primary);
  font-family: Inter, serif;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
}

div.wallet-chooser-item.selected {
  border-color: var(--network-border-accent-color);
  background-color: hsl(from var(--network-button-color) h s l / 9%)
}

</style>
