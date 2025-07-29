// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="is-inline-block">

    <EntityLink :route="accountRoute">
      <AccountIOL :account-id="accountId" :null-label="nullLabel"/>
    </EntityLink>

    <template v-if="showExtra && extra.length > 0">
      <span class="ml-2 h-is-extra-text h-is-numeric">
        {{ extra }}
      </span>
    </template>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, onBeforeUnmount, onMounted, PropType, ref, watch} from "vue";
import {NetworkCache} from "@/utils/cache/NetworkCache";
import {ContractByIdCache} from "@/utils/cache/ContractByIdCache";
import {RouteLocationRaw} from "vue-router";
import EntityLink from "@/components/values/link/EntityLink.vue";
import AccountIOL from "@/components/values/link/AccountIOL.vue";
import {makeOperatorDescription} from "@/schemas/MirrorNodeUtils.ts";
import {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  accountId: {
    type: String as PropType<string | null>,
    default: null
  },
  showExtra: {
    type: Boolean,
    default: false
  },
  noAnchor: {
    type: Boolean,
    default: false
  },
  nullLabel: {
    type: String,
    default: null
  },
})

const networkLookup = NetworkCache.instance.makeLookup()
onMounted(() => networkLookup.mount())
onBeforeUnmount(() => networkLookup.unmount())

const accountRoute = ref<RouteLocationRaw | null>(null)

const selectRoute = async (accountId: string) => {
  let result: RouteLocationRaw | null
  try {
    if (await ContractByIdCache.instance.lookup(accountId) !== null) {
      result = routeManager.makeRouteToContract(accountId)
    } else {
      result = routeManager.makeRouteToAccount(accountId)
    }
  } catch {
    result = null
  }
  return Promise.resolve(result)
}

onMounted(() => {
  if (props.accountId && !props.noAnchor) {
    selectRoute(props.accountId).then((route) => accountRoute.value = route)
  } else {
    accountRoute.value = null
  }
})
watch(() => props.accountId, (newValue) => {
  if (newValue) {
    selectRoute(newValue).then((route) => accountRoute.value = route)
  } else {
    accountRoute.value = null
  }
})
const nodes = computed(() => networkLookup.entity.value ?? [])

const extra = computed(() => {
  const result = props.accountId ? makeOperatorDescription(props.accountId, nodes.value) : null
  return result ?? ""
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

