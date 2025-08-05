// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="accountId" id="tokensSection">

    <template #title>
      <span>HTS Tokens</span>
    </template>

    <template #right-control>
      <template v-if="(selectedTab === 'fungible' || selectedTab ==='nfts') && rejectEnabled">
        <div v-if="rejectButtonHint" class="h-is-low-contrast">
          {{ rejectButtonHint }}
        </div>
        <ButtonView
            id="reject-button"
            :enabled="rejectButtonEnabled"
            :size="ButtonSize.small"
            @action="onReject"
        >
          REJECT
        </ButtonView>
      </template>
      <template v-else-if="selectedTab === 'pendingAirdrop' && claimEnabled">
        <div v-if="claimButtonHint" class="h-is-low-contrast">
          {{ claimButtonHint }}
        </div>
        <ButtonView
            id="claim-button"
            :enabled="claimActionEnabled"
            :size="ButtonSize.small"
            @action="onClaim"
        >
          {{ checkedAirdrops.length === 0 ? 'CLAIM ALL' : 'CLAIM' }}
        </ButtonView>
      </template>
      <template v-else/>
    </template>

    <template #content>
      <template v-if="hasContent">
        <Tabs
            :selected-tab="selectedTab"
            :tab-ids="tabIds"
            :tabLabels="tabLabels"
            @update:selected-tab="onSelectTab($event)"
        />

        <div v-if="selectedTab === 'fungible'" id="fungibleTable">
          <FungibleTable
              :controller="fungibleTableController"
              :check-enabled="rejectEnabled"
              v-model:checked-tokens="checkedTokens"
          />
        </div>

        <div v-else-if="selectedTab === 'nfts'" id="nftsTable">
          <NftsTable
              :controller="nftsTableController"
              :check-enabled="rejectEnabled"
              v-model:checked-nfts="checkedTokens"
          />
        </div>

        <div
            v-else-if="selectedTab === 'pendingAirdrop'" id="pendingAirdropTable"
            class="pending-airdrops-container"
        >
          <Tabs
              :selected-tab="airdropSelectedTab"
              :tab-ids="airdropTabIds"
              :tabLabels="airdropTabLabels"
              :sub-tabs="true"
              @update:selectedTab="onAirdropSelectTab"
          />
          <div v-if="airdropSelectedTab === 'nfts'" id="pendingNftsTable">
            <PendingNftAirdropTable
                :controller="nftsAirdropTableController"
                :check-enabled="claimEnabled"
                v-model:checked-airdrops="checkedAirdrops"
            />
          </div>
          <div v-else id="pendingFungibleTable">
            <PendingFungibleAirdropTable
                :controller="fungibleAirdropTableController"
                :check-enabled="claimEnabled"
                v-model:checked-airdrops="checkedAirdrops"
            />
          </div>
        </div>
      </template>

      <template v-else>
        <DocSnippet>
          <p>This account currently holds no fungible tokens, NFTs, or pending token airdrops.</p>
        </DocSnippet>
      </template>
    </template>

  </DashboardCardV2>

  <RejectTokenGroupDialog
      v-model:show-dialog="showRejectTokenDialog"
      :tokens="checkedTokens"
      @rejected="onRejectCompleted"
  />

  <ClaimTokenGroupDialog
      v-model:showDialog="showClaimDialog"
      :airdrops="candidateAirdrops"
      :drained="checkedAirdrops.length < MAX_AIRDROPS"
      @claimed="onClaimCompleted"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType, ref} from 'vue';
import Tabs from "@/components/Tabs.vue";
import {AppStorage} from "@/AppStorage";
import {useRouter} from "vue-router";
import {NftsTableController} from "@/components/account/NftsTableController";
import NftsTable from "@/components/account/NftsTable.vue";
import FungibleTable from "@/components/account/FungibleTable.vue";
import {FungibleTableController} from "@/components/account/FungibleTableController";
import {Nft, Token, TokenAirdrop, TokenType} from "@/schemas/MirrorNodeSchemas";
import RejectTokenGroupDialog from "@/dialogs/token/RejectTokenGroupDialog.vue";
import ClaimTokenGroupDialog from "@/dialogs/token/ClaimTokenGroupDialog.vue";
import {PendingAirdropTableController} from "@/components/account/PendingAirdropTableController";
import PendingNftAirdropTable from "@/components/account/PendingNftAirdropTable.vue";
import {tokenOrNftId} from "@/schemas/MirrorNodeUtils.ts";
import PendingFungibleAirdropTable from "@/components/account/PendingFungibleAirdropTable.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import ButtonView from "@/elements/ButtonView.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import {walletManager} from "@/utils/RouteManager.ts";
import DocSnippet from "@/components/DocSnippet.vue";

const props = defineProps({
  accountId: {
    type: String as PropType<string | null>,
    default: null
  },
})

const hasContent = computed(() =>
    props.accountId === walletManager.accountId.value
    || fungibleTableController.totalRowCount.value >= 1
    || nftsTableController.totalRowCount.value >= 1
    || fungibleAirdropTableController.totalRowCount.value >= 1
    || nftsAirdropTableController.totalRowCount.value >= 1
)

const defaultPageSize = 15

const accountId = computed(() => props.accountId)

const claimActionEnabled = true

const tabIds = ['fungible', 'nfts', 'pendingAirdrop']

