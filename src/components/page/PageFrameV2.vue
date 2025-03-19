// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="h-page-frame">
    <PageHeader :page-title="props.pageTitle"/>

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
    type: String,
    required: true,
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

<style />
