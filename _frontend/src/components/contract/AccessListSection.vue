// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>
    <template #title>
      <span>Access List</span>
    </template>
    <template #content>
      <div class="access-list">
        <template v-for="(item, index) in props.accessList" :key="item.address">
          <AccessListItemView :item="item" :index="index"/>
          <hr class="table-separator"/>
        </template>
      </div>
    </template>
  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts" setup>

import {PropType} from "vue";
import {AccessListItem} from "@/schemas/MirrorNodeSchemas.ts";
import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import AccessListItemView from "@/components/contract/AccessListItemView.vue";

const props = defineProps({
  accessList: {
    type: Array as PropType<Array<AccessListItem>>,
    required: true,
  },
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

hr.table-separator {
  border-color: var(--border-secondary);
  border-width: 0.5px;
  margin: 0;
}

div.access-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

</style>
