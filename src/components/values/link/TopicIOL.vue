// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <EntityIOL :entity-id="topicId" :label="label"/>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType} from "vue";
import EntityIOL from "@/components/values/link/EntityIOL.vue";
import {LabelByIdCache} from "@/utils/cache/LabelByIdCache";

const props = defineProps({
  topicId: {
    type: String as PropType<string | null>,
    default: null
  },
})

const labelLookup = LabelByIdCache.instance.makeLookup(computed(() => props.topicId))
onMounted(() => labelLookup.mount())
onBeforeUnmount(() => labelLookup.unmount())
const label = labelLookup.entity

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
