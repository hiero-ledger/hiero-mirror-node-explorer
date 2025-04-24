// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TaskDialog :controller="controller" @task-dialog-did-succeed="taskDialogDidSucceed">
    <template #taskDialogTitle>{{ dialogTitle }}</template>
    <template #taskDialogInput>
      <template v-if="walletRequired">To execute this function first connect your wallet</template>
      <template v-else>
        <div class="dialog-grid" style="align-self: stretch">
          <template v-for="b of paramBuilders" :key="b.paramType.name">
            <div style="align-self: center">{{ b.paramType.name }}</div>
            <ParamTypeEditor :param-builder="b" style="width: 100%"/>
            <div/>
            <div style="font-size: 12px; color: var(--text-secondary)" class="mb-2">{{ b.paramType.format() }}</div>
          </template>
          <template v-if="payableValueBuilder">
            <div style="align-self: center">{{ payableValueBuilder.paramType.name }}</div>
            <ParamHbarEditor :param-builder="payableValueBuilder" style="width: 100%"/>
            <div/>
            <div style="font-size: 12px; color: var(--text-secondary)" class="mb-2">HBAR</div>
          </template>
        </div>
      </template>
    </template>
    <template #taskDialogBusy>
      <TaskPanel :mode="TaskPanelMode.busy">
        <template #taskPanelMessage>Running {{ dialogTitle }}</template>
        <template #taskPanelExtra1>
          <div>Check {{ walletName }} for any approval request</div>
        </template>
        <template #taskPanelExtra2>
          <img :src="walletIconURL" height=32 alt="Wallet Logo"/>
        </template>
      </TaskPanel>
    </template>

    <template #taskDialogSuccess>
      <template v-if="hasResult">
        <TaskPanel :mode="TaskPanelMode.success">
          <template #taskPanelMessage>Call did complete and return result:</template>
          <template #taskPanelExtra1>{{ callOutput }}</template>
        </TaskPanel>
      </template>
      <template v-else>
        <TaskPanel :mode="TaskPanelMode.success">
          <template #taskPanelMessage>Call did complete</template>
        </TaskPanel>
      </template>
    </template>

    <template #taskDialogError>
      <TaskPanel :mode="TaskPanelMode.error">
        <template #taskPanelMessage>Call did fail</template>
        <template #taskPanelExtra1>{{ errorMessage }}</template>
      </TaskPanel>
    </template>
  </TaskDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {walletManager} from "@/router.ts";
import TaskDialog from "@/dialogs/core/task/TaskDialog.vue";
import {ContractCallBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";
import {ContractAbiController} from "@/dialogs/abi/ContractAbiController.ts";
import ParamTypeEditor from "@/dialogs/abi/ParamTypeEditor.vue";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";
import ParamHbarEditor from "@/dialogs/abi/ParamHbarEditor.vue";

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  contractCallBuilder: {
    type: Object as PropType<ContractCallBuilder>,
    required: true
  },
})

const emit = defineEmits(
    ["didUpdateContractState"]
)

const controller = new ContractAbiController(showDialog, props.contractCallBuilder)

const dialogTitle = computed(() => props.contractCallBuilder.fragment.name + "()")
const paramBuilders = computed(() => props.contractCallBuilder.paramBuilders)
const payableValueBuilder = computed(() => props.contractCallBuilder?.payableValueBuilder)
const hasResult = computed(() => props.contractCallBuilder.hasResult())
const callOutput = computed(() => props.contractCallBuilder.callOutput)
const errorMessage = controller.errorMessage
const walletName = walletManager.walletName
const walletIconURL = computed(() => walletManager.walletIconURL.value ?? "")
const walletRequired = computed(() => {
  return !props.contractCallBuilder.isReadOnly() && walletManager.accountId.value === null
})

const taskDialogDidSucceed = () => {
  emit("didUpdateContractState")
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.dialog-grid {
  display: grid;
  grid-template-columns: 2fr 5fr;
  grid-column-gap: 1rem;
}

</style>
