// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script lang="ts">

import {defineComponent, h} from "vue";
import * as Prism from 'prismjs';

export default defineComponent({
  name: "SolidityCode",


  setup(props, ctx) {

    return () => {
      const attrs = {...ctx.attrs, class: "language-solidity"}
      const slot = ctx.slots.default ? ctx.slots.default() : null
      const slotChildren = slot !== null && slot.length >= 1 ? slot[0].children : null
      const code = typeof slotChildren == "string" ? slotChildren : ""
      const children = Prism.highlight(code, Prism.languages.solidity, 'solidity')
      return h("pre", attrs, h("code", {innerHTML: children}))
    }
  }
})

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style>
pre.language-solidity {
  .number {
    vertical-align: baseline;
    font-size: 0.8rem;
    background-color: inherit;
    min-width: 0;
    padding: 0;
    margin: 0;
  }
}
</style>
