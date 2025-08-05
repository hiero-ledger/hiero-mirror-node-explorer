// SPDX-License-Identifier: Apache-2.0

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                     TEMPLATE                                                    -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<template>
  <div class="searchDropdown" data-cy="searchDropdown">
    <SearchTabs :search-controller="searchController" v-model:selected-agent-id="selectedAgentId"/>
    <div>
      <SearchSection v-if="selectedAgent !== null" :search-controller="searchController" :search-agent="selectedAgent"/>
      <template v-if="searchController.loadingDomainNameSearchAgents.value.length >= 1">
        <hr v-if="searchController.visibleAgents.value.length >= 1"/>
        <template v-for="a in searchController.domainNameSearchAgents" :key="a.id">
          <div v-if="a.loading.value" class="connecting-to-provider">
            Connecting to {{ a.provider.providerAlias }}…
          </div>
        </template>
      </template>
      <div v-if="searchController.candidateCount.value == 0 && !searchController.loading.value"
           @click="navigateToHelp"
           class="no-match">
        No match
        <img src="@/assets/question-circle.svg" alt="info button"/>
      </div>
      <div v-if="!searchController.loading.value" data-cy="searchCompleted" style="display: none"/>
    </div>
  </div>
</template>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      SCRIPT                                                     -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<script setup lang="ts">

import {computed, PropType} from "vue";
import {SearchController} from "@/components/search/SearchController";
import SearchTabs from "@/components/search/SearchTabs.vue";
import SearchSection from "@/components/search/SearchSection.vue";
import {SearchAgent} from "@/components/search/SearchAgent";
import router, {routeManager} from "@/utils/RouteManager.ts";

const props = defineProps({
  "searchController": {
    type: Object as PropType<SearchController>,
    required: true
  }
})

const selectedAgentId = defineModel("selectedAgentId", {
  type: String as PropType<string | null>,
  default: null
})

const selectedAgent = computed(() => {
  let result: SearchAgent<unknown, unknown> | null
  if (selectedAgentId.value !== null) {
    result = props.searchController.findAgentById(selectedAgentId.value)
  } else {
    result = null
  }
  return result
})

const navigateToHelp = () => {
  props.searchController.inputText.value = "" // Hides SearchDropDown
  router.push(routeManager.makeRouteToSearchHelp())
}


</script>

<!-- --------------------------------------------------------------------------------------------------------------- -->
<!--                                                      STYLE                                                      -->
<!-- --------------------------------------------------------------------------------------------------------------- -->

<style scoped>

hr {
  height: 1px;
  color: var(--border-secondary)
}

div.searchDropdown > div {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: stretch;
  padding-left: 8px;
  padding-top: 16px;
  row-gap: 16px;
  line-height: 19px;
}

div.connecting-to-provider {
  color: var(--text-secondary);
  font-weight: 400;
  font-size: 14px;
}

div.no-match {
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 8px;
  cursor: pointer;
  padding: 8px 0 8px 0;
}

</style>
