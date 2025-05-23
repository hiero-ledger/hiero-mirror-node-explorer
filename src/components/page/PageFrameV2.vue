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

    <div v-if="slots.banner">
      <slot name="banner"/>
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

import Footer from "@/components/page/Footer.vue";
import PageHeader from "@/components/page/header/PageHeader.vue";
import {PropType, useSlots} from "vue";

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

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
