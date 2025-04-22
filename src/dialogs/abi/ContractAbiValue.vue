// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<!-- TODO: remove BULMA styling -->

<template>

  <div id="abi" class="h-code-box">

    <template v-if="showAll && roContractCallBuilders.length == 0 && rwContractCallBuilders.length == 0">
      <SolidityCode class="h-code-source">
        {{ "//\n// No function\n//" }}
      </SolidityCode>
    </template>
    <template v-else>
      <template v-if="showReadOnly">
        <template v-if="roContractCallBuilders.length >= 1">
          <SolidityCode class="h-code-source">
            {{ "//\n// Functions (read-only)\n//" }}
          </SolidityCode>
          <div v-for="(b,i) in roContractCallBuilders" :key="b.fragment.selector">
            <div class="mb-2" style="margin-left: 0.6rem">
              <ContractAbiEntry :contract-call-builder="b" :index="i"
                                @did-update-contract-state="entryDidUpdateContractState"/>
            </div>
          </div>
        </template>
        <template v-else>
          <SolidityCode class="h-code-source">
            {{ "//\n// No read-only function\n//" }}
          </SolidityCode>
        </template>
      </template>

      <hr v-if="showAll" class="horizontal-line"/>

      <template v-if="showReadWrite">
        <template v-if="rwContractCallBuilders.length >= 1">
          <SolidityCode class="h-code-source">
            {{ "//\n// Functions (read-write)\n//" }}
          </SolidityCode>
          <div v-for="(b,i) in rwContractCallBuilders" :key="b.fragment.selector">
            <div class="mb-2" style="margin-left: 0.6rem">
              <ContractAbiEntry :contract-call-builder="b" :index="i"
                                @did-update-contract-state="entryDidUpdateContractState"/>
            </div>
          </div>
        </template>
        <template v-else>
          <SolidityCode class="h-code-source">
            {{ "//\n// No read-write function\n//" }}
          </SolidityCode>
        </template>
      </template>
    </template>

    <hr v-if="showAll" class="horizontal-line"/>

    <template v-if="showEvents">
      <SolidityCode class="h-code-source">
        {{ eventList }}
      </SolidityCode>
    </template>

    <hr v-if="showAll" class="horizontal-line"/>

    <template v-if="showErrors">
      <SolidityCode class="h-code-source">
        {{ errorList }}
      </SolidityCode>
    </template>

    <hr v-if="showAll" class="horizontal-line"/>

    <template v-if="showOther">
      <SolidityCode class="h-code-source">
        {{ otherList }}
      </SolidityCode>
    </template>

  </div>

</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {computed, defineComponent, PropType} from "vue";
import {ethers} from "ethers";
import ContractAbiEntry from "@/dialogs/abi/ContractAbiEntry.vue";
import "prismjs/prism";
import "prismjs/themes/prism-tomorrow.css"
import "prismjs/prism.js";
import "prismjs/components/prism-clike.js";
import "prismjs/components/prism-solidity.js";
import SolidityCode from "@/components/SolidityCode.vue";
import {ContractCallBuilder} from "@/dialogs/abi/ContractCallBuilder.ts";
import {ABIController} from "@/components/contract/ABIController.ts";
import {FragmentCollection} from "@/dialogs/abi/FragmentCollection.ts";

