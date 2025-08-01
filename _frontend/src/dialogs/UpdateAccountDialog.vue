// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TransactionDialog
      :controller="controller"
      :native-wallet-only="true"
      @transaction-did-execute="emit('updated')">

    <!-- title -->
    <template #transactionDialogTitle>
      <template v-if="props.stakingOnly">Change Staking</template>
      <template v-else>Account Update</template>
    </template>

    <template #transactionExecutionLabel>UPDATE</template>

    <template #transactionDialogInput>

      <template v-if="!props.stakingOnly">

        <!-- Account Memo -->
        <ContentCell>
          <template #cellTitle>Account Memo</template>
          <template #cellContent>
            <TextFieldView v-model="memoInputText"
                           placeholder="Memo (string)"
                           style="width: 100%"
            />
          </template>
        </ContentCell>


        <!-- Auto Renew Period -->
        <ContentCell>

          <template #cellTitle>
            Auto Renew Period
            <InfoTooltip
                label="Account auto-renew is not turned on yet. This value is not taken into account for the time being."
            />
          </template>

          <template #cellContent>
            <div style="display: flex; align-items: center; column-gap: 8px; width: 100%">
              <TextFieldView v-model="selectedAutoRenewPeriod"
                             id="selectedAutoRenewPeriod"
                             placeholder="> 0"
                             type="number"
                             min="1"
                             step="1"
                             style="width: 100%"
              />
              <SelectView v-model="selectedUnit" width="100%">
                <option v-for="p in PeriodUnit" :key="p" :value="p"
                        style="background-color: var(--h-theme-page-background-color)">
                  {{ p }}
                </option>
              </SelectView>
            </div>
          </template>

        </ContentCell>

        <hr style="width: 100%;"/>

        <!-- Max. Auto. Associations -->
        <ContentCell>

          <template #cellTitle>
            Max. Auto. Associations
            <span class="ml-1"/>
            <InfoTooltip
                label="Max.Auto.Associations sets the amount of available airdrop slots. Unlimited(-1), Limited(>0), No airdrop slots(0)."
            />
          </template>

          <template #cellContent>
            <div style="display: flex; align-items: center; column-gap: 8px; width: 100%">
              <SelectView v-model="autoAssociationMode" width="100%">
                <option :key="0" :value="AutoAssociationMode.NoAutoAssociation"
                        style="background-color: var(--h-theme-page-background-color)">
                  No Automatic Association
                </option>
                <option :key="1" :value="AutoAssociationMode.LimitedAutoAssociation"
                        style="background-color: var(--h-theme-page-background-color)">
                  Limited Automatic Association
                </option>
                <option :key="-1" :value="AutoAssociationMode.UnlimitedAutoAssociation"
                        style="background-color: var(--h-theme-page-background-color)">
                  Unlimited Automatic Association
                </option>
              </SelectView>
              <TextFieldView v-if="autoAssociationMode==AutoAssociationMode.LimitedAutoAssociation"
                             style="width: 100px"
                             :style="{'visibility': autoAssociationMode!==AutoAssociationMode.LimitedAutoAssociation ? 'hidden' : 'inherit'}"
                             v-model="maxAutoAssociationInputText"
                             placeholder="> 0"
                             type="number"
                             min="1"
                             step="1"
              />
            </div>
          </template>

        </ContentCell>

        <!-- Receiver Signature Required -->
        <ContentCell direction="horizontal">

          <template #cellTitle>
            <div>
              Receiver Signature Required
            </div>
          </template>

          <template #cellContent>
            <SwitchView v-model="newRecSigRequired"/>
          </template>

        </ContentCell>

      </template>

      <template v-if="enableStaking">

        <hr style="width: 100%;"/>

        <!-- Staking Choice -->
        <ContentCell>

          <template #cellTitle>Staking</template>

          <template #cellContent>
            <div style="display: flex; column-gap: 12px">
              <RabioBoxView name="stakeTarget" :value="StakeChoice.StakeToNode" v-model="stakeChoice">To Node
              </RabioBoxView>
              <RabioBoxView name="stakeTarget" :value="StakeChoice.StakeToAccount" v-model="stakeChoice">To Account
              </RabioBoxView>
              <RabioBoxView name="stakeTarget" :value="StakeChoice.NotStaking" v-model="stakeChoice">Not Staking
              </RabioBoxView>
            </div>
          </template>

        </ContentCell>

        <StackView :visible-index="visibleIndex">

          <div style="display: flex; flex-direction: column; row-gap: 12px">

            <!-- Staked Node ID -->
            <ContentCell>
              <template #cellTitle>Staked Node ID</template>
              <template #cellContent>
                <SelectView v-model="newStakedNodeId" style="width: 100%">
                  <option v-for="n in nodes" :key="n.node_id" :value="n.node_id"
                          style="background-color: var(--h-theme-page-background-color)"
                  >
                    {{ makeNodeSelectorDescription(n) }}
                  </option>
                </SelectView>
              </template>
            </ContentCell>

            <!-- Decline Rewards -->
            <ContentCell direction="horizontal">
              <template #cellTitle>Decline Rewards</template>
              <template #cellContent>
                <SwitchView v-model="newDeclineReward"/>
              </template>
            </ContentCell>

          </div>


          <ContentCell>

            <template #cellTitle>Staked Account ID</template>
            />

            <template #cellContent>
              <div style="display:flex; align-items: center; width: 100%">
                <TextFieldView v-model="stakedAccountIdInputText" placeholder="Account ID (0.0.1234)"
                               style="width: 100%"/>
              </div>
            </template>

          </ContentCell>

          <div/>

        </StackView>


      </template>

    </template>

    <template #transactionDialogControls>{{ feedbackMessage ?? "" }}</template>

  </TransactionDialog>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import TransactionDialog from "@/dialogs/core/transaction/TransactionDialog.vue";
