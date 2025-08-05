// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <template v-if="tokenId != null">
    <template v-if="useAnchor && tokenRoute">
      <router-link :to="tokenRoute">
        <span class="h-is-extra-text h-should-wrap" style="word-break: break-all">{{ extra }}</span>
      </router-link>
    </template>
    <template v-else>
      <span class="h-is-extra-text h-should-wrap" style="word-break: break-all">{{ extra }}</span>
    </template>
  </template>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {TokenInfo} from "@/schemas/MirrorNodeSchemas";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import {makeTokenSymbol} from "@/schemas/MirrorNodeUtils.ts";

import {routeManager} from "@/utils/RouteManager.ts";

export default defineComponent({
  name: "TokenExtra",

  props: {
    tokenId: String,
    showName: {
      type: Boolean,
      default: false
    },
    useAnchor: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const extra = ref("")

    const updateExtra = () => {
      if (props.tokenId) {
        TokenInfoCache.instance.lookup(props.tokenId).then((r: TokenInfo | null) => {
          if (props.showName) {
            extra.value = r?.name ?? ""
          } else {
            extra.value = makeTokenSymbol(r, 40)
          }
        }, (reason: unknown) => {
          console.warn("TokenInfoCollector did fail to fetch " + props.tokenId + " with reason: " + reason)
        })
      }
    }

    watch(() => props.tokenId, () => {
      updateExtra()
    })

    onMounted(() => {
      updateExtra()
    })

    const tokenRoute = computed(() => props.tokenId ? routeManager.makeRouteToToken(props.tokenId) : null)

    return {extra, tokenRoute}
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

