// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div>
    <span v-if="decimalOverflow" :class="{'mr-2': showExtra && tokenId}">
      ?
    </span>
    <span v-else class="h-is-numeric" :class="{'mr-2': showExtra && tokenId}">
      {{ formattedAmount }}
    </span>

    <template v-if="routeToCollection">
      <router-link :to="routeToCollection ?? ''">
        <TokenExtra
            v-if="showExtra && tokenId != null"
            :token-id="tokenId"
            :use-anchor="false"
        />
      </router-link>
    </template>

    <template v-else>
      <TokenExtra
          v-if="showExtra && tokenId != null"
          :token-id="tokenId"
          :use-anchor="true"
      />
    </template>

    <InfoTooltip
        v-if="decimalOverflow"
        class="ml-2"
        :label="`This token amount cannot be displayed because the number of decimals (${decimalCount}) of the token is too large`"
    />
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, inject, onBeforeUnmount, onMounted, PropType, ref} from "vue";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import TokenExtra from "@/components/values/link/TokenExtra.vue";
import {initialLoadingKey} from "@/AppKeys";
import InfoTooltip from "@/components/InfoTooltip.vue";
import {formatTokenAmount} from "@/schemas/MirrorNodeUtils.ts";

import {routeManager} from "@/utils/RouteManager.ts";

export const MAX_DECIMALS = 20

export default defineComponent({
  name: "TokenAmount",

  components: {InfoTooltip, TokenExtra},
  props: {
    amount: {
      type: BigInt as unknown as PropType<bigint | null>,
      default: null
    },
    tokenId: {
      type: String as PropType<string | null>,
      default: null
    },
    accountId: {
      type: String as PropType<string | null>,
      default: null
    },
    showExtra: {
      type: Boolean,
      default: false
    },
    useAnchor: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    const initialLoading = inject(initialLoadingKey, ref(false))

    const id = computed(() => props.tokenId)
    const lookup = TokenInfoCache.instance.makeLookup(id)
    onMounted(() => lookup.mount())
    onBeforeUnmount(() => lookup.unmount())

    const isNft = computed(() => lookup.entity.value?.type === 'NON_FUNGIBLE_UNIQUE')

    const routeToCollection = computed(() => {
      let result
      if (isNft.value && props.useAnchor && props.accountId && props.tokenId) {
        result = routeManager.makeRouteToCollection(props.accountId, props.tokenId)
      } else {
        result = null
      }
      return result
    })

    const decimalCount = computed(() => {
      let result: number
      if (lookup.entity.value?.decimals) {
        const n = Number(lookup.entity.value.decimals)
        result = isNaN(n) ? 0 : Math.floor(n)
      } else {
        result = 0
      }
      return result
    })

    const decimalOverflow = computed(() => {
      return decimalCount.value ? decimalCount.value > MAX_DECIMALS : false
    })

    const formattedAmount = computed(() => {
      let result: string
      if (lookup.entity.value !== null) {
        if (props.amount !== null) {
          result = formatTokenAmount(props.amount ?? 0, decimalCount.value)
        } else if (initialLoading.value) {
          result = ""
        } else {
          result = "0"
        }
      } else {
        result = ""
      }
      return result
    })

    return {
      isNft,
      routeToCollection,
      formattedAmount,
      decimalOverflow,
      decimalCount,
      initialLoading
    }
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

