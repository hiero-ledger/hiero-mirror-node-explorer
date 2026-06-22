// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div :class="{'wrapper-grid': isSmallScreen, 'wrapper-flex': !isSmallScreen}">

    <!-- left content-->
    <div style="grid-column: span 1;">
      <Property :id="'address-' + props.index" :vertical="isSmallScreen">
        <template v-slot:name>Address</template>
        <template v-slot:value>
          <EVMAddress :address="props.item.address" :compact="true" enable-copy/>
        </template>
      </Property>
    </div>

    <!-- right content -->
    <Property :id="'keys-' + props.index" style="grid-column: span 3;" vertical>
      <template v-slot:name>Storage Keys</template>
      <template v-slot:value>
        <div class="storage-key-list">
          <div
              v-for="(k, i) in props.item.storage_keys"
              :key="i"
              class="storage-key"
          >
            <div class="index-badge">
              <span>{{ '#' + i }}</span>
            </div>
            <HexaDumpValue :byteString="k" :show-none="true" :word-wrap-medium="8" :word-wrap-small="0"/>
          </div>
        </div>
      </template>
    </Property>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {inject, PropType} from "vue";
import {AccessListItem} from "@/schemas/MirrorNodeSchemas";
import HexaDumpValue from "@/components/values/HexaDumpValue.vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import Property from "@/components/Property.vue";

const props = defineProps({
  item: {
    type: Object as PropType<AccessListItem>,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const isSmallScreen = inject('isSmallScreen', true)

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.wrapper-grid {
  position: relative;
  display: grid;
  column-gap: 3rem;
  grid-template-columns: repeat(4, 1fr);
}

.wrapper-flex {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem
}

div.storage-key-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

div.storage-key {
  display: grid;
  grid-template-columns: 35px 1fr;
  gap: 16px;
  align-items: baseline;
}

.index-badge {
  border-width: 0;
  border-radius: 8px;
  background-color: var(--background-secondary);
  font-size: 0.85rem;
  width: 35px;
  text-align: center;
  padding: 3px 0;
  height: fit-content;
}

</style>
