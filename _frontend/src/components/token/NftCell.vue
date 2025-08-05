// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <NftPreview
      v-if="props.property === NftCellItem.image"
      :url="url"
      :type="type"
      :size="props.size"
      :auto="false"
      :no-anchor="true"
  />

  <BlobValue
      v-else
      :blob-value="propertyValue"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

export enum NftCellItem {
  name = "name",
  creator = "creator",
  description = "description",
  image = "image",
}

</script>

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import {NftBySerialCache} from "@/utils/cache/NftBySerialCache";
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer";
import BlobValue from "@/components/values/BlobValue.vue";
import NftPreview from "@/components/token/NftPreview.vue";
import {CoreConfig} from "@/config/CoreConfig";

const props = defineProps({
  tokenId: {
    type: String as PropType<string | null>,
    default: null
  },
  serialNumber: {
    type: Number as PropType<number | null>,
    default: null
  },
  property: {
    type: String as PropType<NftCellItem>,
    default: NftCellItem.name
  },
  size: {
    type: Number,
    default: 40
  },
})

const id = computed(() => props.tokenId)
const serial = computed(() => props.serialNumber?.toString() ?? null)

const nftLookup = NftBySerialCache.instance.makeNftLookup(id, serial)
onMounted(() => nftLookup.mount())
onBeforeUnmount(() => nftLookup.unmount())

const coreConfig = CoreConfig.inject()
const ipfsGatewayPrefix = coreConfig.ipfsGatewayURL
const arweaveServerURL = coreConfig.arweaveServerURL

const metadata = computed(() => nftLookup.entity.value?.metadata ?? '')
const metadataAnalyzer = new TokenMetadataAnalyzer(metadata, ipfsGatewayPrefix, arweaveServerURL)
onMounted(() => metadataAnalyzer.mount())
onBeforeUnmount(() => metadataAnalyzer.unmount())

const propertyValue = computed(() => {
  let result: string | null
  switch (props.property) {
    case NftCellItem.name:
    case NftCellItem.creator:
      result = truncate(metadataAnalyzer[props.property].value ?? '', 20)
      break
    case NftCellItem.description:
      result = truncate(metadataAnalyzer.description.value ?? '', 50)
      break
    default:
      result = null
  }
  return result
})

const truncate = (value: string, length: number): string => {
  return value.length > length ? value.slice(0, length) + '…' : value
}

const url = metadataAnalyzer.imageUrl
const type = metadataAnalyzer.type

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
