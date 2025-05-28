// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <DashboardCardV2>

    <template #title>
      Settings
    </template>

    <template #content>

      <EditableProperty id="property" full-width :editable="true">
        <template #name>Preference 1</template>
        <template v-slot:value>
          <StringValue :string-value="'Value 1'"/>
        </template>
      </EditableProperty>

      <EditableProperty id="property" full-width :editable="true">
        <template #name>Preference 2</template>
        <template v-slot:value>
          <StringValue :string-value="'Value 2'"/>
        </template>
      </EditableProperty>

    </template>

  </DashboardCardV2>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import DashboardCardV2 from "@/components/DashboardCardV2.vue";
import StringValue from "@/components/values/StringValue.vue";
import EditableProperty from "@/components/EditableProperty.vue";
</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>