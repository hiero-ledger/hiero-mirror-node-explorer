// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div class="is-inline-block">

    <EntityLink :route="contractRoute">
      <ContractIOL :contract-id="contractId"/>
    </EntityLink>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, PropType} from "vue";
import EntityLink from "@/components/values/link/EntityLink.vue";
import ContractIOL from "@/components/values/link/ContractIOL.vue";
import {routeManager} from "@/utils/RouteManager.ts";

export default defineComponent({
  name: "ContractLink",
  components: {EntityLink, ContractIOL},

  props: {
    contractId: String as PropType<string | null>,
  },

  setup(props) {
    const contractRoute = computed(
        () => props.contractId ? routeManager.makeRouteToContract(props.contractId) : null
    )
    return {contractRoute}
  }
});

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style/>

