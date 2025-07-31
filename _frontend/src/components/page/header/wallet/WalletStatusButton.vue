// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DropdownPanel v-model:deployed="showWalletOptions" :right-aligned="true">
    <template #button>
      <ButtonView
          id="walletInfoBanner"
          :is-transparent="true"
          :is-default="true"
          :size="ButtonSize.medium"
          @action="showWalletOptions = !showWalletOptions"
      >
        <div class="left">
          <img :src="walletIconURL ?? undefined" alt="wallet logo">
          {{ accountId !== null ? accountId : "No account" }}
        </div>
        <div class="right">
          <ChevronDown v-if="!showWalletOptions" :size="18"/>
          <ChevronUp v-else :size="18" />
        </div>
      </ButtonView>
    </template>
    <template #panel>
      <WalletOptions v-model:show-wallet-options="showWalletOptions"/>
    </template>
  </DropdownPanel>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ref} from "vue";
import DropdownPanel from "@/components/DropdownPanel.vue";
import ButtonView from "@/elements/ButtonView.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import {ChevronDown, ChevronUp} from "lucide-vue-next"
import WalletOptions from "@/components/page/header/wallet/WalletOptions.vue";
import {walletManager} from "@/utils/RouteManager.ts";

const accountId = walletManager.accountId
const walletIconURL = walletManager.walletIconURL
const showWalletOptions = ref(false)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.left {
  align-items: center;
  column-gap: 10px;
  display: flex;
  font-family: var(--font-family-heading), sans-serif;
  justify-content: space-between;
}

div.right {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-left: 4px;
}

img {
  max-height: 24px;
}

figure {
  display: flex;
  align-items: center;
}

</style>
