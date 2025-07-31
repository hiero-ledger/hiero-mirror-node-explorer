// SPDX-License-Identifier: Apache-2.0

<!--


      <div style="display: flex; align-items:center; justify-content: space-evenly; flex-wrap: wrap">
        <div v-for="d in walletItems" :key="d.name">
          <a :id="d.name" @click="chosenWallet=d" @dblclick="handleConnect">
            <div style="display: flex; align-items: center; column-gap: 16px" :class="{'selected':isSelected(d)}">
              <img :src="d.iconURL ?? undefined" alt="wallet logo" style="max-height: 20px;">
              <div>{{ d.name }}</div>
            </div>
          </a>
        </div>
      </div>


  -->

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <ModalDialog v-model:show-dialog="showDialog" :width="0">

    <template #modalDialogTitle>Connect Wallet</template>

    <template #modalDialogContent>
      <template v-if="walletItems.length >= 1">
        <div style="display: flex; align-items: center; justify-content: center;">
          <div class="wallet-chooser-container" :style="{ 'grid-template-columns': gridTemplateColumns }">
            <template v-for="i in walletItems" :key="i.name">
              <WalletChooserItem v-model:selection="chosenWallet" :wallet-item="i" @connect="handleConnect"/>
            </template>
          </div>
        </div>
      </template>
      <template v-else>
        <TaskPanel :mode="TaskPanelMode.error">
          <template #taskPanelMessage>No wallet available</template>
          <template #taskPanelExtra1>
            <div>You must install a wallet extension in your browser</div>
          </template>
        </TaskPanel>
      </template>
    </template>

    <template #modalDialogButtons>
      <ModalDialogButton v-model:show-dialog="showDialog">CANCEL</ModalDialogButton>
      <ModalDialogButton v-model:show-dialog="showDialog"
                         :enabled="chosenWallet !== null"
                         :is-default="true"
                         @action="handleConnect">CONNECT
      </ModalDialogButton>
    </template>

  </ModalDialog>

  <OptOutDialog v-model:show-dialog="showDisclaimerDialog"
                @onAgree="handleAgreeDisclaimer"></OptOutDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, ref, watch} from "vue";
import ModalDialog from "@/dialogs/core/ModalDialog.vue";
import ModalDialogButton from "@/dialogs/core/ModalDialogButton.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import OptOutDialog from "@/dialogs/OptOutDialog.vue";
import {EIP6963Agent} from "@/utils/wallet/EIP6963Agent.ts";
import {AppStorage} from "@/AppStorage.ts";
import WalletChooserItem from "@/dialogs/wallet_chooser/WalletChooserItem.vue";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const chosenWallet = ref<WalletItem | null>(null)
const showDisclaimerDialog = ref(false)

const emit = defineEmits(["chooseWallet"])

watch(showDialog, (showing) => {
  if (showing) chosenWallet.value = null
})

//
// Wallet items
//

export interface WalletItem {
  name: string
  iconURL: string
  uuid: string | null
}

const walletConnectID = CoreConfig.inject().walletConnectID
const walletItems = computed<WalletItem[]>(() => {
  const result: WalletItem[] = []
  if (walletConnectID !== null) {
    result.push({name: "Wallet Connect", iconURL: WALLECT_CONNECT_LOGO, uuid: null})
  }
  for (const d of EIP6963Agent.instance.providers.value) {
    result.push({name: d.info.name, iconURL: d.info.icon, uuid: d.info.uuid})
  }
  return result
})

const disclaimer = CoreConfig.inject().walletChooserDisclaimerPopup

const handleConnect = () => {
  if (disclaimer !== null && !AppStorage.getSkipDisclaimer()) {
    showDisclaimerDialog.value = true
  } else if (chosenWallet.value !== null) {
    handleAgreeDisclaimer()
  }
}

const columnCount = computed(() => Math.min(walletItems.value.length, 3))

const gridTemplateColumns = computed(() => {
  return "repeat(" + columnCount.value + ", 1fr)"
})

//
// Disclaimer
//

const handleAgreeDisclaimer = () => {
  showDialog.value = false
  emit('chooseWallet', chosenWallet.value)
}

const WALLECT_CONNECT_LOGO =
    "data:image/svg+xml,%3Csvg fill='none' height='400' viewBox='0 0 400 400' width='400' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3CclipPath id='a'%3E%3Cpath d='m0 0h400v400h-400z'/%3E%3C/clipPath%3E%3Cg clip-path='url(%23a)'%3E%3Ccircle cx='200' cy='200' fill='%233396ff' r='199.5' stroke='%2366b1ff'/%3E%3Cpath d='m122.519 148.965c42.791-41.729 112.171-41.729 154.962 0l5.15 5.022c2.14 2.086 2.14 5.469 0 7.555l-17.617 17.18c-1.07 1.043-2.804 1.043-3.874 0l-7.087-6.911c-29.853-29.111-78.253-29.111-108.106 0l-7.59 7.401c-1.07 1.043-2.804 1.043-3.874 0l-17.617-17.18c-2.14-2.086-2.14-5.469 0-7.555zm191.397 35.529 15.679 15.29c2.14 2.086 2.14 5.469 0 7.555l-70.7 68.944c-2.139 2.087-5.608 2.087-7.748 0l-50.178-48.931c-.535-.522-1.402-.522-1.937 0l-50.178 48.931c-2.139 2.087-5.608 2.087-7.748 0l-70.7015-68.945c-2.1396-2.086-2.1396-5.469 0-7.555l15.6795-15.29c2.1396-2.086 5.6085-2.086 7.7481 0l50.1789 48.932c.535.522 1.402.522 1.937 0l50.177-48.932c2.139-2.087 5.608-2.087 7.748 0l50.179 48.932c.535.522 1.402.522 1.937 0l50.179-48.931c2.139-2.087 5.608-2.087 7.748 0z' fill='%23fff'/%3E%3C/g%3E%3C/svg%3E"


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.wallet-chooser-container {
  display: grid;
  grid-column-gap: 8px;
  grid-row-gap: 8px;
}

</style>
