// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <ButtonView
      id="connectWalletButton"
      :size="ButtonSize.medium"
      :is-default="true"
      :enabled="!connecting"
      @action="chooseWallet"
  >
    {{ connecting ? "Connecting…" : isLargeScreen ? "CONNECT WALLET" : "CONNECT" }}
  </ButtonView>

  <WalletChooserDialog v-model:show-dialog="showWalletChooser" @choose-wallet="handleChooseWallet"/>

  <AlertDialog v-model:visible="showConnectErrorDialog">
    <template #alertDialogMessage>{{ mainMessage }}</template>
    <template #alertDialogExtra>{{ extraMessage }}</template>
  </AlertDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, ref} from "vue";
import {WalletManagerStatus} from "@/utils/wallet/WalletManagerV4.ts";
import {WalletClientError, WalletClientRejectError} from "@/utils/wallet/client/WalletClient.ts";
import WalletChooserDialog, {WalletItem} from "@/dialogs/wallet_chooser/WalletChooserDialog.vue";
import AlertDialog from "@/dialogs/AlertDialog.vue";
import ButtonView from "@/elements/ButtonView.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import {gtagWalletConnect, gtagWalletConnectionFailure} from "@/gtag.ts";
import router, {routeManager, walletManager} from "@/utils/RouteManager.ts";

const isLargeScreen = inject('isLargeScreen', true)

//
// Connection state
//

const connecting = computed(() => {
  return walletManager.status.value == WalletManagerStatus.initializing
      || walletManager.status.value == WalletManagerStatus.restoring
      || walletManager.status.value == WalletManagerStatus.connecting

})

//
// Wallet chooser
//

const showWalletChooser = ref(false)
const chooseWallet = () => {
  showWalletChooser.value = true
}

const handleChooseWallet = (walletItem: WalletItem) => {
  walletManager
      .connect(walletItem.uuid)
      .catch((reason) => {
        if (!(reason instanceof WalletClientRejectError)) {
          console.warn("Failed to connect wallet - reason:" + reason.toString())
          connectError.value = reason
          showConnectErrorDialog.value = true
          gtagWalletConnectionFailure(walletItem.name)
        }
      })
      .finally(() => {
        navigateToMyAccount()
      })
  // walletIconURL.value = walletManager.getActiveDriver().iconURL || ""
  gtagWalletConnect(walletItem.name)
}

const navigateToMyAccount = () => {
  if (walletManager.accountId.value) {
    router.push(routeManager.makeRouteToAccount(walletManager.accountId.value))
  }
}

//
// Error alert
//

const mainMessage = computed(
    () => connectError.value instanceof WalletClientError
        ? connectError.value.message
        : "Unexpected error"
)
const extraMessage = computed(
    () => connectError.value instanceof WalletClientError
        ? connectError.value.extra
        : JSON.stringify(connectError.value)
)

const showConnectErrorDialog = ref(false)
const connectError = ref<unknown>()


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>
