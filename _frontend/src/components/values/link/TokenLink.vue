// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="is-inline-block">

    <EntityLink :route="!noAnchor ? tokenRoute : null">
      <TokenIOL :token-id="tokenId"/>
    </EntityLink>

    <template v-if="showExtra">
      <span class="ml-2">
        <TokenExtra
            :token-id="tokenId ?? undefined"
            :use-anchor="!noAnchor"
        />
      </span>
    </template>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent} from "vue";
import TokenExtra from "@/components/values/link/TokenExtra.vue";
import TokenIOL from "@/components/values/link/TokenIOL.vue";
import EntityLink from "@/components/values/link/EntityLink.vue";
import {routeManager} from "@/utils/RouteManager.ts";

export default defineComponent({
  name: "TokenLink",
  components: {EntityLink, TokenIOL, TokenExtra},
  props: {
    tokenId: String,
    showExtra: Boolean,
    noAnchor: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const tokenRoute = computed(() => props.tokenId ? routeManager.makeRouteToToken(props.tokenId) : null)
    return {tokenRoute}
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
