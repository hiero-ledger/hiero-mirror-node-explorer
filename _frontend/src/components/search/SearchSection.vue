// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <template v-for="(c,i) in searchAgent.candidates.value" :key="i">
    <button class="button-as-link"
            :class="{'secondary': c.route === null || c.secondary}"
            @click="navigate(c)"
            :disabled="c.route === null"
            style="width: 100%">
      {{ c.description }}
      <span v-if="c.extra" style="color: var(--text-secondary); padding-left: 16px">{{ c.extra }}</span>
      <span v-if="i == 0" style="float: right">&#x23ce;</span>
    </button>
  </template>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {PropType} from "vue";
import {SearchAgent, SearchCandidate} from "@/components/search/SearchAgent";
import router from "@/utils/RouteManager.ts";
import {SearchController} from "@/components/search/SearchController";

const props = defineProps({
  "searchController": {
    type: Object as PropType<SearchController>,
    required: true
  },
  "searchAgent": {
    type: Object as PropType<SearchAgent<unknown, unknown>>,
    required: true
  },
})


const navigate = (c: SearchCandidate<unknown>) => {
  if (c.route !== null) {
    props.searchController.inputText.value = "" // Hides SearchDropDown
    c.agent.willNavigate(c)
    router.push(c.route)
  }
}

</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

.button-as-link {
  background: none !important;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  padding: 0 !important;
  text-align: left;
}

.button-as-link.secondary {
  color: var(--text-secondary);
}

</style>
