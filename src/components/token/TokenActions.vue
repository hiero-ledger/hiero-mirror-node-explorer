// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <!-- Single action -->

  <ButtonView
      v-if="associateEnabled"
      :enabled="true"
      :size="buttonSize"
      :for-toolbar="true"
      @action="showAssociateDialog=true"
  >ASSOCIATE
  </ButtonView>

  <ButtonView
      v-if="dissociateEnabled"
      :enabled="true"
      :size="buttonSize"
      :for-toolbar="true"
      @action="showDissociateDialog=true"
  >DISSOCIATE
  </ButtonView>

  <ButtonView
      v-if="rejectEnabled"
      :enabled="true"
      :size="buttonSize"
      :for-toolbar="true"
      @action="showRejectDialog=true"
  >REJECT
  </ButtonView>

  <ButtonView
      v-if="claimEnabled"
      :enabled="true"
      :size="buttonSize"
      :for-toolbar="true"
      @action="showClaimDialog=true"
  >CLAIM
  </ButtonView>

  <ButtonView
      v-if="watchEnabled"
      :enabled="true"
      :size="buttonSize"
      :for-toolbar="true"
      @action="showWatchDialog=true"
  >IMPORT
  </ButtonView>

  <AssociateTokenDialog
      v-model:show-dialog="showAssociateDialog"
      :analyzer="analyzer"
      @token-associated="emit('completed')"/>

  <DissociateTokenDialog
      v-model:show-dialog="showDissociateDialog"
      :analyzer="analyzer"
      @token-dissociated="emit('completed')"/>

  <RejectTokenDialog
      v-model:show-dialog="showRejectDialog"
      :analyzer="analyzer"
      @token-rejected="emit('completed')"/>

  <ClaimTokenDialog
      v-model:show-dialog="showClaimDialog"
      :analyzer="analyzer"
      @token-claimed="emit('completed')"/>

  <WatchTokenDialog
      v-model:show-dialog="showWatchDialog"
      :analyzer="analyzer"
      @token-watched="emit('completed')"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, ref} from "vue";
import {TokenAssociationStatus, TokenInfoAnalyzer} from "@/components/token/TokenInfoAnalyzer.ts";
import ButtonView from "@/elements/ButtonView.vue";
import AssociateTokenDialog from "@/dialogs/token/AssociateTokenDialog.vue";
import DissociateTokenDialog from "@/dialogs/token/DissociateTokenDialog.vue";
import {ButtonSize} from "@/dialogs/core/DialogUtils.ts";
import RejectTokenDialog from "@/dialogs/token/RejectTokenDialog.vue";
import ClaimTokenDialog from "@/dialogs/token/ClaimTokenDialog.vue";
import WatchTokenDialog from "@/dialogs/token/WatchTokenDialog.vue";
import {walletManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  analyzer: {
    type: Object as PropType<TokenInfoAnalyzer>,
    required: true
  }
})

const emit = defineEmits(["completed"])

/*

  T   : token
  TA  : treasury account of T
  WA  : account from connected wallet

  | Actions       | TA == WA   |                                  TA != WA                                  |
  |               |            |-------------------+-------------------------------------+------------------+
  |               |            | T is dissociated  |          T is associated            | T is an airdrop  |
  |               |            | from WA           |          to WA                      | to WA            |
  |               |            +                   +------------------+------------------+                  |
  |               |            +                   +    balance == 0  |    balance > 0   |                  |
  |---------------+------------+-------------------+------------------+------------------+------------------+
  | Associate     |            | x                 |                  |                  |                  |
  | Dissociate    |            |                   | x                |                  |                  |
  | Reject        |            |                   |                  | x                |                  |
  | Claim         |            |                   |                  |                  | x                |
  | Watch         |            | x                 | x                | x                | x                |


 */


//
// xxxEnabled
//

const treasuryAccountId = computed(() => props.analyzer.treasuryAccount.value)
const associationStatus = computed(() => props.analyzer.associationStatus.value)
const balanceForConnectedAccount = computed(() => props.analyzer.balance.value)
const tokenAirdrops = computed(() => props.analyzer.pendingAirdrops.value)
const isFungibleToken = computed(() => props.analyzer.isFungible.value)

const connectedAccountOK = computed(() =>
    walletManager.accountId.value !== null && walletManager.accountId.value !== treasuryAccountId.value)

const associateEnabled = computed(
    () => connectedAccountOK.value
        && associationStatus.value === TokenAssociationStatus.Dissociated
        && !claimEnabled.value)

const dissociateEnabled = computed(
    () => connectedAccountOK.value
        && associationStatus.value === TokenAssociationStatus.Associated
        && balanceForConnectedAccount.value == 0)

const rejectEnabled = computed(
    () => connectedAccountOK.value
        && balanceForConnectedAccount.value !== null
        && balanceForConnectedAccount.value > 0 /* => token associated */
        && isFungibleToken.value !== null
        && isFungibleToken.value)

const claimEnabled = computed(
    () => connectedAccountOK.value
        && tokenAirdrops.value !== null
        && tokenAirdrops.value.length >= 1)

const watchEnabled = computed(
    () => walletManager.isWatchSupported.value
        && isFungibleToken.value !== null
        && isFungibleToken.value
)


//
// showXXXDialog
//

const showAssociateDialog = ref(false)
const showDissociateDialog = ref(false)
const showRejectDialog = ref(false)
const showClaimDialog = ref(false)
const showWatchDialog = ref(false)


const buttonSize = ButtonSize.small

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
