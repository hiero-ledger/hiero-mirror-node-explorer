// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <DropdownPanel v-model:deployed="showPanel" :right-aligned="false" compact>
    <template #button>
      <Marker @action="onClick"/>
    </template>
    <template #panel>
      <div class="container">
        <div v-for="n in props.place.nodes">
          <NodeName :node="n"/>
        </div>
        <div class="place-name">{{ props.place.placeName }}</div>
      </div>
    </template>
  </DropdownPanel>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {ref} from "vue";
import DropdownPanel from "@/components/DropdownPanel.vue";
import Marker from "@/components/node/map/Marker.vue";
import NodeName from "@/components/node/map/NodeName.vue";

const props = defineProps({
  place: {
    type: Object,
    required: true
  }
})

const showPanel = ref(false)
const onClick = () => {
  showPanel.value = true
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 6px;
}

div.place-name {
  color: var(--text-secondary);
  font-size: 10px
}
</style>
