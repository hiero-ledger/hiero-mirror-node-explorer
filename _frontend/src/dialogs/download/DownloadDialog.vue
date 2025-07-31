// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <TaskDialog :controller="controller" @task-dialog-did-succeed="handleSuccess" :width="props.width">

    <template #taskDialogTitle>
      <slot name="downloadDialogTitle"/>
    </template>

    <template #taskExecuteLabel>DOWNLOAD</template>

    <template #taskDialogInput>
      <slot name="downloadDialogInput"/>
    </template>

    <template #taskDialogBusy>
      <progress id="progress" :value="props.controller.getDownloader().progress.value"/>
      <span>Downloading:</span>
      <span class="h-is-low-contrast h-is-numeric ml-2">{{ busyMessage }}</span>
    </template>

    <template #taskDialogSuccess>
      <div style="display: flex">
        <span>Download completed:</span>
        <div style="margin-left: 0.5rem; color: var(--text-secondary)">
          <div>{{ successMessage }}</div>
          <div v-if="successMessage2">{{ successMessage2 }}</div>
          <div v-if="successMessage3">{{ successMessage3 }}</div>
        </div>
      </div>
    </template>

    <template #taskDialogError>
      <span>Download failed:</span>
      <span>{{ errorMessage }}</span>
    </template>

    <template #taskDialogControls>
      <slot name="downloadDialogControls"/>
    </template>

  </TaskDialog>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import TaskDialog from "@/dialogs/core/task/TaskDialog.vue";
import {DownloadController} from "@/dialogs/download/DownloadController.ts";
import {CoreConfig} from "@/config/CoreConfig.ts";

const props = defineProps({
  controller: {
    type: Object as PropType<DownloadController<unknown, unknown>>,
    required: true
  },
  width: {
    type: Number,
  }
})

const busyMessage = computed(() => {
  const items = props.controller.getDownloader().downloadedCount.value
  return items + " " + (items > 1 ? "items" : "item")
})

const successMessage = computed(() => {
  let result: string
  const entityCount = props.controller.getDownloader().entities.value.length
  if (entityCount === 0) {
    result = "No item matches this range"
  } else {
    result = entityCount + " " + (entityCount > 1 ? "items" : "item")
  }
  return result
})

const successMessage2 = computed(() => {
  return props.controller.getDownloader().drained.value ? null : "The maximum of " + props.controller.getDownloader().maxEntityCount + " downloads was hit"
})

const successMessage3 = computed(() => {
  let result: string | null
  const drained = props.controller.getDownloader().drained.value
  const lastDownloadedEntityDate = props.controller.getDownloader().lastDownloadedEntityDate.value
  if (!drained && lastDownloadedEntityDate !== null) {
    const locale = "en-US"
    const dateOptions: Intl.DateTimeFormatOptions = {
      second: "2-digit",
      minute: "2-digit",
      hour: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
    const format = new Intl.DateTimeFormat(locale, dateOptions)
    const lastDate = format.format(lastDownloadedEntityDate)
    result = "Operation stopped at " + lastDate
  } else {
    result = null
  }
  return result
})

const errorMessage = computed(() => {
  return props.controller.getDownloader().failureReason.value
})

const cryptoName = CoreConfig.inject().cryptoName

const handleSuccess = () => {
  const blob = props.controller.getDownloader().csvBlob.value
  if (blob !== null) {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', props.controller.getDownloader().getOutputName(cryptoName));
    a.click()
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
