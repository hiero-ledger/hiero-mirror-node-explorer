// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->


<!--

              \   loading  |         true         |        false         |
        error              |                      |                      |
        -------------------+----------------------+----------------------+
        false              |  if timeoutElapsed   |        empty         |
                           |        loader        |                      |
        -------------------+  else                +----------------------+
        true               |        empty         |     error button     |
                           |                      |                      |
        -------------------+----------------------+----------------------+

 -->

<template>
  <template v-if="late">
    <span class="loader is-inline-block"/>
  </template>
  <template v-else-if="error">
    <TriangleAlert
        :size="18"
        class="h-text-error"
        style="cursor: pointer;"
        @click="showErrorDialog = true"
    />
  </template>
  <ModalDialog v-model:show-dialog="showErrorDialog" iconClass="fa fa-2x fa-exclamation-triangle has-text-danger">
    <template #modalDialogContent>
      <TaskPanel :mode="TaskPanelMode.error">
        <template #taskPanelMessage>{{ explanation }}</template>
        <template v-if="explanation" #taskPanelExtra1>
          Some of the data required by this page could not be downloaded.
          Displayed information may not be accurate.
        </template>
        <template v-if="suggestion" #taskPanelExtra2>{{ suggestion }}</template>
      </TaskPanel>
    </template>
  </ModalDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, onBeforeUnmount, onMounted, ref, watch} from "vue"
import {errorKey, explanationKey, loadingKey, suggestionKey} from "@/AppKeys"
import ModalDialog from "@/dialogs/core/ModalDialog.vue";
import {TriangleAlert} from "lucide-vue-next";
import TaskPanel from "@/dialogs/core/task/TaskPanel.vue";
import {TaskPanelMode} from "@/dialogs/core/DialogUtils.ts";

const loading = inject(loadingKey, ref(false))
const error = inject(errorKey, ref(false))
const explanation = inject(explanationKey, ref(""))
const suggestion = inject(suggestionKey, ref(""))

watch(loading, (newValue, oldValue) => {
  if (oldValue && !newValue) {
    stopTimeout()
  } else if (!oldValue && newValue) {
    startTimeout()
  }
})
watch(error, (newValue, oldValue) => {
  if (oldValue && !newValue) {
    // Error flag off => hides error dialog if needed
    showErrorDialog.value = false
  }
})

//
// Late
//
const late = computed(() => {
  return loading.value && timeoutElapsed.value
})

//
// timeoutElapsed
//
const timeoutElapsed = ref(false)
let timeoutID = -1
const startTimeout = () => {
  if (timeoutID == -1) {
    timeoutElapsed.value = false
    timeoutID = window.setTimeout(() => {
      timeoutElapsed.value = true
      timeoutID = -1
    }, 1000)
  }
}
const stopTimeout = () => {
  if (timeoutID != -1) {
    window.clearTimeout(timeoutID)
    timeoutID = -1
  }
}

//
// showErrorDialog
//
const showErrorDialog = ref(false)

//
// Mount
//
onMounted(() => {
  startTimeout()
})
onBeforeUnmount(() => {
  stopTimeout()
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.loader {
  border-left-color: grey;
  border-bottom-color: grey
}

</style>
