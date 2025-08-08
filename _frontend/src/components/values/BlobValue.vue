// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div
      class="h-should-wrap"
      :class="{'formatted-text': props.pretty}"
  >

    <template v-if="decodedValue">

      <template v-if="decodedURL">
        <span v-if="noAnchor">{{ decodedValue }}</span>
        <a v-else :href="decodedURL">{{ decodedValue }}</a>
      </template>

      <template v-else-if="jsonValue && isNaN(jsonValue)">
        <div class="h-code-box">
          {{ jsonValue }}
        </div>
      </template>

      <template v-else-if="hcs1TopicRoute">
        <EntityLink :route="noAnchor ? null : hcs1TopicRoute">
          {{ decodedValue }}
        </EntityLink>
      </template>

      <template v-else>
        <div id="blob-main" :class="{'scrollable': decodedValue.length > 1024 && !expand}">
          {{ (b64EncodingFound && showBase64AsExtra) ? blobValue : decodedValue }}
        </div>
        <div v-if="b64EncodingFound && showBase64AsExtra" class="h-is-extra-text">
          <span class="h-is-low-contrast">Base64:</span>
          <span id="blob-extra">{{ decodedValue }}</span>
        </div>
      </template>

    </template>

    <span v-else-if="showNone && !initialLoading" class="h-is-low-contrast">None</span>

    <span v-else/>

  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject, PropType, ref} from "vue";
import {initialLoadingKey} from "@/AppKeys";
import {CoreConfig} from "@/config/CoreConfig";
import {blob2URL} from "@/utils/URLUtils.ts";
import {HCSURI} from "@/utils/HCSURI.ts";
import EntityLink from "@/components/values/link/EntityLink.vue";
import {base64Decode, utf8Encode} from "@/utils/B64Utils.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  blobValue: {
    type: String as PropType<string | null>,
    default: null
  },
  showNone: {
    type: Boolean,
    default: false
  },
  base64: {
    type: Boolean,
    default: false
  },
  showBase64AsExtra: {
    type: Boolean,
    default: false
  },
  pretty: {
    type: Boolean,
    default: false
  },
  noAnchor: {
    type: Boolean,
    default: false
  },
  expand: {
    type: Boolean,
    default: false
  }
})

const initialLoading = inject(initialLoadingKey, ref(false))

const coreConfig = CoreConfig.inject()
const ipfsGateway = coreConfig.ipfsGatewayURL
const arweaveServer = coreConfig.arweaveServerURL

const decodedURL = computed(() => blob2URL(decodedValue.value, ipfsGateway, arweaveServer))

const jsonValue = computed(() => {
  let result
  if (decodedValue.value && decodedValue.value != '{}' && props.pretty) {
    try {
      result = JSON.parse(decodedValue.value)
    } catch {
      result = null
    }
  } else {
    result = null
  }
  return result
})

const hcs1TopicRoute = computed(() => {
  let result
  const hcs1Uri = HCSURI.parse(decodedValue.value)
  if (hcs1Uri) {
    result = routeManager.makeRouteToTopic(hcs1Uri.topicId)
  } else {
    result = null
  }
  return result
})

const b64EncodingFound = computed(() => b64DecodedValue.value !== null)

const b64DecodedValue = computed(() => {
  let result: string | null
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  if (props.blobValue && props.base64 && base64regex.test(props.blobValue)) {
    try {
      result = utf8Encode(base64Decode(props.blobValue))
    } catch {
      result = null
    }
  } else {
    result = null
  }
  return result
})

const decodedValue = computed(() => {

  let result: string

  if (props.blobValue) {
    if (props.base64) {
      result = b64DecodedValue.value ?? props.blobValue
    } else {
      result = props.blobValue
    }
  } else {
    result = ""
  }
  return result
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.formatted-text {
  white-space: pre-wrap;
  text-align: left;
}

div.scrollable {
  max-height: 200px;
  overflow: auto;
}

</style>
