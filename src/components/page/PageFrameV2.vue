// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="h-page-frame">
    <PageHeader
        :page-title="props.pageTitle"
    >
      <template v-if="slots['page-title']" #page-title>
        <slot name="page-title"/>
      </template>
    </PageHeader>

    <div v-if="slots.banner" class="h-page-banner">
      <slot name="banner"/>
    </div>

    <div v-if="slots['left-toolbar'] || slots['right-toolbar']" class="h-page-toolbar">
      <slot name="left-toolbar"/>
      <slot name="right-toolbar"/>
    </div>

    <div class="h-page-content">
      <slot/>
    </div>

    <Footer/>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType, useSlots, watch} from "vue";
import Footer from "@/components/page/Footer.vue";
import PageHeader from "@/components/page/header/PageHeader.vue";
import {CoreConfig} from "@/config/CoreConfig.ts";

const props = defineProps({
  pageTitle: {
    type: String as PropType<string | null>,
    default: null,
  },
  notification: {
    type: String as PropType<string | null>,
    default: null,
  }
})

const slots = useSlots()
const coreConfig = CoreConfig.inject()

const documentTitle = computed(() => {
  let result: string | null
  if (props.pageTitle) {
    const envTitlePrefix = coreConfig.documentTitlePrefix
    const titlePrefix = envTitlePrefix !== "" ? envTitlePrefix + " " : ""
    result = titlePrefix + props.pageTitle
  } else {
    result = null
  }
  return result
})

watch(documentTitle, (newValue: string|null) => {
  document.title = newValue ?? ""
}, {immediate: true})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.h-page-banner {
  margin: 16px 16px;
}

@media (min-width: 1080px) {
  .h-page-banner {
    margin: 16px 32px;
  }
}

</style>
