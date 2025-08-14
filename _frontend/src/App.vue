// SPDX-License-Identifier: Apache-2.0

<template>

  <router-view/>

  <CookiesDialog v-model:show-dialog="showCookiesDialog"
                 @onChooseReject="handleChooseRejectCookies"
                 @onChooseAccept="handleChooseAcceptCookies">
  </CookiesDialog>

</template>

<script setup lang="ts">

import {computed, onBeforeMount, onBeforeUnmount, onMounted, PropType, provide, ref, watch} from 'vue';
import {
  coreConfigKey,
  errorKey,
  explanationKey,
  initialLoadingKey,
  loadingKey,
  networkConfigKey,
  profileControllerKey,
  suggestionKey,
  themeControllerKey
} from "@/AppKeys"
import {AxiosMonitor} from "@/utils/AxiosMonitor"
import CookiesDialog from "@/dialogs/CookiesDialog.vue";
import {AppStorage} from "@/AppStorage";
import {LARGE_BREAKPOINT, MEDIUM_BREAKPOINT, SMALL_BREAKPOINT, XLARGE_BREAKPOINT} from "@/BreakPoints";
import {CoreConfig} from "@/config/CoreConfig";
import {NetworkConfig} from "@/config/NetworkConfig";
import {ThemeController} from "@/components/ThemeController.ts";
import {walletManager} from "@/utils/RouteManager.ts";
import {ProfileController} from "@/utils/profile/ProfileController.ts";

const props = defineProps({
  "coreConfig": {
    type: Object as PropType<CoreConfig>,
    required: true
  },
  networkConfig: {
    type: Object as PropType<NetworkConfig>,
    required: true
  }
})

const buildRelease = import.meta.env.VITE_BUILD_RELEASE ?? "not available"
provide('buildRelease', buildRelease)

const buildShortCommitHash = import.meta.env.VITE_BUILD_SHORTCOMMITHASH ?? "not available"
provide('buildShortCommitHash', buildShortCommitHash)

const buildTime = import.meta.env.VITE_BUILD_TIME_UTC ?? "not available"
provide('buildTime', buildTime)

const isTouchDevice = ('ontouchstart' in window)
provide('isTouchDevice', isTouchDevice)

const windowWidth = ref(window.screen.width)
provide('windowWidth', windowWidth)

const isSmallScreen = computed(() => {
  return windowWidth.value > SMALL_BREAKPOINT
})
provide('isSmallScreen', isSmallScreen)

const isMediumScreen = computed(() => {
  return windowWidth.value >= MEDIUM_BREAKPOINT
})
provide('isMediumScreen', isMediumScreen)

const isLargeScreen = computed(() => {
  return windowWidth.value >= LARGE_BREAKPOINT
})
provide('isLargeScreen', isLargeScreen)

const isXLargeScreen = computed(() => {
  return windowWidth.value >= XLARGE_BREAKPOINT
})
provide('isXLargeScreen', isXLargeScreen)

const onResizeHandler = () => {
  windowWidth.value = window.innerWidth
}

provide(coreConfigKey, props.coreConfig)
provide(networkConfigKey, props.networkConfig)

const themeController = new ThemeController(props.coreConfig)
provide(themeControllerKey, themeController)
onMounted(() => themeController.mount())

const profileController = new ProfileController(props.coreConfig)
provide(profileControllerKey, profileController)
onMounted(() => profileController.restoreCurrentUser())

const showCookiesDialog = ref(false)

const acceptCookies = ref<boolean | null>(null)
watch(acceptCookies, (accept) => {
  const googleTagID = props.coreConfig.googleTagID
  if (accept && googleTagID && googleTagID.length > 0) {
    insertGoogleTag(props.coreConfig.googleTagID)
  }
})

provide(loadingKey, AxiosMonitor.instance.loading)
provide(initialLoadingKey, AxiosMonitor.instance.initialLoading)
provide(errorKey, AxiosMonitor.instance.error)
provide(explanationKey, AxiosMonitor.instance.explanation)
provide(suggestionKey, AxiosMonitor.instance.suggestion)

onBeforeMount(() => {
  const cookiesDialogContent = props.coreConfig.cookiesDialogContent

  if (cookiesDialogContent && cookiesDialogContent.length > 0) {
    acceptCookies.value = AppStorage.getAcceptCookiePolicy()
    showCookiesDialog.value = (acceptCookies.value == null && props.coreConfig.cookiesDialogContent != null)
  } else {
    acceptCookies.value = null
    showCookiesDialog.value = false
  }
})

onMounted(() => {
  windowWidth.value = window.innerWidth
  window.addEventListener('resize', onResizeHandler);
  walletManager.launch()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResizeHandler);
})

const handleChooseRejectCookies = () => {
  acceptCookies.value = false
  AppStorage.setAcceptCookiePolicy(false)
}

const handleChooseAcceptCookies = () => {
  acceptCookies.value = true
  AppStorage.setAcceptCookiePolicy(true)
}

function insertGoogleTag(tagId: string) {
  const src1 = `https://www.googletagmanager.com/gtag/js?id=${tagId}`
  const s1 = document.createElement('script');
  s1.setAttribute('async', '');
  s1.setAttribute('src', src1);
  document.head.appendChild(s1);

  // https://developers.google.com/analytics/devguides/collection/ga4/views?client_type=gtag#manual_pageviews
  const src2 = `window.dataLayer = window.dataLayer || [];
    function gtag() {dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${tagId}',{ send_page_view: false });`
  const s2 = document.createElement('script');
  s2.innerHTML = src2;
  document.head.appendChild(s2);
}

</script>

<style/>
