// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TaskDialog :controller="controller" @task-dialog-did-succeed="emit('verifyDidComplete')">

    <!-- title -->
    <template #taskDialogTitle>{{ dialogTitle }}</template>

    <!-- execute label -->
    <template #taskExecuteLabel>VERIFY</template>

    <!-- input -->
    <template #taskDialogInput>
      <div style="color: var(--text-secondary); font-size: 14px;">
        Please upload the Solidity source files and metadata associated with the Hedera contract.
        Once submitted the verification service will compile the source code and match it with
        the contract bytecode deployed on the Hedera network.
      </div>

      <div style="width: 100%">
        <div class="has-text-centered h-is-bold mb-2">
          Contract files
        </div>
        <div class="h-is-low-contrast mb-4 has-text-centered" style="font-size: 14px">
          {{ controller.status.value }}
        </div>
        <div class="dotted-area" @drop="handleDrop" @dragover="handleDragOver">
          <template v-if="items.length >= 1">
            <FileList :audit-items="items" @clear-all-files="controller.handleClearAllFiles()"/>
          </template>
          <template v-else>
            <div class="inline-help">
              <FilePlus :size="24"/>
              <span>Drop .sol and .json files, or folder here... or
                <a @click="showFileChooser">
                  <span style="margin-left: 0.5rem; color: var(--network-text-accent-color); cursor: pointer">Choose files</span>
                </a>
              </span>
              <input
                  type="file"
                  ref="fileChooser"
                  id="file-chooser"
                  accept=".json, .sol"
                  multiple
                  style="display: none"
                  @change="handleFileSelected"
              />
            </div>
          </template>
        </div>
      </div>
    </template>

    <!-- confirm -->
    <template #taskDialogConfirm>
      Once verified, the contract status and source files will be public.
    </template>

    <!-- busy -->
    <template #taskDialogBusy>
      <TaskPanel :mode="TaskPanelMode.busy">
        <template #taskPanelMessage>Verifying {{ controller.matchingContractName.value }} contract…</template>
      </TaskPanel>
    </template>

    <!-- success -->
    <template #taskDialogSuccess>
      <TaskPanel :mode="TaskPanelMode.success">
        <template #taskPanelMessage>{{ controller.mainSuccessMessage.value }}</template>
        <template v-if="controller.extraSuccessMessage.value" #taskPanelExtra1>{{
            controller.extraSuccessMessage.value
          }}
        </template>
      </TaskPanel>
    </template>

    <!-- error -->
    <template #taskDialogError>
      <TaskPanel :mode="TaskPanelMode.error">
        <template #taskPanelMessage>Verification failed</template>
        <template v-if="controller.extraErrorMessage.value !== null" #taskPanelExtra1>
          {{ controller.extraErrorMessage.value }}
        </template>
      </TaskPanel>
    </template>

    <!-- feedback -->
    <template #taskDialogControls>
      <ButtonView :size="ButtonSize.small"
                  :class="{'is-invisible': items.length === 0}"
                  @action="showFileChooser">
        ADD MORE FILES
      </ButtonView>
      <input
          type="file"
          ref="fileChooser"
          id="file-chooser"
          accept=".json, .sol"
          multiple
          style="display: none"
          @change="handleFileSelected"
      />
    </template>


  </TaskDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, ref} from "vue";
import TaskDialog from "@/dialogs/core/task/TaskDialog.vue";
import FileList from "@/dialogs/verification/FileList.vue";
import {ContractVerificationController} from "@/dialogs/verification/ContractVerificationController.ts";
import {ButtonSize, TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";
import ButtonView from "@/elements/ButtonView.vue";
import {FilePlus} from 'lucide-vue-next';

//
// ModalDialog
//

const showDialog = defineModel("showDialog", {
  type: Boolean,
  required: true
})

const props = defineProps({
  contractId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const emit = defineEmits(["verifyDidComplete"])

const contractId = computed(() => props.contractId)
const controller = new ContractVerificationController(showDialog, contractId)

const dialogTitle = computed(() => `Verify contract ${props.contractId}`)

// File Chooser
const fileChooser = ref<HTMLInputElement | null>(null)

const showFileChooser = () => {
  if (fileChooser.value !== null) {
    fileChooser.value.value = ''
    fileChooser.value.click()
  }
}

const handleFileSelected = async () => {
  const selectedFiles = fileChooser.value?.files ?? null
  if (selectedFiles && selectedFiles.length >= 1) {
    await controller.chooseFiles(selectedFiles)
  } else {
    console.log("Selected file is undefined")
  }
}

//
// Drag & drop
//
const handleDragOver = (e: DragEvent) => {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy";
  }
  e.preventDefault()
}

const handleDrop = async (e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy"
    await controller.dropFiles(e.dataTransfer.items)
  }
}

const items = controller.items

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.inline-help {
  align-items: center;
  display: flex;
  color: var(--text-secondary);
  flex-direction: column;
  justify-content: center;
  margin-bottom: 1.5rem;
  margin-top: 1.5rem;
  row-gap: 14px;
  text-align: center;
  line-height: 30px;
}

.is-invisible {
  visibility: hidden
}

.dotted-area {
  border: dashed 1px var(--network-theme-color);
  margin-bottom: 1.0rem;
  padding: 16px;
}

</style>
