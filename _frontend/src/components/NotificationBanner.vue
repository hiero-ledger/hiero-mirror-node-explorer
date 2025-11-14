// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div
      id="notificationBanner"
      class="notification-banner"
      :class="{'notification-error': props.isError, 'notification-success': !props.isError}"
  >
    <div class="notification-text">
      {{ props.message }}
    </div>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  isError: {
    type: Boolean,
    default: true
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>

div.notification-banner {
  border-radius: 16px;
  padding: 16px;
}

.notification-error {
  background-color: var(--status-error-color);
}

.notification-success {
  background-color: var(--text-accent2);
}

.notification-text {
  color: white;
  font-family: var(--font-family-heading), sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
}

</style>