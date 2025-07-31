// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {onMounted} from 'vue';
import {PathParam} from "@/utils/PathParam";
import {RouteLocationRaw} from "vue-router";
import {ContractByAddressCache} from "@/utils/cache/ContractByAddressCache";
import {AccountByAddressCache} from "@/utils/cache/AccountByAddressCache";
import router, {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  accountAddress: String,
  network: String
})

const getContractId = async (evmAddress: string): Promise<string | null> => {
  const contract = await ContractByAddressCache.instance.lookup(evmAddress)
  return Promise.resolve(contract?.contract_id ?? null)
}

const getAccountId = async (evmAddress: string): Promise<string | null> => {
  const account = await AccountByAddressCache.instance.lookup(evmAddress)
  return Promise.resolve(account?.account ?? null)
}

const selectRoute = async () => {
  let result: RouteLocationRaw

  const evmAddress = PathParam.parseEvmAddress(props.accountAddress)
  if (evmAddress !== null) {

    const contractId = await getContractId(evmAddress)
    if (contractId !== null) {
      result = routeManager.makeRouteToContract(contractId)
    } else {
      const accountId = await getAccountId(evmAddress)
      if (accountId !== null) {
        result = routeManager.makeRouteToAccount(accountId)
      } else {
        result = routeManager.makeRouteToAccount(evmAddress)
      }
    }

  } else {
    result = routeManager.makeRouteToPageNotFound()
  }

  return Promise.resolve(result)
}

onMounted(() => {
  selectRoute().then((route: RouteLocationRaw) => router.replace(route))
})

</script>

<style/>
