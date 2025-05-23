// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2 v-if="props.topicMemo" collapsible-key="hcs1Content">

    <template #title>
      HCS-1 Content
    </template>

    <template #content>
      <Property id="hash" full-width>
        <template #name>Hash</template>
        <template #value>
          <div style="display: flex; gap:8px">
            <HexaValue :byte-string="props.topicMemo?.hash"/>
            <Check
                v-if="hashMatch"
                :size="18"
                class="h-text-success"
                id="check-mark"
            />
            <InfoTooltip
                v-else-if="isCompressionAlgoSupported"
                :label="isAssetIncomplete ? INCOMPLETE_ASSET_TOOLTIP : HASH_MISMATCH_TOOLTIP"
            />
          </div>
        </template>
      </Property>
      <Property id="compression" full-width>
        <template #name>Compression</template>
        <template #value>
          <div style="display: flex; gap:8px">
            <StringValue :string-value="props.topicMemo?.algo"/>
            <InfoTooltip
                v-if="!isCompressionAlgoSupported"
                :label="UNSUPPORTED_COMPRESSION_TOOLTIP"
            />
          </div>
        </template>
      </Property>
      <Property id="encoding" full-width>
        <template #name>Encoding</template>
        <template #value>
          {{ props.topicMemo?.encoding }}
        </template>
      </Property>
      <Property v-if="hcs1DataType" id="mime-type" full-width>
        <template #name>MIME Type</template>
        <template #value>
          {{ hcs1DataType }}
        </template>
      </Property>
      <Property v-if="hashMatch && (hcs1DataURL || jsonContent)" id="preview" full-width>
        <template #name>Preview</template>
        <template #value>
          <MediaContent
              v-if="hcs1DataURL"
              :url="hcs1DataURL"
              :type="hcs1DataType"
              :size="200"
              :auto="false"
          />
          <BlobValue
              v-else-if="jsonContent"
              :blob-value="jsonContent"
              :show-none="true"
              :base64="true"
              :pretty="true"
          />
        </template>
      </Property>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from 'vue';
import Property from "@/components/Property.vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {HCSTopicMemo} from "@/utils/HCSTopicMemo.ts";
import MediaContent from "@/components/MediaContent.vue";
import {HCSAsset} from "@/utils/cache/HCSAsset.ts";
import InfoTooltip from "@/components/InfoTooltip.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import {utf8Encode} from "@/utils/B64Utils.ts";
import HexaValue from "@/components/values/HexaValue.vue";
import {Check} from "lucide-vue-next";
import StringValue from "@/components/values/StringValue.vue";

const props = defineProps({
  topicMemo: {
    type: Object as PropType<HCSTopicMemo | null>,
    default: null
  },
  hcs1Asset: {
    type: Object as PropType<HCSAsset | null>,
    default: null
  }
})

const INCOMPLETE_ASSET_TOOLTIP =
    'This topic contains too many messages for the HCS-1 content to be fully retrieved. ' +
    'The hash cannot be checked and the preview of the content is not available.'

const HASH_MISMATCH_TOOLTIP =
    'The HCS-1 content was fully retrieved but its hash does not match the hash from the topic memo. ' +
    'The preview of the content is hence not available.'

const UNSUPPORTED_COMPRESSION_TOOLTIP =
    'This compression algorithm is not supported.'

const isAssetIncomplete = computed(() =>
    props.hcs1Asset === null
    || props.hcs1Asset.content === null
)

const isCompressionAlgoSupported = computed(() =>
    props.topicMemo !== null
    && HCSAsset.isCompressionAlgoSupported(props.topicMemo.algo)
)

const hashMatch = computed(() =>
    props.topicMemo !== null
    && props.hcs1Asset !== null
    && props.topicMemo.hash === props.hcs1Asset.hash
)

const hcs1DataType = computed(() =>
    props.hcs1Asset ? props.hcs1Asset.type : null
)

const jsonContent = computed(() => {
  let result: string | null
  if (
      props.hcs1Asset?.content
      && hcs1DataType.value !== null
      && (hcs1DataType.value.startsWith('application/json'))
  ) {
    result = utf8Encode(new Uint8Array(props.hcs1Asset.content))
  } else {
    result = null
  }
  return result
})

const hcs1DataURL = computed(() => {
  let result: string | null
  if (
      props.hcs1Asset
      && hcs1DataType.value !== null
      && (
          hcs1DataType.value.startsWith('image')
          || hcs1DataType.value.startsWith('video')
          || hcs1DataType.value.startsWith('audio')
      )
  ) {
    result = props.hcs1Asset.getDataURL()
  } else {
    result = null
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>
</style>
