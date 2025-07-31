// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="wallet-options">

    <!-- header -->
    <div class="wallet-options-title">
      <div style="height: 40px">
        <EntityLink :route="accountRoute">
          <LabelView :icon-url="walletIconURL">
            <div style="display: flex; align-items: center; justify-content: center;">
              {{ accountId }}
              <span style="color: var(--text-secondary)">-{{ accountChecksum }}</span>
            </div>
          </LabelView>
        </EntityLink>
      </div>
    </div>

    <!-- content -->

    <template v-if="accountId">

      <div class="wallet-options-content">

        <!-- EVM Address -->
        <GroupBoxView>
          <template #groupBoxTitle>EVM Address</template>
          <template #default>
            <EVMAddress :address="accountEthereumAddress" :show-id="false"/>
          </template>
        </GroupBoxView>

        <!-- Balance -->
        <GroupBoxView>
          <template #groupBoxTitle>Balance</template>
          <template #default>
            <HbarAmount :amount="tbarBalance"/>
            <div style="color: var(--text-secondary)">
              <HbarExtra :hide-zero="false" :tbar-amount="tbarBalance ?? 0"/>
            </div>
          </template>
        </GroupBoxView>

        <!-- Account Operations -->
        <GroupBoxView>
          <template #groupBoxTitle>Account Operations</template>
          <template #default>
            <div class="account-operations">
              <div class="operation" @click="onUpdateAccount">
                <UserRoundPen :size="18"/>
                Account Update
              </div>
              <div class="operation" @click="onApproveAllowance">
                <CheckCheck :size="18"/>
                Approve Allowance
              </div>
            </div>
          </template>
        </GroupBoxView>

      </div>

    </template>

    <template v-else>
      Reconnect to your wallet and make sure to select {{ currentNetwork.toUpperCase() }} accounts
    </template>

    <!-- footer -->
    <div class="wallet-options-footer">
      <template v-if="accountId">
        <ButtonView @action="handleDisconnect">DISCONNECT WALLET</ButtonView>
        <AccountSelector :account-ids="accountIds"
                         :model-value="accountId"
                         @update:model-value="handleChangeAccount"/>
      </template>
      <template v-else>
        <ButtonView @action="handleReconnect">RECONNECT WALLET</ButtonView>
      </template>
    </div>

    <UpdateAccountDialog
        v-model:show-dialog="showUpdateAccountDialog"
        @updated="onUpdateCompleted"
    />

    <ApproveAllowanceDialog v-model:show-dialog="showApproveAllowanceDialog"
                            @allowance-approved="onAllowanceApproved"
    />

  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import GroupBoxView from "@/elements/GroupBoxView.vue";
import ButtonView from "@/elements/ButtonView.vue";
import LabelView from "@/elements/LabelView.vue";
import {AccountLocParser} from "@/utils/parser/AccountLocParser.ts";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {BalanceAnalyzer} from "@/utils/analyzer/BalanceAnalyzer.ts";
import HbarExtra from "@/components/values/HbarExtra.vue";
import EntityLink from "@/components/values/link/EntityLink.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import UpdateAccountDialog from "@/dialogs/UpdateAccountDialog.vue";
import ApproveAllowanceDialog from "@/dialogs/allowance/ApproveAllowanceDialog.vue";
import {CheckCheck, UserRoundPen} from 'lucide-vue-next';
import HbarAmount from "@/components/values/HbarAmount.vue";
import AccountSelector from "@/components/page/header/wallet/AccountSelector.vue";
import router, {routeManager, walletManager} from "@/utils/RouteManager.ts";

const showWalletOptions = defineModel("showWalletOptions", {
  type: Boolean,
  required: true
})

const networkConfig = NetworkConfig.inject()
const accountLocParser = new AccountLocParser(walletManager.accountId, networkConfig)
onMounted(() => accountLocParser.mount())
onBeforeUnmount(() => accountLocParser.unmount())

const balanceAnalyzer = new BalanceAnalyzer(accountLocParser.accountId, 10000)
onMounted(() => balanceAnalyzer.mount())
onBeforeUnmount(() => balanceAnalyzer.unmount())

const accountRoute = computed(() => {
  const accountId = walletManager.accountId.value
  return accountId !== null ? routeManager.makeRouteToAccount(accountId) : null
})


const walletIconURL = computed(() => walletManager.walletIconURL.value ?? undefined)
const accountId = computed(() => walletManager.accountId.value ?? "No account ID")
const accountChecksum = accountLocParser.accountChecksum ?? ""
const accountIds = walletManager.accountIds
const accountEthereumAddress = accountLocParser.ethereumAddress
const tbarBalance = balanceAnalyzer.hbarBalance
const currentNetwork = routeManager.currentNetwork

const showUpdateAccountDialog = ref(false)
const onUpdateAccount = () => showUpdateAccountDialog.value = true
const onUpdateCompleted = () => console.log('Account update completed')

const showApproveAllowanceDialog = ref(false)
const onApproveAllowance = () => showApproveAllowanceDialog.value = true
const onAllowanceApproved = () => console.log('Approve Allowance completed')

const handleDisconnect = async () => {
  showWalletOptions.value = false
  await walletManager.disconnect()
}

const handleReconnect = async () => {
  showWalletOptions.value = false
  const walletUUID = walletManager.walletUUID.value
  await walletManager.disconnect()
  await walletManager.connect(walletUUID)
}

const handleChangeAccount = (accountId: string) => {
  walletManager.selectAccountId(accountId)
  if (walletManager.accountId.value) {
    router.push(routeManager.makeRouteToAccount(walletManager.accountId.value))
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.wallet-options {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  row-gap: 24px;
}

div.wallet-options-title {
  align-items: center;
  border-bottom-color: var(--network-theme-color);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  color: var(--text-primary);
  display: flex;
  padding-bottom: 16px;
}

div.wallet-options-content {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

div.account-operations {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
}

div.operation {
  align-items: center;
  display: flex;
  gap: 8px;
}

div.operation:hover {
  color: grey;
}

div.wallet-options-footer {
  align-items: center;
  justify-content: space-between;
  column-gap: 8px;
  display: flex;
  flex-direction: row-reverse;
}


</style>
