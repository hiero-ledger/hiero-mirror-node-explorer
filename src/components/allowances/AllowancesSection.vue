// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="accountId" collapsible-key="allowances">

    <template #title>
      Allowances
    </template>

    <template #right-control>
      <ButtonView
          v-if="isWalletConnected && isHieroWallet"
          id="approve-button"
          :size="ButtonSize.small"
          @action="onClick"
      >
        APPROVE ALLOWANCE
      </ButtonView>
    </template>

    <template #content>
      <Tabs
          :selected-tab="selectedTab"
          :tab-ids="tabIds"
          :tabLabels="tabLabels"
          @update:selected-tab="onUpdate($event)"
      />

      <div v-if="selectedTab === 'nft'" id="approvedForAll" class="approved-for-all-checkbox">
        <input type="checkbox" v-model="selectApprovedForAll" id="approvedForAll" name="approvedForAll"/>
        <label for="approvedForAll">Approved for all</label>
      </div>

      <div v-if="selectedTab === 'hbar'" id="hbarAllowancesTable">
        <HbarAllowanceTable
            :controller="hbarAllowanceTableController"
            @edit-allowance="onEditHbar"
        />
      </div>

      <div v-else-if="selectedTab === 'token'" id="tokenAllowancesTable">
        <TokenAllowanceTable
            :controller="tokenAllowanceTableController"
            @edit-allowance="onEditToken"
        />
      </div>

      <div v-else id="nftAllowancesTable">
        <NftAllSerialsAllowanceTable
            v-if="selectApprovedForAll"
            :controller="nftAllSerialsAllowanceTableController"
            @delete-allowance="onDeleteAllSerialsNft"
        />
        <NftAllowanceTable
            v-else
            :controller="nftAllowanceTableController"
            @delete-allowance="onDeleteNft"
        />
      </div>
    </template>

  </DashboardCardV2>

  <ApproveAllowanceDialog v-model:show-dialog="showApproveAllowanceDialog"
                          @allowance-approved="onAllowanceApproved"
  />

  <UpdateCryptoAllowanceDialog v-model:show-dialog="showUpdateHbarAllowanceDialog"
                               :hbar-allowance="currentHbarAllowance"
                               @allowance-approved="onAllowanceApproved"
  />

  <UpdateTokenAllowanceDialog v-model:show-dialog="showUpdateTokenAllowanceDialog"
                              :token-allowance="currentTokenAllowance"
                              @allowance-approved="onAllowanceApproved"
  />

  <DeleteNftAllowanceDialog
      v-model:show-dialog="showDeleteNftAllowanceDialog"
      :token-id="currentNftId"
      :spender-id="currentSpenderId"
      :serial-number="currentNftSerialNumber"
      @allowance-deleted="onNftDeleted"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import router, {walletManager} from "@/router";
import {HbarAllowanceTableController} from "@/components/allowances/HbarAllowanceTableController";
import {TokenAllowanceTableController} from "@/components/allowances/TokenAllowanceTableController";
import HbarAllowanceTable from "@/components/allowances/HbarAllowanceTable.vue";
import TokenAllowanceTable from "@/components/allowances/TokenAllowanceTable.vue";
import ApproveAllowanceDialog from "@/dialogs/allowance/ApproveAllowanceDialog.vue";
import {CryptoAllowance, Nft, NftAllowance, TokenAllowance} from "@/schemas/MirrorNodeSchemas";
import Tabs from "@/components/Tabs.vue";
import {AppStorage} from "@/AppStorage";
import NftAllowanceTable from "@/components/allowances/NftAllowanceTable.vue";
import {NftAllowanceTableController} from "@/components/allowances/NftAllowanceTableController";
import {NftAllSerialsAllowanceTableController} from "@/components/allowances/NftAllSerialsAllowanceTableController";
import NftAllSerialsAllowanceTable from "@/components/allowances/NftAllSerialsAllowanceTable.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ButtonView from "@/elements/ButtonView.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import UpdateCryptoAllowanceDialog from "@/dialogs/allowance/UpdateCryptoAllowanceDialog.vue";
import UpdateTokenAllowanceDialog from "@/dialogs/allowance/UpdateTokenAllowanceDialog.vue";
import DeleteNftAllowanceDialog from "@/dialogs/allowance/DeleteNftAllowanceDialog.vue";

const props = defineProps({
  accountId: String,
})

const isMediumScreen = inject('isMediumScreen', true)
const cryptoName = CoreConfig.inject().cryptoName

const computedAccountId = computed(() => props.accountId || null)
const isWalletConnected = computed(() =>
    walletManager.accountId.value === props.accountId
)

const showApproveAllowanceDialog = ref(false)
const showUpdateHbarAllowanceDialog = ref(false)
const showUpdateTokenAllowanceDialog = ref(false)
const showDeleteNftAllowanceDialog = ref(false)

watch(showApproveAllowanceDialog, (newValue) => {
  if (!newValue) {
    cleanUpRouteQuery()
  }
})

