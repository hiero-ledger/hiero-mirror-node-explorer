// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="footer-root">

    <div class="footer-left">
      <a v-if="builtOnURL" :href="builtOnURL">
        <img id="built-on-logo" alt="Built On Logo" :src="builtOnLogoURL" class="footer-logo">
      </a>
      <img v-else id="built-on-logo" alt="Built On Logo" :src="builtOnLogoURL" class="footer-logo">

      <div class="footer-text">
        <div v-if="isSmallScreen" class="footer-text-item">
          {{ productDescription }}
        </div>

        <template v-if="termsOfUseURL">
          <div v-if="isSmallScreen" class="line"></div>

          <a data-cy="termsOfUse" :href="termsOfUseURL" style="line-height: 1rem">
            <div class="footer-text-item">
              See Terms of Service
            </div>
          </a>
        </template>

        <template v-if="isMediumScreen">
          <div class="line"></div>
          <div class="footer-text-item">
            <span>Release </span>
            <a :href="buildReleaseUrl">{{ buildRelease }}</a>
            <span> built {{ buildTime }}</span>
          </div>
        </template>
      </div>
    </div>

    <template v-if="isSmallScreen">
      <a v-if="sponsorURL" :href="sponsorURL" class="footer-logo">
        <img id="sponsor-logo" alt="Sponsor Logo" :src="sponsorLogoURL">
      </a>
      <img v-else class="footer-logo" id="sponsor-logo" alt="Sponsor Logo" :src="sponsorLogoURL">
    </template>
  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, inject} from "vue";
import {CoreConfig} from "@/config/CoreConfig";
import {ThemeController} from "@/components/ThemeController.ts";

const isSmallScreen = inject('isSmallScreen', true)
const isMediumScreen = inject('isMediumScreen', true)

let buildRelease = inject('buildRelease', "not available")
let buildReleaseUrl = "https://github.com/hashgraph/hedera-mirror-node-explorer"
const buildShortCommitHash = inject('buildShortCommitHash', "not available")
const disposableReleaseDetails = "-0-g" + buildShortCommitHash;
if (buildRelease.includes(disposableReleaseDetails)) {
  // Commit matches a specific release (i.e., v23.5.0), show only release version
  buildRelease = buildRelease.replace(disposableReleaseDetails, "")
  // Link release page
  buildReleaseUrl += "/releases/tag/" + buildRelease
} else {
  // Show git version (<tag>-<commit distance>-<short commit hash> (i.e., v23.5.0-1-g706e821)
  // Link to specific commit
  buildReleaseUrl += "/tree/" + buildShortCommitHash
}
const buildTime = inject('buildTime', "not available")

const coreConfig = CoreConfig.inject()
const productDescription = coreConfig.productDescription

const darkSelected = ThemeController.inject().darkSelected
const builtOnLogoURL = computed(() =>
    darkSelected.value ? coreConfig.builtOnLogoDarkURL : coreConfig.builtOnLogoLightURL
)
const sponsorLogoURL = computed(() =>
    darkSelected.value ? coreConfig.sponsorLogoDarkURL : coreConfig.sponsorLogoLightURL
)

const builtOnURL = coreConfig.builtOnURL
const sponsorURL = coreConfig.sponsorURL
const termsOfUseURL = coreConfig.termsOfUseURL

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

div.footer-root {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 32px 32px 32px
}

div.footer-left {
  align-items: center;
  display: flex;
  gap: 40px;
  justify-content: flex-start;
}

div.footer-text {
  align-items: baseline;
  display: flex;
  gap: 12px;
  height: 16px;
  justify-content: flex-start;
}

div.footer-text-item {
  font-size: 10px;
  color: var(--text-primary);
}

.footer-logo {
  max-width: 120px;
}

div.line {
  align-self: center;
  border: 1px solid var(--text-secondary);
  rotate: -90deg;
  width: 16px;
}

</style>