import {
  AutoAssociationMode,
  PeriodUnit,
  StakeChoice,
  UpdateAccountController
} from "@/dialogs/UpdateAccountController.ts";
import {computed} from "vue";
import {makeNodeSelectorDescription} from "@/schemas/MirrorNodeSchemas.ts";
import ContentCell from "@/dialogs/core/ContentCell.vue";
import TextFieldView from "@/elements/TextFieldView.vue";
import InfoTooltip from "@/components/InfoTooltip.vue";
import SelectView from "@/elements/SelectView.vue";
import SwitchView from "@/elements/SwitchView.vue";
import RabioBoxView from "@/elements/RabioBoxView.vue";
import StackView from "@/elements/StackView.vue";
import {NetworkConfig} from "@/config/NetworkConfig.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  stakingOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(["updated"])

const networkConfig = NetworkConfig.inject()
const controller = new UpdateAccountController(showDialog, networkConfig)

const memoInputText = controller.memoInputText
const selectedAutoRenewPeriod = controller.autoRenewPeriodQuantityInputText
const selectedUnit = controller.newAutoRenewPeriodUnit
const autoAssociationMode = controller.autoAssociationMode
const maxAutoAssociationInputText = controller.maxAutoAssociationInputText
const newRecSigRequired = controller.newRecSigRequired
const stakeChoice = controller.stakeChoice
const newStakedNodeId = controller.newStakedNodeId
const newDeclineReward = controller.newDeclineReward
const stakedAccountIdInputText = controller.stakedAccountIdInputText
const feedbackMessage = controller.feedbackMessage

const nodes = controller.nodes

const enableStaking = routeManager.enableStaking


const visibleIndex = computed(() => {
  let result: number
  switch (stakeChoice.value) {
    case StakeChoice.StakeToNode:
      result = 0
      break
    case StakeChoice.StakeToAccount:
      result = 1
      break
    case StakeChoice.NotStaking:
      result = 2
      break
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
