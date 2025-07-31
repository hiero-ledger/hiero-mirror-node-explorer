// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <EVMAddress :address="senderAddress ?? undefined" :compact="false" :show-id="true" :show-none="false"/>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, inject, onBeforeUnmount, onMounted, ref} from "vue";
import EVMAddress from "@/components/values/EVMAddress.vue";
import {ContractResultByTransactionIdCache} from "@/utils/cache/ContractResultByTransactionIdCache";

export default defineComponent({
  name: "InnerSenderEVMAddress",
  components: {EVMAddress},
  props: {
    transactionId: String,
  },

  setup(props) {
    const isSmallScreen = inject('isSmallScreen', ref(false))

    const contractResultLookup = ContractResultByTransactionIdCache.instance.makeLookup(computed(() => props.transactionId ?? null))
    onMounted(() => contractResultLookup.mount())
    onBeforeUnmount(() => contractResultLookup.unmount())

    const senderAddress = computed(() => {
      return contractResultLookup.entity.value?.from ?? null
    })

    return {
      isSmallScreen,
      senderAddress
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>