export default defineComponent({
  components: {
    SolidityCode,
    ContractAbiEntry,
  },

  props: {
    abiController: {
      type: Object as PropType<ABIController>,
      required: true
    },
    fragmentCollection: {
      type: String as PropType<FragmentCollection>,
      default: FragmentCollection.ALL
    }
  },

  setup: function (props) {

    const showAll = computed(() => props.fragmentCollection === FragmentCollection.ALL)
    const showReadOnly = computed(() => showAll.value || props.fragmentCollection === FragmentCollection.READONLY)
    const showReadWrite = computed(() => showAll.value || props.fragmentCollection === FragmentCollection.READWRITE)
    const showEvents = computed(() => showAll.value || props.fragmentCollection === FragmentCollection.EVENTS)
    const showErrors = computed(() => showAll.value || props.fragmentCollection === FragmentCollection.ERRORS)
    const showOther = computed(() => showAll.value || props.fragmentCollection === FragmentCollection.OTHER)

    const functionFragments = computed(() => {
      const result: ethers.FunctionFragment[] = []
      const i = props.abiController.targetInterface.value
      if (i !== null) {
        for (const f of i.fragments) {
          if (f instanceof ethers.FunctionFragment) {
            result.push(f)
          }
        }
      }
      return result

    })

    const eventFragments = computed(() => {
      const result: ethers.EventFragment[] = []
      const i = props.abiController.targetInterface.value
      if (i !== null) {
        for (const f of i.fragments) {
          if (f instanceof ethers.EventFragment) {
            result.push(f)
          }
        }
      }
      return result
    })

    const eventList = computed(() => {
      let result: string
      if (eventFragments.value.length >= 1) {
        result = "//\n// Events\n//\n\n"
        for (const f of eventFragments.value) {
          result += f.format("full") + "\n"
        }
      } else {
        result = "//\n// No event\n//"
      }
      return result
    })

    const errorFragments = computed(() => {
      const result: ethers.ErrorFragment[] = []
      const i = props.abiController.targetInterface.value
      if (i !== null) {
        for (const f of i.fragments) {
          if (f instanceof ethers.ErrorFragment) {
            result.push(f)
          }
        }
      }
      return result
    })

    const errorList = computed(() => {
      let result: string
      if (errorFragments.value.length >= 1) {
        result = "//\n// Errors\n//\n\n"
        for (const f of errorFragments.value) {
          result += f.format("full") + "\n"
        }
      } else {
        result = "//\n// No error\n//"
      }
      return result
    })

    const otherFragments = computed(() => {
      const result: ethers.Fragment[] = []
      const i = props.abiController.targetInterface.value
      if (i !== null) {
        for (const f of i.fragments) {
          const regular = (
              f instanceof ethers.FunctionFragment ||
              f instanceof ethers.EventFragment ||
              f instanceof ethers.ErrorFragment
          )
          if (!regular) {
            result.push(f)
          }
        }
      }
      return result
    })

    const otherList = computed(() => {
      let result: string
      if (otherFragments.value.length >= 1) {
        result = "//\n// Others\n//\n\n"
        for (const f of otherFragments.value) {
          result += f.format("full") + "\n"
        }
      } else {
        result = "//\n// No other definitions\n//"
      }
      return result
    })

    const contractCallBuilders = computed(() => {
      const result: ContractCallBuilder[] = []
      for (const f of functionFragments.value) {
        result.push(new ContractCallBuilder(f, props.abiController))
      }
      return result
    })

    const roContractCallBuilders = computed(() => {
      const result: ContractCallBuilder[] = []
      for (const b of contractCallBuilders.value) {
        if (b.isReadOnly()) {
          result.push(b)
        }
      }
      return result
    })

    const rwContractCallBuilders = computed(() => {
      const result: ContractCallBuilder[] = []
      for (const b of contractCallBuilders.value) {
        if (!b.isReadOnly()) {
          result.push(b)
        }
      }
      return result
    })

    const entryDidUpdateContractState = () => {
      for (const b of contractCallBuilders.value) {
        if (b.isGetter()) {
          b.execute()
        }
      }
    }

    return {
      showAll,
      showReadOnly,
      showReadWrite,
      showEvents,
      showErrors,
      showOther,
      roContractCallBuilders,
      rwContractCallBuilders,
      eventList,
      errorList,
      otherList,
      entryDidUpdateContractState
    }
  }

})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                       STYLE                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

hr.horizontal-line {
  height: 2px;
}

</style>
