// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div id="recaptchaElement"></div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onMounted} from "vue";
import {fetchReCaptchaToken} from "@/components/recaptcha/RecaptchaUtils.ts";

const props = defineProps({
  siteKey: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  }
})

const emit = defineEmits(["onCaptchaChange"])

onMounted( async () => {
  const token = await fetchReCaptchaToken(props.siteKey, "recaptchaElement", props.action)
  emit("onCaptchaChange", token)
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

</style>