const tabLabels = ['Fungible', 'NFTs', 'Pending Airdrops']
const selectedTab = ref<string | null>(AppStorage.getAccountTokenTab() ?? tabIds[0])
const onSelectTab = (tab: string | null) => {
  selectedTab.value = tab
  AppStorage.setAccountTokenTab(tab)
  checkedTokens.value.splice(0)
  checkedAirdrops.value.splice(0)
}

const airdropTabIds = ['nfts', 'fungible']
const airdropTabLabels = ['NFTs', 'Fungible']
const airdropSelectedTab = ref<string | null>(AppStorage.getAccountAirdropTab() ?? airdropTabIds[0])
const onAirdropSelectTab = (tab: string | null) => {
  airdropSelectedTab.value = tab
  AppStorage.setAccountAirdropTab(tab)
  checkedAirdrops.value.splice(0)
}

const nftsTableController = new NftsTableController(
    useRouter(),
    accountId,
    defaultPageSize,
    "ps", "ks"
);

const fungibleTableController = new FungibleTableController(
    useRouter(),
    accountId,
    defaultPageSize,
    "pf", "kf"
);

const nftsAirdropTableController = new PendingAirdropTableController(
    useRouter(),
    accountId,
    TokenType.NON_FUNGIBLE_UNIQUE,
    defaultPageSize,
    "pa", "ka"
)
const fungibleAirdropTableController = new PendingAirdropTableController(
    useRouter(),
    accountId,
    TokenType.FUNGIBLE_COMMON,
    defaultPageSize,
    "pr", "kr"
)

onMounted(() => {
  nftsTableController.mount()
  fungibleTableController.mount()
  nftsAirdropTableController.mount()
  fungibleAirdropTableController.mount()
})
onBeforeUnmount(() => {
  nftsTableController.unmount()
  fungibleTableController.unmount()
  nftsAirdropTableController.unmount()
  fungibleAirdropTableController.unmount()
})


//
// Reject
//

const showRejectTokenDialog = ref(false)

const onReject = () => {
  showRejectTokenDialog.value = true
}

const onRejectCompleted = () => {
  checkedTokens.value.splice(0)
  if (selectedTab.value === 'fungible') {
    fungibleTableController.refresh()
  } else {
    nftsTableController.refresh()
  }
}

const isNftSelection = computed(() =>
    checkedTokens.value.length >= 1
    && (checkedTokens.value[0] as Nft).serial_number != undefined
)

const rejectButtonHint = computed(() => {
  let result: string
  const checkedCount = checkedTokens.value.length
  if (checkedCount >= 2) {
    result = `${checkedCount} selected ${isNftSelection.value ? "NFT" : "token"}s`
  } else if (checkedCount == 1) {
    result = `${tokenOrNftId(checkedTokens.value[0])} selected`
  } else {
    result = ""
  }
  return result
})

const rejectEnabled = computed(() => {
  const isTableFilled = (selectedTab.value === 'fungible' && fungibleTableController.totalRowCount.value >= 1)
      || (selectedTab.value === 'nfts' && nftsTableController.totalRowCount.value >= 1)

  return walletManager.isHieroWallet.value
      && walletManager.accountId.value === props.accountId
      && isTableFilled
})

const rejectButtonEnabled = computed(() =>
    (checkedTokens.value.length >= 1)
)

const checkedTokens = ref<(Token | Nft)[]>([])

//
// Claim
//

const MAX_AIRDROPS = 100 // for CLAIM ALL

const showClaimDialog = ref(false)

const onClaim = async () => {
  if (checkedAirdrops.value.length === 0) { // CLAIM ALL was chosen
    const allAirdrops = (airdropSelectedTab.value === 'nfts')
        ? await nftsAirdropTableController.loadAllAirdrops(MAX_AIRDROPS)
        : await fungibleAirdropTableController.loadAllAirdrops(MAX_AIRDROPS)
    candidateAirdrops.value = allAirdrops ?? []
  } else {
    candidateAirdrops.value = checkedAirdrops.value
  }
  showClaimDialog.value = true
}

const onClaimCompleted = () => {
  checkedAirdrops.value.splice(0)
  nftsTableController.refresh()
  fungibleTableController.refresh()
  nftsAirdropTableController.refresh()
  fungibleAirdropTableController.refresh()
}

const claimButtonHint = computed(() => {
  let result: string
  const checkedCount = checkedAirdrops.value.length
  if (checkedCount >= 2) {
    result = `${checkedCount} selected tokens`
  } else if (checkedCount == 1) {
    const checkedTokenId = checkedAirdrops.value[0].token_id
    result = `${checkedTokenId} selected`
  } else {
    result = ""
  }
  return result
})

const claimEnabled = computed(() => {
  const isTableFilled = (airdropSelectedTab.value === 'fungible' && fungibleAirdropTableController.totalRowCount.value >= 1)
      || (airdropSelectedTab.value === 'nfts' && nftsAirdropTableController.totalRowCount.value >= 1)

  return walletManager.isHieroWallet.value
      && walletManager.accountId.value === props.accountId
      && isTableFilled
})

const checkedAirdrops = ref<TokenAirdrop[]>([])

const candidateAirdrops = ref<TokenAirdrop[]>([])

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.pending-airdrops-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>
