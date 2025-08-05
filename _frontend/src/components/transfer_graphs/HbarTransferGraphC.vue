// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>

  <div v-if="hbarTransferLayout.rowCount >= 1" class="graph-container">

    <template v-for="i in hbarTransferLayout.rowCount" v-bind:key="i">

      <!-- #0 : account id -->
      <div>
        <AccountLink v-if="i <= hbarTransferLayout.sources.length"
                     v-bind:account-id="hbarTransferLayout.sources[i-1].transfer.account"
                     v-bind:no-anchor="true"
                     null-label="MINT"
                     data-cy="sourceAccount"/>
      </div>

      <!-- #1 : arrow -->
      <div style="position: relative">
        <ArrowSegment
            v-bind:source-count="hbarTransferLayout.sources.length"
            v-bind:compact="true"
            v-bind:row-index="i-1"/>
      </div>

      <!-- #2 : hbar amount -->
      <div class="justify-end">
        <HbarAmount v-if="i === 1"
                    v-bind:amount="hbarTransferLayout.destinationAmount"/>
      </div>

      <!-- #3 : arrow -->
      <div style="position: relative">
        <ArrowSegment
            v-bind:dest-count="hbarTransferLayout.destinations.length"
            v-bind:compact="true"
            v-bind:row-index="i-1"/>
      </div>

      <!-- #4 : account id -->
      <div>
        <AccountLink v-if="i <= hbarTransferLayout.destinations.length"
                     v-bind:account-id="hbarTransferLayout.destinations[i-1].transfer.account"
                     v-bind:no-anchor="true"
                     null-label="BURN"
                     data-cy="destinationAccount"/>
      </div>

    </template>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, onBeforeUnmount, onMounted, PropType} from "vue";
import AccountLink from "@/components/values/link/AccountLink.vue";
import ArrowSegment from "@/components/transfer_graphs/ArrowSegment.vue";
import HbarAmount from "@/components/values/HbarAmount.vue";
import {Transaction} from "@/schemas/MirrorNodeSchemas";
import {HbarTransferLayout} from "@/components/transfer_graphs/layout/HbarTransferLayout";
import {NetworkAnalyzer} from "@/utils/analyzer/NetworkAnalyzer";

export default defineComponent({
  name: "HbarTransferOutline",
  components: {HbarAmount, ArrowSegment, AccountLink},
  props: {
    transaction: Object as PropType<Transaction>
  },
  setup(props) {

    const networkAnalyzer = new NetworkAnalyzer()
    onMounted(() => networkAnalyzer.mount())
    onBeforeUnmount(() => networkAnalyzer.unmount())

    const hbarTransferLayout = computed(
        () => new HbarTransferLayout(props.transaction, networkAnalyzer.nodes.value, false))

    return {
      hbarTransferLayout,
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.graph-container {
  display: inline-grid;
  grid-template-columns: repeat(5, auto);
  line-height: 1.4rem;
  column-gap: 1em
}

div.graph-container > div.justify-end {
  justify-self: end;
}

</style>
