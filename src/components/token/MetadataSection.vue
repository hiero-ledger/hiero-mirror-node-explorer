// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2
      id="metadata-section"
      collapsible-key="metadataSection"
      :collapsed="true"
  >
    <template #title>
      Metadata Details
    </template>

    <template #right-control>
      <div v-if="metadataString" id="raw-metadata-checkbox">
        <input type="checkbox" v-model="showRawMetadata" name="raw-metadata-checkbox"/>
        <label for="raw-metadata-checkbox">Raw content</label>
      </div>
    </template>

    <template #content>
      <Property id="raw-metadata-property" full-width>
        <template #name>
          Raw Metadata
        </template>
        <template #value>
          <BlobValue :blob-value="rawMetadata" :show-none="true"/>
        </template>
      </Property>
      <Property v-if="rawMetadata" id="metadata-location" full-width>
        <template #name>Decoded Metadata</template>
        <template #value>
          <BlobValue
              class="is-inline-block"
              :blob-value="metadata"
              :show-none="true"
          />
          <InfoTooltip
              v-if="metadataWarning || metadataInfo"
              :warning-label="metadataWarning"
              :label="metadataInfo"
              class="ml-2"
          />
        </template>
      </Property>

      <template v-if="showRawMetadata">
        <Property id="raw-content" full-width>
          <template #name>
            Content
          </template>
          <template #value>
            <BlobValue
                :blob-value="metadataString"
                :pretty="true"
            />
          </template>
        </Property>
      </template>

      <template v-else>
        <Property v-if="format" id="format" full-width>
          <template #name>
            Format
          </template>
          <template #value>
            <BlobValue :blob-value="format" :show-none="true"/>
          </template>
        </Property>
        <Property v-if="image" id="image" full-width>
          <template #name>
            Image
          </template>
          <template #value>
            <BlobValue :blob-value="image" :show-none="true"/>
          </template>
        </Property>
        <Property v-if="type" id="type" full-width>
          <template #name>
            Type
          </template>
          <template #value>
            <BlobValue :blob-value="type" :show-none="true"/>
          </template>
        </Property>
        <Property v-if="checksum" id="checksum" full-width>
          <template #name>
            Checksum
          </template>
          <template #value>
            <BlobValue :blob-value="checksum" :show-none="true"/>
          </template>
        </Property>
        <Property v-if="creatorDID" id="creator-did" full-width>
          <template #name>
            Creator DID
          </template>
          <template #value>
            <BlobValue :blob-value="creatorDID" :show-none="true"/>
          </template>
        </Property>
        <Property v-if="properties" id="properties" full-width>
          <template #name>
            Properties
          </template>
          <template #value>
            <BlobValue :blob-value="properties" :pretty="true" :show-none="true"/>
          </template>
        </Property>

        <template v-if="attributes.length">
          <template v-for="attr in attributes" :key="attr.trait_type">
            <NftAttribute :attribute="attr"/>
          </template>
        </template>

        <template v-if="files.length">
          <Property full-width>
            <template #name>Files</template>
            <template #value>
              <div id="file-container-area" class="file-container">
                <NftFile
                    v-for="(file) in files" :key="file.uri"
                    class="file-container-item mt-1"
                    :type="file.type"
                    :url="file.url"
                    :size="200"
                />
              </div>
            </template>
          </Property>
        </template>
      </template>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">
import {PropType, ref,} from "vue"
import BlobValue from "@/components/values/BlobValue.vue"
import Property from "@/components/Property.vue"
import {TokenMetadataAnalyzer} from "@/components/token/TokenMetadataAnalyzer";
import NftAttribute from "@/components/token/NftAttribute.vue";
import InfoTooltip from "@/components/InfoTooltip.vue";
import NftFile from "@/components/token/NftFile.vue";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";

const props = defineProps({
  metadataAnalyzer: {
    type: Object as PropType<TokenMetadataAnalyzer>,
    required: true,
  }
})

const showRawMetadata = ref(false)

const metadataInfo = props.metadataAnalyzer.metadataInfo
const metadataWarning = props.metadataAnalyzer.metadataWarning
const metadata = props.metadataAnalyzer.metadata
const rawMetadata = props.metadataAnalyzer.rawMetadata
const metadataString = props.metadataAnalyzer.metadataString
const attributes = props.metadataAnalyzer.attributes
const creatorDID = props.metadataAnalyzer.creatorDID
const checksum = props.metadataAnalyzer.checksum
const image = props.metadataAnalyzer.image
const type = props.metadataAnalyzer.type
const format = props.metadataAnalyzer.format
const properties = props.metadataAnalyzer.properties
const files = props.metadataAnalyzer.files

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div#raw-metadata-checkbox {
  align-items: center;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.file-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 520px;
  overflow-x: auto;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  /*
  &::-webkit-scrollbar {
    display: none;
  }
  */

  .file-container-item {
    flex: 0 0 auto;
    border: 0.5px solid grey;
    padding: 0.5px;
    background-color: var(--h-theme-page-background-color);
  }

  .file-container-item:hover {
    border: 1px solid grey;
    padding: 0;
  }

  .file-container-item:active {
    border: 1px solid white;
    padding: 0;
  }

  .file-container-item.selectedItem {
    border: 1px solid var(--h-theme-highlight-color);
    padding: 0;
  }
}

</style>
