// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <TokenAmount
      v-if="property === TokenCellItem.tokenBalance && propertyValue"
      :amount="BigInt(propertyValue)"
      :token-id="tokenId"
  />

  <BlobValue
      v-else
      :blob-value="propertyValue"
  />

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, onBeforeUnmount, onMounted, PropType} from "vue";
import BlobValue from "@/components/values/BlobValue.vue";
import {TokenInfoCache} from "@/utils/cache/TokenInfoCache";
import {makeTokenName, makeTokenSymbol} from "@/schemas/MirrorNodeUtils.ts";
import TokenAmount from "@/components/values/TokenAmount.vue";
import {TokenType} from "@/schemas/MirrorNodeSchemas";
import {TokenAssociationCache} from "@/utils/cache/TokenAssociationCache";

export enum TokenCellItem {
  tokenName = "tokenName",
  tokenSymbol = "tokenSymbol",
  tokenType = "tokenType",
  tokenBalance = "tokenBalance",
  tokenNbSerials = "tokenNbSerials"
}

export default defineComponent({
  name: "TokenCell",
  components: {TokenAmount, BlobValue},

  props: {
    tokenId: {
      type: String as PropType<string | null>,
      default: null
    },
    accountId: {
      type: String as PropType<string | null>,
      default: null
    },
    property: {
      type: String as PropType<TokenCellItem>,
      default: TokenCellItem.tokenName
    },
    balanceOrNbSerials: {
      type: Number as PropType<number | null>,
      default: null
    }
  },

  setup(props) {
    const tokenId = computed(() => props.tokenId)
    const accountId = computed(() => props.accountId)

    const infoLookup = TokenInfoCache.instance.makeLookup(tokenId)
    onMounted(() => infoLookup.mount())
    onBeforeUnmount(() => infoLookup.unmount())

    const associationLookup = TokenAssociationCache.instance.makeTokenAssociationLookup(accountId, tokenId)
    onMounted(() => associationLookup.mount())
    onBeforeUnmount(() => associationLookup.unmount())

    const tokenBalance = computed(() => {
      const associations = associationLookup.entity.value
      return associations ? associations[0].balance : null
    })

    const propertyValue = computed(() => {
      let result: string | null
      switch (props.property) {
        case TokenCellItem.tokenName:
          result = makeTokenName(infoLookup.entity.value)
          break
        case TokenCellItem.tokenSymbol:
          result = makeTokenSymbol(infoLookup.entity.value)
          break
        case TokenCellItem.tokenType:
          result = infoLookup.entity.value?.type === TokenType.FUNGIBLE_COMMON ? 'Fungible' : 'NFT'
          break
        case TokenCellItem.tokenBalance:
          if (infoLookup.entity.value?.type === TokenType.FUNGIBLE_COMMON) {
            if (props.balanceOrNbSerials !== null) {
              result = props.balanceOrNbSerials.toString()
            } else {
              result = tokenBalance.value?.toString() ?? null
            }
          } else {
            result = null
          }
          break
        case TokenCellItem.tokenNbSerials:
          result = infoLookup.entity.value?.type === TokenType.NON_FUNGIBLE_UNIQUE
              ? props.balanceOrNbSerials?.toString() ?? null
              : null
          break
        default:
          result = null
      }
      return result
    })

    return {
      propertyValue,
      TokenCellItem,
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