const tabIds = ['hbar', 'token', 'nft']
const tabLabels = [cryptoName, 'Tokens', 'NFTs']
const selectedTab = ref<string | null>(AppStorage.getAccountAllowanceTab() ?? tabIds[0])
const onUpdate = (tab: string | null) => {
  selectedTab.value = tab
  AppStorage.setAccountAllowanceTab(tab)
  switch (selectedTab.value) {
    case 'hbar':
      hbarAllowanceTableController.refresh()
      break
    case 'token':
      tokenAllowanceTableController.refresh()
      break
    case 'nft':
      if (selectApprovedForAll.value) {
        nftAllSerialsAllowanceTableController.refresh()
      } else {
        nftAllowanceTableController.refresh()
      }
      break
    default:
      //should not happen
  }
}

const selectApprovedForAll = ref(false)
onMounted(() => selectApprovedForAll.value = AppStorage.getSelectApprovedForAll())
watch(selectApprovedForAll, (value) => {
  AppStorage.setSelectApprovedForAll(value)
  return value ? nftAllSerialsAllowanceTableController.refresh() : nftAllowanceTableController.refresh()
})

const defaultPageSize = isMediumScreen ? 10 : 5

const currentHbarAllowance = ref<CryptoAllowance | null>(null)
const currentTokenAllowance = ref<TokenAllowance | null>(null)
const currentNftAllowance = ref<Nft | null>(null)
const currentNftAllSerialsAllowance = ref<NftAllowance | null>(null)

const currentNftId = computed(() => {
  let result: string | null
  if (selectApprovedForAll.value) {
    result = currentNftAllSerialsAllowance.value?.token_id ?? null
  } else {
    result = currentNftAllowance.value?.token_id ?? null
  }
  return result
})

const currentSpenderId = computed(() => {
  let result: string | null
  if (selectApprovedForAll.value) {
    result = currentNftAllSerialsAllowance.value?.spender ?? null
  } else {
    result = currentNftAllowance.value?.spender ?? null
  }
  return result
})

const currentNftSerialNumber = computed(() => {
  let result: number | null
  if (selectApprovedForAll.value) {
    result = null
  } else {
    result = currentNftAllowance.value?.serial_number ?? null
  }
  return result
})

//
// HBAR Allowances Table Controller
//
const hbarAllowanceTableController = new HbarAllowanceTableController(
    router,
    computedAccountId,
    defaultPageSize,
    "ph", "kh"
)
onMounted(() => hbarAllowanceTableController.mount())
onBeforeUnmount(() => hbarAllowanceTableController.unmount())

//
// Token Allowances Table Controller
//
const tokenAllowanceTableController = new TokenAllowanceTableController(
    router,
    computedAccountId,
    defaultPageSize,
    "pt", "kt"
)
onMounted(() => tokenAllowanceTableController.mount())
onBeforeUnmount(() => tokenAllowanceTableController.unmount())

//
// NFT Allowances Table Controllers
//
const nftAllowanceTableController = new NftAllowanceTableController(
    router,
    computedAccountId,
    defaultPageSize,
    "pn", "kn"
)
const nftAllSerialsAllowanceTableController = new NftAllSerialsAllowanceTableController(
    router,
    computedAccountId,
    defaultPageSize,
    "pc", "kc"
)
onMounted(() => {
  nftAllowanceTableController.mount()
  nftAllSerialsAllowanceTableController.mount()
})
onBeforeUnmount(() => {
  nftAllowanceTableController.unmount()
  nftAllSerialsAllowanceTableController.unmount()
})

const onClick = () => {
  showApproveAllowanceDialog.value = true
  currentHbarAllowance.value = null
  currentTokenAllowance.value = null
}

const onAllowanceApproved = () => {
  hbarAllowanceTableController.refresh()
  tokenAllowanceTableController.refresh()
  nftAllowanceTableController.refresh()
  nftAllSerialsAllowanceTableController.refresh()
}

const onEditHbar = (allowance: CryptoAllowance) => {
  // console.log("Edit Hbar Allowance: " + JSON.stringify(allowance))
  currentHbarAllowance.value = allowance
  showUpdateHbarAllowanceDialog.value = true
}

const onEditToken = (allowance: TokenAllowance) => {
  // console.log("Edit Token Allowance: " + JSON.stringify(allowance))
  currentTokenAllowance.value = allowance
  showUpdateTokenAllowanceDialog.value = true
}

const onDeleteNft = async (nft: Nft) => {
  // console.log("Delete NFT Allowance: " + JSON.stringify(nft))
  currentNftAllowance.value = nft
  currentNftAllSerialsAllowance.value = null
  showDeleteNftAllowanceDialog.value = true
}

const onDeleteAllSerialsNft = async (allowance: NftAllowance) => {
  // console.log("Delete NFT Allowance: " + JSON.stringify(allowance))
  currentNftAllowance.value = null
  currentNftAllSerialsAllowance.value = allowance
  showDeleteNftAllowanceDialog.value = true
}

const onNftDeleted = () => {
  nftAllowanceTableController.refresh()
  nftAllSerialsAllowanceTableController.refresh()
}

const cleanUpRouteQuery = async () => {
  const query = {...router.currentRoute.value.query}
  if (query.app) {
    delete query.app

    const failure = await router.replace({query: query})
    if (failure && failure.type != 8 && failure.type != 16) {
      console.warn(failure.message)
    }
  }
}

const isHieroWallet = walletManager.isHieroWallet

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.approved-for-all-checkbox {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

</style>
