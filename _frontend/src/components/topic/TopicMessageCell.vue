// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <BlobValue
      :blob-value="propertyValue"
      :base64="isMessage"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, onBeforeUnmount, onMounted, PropType} from "vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {TopicMessageByTimestampCache} from "@/utils/cache/TopicMessageByTimestampCache.ts";

export enum TopicMessageCellItem {
  sequenceNumber = "sequenceNumber",
  message = "message"
}

const DEFAULT_TRUNCATION = 150

export default defineComponent({
  name: "TopicMessageCell",
  components: {BlobValue},

  props: {
    timestamp: {
      type: String as PropType<string | null>,
      default: null
    },
    property: {
      type: String as PropType<TopicMessageCellItem>,
      default: TopicMessageCellItem.message
    },
    truncation: {
      type: Number,
      default: DEFAULT_TRUNCATION
    }
  },

  setup(props) {
    const timestamp = computed(() => props.timestamp)

    const messageLookup = TopicMessageByTimestampCache.instance.makeLookup(timestamp)
    onMounted(() => messageLookup.mount())
    onBeforeUnmount(() => messageLookup.unmount())

    const isMessage = computed(() =>
        props.property === TopicMessageCellItem.message && propertyValue.value !== null
    )

    const propertyValue = computed(() => {
      let result: string | null
      switch (props.property) {
        case TopicMessageCellItem.message:
          result = truncate(messageLookup.entity.value?.message ?? '', props.truncation)
          break
        case TopicMessageCellItem.sequenceNumber:
          result = messageLookup.entity.value?.sequence_number.toString() ?? ''
          break
        default:
          result = null
      }
      return result
    })

    const truncate = (value: string, length: number): string => {
      return value.length > length ? value.slice(0, length) + '…' : value
    }

    return {
      propertyValue,
      isMessage,
      TopicMessageCellItem,
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
